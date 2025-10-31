/**
 * Test Utilities
 *
 * Provides reusable helper functions and custom matchers for database tests.
 * Ensures consistent assertions and reduces test boilerplate.
 *
 * @module test-utils
 */

import { Database, Model } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

// ============================================================================
// Database Query Helpers
// ============================================================================

/**
 * Fetches all records from a collection.
 *
 * @param {Database} database - WatermelonDB instance
 * @param {string} tableName - Collection name (e.g., 'workouts')
 * @returns {Promise<Model[]>} All records in the collection
 *
 * @example
 * ```typescript
 * const workouts = await getAllRecords(database, 'workouts');
 * expect(workouts).toHaveLength(5);
 * ```
 */
export async function getAllRecords(database: Database, tableName: string): Promise<Model[]> {
  const collection = database.get(tableName);
  return await collection.query().fetch();
}

/**
 * Fetches a single record by ID.
 *
 * @param {Database} database - WatermelonDB instance
 * @param {string} tableName - Collection name
 * @param {string} id - Record ID
 * @returns {Promise<Model>} Record with the specified ID
 * @throws {Error} If record not found
 *
 * @example
 * ```typescript
 * const workout = await getRecordById(database, 'workouts', 'workout-1');
 * expect(workout.title).toBe('Leg Day');
 * ```
 */
export async function getRecordById(
  database: Database,
  tableName: string,
  id: string,
): Promise<Model> {
  const collection = database.get(tableName);
  return await collection.find(id);
}

/**
 * Counts records in a collection matching optional query.
 *
 * @param {Database} database - WatermelonDB instance
 * @param {string} tableName - Collection name
 * @param {any[]} queryConditions - Optional WatermelonDB query conditions
 * @returns {Promise<number>} Number of matching records
 *
 * @example
 * ```typescript
 * const count = await countRecords(database, 'workouts');
 * expect(count).toBe(10);
 *
 * const completedCount = await countRecords(database, 'workouts', [
 *   Q.where('status', 'completed')
 * ]);
 * expect(completedCount).toBe(5);
 * ```
 */
export async function countRecords(
  database: Database,
  tableName: string,
  queryConditions: any[] = [],
): Promise<number> {
  const collection = database.get(tableName);
  return await collection.query(...queryConditions).fetchCount();
}

/**
 * Checks if a record exists by ID.
 *
 * @param {Database} database - WatermelonDB instance
 * @param {string} tableName - Collection name
 * @param {string} id - Record ID
 * @returns {Promise<boolean>} True if record exists, false otherwise
 *
 * @example
 * ```typescript
 * const exists = await recordExists(database, 'workouts', 'workout-1');
 * expect(exists).toBe(true);
 * ```
 */
