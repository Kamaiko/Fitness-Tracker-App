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
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// All external native modules are mocked via __mocks__ directory
// This is the standard Jest approach for modules that don't exist in Node.js
// Mocked modules:
// - expo-sqlite
// - expo-asset
// - @react-native-async-storage/async-storage
// - react-native-mmkv
// - @supabase/supabase-js

// Mock our Supabase client to avoid loading native dependencies during tests
jest.mock('@/services/supabase/client');
