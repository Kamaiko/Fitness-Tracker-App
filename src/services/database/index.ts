/**
 * Database Service - Main Export
 *
 * WatermelonDB-based offline-first storage with reactive queries
 *
 * ARCHITECTURE (Phase 0.6 - Reorganized):
 * - local/ - WatermelonDB (schema, models, migrations)
 * - remote/ - Supabase sync protocol
 * - operations/ - Business logic (CRUD operations)
 *
 * USAGE:
 * import { createWorkout, observeUserWorkouts } from '@/services/database';
 */

// WatermelonDB database instance
export { database } from './local';

// Types
export type * from './remote/types';

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
} from './operations/workouts';

// Workout operations (Observable-based - reactive)
export {
  observeWorkout,
  observeUserWorkouts,
  observeActiveWorkout,
  observeWorkoutWithDetails,
} from './operations/workouts';

// Sync operations
export {
  sync,
  getSyncStatus,
  setupAutoSync,
  manualSync,
  checkUnsyncedChanges,
} from './remote/sync';
export type { SyncStatus, SyncResult } from './remote/sync';
