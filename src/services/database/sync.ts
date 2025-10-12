/**
 * Supabase Sync Service
 *
 * Simple sync strategy:
 * 1. Save local first (instant UI)
 * 2. Sync to Supabase in background
 * 3. Handle conflicts with "last write wins"
 *
 * Migration note: This will be replaced by WatermelonDB sync when scaling
 */

import { supabase } from '@/services/supabase';
import { getDatabase } from './db';
import type { Workout, WorkoutExercise, ExerciseSet } from './types';

// ============================================================================
// Sync Status Types
// ============================================================================

export interface SyncStatus {
  isOnline: boolean;
  lastSync: number | null;
  pendingWorkouts: number;
  pendingSets: number;
}

export interface SyncResult {
  success: boolean;
  syncedWorkouts: number;
  syncedExercises: number;
  syncedSets: number;
  errors: string[];
}

// ============================================================================
// Main Sync Function
// ============================================================================

/**
 * Sync all unsynced data to Supabase
 * Called after workout completion or periodically
 */
export async function syncToSupabase(): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    syncedWorkouts: 0,
    syncedExercises: 0,
    syncedSets: 0,
    errors: [],
  };

  try {
    // Check if online
    const { data: healthCheck } = await supabase.from('workouts').select('id').limit(1);
    if (!healthCheck) throw new Error('Offline');

    // Sync workouts
    const workoutsResult = await syncWorkouts();
    result.syncedWorkouts = workoutsResult.synced;
    result.errors.push(...workoutsResult.errors);

    // Sync workout exercises
    const exercisesResult = await syncWorkoutExercises();
    result.syncedExercises = exercisesResult.synced;
    result.errors.push(...exercisesResult.errors);

    // Sync sets
    const setsResult = await syncSets();
    result.syncedSets = setsResult.synced;
    result.errors.push(...setsResult.errors);

    result.success = result.errors.length === 0;

    console.log('✅ Sync complete:', result);
    return result;
  } catch (error) {
    result.errors.push(`Sync failed: ${error}`);
    console.log('⚠️ Sync failed (will retry later):', error);
    return result;
  }
}

// ============================================================================
// Sync Individual Tables
// ============================================================================

/**
 * Sync workouts table
 */
async function syncWorkouts(): Promise<{ synced: number; errors: string[] }> {
  const db = getDatabase();
  const errors: string[] = [];
  let synced = 0;

  try {
    // Get unsynced workouts
    const unsynced = await db.getAllAsync<Workout>('SELECT * FROM workouts WHERE synced = 0');

    for (const workout of unsynced) {
      try {
        // Transform to Supabase format (timestamps to ISO)
        const supabaseWorkout = {
          id: workout.id,
          user_id: workout.user_id,
          started_at: new Date(workout.started_at * 1000).toISOString(),
          completed_at: workout.completed_at
            ? new Date(workout.completed_at * 1000).toISOString()
            : null,
          duration_seconds: workout.duration_seconds,
          title: workout.title,
          notes: workout.notes,
          created_at: new Date(workout.created_at * 1000).toISOString(),
          updated_at: new Date(workout.updated_at * 1000).toISOString(),
        };

        // Upsert to Supabase (insert or update)
        const { error } = await supabase.from('workouts').upsert(supabaseWorkout);

        if (error) throw error;

        // Mark as synced locally
        await db.runAsync('UPDATE workouts SET synced = 1 WHERE id = ?', [workout.id]);
        synced++;
      } catch (err) {
        errors.push(`Workout ${workout.id}: ${err}`);
      }
    }
  } catch (err) {
    errors.push(`Workouts sync failed: ${err}`);
  }

  return { synced, errors };
}

/**
 * Sync workout_exercises table
 */
