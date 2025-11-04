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
    // NOTE: Custom exercises removed in MVP (ADR-017)
    // May be added in Phase 3+ based on beta user feedback
    tableSchema({
      name: 'exercises',
      columns: [
        { name: 'exercisedb_id', type: 'string', isIndexed: true }, // Original ExerciseDB ID
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'category', type: 'string', isIndexed: true },
        { name: 'exercise_type', type: 'string' }, // 'strength', 'cardio', 'flexibility'
        { name: 'muscle_groups', type: 'string' }, // JSON array as string
        { name: 'primary_muscle', type: 'string' },
        { name: 'equipment', type: 'string', isIndexed: true },
        { name: 'instructions', type: 'string' },
        { name: 'difficulty', type: 'string' }, // 'beginner', 'intermediate', 'expert'
        { name: 'image_url', type: 'string', isOptional: true },
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
