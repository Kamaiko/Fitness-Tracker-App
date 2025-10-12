/**
 * Database Service - Main Export
 *
 * Simple SQLite-based offline-first storage
 *
 * ARCHITECTURE:
 * - Phase 0-2 (NOW): expo-sqlite + manual Supabase sync
 * - Phase 3+ (1000+ users): Migrate to WatermelonDB + MMKV
 *
 * USAGE:
 * import { initDatabase, createWorkout, syncToSupabase } from '@/services/database';
 */

// Core database
export { initDatabase, getDatabase, resetDatabase, getDatabaseStats } from './db';

// Types
export type * from './types';

// Workout operations
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

// Sync operations
export { syncToSupabase, getSyncStatus, autoSync } from './sync';
export type { SyncStatus, SyncResult } from './sync';
