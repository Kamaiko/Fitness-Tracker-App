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
  created_at: number;
  updated_at: number;
}

export interface Exercise {
  id: string;

  // ===== ExerciseDB V1 API fields =====
  exercisedb_id: string; // Original ExerciseDB ID (e.g., "0001")
  name: string;
  body_parts: string[]; // Anatomical region: ["chest"] (converted from V1 string)
  target_muscles: string[]; // Primary muscle: ["pectorals"] (converted from V1 string)
  secondary_muscles: string[]; // Supporting muscles: ["triceps", "deltoids"]
  equipments: string[]; // Required equipment: ["barbell"] (converted from V1 string)
  instructions: string[]; // Step-by-step guide (array of strings)
  description: string; // V1: Detailed exercise description
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // V1: Difficulty level
  category: string; // V1: "strength" | "cardio" | "stretching"
  // NOTE: Images deferred to post-MVP (AI-generated or GitHub open-source)

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
  // synced removed - internal WatermelonDB sync tracking
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
  // synced removed - internal WatermelonDB sync tracking
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
  is_warmup: boolean;
  is_failure: boolean;
  // synced removed - internal WatermelonDB sync tracking
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
export type CreateWorkout = Omit<Workout, 'id' | 'created_at' | 'updated_at'>;
export type CreateWorkoutExercise = Omit<WorkoutExercise, 'id' | 'created_at' | 'updated_at'>;
export type CreateExerciseSet = Omit<ExerciseSet, 'id' | 'created_at' | 'updated_at'>;

/**
 * Update types (optional fields only)
 */
export type UpdateWorkout = Partial<Omit<Workout, 'id' | 'user_id' | 'created_at'>>;
export type UpdateExerciseSet = Partial<
  Omit<ExerciseSet, 'id' | 'workout_exercise_id' | 'created_at'>
>;
