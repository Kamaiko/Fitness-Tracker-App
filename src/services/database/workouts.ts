/**
 * Workout CRUD Operations
 *
 * Simple, type-safe functions for workout management
 * All operations are LOCAL FIRST (instant), sync happens separately
 */

import { getDatabase } from './db';
import type {
  Workout,
  WorkoutWithDetails,
  CreateWorkout,
  UpdateWorkout,
  WorkoutExercise,
  ExerciseSet,
  Exercise,
} from './types';

// ============================================================================
// Helper: Generate UUID (simple version)
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// CREATE Operations
// ============================================================================

/**
 * Start a new workout
 * Saves to local DB immediately
 */
export async function createWorkout(data: CreateWorkout): Promise<Workout> {
  const db = getDatabase();
  const id = generateId();
  const now = Math.floor(Date.now() / 1000);

  await db.runAsync(
    `INSERT INTO workouts (
      id, user_id, started_at, completed_at, duration_seconds,
      title, notes, synced, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    [
      id,
      data.user_id,
      data.started_at,
      data.completed_at ?? null,
      data.duration_seconds ?? null,
      data.title ?? null,
      data.notes ?? null,
      now,
      now,
    ]
  );

  return getWorkoutById(id);
}

/**
 * Add exercise to workout
 */
export async function addExerciseToWorkout(
  workoutId: string,
  exerciseId: string,
  orderIndex: number,
  supersetGroup?: string
): Promise<WorkoutExercise> {
  const db = getDatabase();
  const id = generateId();
  const now = Math.floor(Date.now() / 1000);

  await db.runAsync(
    `INSERT INTO workout_exercises (
      id, workout_id, exercise_id, order_index, superset_group,
      synced, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
    [id, workoutId, exerciseId, orderIndex, supersetGroup ?? null, now, now]
  );

  const result = await db.getFirstAsync<WorkoutExercise>(
    'SELECT * FROM workout_exercises WHERE id = ?',
    [id]
  );

  if (!result) throw new Error('Failed to create workout exercise');
  return result;
}

/**
 * Log a set
 */
export async function logSet(
  workoutExerciseId: string,
  setNumber: number,
  data: {
    weight?: number;
    weight_unit?: 'kg' | 'lbs';
    reps?: number;
    rpe?: number;
    rir?: number;
    is_warmup?: boolean;
  }
): Promise<ExerciseSet> {
  const db = getDatabase();
  const id = generateId();
  const now = Math.floor(Date.now() / 1000);

  await db.runAsync(
    `INSERT INTO exercise_sets (
      id, workout_exercise_id, set_number, weight, weight_unit, reps,
      rpe, rir, is_warmup, completed_at, synced, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    [
      id,
      workoutExerciseId,
      setNumber,
      data.weight ?? null,
      data.weight_unit ?? null,
      data.reps ?? null,
      data.rpe ?? null,
      data.rir ?? null,
      data.is_warmup ? 1 : 0,
      now,
      now,
      now,
    ]
  );

  const result = await db.getFirstAsync<ExerciseSet>(
    'SELECT * FROM exercise_sets WHERE id = ?',
    [id]
  );

  if (!result) throw new Error('Failed to create set');
  return result;
}

// ============================================================================
// READ Operations
// ============================================================================

/**
 * Get workout by ID
 */
export async function getWorkoutById(id: string): Promise<Workout> {
  const db = getDatabase();
  const result = await db.getFirstAsync<Workout>('SELECT * FROM workouts WHERE id = ?', [id]);

  if (!result) throw new Error(`Workout ${id} not found`);
  return result;
}

/**
 * Get all workouts for user
 * Ordered by most recent first
 */
export async function getUserWorkouts(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<Workout[]> {
  const db = getDatabase();

  const results = await db.getAllAsync<Workout>(
    `SELECT * FROM workouts
     WHERE user_id = ?
     ORDER BY started_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  return results;
}

/**
 * Get active workout (not completed)
 */
export async function getActiveWorkout(userId: string): Promise<Workout | null> {
  const db = getDatabase();

  const result = await db.getFirstAsync<Workout>(
    `SELECT * FROM workouts
     WHERE user_id = ? AND completed_at IS NULL
     ORDER BY started_at DESC
     LIMIT 1`,
    [userId]
  );

  return result || null;
}

/**
 * Get workout with all exercises and sets
 */
export async function getWorkoutWithDetails(workoutId: string): Promise<WorkoutWithDetails> {
  const db = getDatabase();

  // Get workout
  const workout = await getWorkoutById(workoutId);

  // Get exercises for this workout
  const workoutExercises = await db.getAllAsync<WorkoutExercise>(
    `SELECT * FROM workout_exercises
     WHERE workout_id = ?
     ORDER BY order_index ASC`,
    [workoutId]
  );

  // For each workout exercise, get exercise details and sets
  const exercisesWithDetails = await Promise.all(
    workoutExercises.map(async (we) => {
      // Get exercise
      const exercise = await db.getFirstAsync<Exercise>(
        'SELECT * FROM exercises WHERE id = ?',
        [we.exercise_id]
      );

      // Get sets
      const sets = await db.getAllAsync<ExerciseSet>(
        `SELECT * FROM exercise_sets
         WHERE workout_exercise_id = ?
         ORDER BY set_number ASC`,
        [we.id]
      );

      return {
        ...we,
        exercise: exercise!,
        sets,
      };
    })
  );

  return {
    ...workout,
    exercises: exercisesWithDetails,
  };
}

/**
 * Get last workout (for "Repeat Last Workout" feature)
 */
export async function getLastCompletedWorkout(userId: string): Promise<WorkoutWithDetails | null> {
  const db = getDatabase();

  const lastWorkout = await db.getFirstAsync<Workout>(
    `SELECT * FROM workouts
     WHERE user_id = ? AND completed_at IS NOT NULL
     ORDER BY completed_at DESC
     LIMIT 1`,
    [userId]
  );

  if (!lastWorkout) return null;

  return getWorkoutWithDetails(lastWorkout.id);
}

// ============================================================================
// UPDATE Operations
// ============================================================================

/**
 * Update workout
 */
export async function updateWorkout(id: string, updates: UpdateWorkout): Promise<Workout> {
  const db = getDatabase();
  const now = Math.floor(Date.now() / 1000);

  // Build SET clause dynamically
  const fields = Object.keys(updates).filter((k) => k !== 'id' && k !== 'user_id');
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => updates[f as keyof UpdateWorkout] ?? null);

  await db.runAsync(
    `UPDATE workouts
     SET ${setClause}, updated_at = ?, synced = 0
     WHERE id = ?`,
    [...values, now, id] as (string | number | null)[]
  );

  return getWorkoutById(id);
}

/**
 * Complete workout
 */
export async function completeWorkout(id: string): Promise<Workout> {
  const workout = await getWorkoutById(id);
  const now = Math.floor(Date.now() / 1000);
  const duration = now - workout.started_at;

  return updateWorkout(id, {
    completed_at: now,
    duration_seconds: duration,
  });
}

// ============================================================================
// DELETE Operations
// ============================================================================

/**
 * Delete workout (cascades to exercises and sets)
 */
export async function deleteWorkout(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM workouts WHERE id = ?', [id]);
}

// ============================================================================
// SYNC Helpers
// ============================================================================

/**
 * Get unsynced workouts (for Supabase sync)
 */
export async function getUnsyncedWorkouts(): Promise<WorkoutWithDetails[]> {
  const db = getDatabase();

  const workouts = await db.getAllAsync<Workout>('SELECT * FROM workouts WHERE synced = 0');

  return Promise.all(workouts.map((w) => getWorkoutWithDetails(w.id)));
}

/**
 * Mark workout as synced
 */
export async function markWorkoutAsSynced(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync('UPDATE workouts SET synced = 1 WHERE id = ?', [id]);
}
