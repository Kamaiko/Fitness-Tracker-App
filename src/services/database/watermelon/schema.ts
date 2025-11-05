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
  version: 5, // V5: Migrated to ExerciseDB V1 API structure (removed 7 fields, added 3)
  tables: [
    // Users table
    tableSchema({
      name: 'users',
      columns: [
        { name: 'email', type: 'string' },
        { name: 'preferred_unit', type: 'string' }, // 'kg' or 'lbs'
        // NOTE: nutrition_phase removed per SCOPE-SIMPLIFICATION.md (not in MVP scope)
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // Exercises table (1,300+ from ExerciseDB V1 - read-only)
    // NOTE: ExerciseDB V1 API structure (10 fields, images deferred to post-MVP)
    // NOTE: Custom exercises removed in MVP (ADR-017)
    tableSchema({
      name: 'exercises',
      columns: [
        // ===== ExerciseDB V1 API fields =====
        { name: 'exercisedb_id', type: 'string', isIndexed: true }, // Original ExerciseDB ID
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'body_parts', type: 'string' }, // JSON array: ["chest"] (single anatomical region from V1)
        { name: 'target_muscles', type: 'string' }, // JSON array: ["pectorals"] (single primary muscle from V1)
        { name: 'secondary_muscles', type: 'string' }, // JSON array: ["triceps", "deltoids"] (supporting muscles)
        { name: 'equipments', type: 'string' }, // JSON array: ["barbell"] (single equipment from V1)
        { name: 'instructions', type: 'string' }, // JSON array: step-by-step guide
        { name: 'description', type: 'string' }, // V1: Detailed exercise description (replaces overview)
        { name: 'difficulty', type: 'string' }, // V1: "beginner" | "intermediate" | "advanced"
        { name: 'category', type: 'string' }, // V1: "strength" | "cardio" | "stretching"
        // NOTE: Images deferred to post-MVP (AI-generated or GitHub open-source)

        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
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
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
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
      ],
    }),
  ],
});
