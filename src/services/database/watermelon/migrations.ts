/**
 * WatermelonDB Local Database Migrations
 *
 * Handles schema version upgrades for local SQLite database.
 * These migrations run automatically when app detects schema version mismatch.
 *
 * IMPORTANT: _changed and _status columns are managed automatically by WatermelonDB
 * when using the sync protocol. They do NOT need to be added via migrations.
 *
 * Current schema version: 5
 *
 * Migration History:
 * - v1 → v2: ExerciseDB alignment (14-field schema)
 * - v2 → v3: Removed Halterofit-specific fields
 * - v3 → v4: Added exercisedb_id column
 * - v4 → v5: Migrated to ExerciseDB V1 API structure
 *   * Removed: exercise_type, exercise_tips, variations, overview, image_url, video_url, keywords
 *   * Added: description, difficulty, category
 *
 * NOTE: v2-v4 are placeholder migrations (no steps). v5 has real migration steps.
 *
 * @see https://nozbe.github.io/WatermelonDB/Advanced/Migrations.html
 * @see https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
 */

import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        // No migration steps - fresh installs start at current version
      ],
    },
    {
      toVersion: 3,
      steps: [
        // No migration steps - fresh installs start at current version
      ],
    },
    {
      toVersion: 4,
      steps: [
        // No migration steps - fresh installs start at current version
      ],
    },
    {
      toVersion: 5,
      steps: [
        // Add V1 API fields to exercises table
        addColumns({
          table: 'exercises',
          columns: [
            { name: 'description', type: 'string' },
            { name: 'difficulty', type: 'string' },
            { name: 'category', type: 'string' },
          ],
        }),
        // NOTE: Removed fields (exercise_type, exercise_tips, etc.) don't need explicit removal
        // WatermelonDB simply ignores columns not defined in the schema
      ],
    },
  ],
});
