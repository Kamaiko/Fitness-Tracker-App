/**
 * WatermelonDB Schema
 *
 * Defines database structure for offline-first workout tracking.
 * Matches Supabase schema for seamless sync.
 *
 * @see docs/DATABASE.md for complete schema documentation
 */

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    // Users table
    tableSchema({
      name: 'users',
      columns: [
        { name: 'email', type: 'string' },
        { name: 'preferred_unit', type: 'string' }, // 'kg' or 'lbs'
        { name: 'nutrition_phase', type: 'string' }, // 'bulk', 'cut', 'maintenance'
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        // NOTE: _changed and _status are managed automatically by WatermelonDB sync
      ],
    }),

    // Exercises table (1,300+ from ExerciseDB - read-only)
    // NOTE: Schema aligned with ExerciseDB nomenclature (ADR-018)
    // NOTE: Custom exercises removed in MVP (ADR-017)
    tableSchema({
      name: 'exercises',
      columns: [
        // ===== ExerciseDB fields (1:1 mapping) =====
        { name: 'exercisedb_id', type: 'string', isIndexed: true }, // Original ExerciseDB ID
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'body_parts', type: 'string' }, // JSON array: ["Chest", "Shoulders"] (anatomical regions)
        { name: 'target_muscles', type: 'string' }, // JSON array: ["Pectoralis Major"] (primary muscles)
        { name: 'secondary_muscles', type: 'string' }, // JSON array: ["Triceps", "Deltoids"] (supporting muscles)
        { name: 'equipments', type: 'string' }, // JSON array: ["Barbell", "Bench"] (required equipment)
        { name: 'exercise_type', type: 'string' }, // "weight_reps" | "cardio" | "duration" | "stretching"
        { name: 'instructions', type: 'string' }, // JSON array: step-by-step guide
        { name: 'exercise_tips', type: 'string' }, // JSON array: safety and technique recommendations
        { name: 'variations', type: 'string' }, // JSON array: alternative exercise versions
        { name: 'overview', type: 'string', isOptional: true }, // Descriptive summary
        { name: 'image_url', type: 'string', isOptional: true }, // Exercise image URL
        { name: 'video_url', type: 'string', isOptional: true }, // Exercise video URL
        { name: 'keywords', type: 'string' }, // JSON array: search optimization terms

        // ===== Halterofit-specific fields (analytics) =====
        { name: 'movement_pattern', type: 'string', isIndexed: true }, // "compound" | "isolation" (derived from ExerciseDB data)
        { name: 'difficulty', type: 'string' }, // "beginner" | "intermediate" | "advanced"

        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        // NOTE: _changed and _status are managed automatically by WatermelonDB sync
      ],
    }),

    // Workouts table
    tableSchema({
      name: 'workouts',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'started_at', type: 'number', isIndexed: true },
        { name: 'completed_at', type: 'number', isOptional: true },
        { name: 'duration_seconds', type: 'number', isOptional: true },
        { name: 'title', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'nutrition_phase', type: 'string' }, // 'bulk', 'cut', 'maintenance' - captured at workout time
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        // NOTE: _changed and _status are managed automatically by WatermelonDB sync
      ],
    }),

    // Workout exercises (junction table for ordering)
    tableSchema({
      name: 'workout_exercises',
      columns: [
        { name: 'workout_id', type: 'string', isIndexed: true },
        { name: 'exercise_id', type: 'string', isIndexed: true },
        { name: 'order_index', type: 'number' },
        { name: 'superset_group', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'target_sets', type: 'number', isOptional: true },
        { name: 'target_reps', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        // NOTE: _changed and _status are managed automatically by WatermelonDB sync
      ],
    }),

    // Exercise sets (actual performance data)
    tableSchema({
      name: 'exercise_sets',
      columns: [
        { name: 'workout_exercise_id', type: 'string', isIndexed: true },
        { name: 'set_number', type: 'number' },
        { name: 'weight', type: 'number', isOptional: true },
        { name: 'weight_unit', type: 'string', isOptional: true },
        { name: 'reps', type: 'number', isOptional: true },
        { name: 'duration_seconds', type: 'number', isOptional: true },
        { name: 'distance_meters', type: 'number', isOptional: true },
        { name: 'rpe', type: 'number', isOptional: true }, // Rate of Perceived Exertion (1-10)
        { name: 'rir', type: 'number', isOptional: true }, // Reps in Reserve (0-5)
        { name: 'rest_time_seconds', type: 'number', isOptional: true },
        { name: 'completed_at', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'is_warmup', type: 'boolean' },
        { name: 'is_failure', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        // NOTE: _changed and _status are managed automatically by WatermelonDB sync
      ],
    }),
  ],
});
