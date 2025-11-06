/**
 * Test Database Setup
 *
 * Provides reusable test database configuration with LokiJS in-memory adapter.
 * LokiJS is used for Jest/Node.js environment (SQLite requires React Native JSI).
 *
 * @module test-database
 */

import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schema } from '@/services/database/local/schema';
import migrations from '@/services/database/local/migrations';
import Workout from '@/services/database/local/models/Workout';
import WorkoutExercise from '@/services/database/local/models/WorkoutExercise';
import ExerciseSet from '@/services/database/local/models/ExerciseSet';
import Exercise from '@/services/database/local/models/Exercise';
import User from '@/services/database/local/models/User';

/**
 * Creates a fresh in-memory LokiJS test database.
 *
 * Features:
 * - In-memory storage for speed
 * - Compatible with Jest/Node.js environment
 * - Isolated per test (no side effects)
 * - Full migration support
 * - Sync protocol support (_changed, _status)
 *
 * Performance:
 * - Database creation: ~5ms
 * - Query execution: ~1-3ms
 * - Full test: ~50-100ms
 *
 * Note: LokiJS is used instead of SQLite for Jest tests because SQLite
 * requires React Native's JSI (JavaScript Interface) which isn't available
 * in Node.js environment. Production uses SQLite adapter.
 *
 * @returns {Database} Configured WatermelonDB instance ready for testing
 *
 * @example
 * ```typescript
 * import { createTestDatabase } from './setup/test-database';
 *
 * describe('Workout CRUD', () => {
 *   let database: Database;
 *
 *   beforeEach(() => {
 *     database = createTestDatabase();
 *   });
 *
 *   afterEach(async () => {
 *     await database.write(async () => {
 *       await database.unsafeResetDatabase();
 *     });
 *   });
 *
 *   test('creates workout', async () => {
 *     // Test implementation
 *   });
 * });
 * ```
 */
export function createTestDatabase(): Database {
  const adapter = new LokiJSAdapter({
    schema,
    migrations,
    // LokiJS-specific options (optimized for tests)
    useWebWorker: false, // Disable web worker for faster execution in Node.js
    useIncrementalIndexedDB: false, // Not needed for in-memory tests
  });

  return new Database({
    adapter,
    modelClasses: [Workout, WorkoutExercise, ExerciseSet, Exercise, User],
  });
}

/**
 * Cleans up test database by resetting all data.
 *
 * Call this in afterEach() to ensure test isolation.
 * Uses unsafeResetDatabase() which is faster than dropping/recreating.
 *
 * Note: LokiJS is an in-memory adapter that doesn't require explicit connection
 * closing. The database is automatically garbage collected when the test completes.
 *
 * @param {Database} database - Database instance to clean
 *
 * @example
 * ```typescript
 * afterEach(async () => {
 *   await cleanupTestDatabase(database);
 * });
 * ```
 */
export async function cleanupTestDatabase(database: Database): Promise<void> {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
}

/**
 * Type-safe database instance for testing.
 * Extends Database with typed collections for better IDE support.
 */
export type TestDatabase = Database;
