/**
 * Database Types
 *
 * Type-safe interfaces matching SQLite schema
 * These will also match Supabase schema for easy sync
 */

// ============================================================================
// Core Tables
// ============================================================================

export interface User {
  id: string;
  email: string;
  preferred_unit: 'kg' | 'lbs';
  nutrition_phase: 'bulk' | 'cut' | 'maintenance';
  created_at: number;
  updated_at: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'compound' | 'isolation' | 'cardio' | 'stretching';
  exercise_type: 'strength' | 'cardio' | 'timed' | 'bodyweight';
  muscle_groups: string; // JSON string array: ['chest', 'triceps']
  primary_muscle: string;
  equipment: 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable' | 'other';
  instructions?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image_url?: string;
  is_custom: number; // SQLite boolean (0 or 1)
  created_by?: string;
  created_at: number;
  updated_at: number;
}

export interface Workout {
  id: string;
  user_id: string;
  started_at: number; // Unix timestamp
  completed_at?: number;
  duration_seconds?: number;
  title?: string;
  notes?: string;
  synced: number; // 0 = not synced, 1 = synced
  created_at: number;
  updated_at: number;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  order_index: number; // 1, 2, 3...
  superset_group?: string; // 'A', 'B', etc.
  notes?: string;
  target_sets?: number;
  target_reps?: number;
  synced: number;
  created_at: number;
  updated_at: number;
}

export interface ExerciseSet {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  weight?: number;
  weight_unit?: 'kg' | 'lbs';
  reps?: number;
  duration_seconds?: number;
  distance_meters?: number;
  rpe?: number; // 1-10
  rir?: number; // 0-5
  rest_time_seconds?: number;
  completed_at?: number;
  notes?: string;
  is_warmup: number; // SQLite boolean
  is_failure: number; // SQLite boolean
  synced: number;
  created_at: number;
  updated_at: number;
}

// ============================================================================
// Helper Types for Queries
// ============================================================================

/**
 * Full workout with exercises and sets
 * Used for display and sync
 */
export interface WorkoutWithDetails extends Workout {
  exercises: Array<WorkoutExerciseWithDetails>;
}

export interface WorkoutExerciseWithDetails extends WorkoutExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

/**
 * Create types (without auto-generated fields)
 */
export type CreateWorkout = Omit<Workout, 'id' | 'created_at' | 'updated_at' | 'synced'>;
export type CreateWorkoutExercise = Omit<
  WorkoutExercise,
  'id' | 'created_at' | 'updated_at' | 'synced'
>;
export type CreateExerciseSet = Omit<ExerciseSet, 'id' | 'created_at' | 'updated_at' | 'synced'>;

/**
 * Update types (optional fields only)
 */
export type UpdateWorkout = Partial<Omit<Workout, 'id' | 'user_id' | 'created_at'>>;
export type UpdateExerciseSet = Partial<Omit<ExerciseSet, 'id' | 'workout_exercise_id' | 'created_at'>>;