export async function recordExists(
  database: Database,
  tableName: string,
  id: string,
): Promise<boolean> {
  try {
    await getRecordById(database, tableName, id);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Sync Protocol Helpers
// ============================================================================

/**
 * Asserts that a record has valid sync protocol columns.
 *
 * Validates:
 * - _changed exists and can be converted to a valid timestamp
 * - _changed is greater than 0
 * - _status is null (not deleted) by default
 *
 * NOTE: LokiJS stores _changed as string, SQLite as number.
 * This helper normalizes both to ensure cross-adapter compatibility.
 *
 * @param {any} record - WatermelonDB model instance
 * @param {object} options - Assertion options
 * @param {boolean} options.shouldBeDeleted - If true, expects _status to be 'deleted'
 *
 * @example
 * ```typescript
 * const workout = await createTestWorkout(database);
 * assertSyncProtocolColumns(workout);
 *
 * // After soft delete
 * await workout.markAsDeleted();
 * assertSyncProtocolColumns(workout, { shouldBeDeleted: true });
 * ```
 */
export function assertSyncProtocolColumns(
  record: any,
  options: { shouldBeDeleted?: boolean } = {},
): void {
  // WatermelonDB stores sync protocol columns in _raw object
  // According to WatermelonDB source (RawRecord/index.d.ts):
  // - _changed is ALWAYS a string (timestamp as string)
  // - _status is SyncStatus ('synced' | 'created' | 'updated' | 'deleted')
  const rawChanged = record._raw?._changed;
  const rawStatus = record._raw?._status;

  expect(rawChanged).toBeDefined();
  expect(typeof rawChanged).toBe('string');

  // _changed should be a parseable timestamp string
  const timestamp = parseInt(rawChanged, 10);
  expect(isNaN(timestamp)).toBe(false);
  expect(timestamp).toBeGreaterThan(0);

  // Verify it's a reasonable timestamp (13 digits for milliseconds)
  expect(rawChanged.length).toBeGreaterThanOrEqual(13);

  if (options.shouldBeDeleted) {
    expect(rawStatus).toBe('deleted');
  } else {
    // For non-deleted records, _status should be 'synced', 'created', or 'updated'
    expect(['synced', 'created', 'updated']).toContain(rawStatus);
  }
}

/**
 * Gets the _changed timestamp of a record.
 *
 * NOTE: WatermelonDB always stores _changed as a string (per RawRecord spec).
 * This helper parses it to a number for easier comparison.
 * WatermelonDB stores sync columns in _raw object.
 *
 * @param {any} record - WatermelonDB model instance
 * @returns {number} Timestamp in milliseconds
 *
 * @example
 * ```typescript
 * const workout = await createTestWorkout(database);
 * const timestamp1 = getSyncTimestamp(workout);
 *
 * await workout.update(() => {
 *   workout.title = 'Updated';
 * });
 * const timestamp2 = getSyncTimestamp(workout);
 *
 * expect(timestamp2).toBeGreaterThan(timestamp1);
 * ```
 */
export function getSyncTimestamp(record: any): number {
  // WatermelonDB stores _changed as string in _raw object
  const rawChanged = record._raw?._changed;
  return parseInt(rawChanged, 10);
}

/**
 * Checks if a record is marked as deleted (soft delete).
 *
 * WatermelonDB stores sync columns in _raw object.
 *
 * @param {any} record - WatermelonDB model instance
 * @returns {boolean} True if _status is 'deleted'
 *
 * @example
 * ```typescript
 * const workout = await createTestWorkout(database);
 * expect(isRecordDeleted(workout)).toBe(false);
 *
 * await workout.markAsDeleted();
 * expect(isRecordDeleted(workout)).toBe(true);
 * ```
 */
export function isRecordDeleted(record: any): boolean {
  // WatermelonDB stores _status in _raw object
  return record._raw?._status === 'deleted';
}

// ============================================================================
// Time Manipulation Helpers
// ============================================================================

/**
 * Waits for a specified amount of milliseconds.
 *
 * Useful for testing time-dependent operations (e.g., _changed timestamp updates).
 *
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const timestamp1 = getSyncTimestamp(workout);
 * await wait(10); // Ensure timestamp difference
 * await workout.update(() => { workout.title = 'Updated'; });
 * const timestamp2 = getSyncTimestamp(workout);
 * expect(timestamp2).toBeGreaterThan(timestamp1);
 * ```
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a date in the past relative to now.
 *
 * @param {object} options - Date calculation options
 * @param {number} options.days - Days in the past (default: 0)
 * @param {number} options.hours - Hours in the past (default: 0)
 * @param {number} options.minutes - Minutes in the past (default: 0)
 * @returns {Date} Date in the past
 *
 * @example
 * ```typescript
 * const yesterday = dateInPast({ days: 1 });
 * const oneHourAgo = dateInPast({ hours: 1 });
 * ```
 */
export function dateInPast(options: {
  days?: number;
  hours?: number;
  minutes?: number;
}): Date {
  const now = new Date();
  const { days = 0, hours = 0, minutes = 0 } = options;

  const totalMs =
    days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

  return new Date(now.getTime() - totalMs);
}

/**
 * Creates a date in the future relative to now.
 *
 * @param {object} options - Date calculation options
 * @param {number} options.days - Days in the future (default: 0)
 * @param {number} options.hours - Hours in the future (default: 0)
 * @param {number} options.minutes - Minutes in the future (default: 0)
 * @returns {Date} Date in the future
 *
 * @example
 * ```typescript
 * const tomorrow = dateInFuture({ days: 1 });
 * const inOneHour = dateInFuture({ hours: 1 });
 * ```
 */
export function dateInFuture(options: {
  days?: number;
  hours?: number;
  minutes?: number;
}): Date {
  const now = new Date();
  const { days = 0, hours = 0, minutes = 0 } = options;

  const totalMs =
    days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

  return new Date(now.getTime() + totalMs);
}

// ============================================================================
// Assertion Helpers
// ============================================================================

/**
 * Asserts that two dates are approximately equal (within tolerance).
 *
 * Useful for testing timestamps that may have small differences due to execution time.
 *
 * @param {Date | string | number} actual - Actual date/timestamp
 * @param {Date | string | number} expected - Expected date/timestamp
 * @param {number} toleranceMs - Tolerance in milliseconds (default: 1000ms = 1 second)
 *
 * @example
 * ```typescript
 * const workout = await createTestWorkout(database);
 * assertDatesApproximatelyEqual(workout.startedAt, new Date(), 1000);
 * ```
 */
export function assertDatesApproximatelyEqual(
  actual: Date | string | number,
  expected: Date | string | number,
  toleranceMs: number = 1000,
): void {
  const actualTime = new Date(actual).getTime();
  const expectedTime = new Date(expected).getTime();
  const diff = Math.abs(actualTime - expectedTime);

  expect(diff).toBeLessThanOrEqual(toleranceMs);
}

/**
 * Asserts that an array contains objects with specific properties.
 *
 * @param {any[]} array - Array to check
 * @param {object} expectedProps - Expected properties and values
 *
 * @example
 * ```typescript
 * const workouts = await getAllRecords(database, 'workouts');
 * assertArrayContainsObject(workouts, { title: 'Leg Day', status: 'completed' });
 * ```
 */
export function assertArrayContainsObject(array: any[], expectedProps: Record<string, any>): void {
  const found = array.some((item) => {
    return Object.entries(expectedProps).every(([key, value]) => item[key] === value);
  });

  expect(found).toBe(true);
}

// ============================================================================
// Error Testing Helpers
// ============================================================================

/**
 * Asserts that an async function throws an error with a specific message.
 *
 * @param {Function} fn - Async function that should throw
 * @param {string | RegExp} expectedMessage - Expected error message or pattern
 *
 * @example
 * ```typescript
 * await expectAsyncError(
 *   async () => await getRecordById(database, 'workouts', 'non-existent'),
 *   /not found/i
 * );
 * ```
 */
export async function expectAsyncError(
  fn: () => Promise<any>,
  expectedMessage: string | RegExp,
): Promise<void> {
  await expect(fn()).rejects.toThrow(expectedMessage);
}

// ============================================================================
// Batch Operation Helpers
// ============================================================================

/**
 * Creates multiple test records of the same type in batch.
 *
 * More efficient than creating records one by one.
 *
 * @param {Function} createFn - Factory function (e.g., createTestWorkout)
 * @param {Database} database - WatermelonDB instance
 * @param {number} count - Number of records to create
 * @param {Function} overridesFn - Optional function to generate unique overrides per record
 * @returns {Promise<any[]>} Array of created records
 *
 * @example
 * ```typescript
 * // Create 10 workouts with sequential titles
 * const workouts = await createMultipleRecords(
 *   createTestWorkout,
 *   database,
 *   10,
 *   (index) => ({ title: `Workout ${index + 1}` })
 * );
 * expect(workouts).toHaveLength(10);
 * ```
 */
export async function createMultipleRecords<T>(
  createFn: (db: Database, overrides?: any) => Promise<T>,
  database: Database,
  count: number,
  overridesFn?: (index: number) => any,
): Promise<T[]> {
  const records: T[] = [];

  for (let i = 0; i < count; i++) {
    const overrides = overridesFn ? overridesFn(i) : {};
    const record = await createFn(database, overrides);
    records.push(record);
  }

  return records;
}

// ============================================================================
// Performance Testing Helpers
// ============================================================================

/**
 * Measures execution time of an async operation.
 *
 * @param {Function} fn - Async function to measure
 * @returns {Promise<{ result: any; durationMs: number }>} Result and duration
 *
 * @example
 * ```typescript
 * const { result, durationMs } = await measureExecutionTime(async () => {
 *   return await database.get('workouts').query().fetch();
 * });
 * console.log(`Query took ${durationMs}ms`);
 * expect(durationMs).toBeLessThan(100); // Performance assertion
 * ```
 */
export async function measureExecutionTime<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; durationMs: number }> {
  const startTime = Date.now();
  const result = await fn();
  const endTime = Date.now();
  const durationMs = endTime - startTime;

  return { result, durationMs };
}
