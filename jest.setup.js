// Extend Jest matchers with react-native-specific matchers
// Note: @testing-library/react-native v12.4+ includes matchers built-in
// No need to import extend-expect anymore

// Mock Expo globals
global.__ExpoImportMetaRegistry = new Map();
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

// Mock environment variables for Supabase (prevents errors during module loading)
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock console warnings in tests (reduce noise)
// Set DEBUG_WATERMELON=1 to see WatermelonDB logs during test debugging
global.console = {
  ...console,
  log: process.env.DEBUG_WATERMELON ? console.log : jest.fn(), // Silence WatermelonDB logs
  warn: jest.fn(),
  error: jest.fn(),
};

// All external native modules are mocked via __mocks__ directory
// This is the standard Jest approach for modules that don't exist in Node.js
// Mocked modules:
// - expo-asset
// - react-native-mmkv
// - @supabase/supabase-js

// Mock our Supabase client to avoid loading native dependencies during tests
jest.mock('@/services/supabase/client');

// ============================================================================
// 🆕 Global Test Setup (Phase 0.5.28 refactor)
// ============================================================================

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Note: resetTestIdCounter() is called in each test file's beforeEach
  // (not here to avoid issues - tests explicitly call it)
});

// ============================================================================
// 🆕 Custom Jest Matchers (Phase 0.5.28 refactor)
// ============================================================================

expect.extend({
  /**
   * Assert workout object has valid structure
   * @example expect(workout).toBeValidWorkout()
   */
  toBeValidWorkout(received) {
    const pass =
      received &&
      typeof received.id === 'string' &&
      typeof received.title === 'string' &&
      typeof received.userId === 'string';

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${JSON.stringify(received)} not to be a valid workout`
          : `Expected ${JSON.stringify(received)} to be a valid workout (id, title, userId)`,
    };
  },

  /**
   * Assert exercise object has valid structure
   * @example expect(exercise).toBeValidExercise()
   */
  toBeValidExercise(received) {
    const pass = received && typeof received.id === 'string' && typeof received.name === 'string';

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${JSON.stringify(received)} not to be a valid exercise`
          : `Expected ${JSON.stringify(received)} to be a valid exercise (id, name)`,
    };
  },
});
