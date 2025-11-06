/**
 * ESLint config for network test helpers
 *
 * Network helpers (msw, fixtures) have different requirements:
 * - Use 'any' types for flexible mock data generation
 * - Allow unused function parameters in msw handlers
 */

module.exports = {
  extends: ['../../../.eslintrc.js'],

  rules: {
    // Allow 'any' in test helpers for mock data flexibility
    '@typescript-eslint/no-explicit-any': 'off',

    // Allow unused params in msw handlers (request object often unused)
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
};
