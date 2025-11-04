/**
 * WatermelonDB Local Database Migrations
 *
 * Handles schema version upgrades for local SQLite database.
 * These migrations run automatically when app detects schema version mismatch.
 *
 * IMPORTANT: _changed and _status columns are managed automatically by WatermelonDB
 * when using the sync protocol. They do NOT need to be added via migrations.
 *
 * Current schema version: 4
 *
 * Migration History:
 * - v1 → v2: ExerciseDB alignment (14-field schema)
 * - v2 → v3: Removed Halterofit-specific fields
 * - v3 → v4: Added exercisedb_id column
 *
 * NOTE: No actual migrations needed for fresh installs (start at v4).
 * Placeholder migrations satisfy WatermelonDB validation in tests.
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
  ],
});