async function syncWorkoutExercises(): Promise<{ synced: number; errors: string[] }> {
  const db = getDatabase();
  const errors: string[] = [];
  let synced = 0;

  try {
    const unsynced = await db.getAllAsync<WorkoutExercise>(
      'SELECT * FROM workout_exercises WHERE synced = 0'
    );

    for (const we of unsynced) {
      try {
        const supabaseWE = {
          id: we.id,
          workout_id: we.workout_id,
          exercise_id: we.exercise_id,
          order_index: we.order_index,
          superset_group: we.superset_group,
          notes: we.notes,
          target_sets: we.target_sets,
          target_reps: we.target_reps,
          created_at: new Date(we.created_at * 1000).toISOString(),
          updated_at: new Date(we.updated_at * 1000).toISOString(),
        };

        const { error } = await supabase.from('workout_exercises').upsert(supabaseWE);

        if (error) throw error;

        await db.runAsync('UPDATE workout_exercises SET synced = 1 WHERE id = ?', [we.id]);
        synced++;
      } catch (err) {
        errors.push(`WorkoutExercise ${we.id}: ${err}`);
      }
    }
  } catch (err) {
    errors.push(`Workout exercises sync failed: ${err}`);
  }

  return { synced, errors };
}

/**
 * Sync exercise_sets table
 */
async function syncSets(): Promise<{ synced: number; errors: string[] }> {
  const db = getDatabase();
  const errors: string[] = [];
  let synced = 0;

  try {
    const unsynced = await db.getAllAsync<ExerciseSet>(
      'SELECT * FROM exercise_sets WHERE synced = 0'
    );

    // Sync in batches of 50 (better performance)
    const BATCH_SIZE = 50;
    for (let i = 0; i < unsynced.length; i += BATCH_SIZE) {
      const batch = unsynced.slice(i, i + BATCH_SIZE);

      try {
        const supabaseSets = batch.map((set) => ({
          id: set.id,
          workout_exercise_id: set.workout_exercise_id,
          set_number: set.set_number,
          weight: set.weight,
          weight_unit: set.weight_unit,
          reps: set.reps,
          duration_seconds: set.duration_seconds,
          distance_meters: set.distance_meters,
          rpe: set.rpe,
          rir: set.rir,
          rest_time_seconds: set.rest_time_seconds,
          completed_at: set.completed_at ? new Date(set.completed_at * 1000).toISOString() : null,
          notes: set.notes,
          is_warmup: set.is_warmup === 1,
          is_failure: set.is_failure === 1,
          created_at: new Date(set.created_at * 1000).toISOString(),
          updated_at: new Date(set.updated_at * 1000).toISOString(),
        }));

        const { error } = await supabase.from('exercise_sets').upsert(supabaseSets);

        if (error) throw error;

        // Mark batch as synced
        const ids = batch.map((s) => s.id);
        await db.runAsync(
          `UPDATE exercise_sets SET synced = 1 WHERE id IN (${ids.map(() => '?').join(',')})`,
          ids
        );
        synced += batch.length;
      } catch (err) {
        errors.push(`Batch sync failed: ${err}`);
      }
    }
  } catch (err) {
    errors.push(`Sets sync failed: ${err}`);
  }

  return { synced, errors };
}

// ============================================================================
// Sync Status Helpers
// ============================================================================

/**
 * Get current sync status
 */
export async function getSyncStatus(): Promise<SyncStatus> {
  const db = getDatabase();

  const pendingWorkouts = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM workouts WHERE synced = 0'
  );

  const pendingSets = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercise_sets WHERE synced = 0'
  );

  // TODO: Store last sync timestamp in AsyncStorage
  return {
    isOnline: true, // TODO: Check actual connectivity
    lastSync: null, // TODO: Get from AsyncStorage
    pendingWorkouts: pendingWorkouts?.count || 0,
    pendingSets: pendingSets?.count || 0,
  };
}

/**
 * Auto-sync: Call this after important operations
 * Non-blocking - runs in background
 */
export function autoSync(): void {
  syncToSupabase()
    .then((result) => {
      if (result.success) {
        console.log('✅ Auto-sync successful');
      }
    })
    .catch((err) => {
      console.log('⚠️ Auto-sync queued for retry:', err);
    });
}
