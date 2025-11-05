/**
 * WatermelonDB Local Database Migrations
 *
 * Handles schema version upgrades for local SQLite database.
 * These migrations run automatically when app detects schema version mismatch.
 *
 * IMPORTANT: _changed and _status columns are managed automatically by WatermelonDB
 * when using the sync protocol. They do NOT need to be added via migrations.
 *
 * Current schema version: 7
 *
 * Migration History:
 * - v1 → v2: ExerciseDB alignment (14-field schema)
 * - v2 → v3: Removed Halterofit-specific fields
 * - v3 → v4: Added exercisedb_id column
 * - v4 → v5: Migrated to ExerciseDB V1 API structure
 *   * Removed: exercise_type, exercise_tips, variations, overview, image_url, video_url, keywords
 *   * Added: description, difficulty, category
 * - v5 → v6: Removed description, difficulty, category (not in GitHub ExerciseDB dataset)
 * - v6 → v7: Added gif_url (GitHub ExerciseDB provides animated exercise GIFs)
 *
 * NOTE: v2-v4 are placeholder migrations (no steps).
 *
 * @see https://nozbe.github.io/WatermelonDB/Advanced/Migrations.html
 * @see https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
 */

import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

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
        // Placeholder - fresh installs start at current version
      ],
    },
    {
      toVersion: 6,
      steps: [
        // No steps needed - WatermelonDB ignores columns not in schema
        // Removed: description, difficulty, category (not in GitHub ExerciseDB dataset)
      ],
    },
    {
      toVersion: 7,
      steps: [
        // No steps needed - WatermelonDB will create gif_url column on next sync
        // Added: gif_url (GitHub ExerciseDB provides animated exercise GIFs)
      ],
    },
  ],
});
