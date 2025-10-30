/**
 * Workout CRUD Operations - WatermelonDB Implementation
 *
 * Dual API Architecture:
 * - Promise-based functions for imperative code (actions)
 * - Observable-based functions for reactive UI (hooks)
 *
 * All operations are LOCAL FIRST (instant), sync happens separately
 */

import { Q } from '@nozbe/watermelondb';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { database } from './watermelon';
import WorkoutModel from './watermelon/models/Workout';
import WorkoutExerciseModel from './watermelon/models/WorkoutExercise';
import ExerciseSetModel from './watermelon/models/ExerciseSet';
import ExerciseModel from './watermelon/models/Exercise';
import type {
  Workout,
  WorkoutWithDetails,
  CreateWorkout,
  UpdateWorkout,
  WorkoutExercise,
  ExerciseSet,
} from './types';

// ============================================================================
// Helper: Convert WatermelonDB Model to Plain Object
// ============================================================================

function workoutToPlain(workout: WorkoutModel): Workout {
  return {
    id: workout.id,
    user_id: workout.userId,
    started_at: workout.startedAt.getTime(),
    completed_at: workout.completedAt?.getTime(),
    duration_seconds: workout.durationSeconds ?? undefined,
    title: workout.title ?? undefined,
    notes: workout.notes ?? undefined,
    nutrition_phase: workout.nutritionPhase as 'bulk' | 'cut' | 'maintenance',
    synced: workout.synced,
    created_at: workout.createdAt.getTime(),
    updated_at: workout.updatedAt.getTime(),
  };
}

// ============================================================================
// CREATE Operations (Promise only - these are actions)
// ============================================================================

/**
 * Start a new workout
 * Saves to local DB immediately
 */
export async function createWorkout(data: CreateWorkout): Promise<Workout> {
  const workout = await database.write(async () => {
    return await database.get<WorkoutModel>('workouts').create((workout) => {
      workout.userId = data.user_id;
      workout.startedAt = new Date(data.started_at);
      if (data.completed_at) workout.completedAt = new Date(data.completed_at);
      if (data.duration_seconds) workout.durationSeconds = data.duration_seconds;
      if (data.title) workout.title = data.title;
      if (data.notes) workout.notes = data.notes;
      workout.nutritionPhase = data.nutrition_phase;
      workout.synced = false;
    });
  });

  return workoutToPlain(workout);
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
  const workoutExercise = await database.write(async () => {
    return await database.get<WorkoutExerciseModel>('workout_exercises').create((we) => {
      we.workoutId = workoutId;
      we.exerciseId = exerciseId;
      we.orderIndex = orderIndex;
      if (supersetGroup) we.supersetGroup = supersetGroup;
      we.synced = false;
    });
  });

  return {
    id: workoutExercise.id,
    workout_id: workoutId,
    exercise_id: exerciseId,
    order_index: workoutExercise.orderIndex,
    superset_group: workoutExercise.supersetGroup ?? undefined,
    notes: workoutExercise.notes ?? undefined,
    target_sets: workoutExercise.targetSets ?? undefined,
    target_reps: workoutExercise.targetReps ?? undefined,
    synced: workoutExercise.synced,
    created_at: workoutExercise.createdAt.getTime(),
    updated_at: workoutExercise.updatedAt.getTime(),
  };
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
  const exerciseSet = await database.write(async () => {
    return await database.get<ExerciseSetModel>('exercise_sets').create((set) => {
      set.workoutExerciseId = workoutExerciseId;
      set.setNumber = setNumber;
      if (data.weight !== undefined) set.weight = data.weight;
      if (data.weight_unit) set.weightUnit = data.weight_unit;
      if (data.reps !== undefined) set.reps = data.reps;
      if (data.rpe !== undefined) set.rpe = data.rpe;
      if (data.rir !== undefined) set.rir = data.rir;
      set.isWarmup = data.is_warmup ?? false;
      set.isFailure = false;
      set.completedAt = new Date();
      set.synced = false;
    });
  });

  return {
    id: exerciseSet.id,
    workout_exercise_id: workoutExerciseId,
    set_number: exerciseSet.setNumber,
    weight: exerciseSet.weight ?? undefined,
    weight_unit: exerciseSet.weightUnit as 'kg' | 'lbs' | undefined,
    reps: exerciseSet.reps ?? undefined,
    duration_seconds: exerciseSet.durationSeconds ?? undefined,
    distance_meters: exerciseSet.distanceMeters ?? undefined,
    rpe: exerciseSet.rpe ?? undefined,
    rir: exerciseSet.rir ?? undefined,
    rest_time_seconds: exerciseSet.restTimeSeconds ?? undefined,
    completed_at: exerciseSet.completedAt?.getTime(),
    notes: exerciseSet.notes ?? undefined,
    is_warmup: exerciseSet.isWarmup,
    is_failure: exerciseSet.isFailure,
    synced: exerciseSet.synced,
    created_at: exerciseSet.createdAt.getTime(),
    updated_at: exerciseSet.updatedAt.getTime(),
  };
}

