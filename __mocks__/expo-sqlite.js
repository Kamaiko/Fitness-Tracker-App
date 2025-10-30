// Manual mock for expo-sqlite
// This allows tests to run without the actual Expo native module

const mockDatabase = {
  execAsync: jest.fn(() => Promise.resolve()),
  runAsync: jest.fn(() => Promise.resolve({ changes: 1, lastInsertRowId: 1 })),
  getAllAsync: jest.fn(() => Promise.resolve([])),
  getFirstAsync: jest.fn(() => Promise.resolve(null)),
  closeAsync: jest.fn(() => Promise.resolve()),
};

const openDatabaseAsync = jest.fn(() => Promise.resolve(mockDatabase));

module.exports = {
  openDatabaseAsync,
};
