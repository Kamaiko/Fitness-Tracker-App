/**
 * Database Service - Main Export
 *
 * WatermelonDB-based offline-first storage with reactive queries
 *
 * ARCHITECTURE:
 * - WatermelonDB for reactive, scalable data management
 * - Dual API: Promise (imperative) + Observable (reactive)
 * - Manual Supabase sync for backend persistence
 *
 * USAGE:
 * import { createWorkout, observeUserWorkouts } from '@/services/database';
 */

// WatermelonDB database instance
export { database } from './watermelon';

// Types
export type * from './types';

// Workout operations (Promise-based - imperative)
export {
  createWorkout,
  addExerciseToWorkout,
  logSet,
  getWorkoutById,
  getUserWorkouts,
  getActiveWorkout,
  getWorkoutWithDetails,
  getLastCompletedWorkout,
  updateWorkout,
  completeWorkout,
  deleteWorkout,
  getUnsyncedWorkouts,
  markWorkoutAsSynced,
} from './workouts';

// Workout operations (Observable-based - reactive)
export {
  observeWorkout,
  observeUserWorkouts,
  observeActiveWorkout,
  observeWorkoutWithDetails,
} from './workouts';

// Sync operations
export { syncToSupabase, getSyncStatus, autoSync } from './sync';
export type { SyncStatus, SyncResult } from './sync';
