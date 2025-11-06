/**
 * Jest Setup Validation Tests
 *
 * These tests validate that Jest is configured correctly.
 * They serve as examples for writing future tests.
 */

describe('Jest Setup Validation', () => {
  test('basic math works', () => {
    expect(1 + 1).toBe(2);
  });

  test('array contains value', () => {
    const array = [1, 2, 3];
    expect(array).toContain(2);
  });

  test('string concatenation', () => {
    const greeting = 'Hello' + ' ' + 'World';
    expect(greeting).toBe('Hello World');
  });
});
