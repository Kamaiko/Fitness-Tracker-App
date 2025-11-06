/**
 * Integration Tests Setup
 *
 * Global setup for integration tests:
 * - Initialize msw mock server
 * - Setup network simulator
 * - Configure test database (LokiJS)
 * - Global test utilities
 *
 * @module integration/setup
 */

import { setupMockSupabase, resetMockSupabase, cleanupMockSupabase } from '@test-helpers/network/mock-supabase';
import { networkSimulator } from '@test-helpers/network/network-simulator';

// ============================================================================
// msw Server Setup
// ============================================================================

/**
 * Setup msw server before all tests
 */
beforeAll(() => {
  setupMockSupabase();
  console.log('✅ msw mock server initialized');
});

/**
 * Reset msw handlers and network state after each test
 */
afterEach(() => {
  resetMockSupabase();
  networkSimulator.reset();
});

/**
 * Cleanup msw server after all tests
 */
afterAll(() => {
  cleanupMockSupabase();
  console.log('✅ msw mock server cleaned up');
});

// ============================================================================
// Global Test Environment
// ============================================================================

/**
 * Suppress console warnings in tests (optional)
 * Uncomment if needed to reduce noise
 */
// global.console = {
//   ...console,
//   warn: jest.fn(),
//   error: jest.fn(),
// };

/**
 * Global timeout for async operations
 */
jest.setTimeout(30000); // 30 seconds

// ============================================================================
// Custom Matchers (optional)
// ============================================================================

/**
 * Add custom Jest matchers for sync testing
 * Example: expect(record).toHaveSyncMetadata()
 */
expect.extend({
  toHaveSyncMetadata(received: any) {
    const hasMetadata =
      received &&
      typeof received._changed === 'number' &&
      typeof received._status === 'string' &&
      ['synced', 'created', 'updated', 'deleted'].includes(received._status);

    return {
      pass: hasMetadata,
      message: () =>
        hasMetadata
          ? `Expected record NOT to have sync metadata`
          : `Expected record to have sync metadata (_changed, _status)`,
    };
  },

  toBeValidTimestamp(received: any) {
    const isValid =
      typeof received === 'number' &&
      received >= 0 && // Allow epoch (0) as valid timestamp
      received <= Date.now() + 60000; // Allow 1 minute in future

    return {
      pass: isValid,
      message: () =>
        isValid
          ? `Expected ${received} NOT to be a valid timestamp`
          : `Expected ${received} to be a valid timestamp (non-negative number <= now + 1min)`,
    };
  },
});

// ============================================================================
// Type Declarations for Custom Matchers
// ============================================================================

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveSyncMetadata(): R;
      toBeValidTimestamp(): R;
    }
  }
}

// ============================================================================
// Integration Test Utilities
// ============================================================================

/**
 * Wait for condition with timeout (polling utility)
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Sleep utility for tests
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
