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
 * - v1-v4: Initial schema development
 * - v5: Consolidated schema (merged 8 incremental migrations)
 * - v6: Removed description, difficulty, category (not in GitHub dataset)
 * - v7: Added gif_url (GitHub ExerciseDB provides animated GIFs)
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
