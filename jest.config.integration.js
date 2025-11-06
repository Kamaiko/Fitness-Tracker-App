/**
 * Jest Configuration for Integration Tests
 *
 * IMPORTANT LIMITATIONS:
 * - WatermelonDB sync protocol requires Real SQLite (not available in Jest/Node.js)
 * - `_changed`, `_status` columns and `synchronize()` method require native SQLite module
 * - Integration tests use LokiJS for most scenarios, E2E for sync-specific tests
 *
 * HYBRID APPROACH:
 * - Integration tests: LokiJS + Mock Supabase (msw) - Test business logic
 * - E2E tests: Real SQLite + Real Supabase - Test sync protocol
 *
 * @see docs/TESTING.md § Integration Tests
 * @see docs/TESTING.md § Limitations & Workarounds
 */

module.exports = {
  // Extend base Jest config
  ...require('./jest.config.js'),

  // Display name for better test output
  displayName: 'integration',

  // Integration test pattern
  testMatch: ['**/__tests__/integration/**/*.test.{ts,tsx}'],

  // Setup files for integration tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/__tests__/integration/setup.ts'],

  // Integration tests use LokiJS (NOT Real SQLite - see limitations above)
  // Real SQLite requires React Native environment (use E2E tests instead)
  testEnvironment: 'node',

  // Longer timeout for integration tests (sync operations)
  testTimeout: 30000, // 30 seconds

  // Coverage for integration tests (track sync logic coverage)
  collectCoverageFrom: [
    'src/services/database/**/*.{ts,tsx}',
    '__tests__/__helpers__/network/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__mocks__/**',
  ],

  coverageThreshold: {
    // Target 80% coverage for sync logic (Phase 1 goal)
    './src/services/database/': {
      branches: 50, // Start at 50%, increase to 80% in Phase 2
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  // Performance: Integration tests run slower than unit tests
  maxWorkers: 2, // Limit parallelism to avoid resource contention

  // Verbose output for debugging
  verbose: true,

  // Transform ESM modules from msw (required for integration tests)
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@nozbe/watermelondb|msw|@mswjs|until-async)',
  ],
};

// ============================================================================
// SYNC TESTING STRATEGY
// ============================================================================
//
// ✅ Integration Tests (LokiJS + msw):
//    - Sync logic (merge strategies, conflict detection)
//    - Network resilience (offline/online transitions)
//    - Mock API responses (pull/push changes)
//    - Business logic validation
//
// ❌ Integration Tests CANNOT test (E2E required):
//    - `_changed`, `_status` columns (SQLite-specific)
//    - `synchronize()` method (requires native module)
//    - Real Supabase sync (authentication, RLS)
//    - Multi-device conflict resolution (requires real backend)
//
// 📋 RECOMMENDED WORKFLOW:
//    1. Write integration tests for business logic (Jest + LokiJS)
//    2. Write E2E tests for sync protocol (Maestro + Real SQLite)
//    3. Run integration tests locally (fast feedback)
//    4. Run E2E tests in CI (comprehensive validation)
//
// ============================================================================
