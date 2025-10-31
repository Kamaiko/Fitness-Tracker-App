/**
 * WatermelonDB Local Database Migrations
 *
 * Handles schema version upgrades for local SQLite database.
 * These migrations run automatically when app detects schema version mismatch.
 *
 * IMPORTANT: _changed and _status columns are managed automatically by WatermelonDB
 * when using the sync protocol. They do NOT need to be added via migrations.
 *
 * Current schema version: 2
 * Previous schema version: 1
 *
 * Version 1 → 2 Migration:
 * - No manual migration needed
 * - WatermelonDB automatically adds sync protocol columns on first sync
 * - Removed old 'synced' boolean column from application code
 *
 * @see https://nozbe.github.io/WatermelonDB/Advanced/Migrations.html
 * @see https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
 */

import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    // NOTE: No migrations needed from v1 to v2
    // WatermelonDB automatically manages sync protocol columns (_changed, _status)
    // when synchronize() is called for the first time
  ],
});
