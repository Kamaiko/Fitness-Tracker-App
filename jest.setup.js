// Extend Jest matchers with react-native-specific matchers
// Note: @testing-library/react-native v12.4+ includes matchers built-in
// No need to import extend-expect anymore

// Mock Expo globals
global.__ExpoImportMetaRegistry = new Map();
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

// Mock console warnings in tests (reduce noise)
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() =>
    Promise.resolve({
      execAsync: jest.fn(),
      runAsync: jest.fn(),
      getAllAsync: jest.fn(),
      getFirstAsync: jest.fn(),
      closeAsync: jest.fn(),
    })
  ),
}));

// Mock expo-asset
jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => ({
      downloadAsync: jest.fn(),
    })),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
