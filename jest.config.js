module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@nozbe/watermelondb)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/?(*.)+(spec|test).{ts,tsx}'],

  // Coverage thresholds for database layer (Phase 0.5 - Foundation)
  // Target: 60-70% coverage for critical database/sync code
  // See: .claude/CLAUDE.md for testing strategy
  coverageThreshold: {
    global: {
      // Global thresholds disabled for Phase 0.5 (only testing database layer)
      // Will be enabled in Phase 1 when testing broader codebase
      // branches: 0,
      // functions: 0,
      // lines: 0,
      // statements: 0,
    },
    './src/services/database/': {
      branches: 60,
      functions: 65,
      lines: 65,
      statements: 65,
    },
  },

  // Performance optimizations
  cacheDirectory: '.jest-cache',
  maxWorkers: '50%', // Use 50% of CPU cores for parallel test execution

  // Verbose output in CI for better debugging
  verbose: process.env.CI === 'true',
};
