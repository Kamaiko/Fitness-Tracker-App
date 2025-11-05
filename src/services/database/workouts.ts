/**
 * Workout CRUD Operations - WatermelonDB Implementation
 *
 * Dual API Architecture:
 * - Promise-based functions for imperative code (actions)
 * - Observable-based functions for reactive UI (hooks)
 *
 * All operations are LOCAL FIRST (instant), sync happens separately
 *
 * Error Handling:
 * - All operations wrapped with try/catch
 * - User authentication validated before writes
 * - Custom errors (DatabaseError, AuthError) for consistent handling
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
import { useAuthStore } from '@/stores/auth/authStore';
import { DatabaseError, AuthError } from '@/utils/errors';

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
    // synced removed - using WatermelonDB sync protocol
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
 *
 * @throws {AuthError} If user is not authenticated or user ID mismatch
 * @throws {DatabaseError} If database operation fails
 */
export async function createWorkout(data: CreateWorkout): Promise<Workout> {
  try {
    // Security validation
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      throw new AuthError(
        'Please sign in to create workouts',
        'User not authenticated - no user.id in authStore'
      );
    }

    if (data.user_id !== currentUser.id) {
      throw new AuthError(
        'Authentication error. Please sign out and sign in again.',
        `User ID mismatch - Expected: ${currentUser.id}, Received: ${data.user_id}`
      );
    }

    const workout = await database.write(async () => {
      return await database.get<WorkoutModel>('workouts').create((workout) => {
        workout.userId = data.user_id;
        workout.startedAt = new Date(data.started_at);
        if (data.completed_at) workout.completedAt = new Date(data.completed_at);
        if (data.duration_seconds) workout.durationSeconds = data.duration_seconds;
        if (data.title) workout.title = data.title;
        if (data.notes) workout.notes = data.notes;
        // Sync tracking handled by WatermelonDB
      });
    });

    return workoutToPlain(workout);
  } catch (error) {
    // Re-throw custom errors
    if (error instanceof AuthError || error instanceof DatabaseError) {
      throw error;
    }

    // Wrap unknown errors
    throw new DatabaseError(
      'Unable to save workout. Please try again.',
      `Failed to create workout: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Add exercise to workout
 *
 * @throws {AuthError} If user is not authenticated
 * @throws {DatabaseError} If database operation fails
 */
export async function addExerciseToWorkout(
  workoutId: string,
  exerciseId: string,
  orderIndex: number,
  supersetGroup?: string
): Promise<WorkoutExercise> {
  try {
    // Security validation - user must be authenticated
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      throw new AuthError(
        'Please sign in to add exercises',
        'User not authenticated - no user.id in authStore'
      );
    }

    const workoutExercise = await database.write(async () => {
      return await database.get<WorkoutExerciseModel>('workout_exercises').create((we) => {
        we.workoutId = workoutId;
        we.exerciseId = exerciseId;
        we.orderIndex = orderIndex;
        if (supersetGroup) we.supersetGroup = supersetGroup;
        // Sync tracking handled by WatermelonDB
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
      // synced removed
      created_at: workoutExercise.createdAt.getTime(),
      updated_at: workoutExercise.updatedAt.getTime(),
    };
  } catch (error) {
    if (error instanceof AuthError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to add exercise. Please try again.',
      `Failed to add exercise to workout: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Log a set
 *
 * @throws {AuthError} If user is not authenticated
 * @throws {DatabaseError} If database operation fails
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
  try {
    // Security validation - user must be authenticated
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      throw new AuthError(
        'Please sign in to log sets',
        'User not authenticated - no user.id in authStore'
      );
    }

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
        // Sync tracking handled by WatermelonDB
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
      // synced removed
      created_at: exerciseSet.createdAt.getTime(),
      updated_at: exerciseSet.updatedAt.getTime(),
    };
  } catch (error) {
    if (error instanceof AuthError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to log set. Please try again.',
      `Failed to log set: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// ============================================================================
// READ Operations (Dual API - Promise + Observable)
// ============================================================================

/**
 * Get workout by ID (Promise - one-time fetch)
 *
 * @throws {DatabaseError} If workout not found or database operation fails
 */
export async function getWorkoutById(id: string): Promise<Workout> {
  try {
    const workout = await database.get<WorkoutModel>('workouts').find(id);
    return workoutToPlain(workout);
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to load workout. Please try again.',
      `Failed to get workout by ID ${id}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Observe workout by ID (Observable - reactive stream)
 *
 * Note: Observable errors are handled by the subscriber
 */
export function observeWorkout(id: string): Observable<Workout> {
  return database.get<WorkoutModel>('workouts').findAndObserve(id).pipe(map(workoutToPlain));
}

/**
 * Get all workouts for user (Promise - one-time fetch)
 * Ordered by most recent first
 *
 * @throws {AuthError} If user is not authenticated
 * @throws {DatabaseError} If database operation fails
 */
export async function getUserWorkouts(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<Workout[]> {
  try {
    // Security validation - ensure user is authenticated
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      throw new AuthError(
        'Please sign in to view workouts',
        'User not authenticated - no user.id in authStore'
      );
    }

    if (userId !== currentUser.id) {
      throw new AuthError(
        'Authentication error. Please sign out and sign in again.',
        `User ID mismatch - Expected: ${currentUser.id}, Received: ${userId}`
      );
    }

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
  } catch (error) {
    if (error instanceof AuthError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to load workouts. Please try again.',
      `Failed to get user workouts: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Observe all workouts for user (Observable - reactive stream)
 *
 * Note: Observable errors are handled by the subscriber
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
 *
 * @throws {AuthError} If user is not authenticated
 * @throws {DatabaseError} If database operation fails
 */
export async function getActiveWorkout(userId: string): Promise<Workout | null> {
  try {
    // Security validation
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      throw new AuthError(
        'Please sign in to view active workout',
        'User not authenticated - no user.id in authStore'
      );
    }

    if (userId !== currentUser.id) {
      throw new AuthError(
        'Authentication error. Please sign out and sign in again.',
        `User ID mismatch - Expected: ${currentUser.id}, Received: ${userId}`
      );
    }

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
  } catch (error) {
    if (error instanceof AuthError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to load active workout. Please try again.',
      `Failed to get active workout: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Observe active workout (Observable)
 *
 * Note: Observable errors are handled by the subscriber
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
 *
 * @throws {DatabaseError} If workout not found or database operation fails
 */
export async function getWorkoutWithDetails(workoutId: string): Promise<WorkoutWithDetails> {
  try {
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
          // synced removed
          created_at: we.createdAt.getTime(),
          updated_at: we.updatedAt.getTime(),
          exercise: {
            id: exercise.id,
            exercisedb_id: exercise.exercisedbId,
            name: exercise.name,
            body_parts: exercise.bodyParts,
            target_muscles: exercise.targetMuscles,
            secondary_muscles: exercise.secondaryMuscles,
            equipments: exercise.equipments,
            instructions: exercise.instructions,
            description: exercise.description,
            difficulty: exercise.difficulty as 'beginner' | 'intermediate' | 'advanced',
            category: exercise.category,
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
            // synced removed
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
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to load workout details. Please try again.',
      `Failed to get workout with details for ID ${workoutId}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Observe workout with details (Observable)
 *
 * Note: This is a simplified version. For true reactivity with nested relations,
 * you'd need to use withObservables in React components
 */
export function observeWorkoutWithDetails(workoutId: string): Observable<WorkoutWithDetails> {
  return database
    .get<WorkoutModel>('workouts')
    .findAndObserve(workoutId)
    .pipe(
      switchMap(async () => {
        return await getWorkoutWithDetails(workoutId);
      })
    );
}

/**
 * Get last workout (for "Repeat Last Workout" feature)
 * Promise only - this is typically a one-time fetch
 *
 * @throws {AuthError} If user is not authenticated
 * @throws {DatabaseError} If database operation fails
 */
export async function getLastCompletedWorkout(userId: string): Promise<WorkoutWithDetails | null> {
  try {
    // Security validation
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      throw new AuthError(
        'Please sign in to view workout history',
        'User not authenticated - no user.id in authStore'
      );
    }

    if (userId !== currentUser.id) {
      throw new AuthError(
        'Authentication error. Please sign out and sign in again.',
        `User ID mismatch - Expected: ${currentUser.id}, Received: ${userId}`
      );
    }

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
  } catch (error) {
    if (error instanceof AuthError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to load last workout. Please try again.',
      `Failed to get last completed workout: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// ============================================================================
// UPDATE Operations (Promise only - these are actions)
// ============================================================================

/**
 * Update workout
 *
 * @throws {AuthError} If user is not authenticated
 * @throws {DatabaseError} If workout not found or database operation fails
 */
export async function updateWorkout(id: string, updates: UpdateWorkout): Promise<Workout> {
  try {
    // Security validation - user must be authenticated
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      throw new AuthError(
        'Please sign in to update workouts',
        'User not authenticated - no user.id in authStore'
      );
    }

    const workout = await database.write(async () => {
      const workout = await database.get<WorkoutModel>('workouts').find(id);

      // Verify user owns this workout
      if (workout.userId !== currentUser.id) {
        throw new AuthError(
          'You do not have permission to update this workout',
          `User ${currentUser.id} attempted to update workout owned by ${workout.userId}`
        );
      }

      await workout.update((w) => {
        if (updates.completed_at !== undefined) w.completedAt = new Date(updates.completed_at);
        if (updates.duration_seconds !== undefined) w.durationSeconds = updates.duration_seconds;
        if (updates.title !== undefined) w.title = updates.title;
        if (updates.notes !== undefined) w.notes = updates.notes;
        // Sync tracking handled by WatermelonDB
      });
      return workout;
    });

    return workoutToPlain(workout);
  } catch (error) {
    if (error instanceof AuthError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to update workout. Please try again.',
      `Failed to update workout ${id}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Complete workout
 *
 * @throws {AuthError} If user is not authenticated
 * @throws {DatabaseError} If workout not found or database operation fails
 */
export async function completeWorkout(id: string): Promise<Workout> {
  try {
    const workout = await database.get<WorkoutModel>('workouts').find(id);
    const now = Date.now();
    const duration = Math.floor((now - workout.startedAt.getTime()) / 1000);

    return updateWorkout(id, {
      completed_at: now,
      duration_seconds: duration,
    });
  } catch (error) {
    if (error instanceof AuthError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to complete workout. Please try again.',
      `Failed to complete workout ${id}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// ============================================================================
// DELETE Operations (Promise only - these are actions)
// ============================================================================

/**
 * Delete workout (cascades to exercises and sets via WatermelonDB relations)
 *
 * @throws {AuthError} If user is not authenticated
 * @throws {DatabaseError} If workout not found or database operation fails
 */
export async function deleteWorkout(id: string): Promise<void> {
  try {
    // Security validation - user must be authenticated
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      throw new AuthError(
        'Please sign in to delete workouts',
        'User not authenticated - no user.id in authStore'
      );
    }

    await database.write(async () => {
      const workout = await database.get<WorkoutModel>('workouts').find(id);

      // Verify user owns this workout
      if (workout.userId !== currentUser.id) {
        throw new AuthError(
          'You do not have permission to delete this workout',
          `User ${currentUser.id} attempted to delete workout owned by ${workout.userId}`
        );
      }

      await workout.markAsDeleted(); // Soft delete for sync
    });
  } catch (error) {
    if (error instanceof AuthError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to delete workout. Please try again.',
      `Failed to delete workout ${id}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// ============================================================================
// SYNC Helpers (Promise only)
// ============================================================================

/**
 * Get unsynced workouts (for Supabase sync)
 *
 * @throws {DatabaseError} If database operation fails
 */
export async function getUnsyncedWorkouts(): Promise<WorkoutWithDetails[]> {
  try {
    const workouts = await database
      .get<WorkoutModel>('workouts')
      .query(Q.where('_status', Q.notEq('deleted')))
      .fetch();

    return Promise.all(workouts.map((w) => getWorkoutWithDetails(w.id)));
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to get unsynced workouts. Please try again.',
      `Failed to get unsynced workouts: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Mark workout as synced
 *
 * @throws {DatabaseError} If workout not found or database operation fails
 */
export async function markWorkoutAsSynced(id: string): Promise<void> {
  try {
    await database.write(async () => {
      const workout = await database.get<WorkoutModel>('workouts').find(id);
      await workout.update((w) => {
        // Sync tracking handled by WatermelonDB _changed/_status
      });
    });
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      'Unable to mark workout as synced. Please try again.',
      `Failed to mark workout ${id} as synced: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