// ============================================================================
// READ Operations (Dual API - Promise + Observable)
// ============================================================================

/**
 * Get workout by ID (Promise - one-time fetch)
 */
export async function getWorkoutById(id: string): Promise<Workout> {
  const workout = await database.get<WorkoutModel>('workouts').find(id);
  return workoutToPlain(workout);
}

/**
 * Observe workout by ID (Observable - reactive stream)
 */
export function observeWorkout(id: string): Observable<Workout> {
  return database.get<WorkoutModel>('workouts').findAndObserve(id).pipe(map(workoutToPlain));
}

/**
 * Get all workouts for user (Promise - one-time fetch)
 * Ordered by most recent first
 */
export async function getUserWorkouts(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<Workout[]> {
  const workouts = await database
    .get<WorkoutModel>('workouts')
    .query(
      Q.where('user_id', userId),
      Q.sortBy('started_at', Q.desc),
      Q.take(limit),
      Q.skip(offset)
    )
    .fetch();

  return workouts.map(workoutToPlain);
}

/**
 * Observe all workouts for user (Observable - reactive stream)
 */
export function observeUserWorkouts(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Observable<Workout[]> {
  return database
    .get<WorkoutModel>('workouts')
    .query(
      Q.where('user_id', userId),
      Q.sortBy('started_at', Q.desc),
      Q.take(limit),
      Q.skip(offset)
    )
    .observe()
    .pipe(map((workouts) => workouts.map(workoutToPlain)));
}

/**
 * Get active workout (not completed) (Promise)
 */
export async function getActiveWorkout(userId: string): Promise<Workout | null> {
  const workouts = await database
    .get<WorkoutModel>('workouts')
    .query(
      Q.where('user_id', userId),
      Q.where('completed_at', null),
      Q.sortBy('started_at', Q.desc),
      Q.take(1)
    )
    .fetch();

  return workouts.length > 0 && workouts[0] ? workoutToPlain(workouts[0]) : null;
}

/**
 * Observe active workout (Observable)
 */
export function observeActiveWorkout(userId: string): Observable<Workout | null> {
  return database
    .get<WorkoutModel>('workouts')
    .query(
      Q.where('user_id', userId),
      Q.where('completed_at', null),
      Q.sortBy('started_at', Q.desc),
      Q.take(1)
    )
    .observe()
    .pipe(
      map((workouts) => (workouts.length > 0 && workouts[0] ? workoutToPlain(workouts[0]) : null))
    );
}

/**
 * Get workout with all exercises and sets (Promise)
 */
export async function getWorkoutWithDetails(workoutId: string): Promise<WorkoutWithDetails> {
  const workout = await database.get<WorkoutModel>('workouts').find(workoutId);
  const workoutExercises = workout.workoutExercises;

  const exercisesWithDetails = await Promise.all(
    workoutExercises.map(async (we: WorkoutExerciseModel) => {
      const exercise = we.exercise;
      const sets = we.exerciseSets;

      return {
        id: we.id,
        workout_id: workoutId,
        exercise_id: exercise.id,
        order_index: we.orderIndex,
        superset_group: we.supersetGroup ?? undefined,
        notes: we.notes ?? undefined,
        target_sets: we.targetSets ?? undefined,
        target_reps: we.targetReps ?? undefined,
        synced: we.synced,
        created_at: we.createdAt.getTime(),
        updated_at: we.updatedAt.getTime(),
        exercise: {
          id: exercise.id,
          name: exercise.name,
          category: exercise.category as 'compound' | 'isolation' | 'cardio' | 'stretching',
          exercise_type: exercise.exerciseType as 'strength' | 'cardio' | 'timed' | 'bodyweight',
          muscle_groups: exercise.muscleGroups,
          primary_muscle: exercise.primaryMuscle,
          equipment: exercise.equipment as
            | 'barbell'
            | 'dumbbell'
            | 'machine'
            | 'bodyweight'
            | 'cable'
            | 'other',
          instructions: exercise.instructions ?? undefined,
          difficulty: exercise.difficulty as 'beginner' | 'intermediate' | 'advanced',
          image_url: exercise.imageUrl ?? undefined,
          is_custom: exercise.isCustom,
          created_by: exercise.createdBy ?? undefined,
          created_at: exercise.createdAt.getTime(),
          updated_at: exercise.updatedAt.getTime(),
        },
        sets: sets.map((set: ExerciseSetModel) => ({
          id: set.id,
          workout_exercise_id: we.id,
          set_number: set.setNumber,
          weight: set.weight ?? undefined,
          weight_unit: set.weightUnit as 'kg' | 'lbs' | undefined,
          reps: set.reps ?? undefined,
          duration_seconds: set.durationSeconds ?? undefined,
          distance_meters: set.distanceMeters ?? undefined,
          rpe: set.rpe ?? undefined,
          rir: set.rir ?? undefined,
          rest_time_seconds: set.restTimeSeconds ?? undefined,
          completed_at: set.completedAt?.getTime(),
          notes: set.notes ?? undefined,
          is_warmup: set.isWarmup,
          is_failure: set.isFailure,
          synced: set.synced,
          created_at: set.createdAt.getTime(),
          updated_at: set.updatedAt.getTime(),
        })),
      };
    })
  );

  return {
    ...workoutToPlain(workout),
    exercises: exercisesWithDetails,
  };
}

/**
 * Observe workout with details (Observable)
 */
export function observeWorkoutWithDetails(workoutId: string): Observable<WorkoutWithDetails> {
  return database
    .get<WorkoutModel>('workouts')
    .findAndObserve(workoutId)
    .pipe(
      switchMap(async () => {
        // Note: This is a simplified version. For true reactivity with nested relations,
        // you'd need to use withObservables in React components
        return await getWorkoutWithDetails(workoutId);
      })
    );
}

/**
 * Get last workout (for "Repeat Last Workout" feature)
 * Promise only - this is typically a one-time fetch
 */
export async function getLastCompletedWorkout(userId: string): Promise<WorkoutWithDetails | null> {
  const workouts = await database
    .get<WorkoutModel>('workouts')
    .query(
      Q.where('user_id', userId),
      Q.where('completed_at', Q.notEq(null)),
      Q.sortBy('completed_at', Q.desc),
      Q.take(1)
    )
    .fetch();

  if (workouts.length === 0 || !workouts[0]) return null;

  return getWorkoutWithDetails(workouts[0].id);
}

// ============================================================================
// UPDATE Operations (Promise only - these are actions)
// ============================================================================

/**
 * Update workout
 */
export async function updateWorkout(id: string, updates: UpdateWorkout): Promise<Workout> {
  const workout = await database.write(async () => {
    const workout = await database.get<WorkoutModel>('workouts').find(id);
    await workout.update((w) => {
      if (updates.completed_at !== undefined) w.completedAt = new Date(updates.completed_at);
      if (updates.duration_seconds !== undefined) w.durationSeconds = updates.duration_seconds;
      if (updates.title !== undefined) w.title = updates.title;
      if (updates.notes !== undefined) w.notes = updates.notes;
      if (updates.nutrition_phase) w.nutritionPhase = updates.nutrition_phase;
      w.synced = false;
    });
    return workout;
  });

  return workoutToPlain(workout);
}

/**
 * Complete workout
 */
export async function completeWorkout(id: string): Promise<Workout> {
  const workout = await database.get<WorkoutModel>('workouts').find(id);
  const now = Date.now();
  const duration = Math.floor((now - workout.startedAt.getTime()) / 1000);

  return updateWorkout(id, {
    completed_at: now,
    duration_seconds: duration,
  });
}

// ============================================================================
// DELETE Operations (Promise only - these are actions)
// ============================================================================

/**
 * Delete workout (cascades to exercises and sets via WatermelonDB relations)
 */
export async function deleteWorkout(id: string): Promise<void> {
  await database.write(async () => {
    const workout = await database.get<WorkoutModel>('workouts').find(id);
    await workout.markAsDeleted(); // Soft delete for sync
  });
}

// ============================================================================
// SYNC Helpers (Promise only)
// ============================================================================

/**
 * Get unsynced workouts (for Supabase sync)
 */
export async function getUnsyncedWorkouts(): Promise<WorkoutWithDetails[]> {
  const workouts = await database
    .get<WorkoutModel>('workouts')
    .query(Q.where('synced', false))
    .fetch();

  return Promise.all(workouts.map((w) => getWorkoutWithDetails(w.id)));
}

/**
 * Mark workout as synced
 */
export async function markWorkoutAsSynced(id: string): Promise<void> {
  await database.write(async () => {
    const workout = await database.get<WorkoutModel>('workouts').find(id);
    await workout.update((w) => {
      w.synced = true;
    });
  });
}
