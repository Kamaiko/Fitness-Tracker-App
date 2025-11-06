/**
 * Test Assertions and Utilities
 *
 * Provides specialized assertion helpers and sync protocol utilities.
 * For query helpers, see queries.ts. For time helpers, see time.ts.
 *
 * @module test-helpers/database/assertions
 */

import { Model } from '@nozbe/watermelondb';

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
 * @param {Model} record - WatermelonDB model instance
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
  record: Model,
  options: { shouldBeDeleted?: boolean } = {}
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
 * @param {Model} record - WatermelonDB model instance
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
export function getSyncTimestamp(record: Model): number {
  // WatermelonDB stores _changed as string in _raw object
  const rawChanged = record._raw?._changed;
  return parseInt(rawChanged, 10);
}

/**
 * Checks if a record is marked as deleted (soft delete).
 *
 * WatermelonDB stores sync columns in _raw object.
 *
 * @param {Model} record - WatermelonDB model instance
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
export function isRecordDeleted(record: Model): boolean {
  // WatermelonDB stores _status in _raw object
  return record._raw?._status === 'deleted';
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
  toleranceMs: number = 1000
): void {
  const actualTime = new Date(actual).getTime();
  const expectedTime = new Date(expected).getTime();
  const diff = Math.abs(actualTime - expectedTime);

  expect(diff).toBeLessThanOrEqual(toleranceMs);
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
  fn: () => Promise<T>
): Promise<{ result: T; durationMs: number }> {
  const startTime = Date.now();
  const result = await fn();
  const endTime = Date.now();
  const durationMs = endTime - startTime;

  return { result, durationMs };
}
