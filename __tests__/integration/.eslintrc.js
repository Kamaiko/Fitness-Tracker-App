/**
 * ESLint config for integration tests
 *
 * Integration tests have different requirements than production code:
 * - Use fetch() in Node.js environment (provided by msw)
 * - Use 'any' types for mock data flexibility
 * - Use Jest namespace for custom matchers
 */

module.exports = {
  extends: ['../../.eslintrc.js'],

  env: {
    node: true,
    jest: true,
  },

  globals: {
    fetch: 'readonly', // fetch is provided by msw in tests
  },

  rules: {
    // Allow 'any' in test files for mock data flexibility
    '@typescript-eslint/no-explicit-any': 'off',

    // Allow namespace for Jest custom matchers (standard pattern)
    '@typescript-eslint/no-namespace': 'off',

    // Allow unused vars prefixed with underscore
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
};
