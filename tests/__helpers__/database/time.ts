/**
 * Time Manipulation Helpers
 *
 * Utilities for working with dates and delays in tests.
 * Useful for timestamp testing and time-based assertions.
 *
 * @module test-helpers/database/time
 */

/**
 * Delays execution for a specified number of milliseconds.
 *
 * Useful for ensuring timestamp differences or testing time-based logic.
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
export function dateInPast(options: { days?: number; hours?: number; minutes?: number }): Date {
  const now = new Date();
  const { days = 0, hours = 0, minutes = 0 } = options;

  const totalMs = days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

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
export function dateInFuture(options: { days?: number; hours?: number; minutes?: number }): Date {
  const now = new Date();
  const { days = 0, hours = 0, minutes = 0 } = options;

  const totalMs = days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

  return new Date(now.getTime() + totalMs);
}
