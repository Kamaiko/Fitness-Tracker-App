# Mocking Patterns Guide

**Context:** Complete guide to mocking external dependencies in Halterofit tests
**Audience:** Developers writing tests that depend on native modules or services
**Environment:** Jest with automatic and manual mocks

## Quick Reference

```typescript
// Jest automatically mocks modules in __mocks__/
import { MMKV } from 'react-native-mmkv'; // Uses __mocks__/react-native-mmkv.js

// Manual mock for internal module
jest.mock('@/services/supabase/client'); // Mocked in jest.setup.js

// Override mock per-test
jest.mock('@/services/database/workouts', () => ({
  createWorkout: jest.fn(() => Promise.resolve(mockWorkout)),
}));
```

## Mocking Strategy

### When to Mock

**✅ Mock External Dependencies:**

- Native modules (react-native-mmkv, expo-asset)
- Network calls (Supabase, API clients)
- File system operations
- Third-party SDKs

**❌ Don't Mock Internal Code:**

- Your own business logic (defeats purpose of testing)
- Database models (test real behavior)
- Utilities and helpers (unless expensive operations)

### Types of Mocks

**1. Automatic Mocks (`__mocks__/` directory)**

- Jest auto-discovers
- Best for: Native modules
- Location: `__mocks__/module-name.js`

**2. Manual Mocks (jest.mock())**

- Explicit mock in test or jest.setup.js
- Best for: Internal modules, services
- Location: Test file or jest.setup.js

## Automatic Mocks

### Current Mocks

**`__mocks__/expo-asset.js`** - Expo Asset API

```javascript
const Asset = {
  fromModule: jest.fn(() => ({
    downloadAsync: jest.fn(() => Promise.resolve()),
    uri: 'mock-asset-uri',
  })),
};

module.exports = { Asset };
```

**`__mocks__/react-native-mmkv.js`** - MMKV Storage

```javascript
const mockStorage = {}; // In-memory

const mockMMKV = {
  set: jest.fn((key, value) => {
    mockStorage[key] = value;
  }),
  getString: jest.fn((key) => mockStorage[key]),
  // ... all MMKV methods
};

module.exports = { MMKV: mockMMKV };
```

**`__mocks__/@supabase/supabase-js.js`** - Supabase Client

```javascript
// Mocked in jest.setup.js instead:
jest.mock('@/services/supabase/client');
```

### Creating Automatic Mocks

**1. Create file in `__mocks__/`**

```
__mocks__/
└── my-native-module.js     # Matches 'my-native-module' import
```

**2. Export mock implementation**

```javascript
// __mocks__/my-native-module.js
const mockFunction = jest.fn(() => 'mock-value');

module.exports = {
  mockFunction,
  CONSTANT: 'MOCK_CONSTANT',
};
```

**3. Jest auto-discovers (no manual setup needed)**

```typescript
import { mockFunction } from 'my-native-module';

test('uses mock', () => {
  expect(mockFunction()).toBe('mock-value'); // Uses __mocks__/ automatically
});
```

## Manual Mocks

### Global Mocks (jest.setup.js)

**Best for:** Modules used across ALL tests

```javascript
// jest.setup.js
jest.mock('@/services/supabase/client'); // All tests use this mock
```

### Per-Test Mocks

**Best for:** Test-specific behavior

```typescript
// In test file
jest.mock('@/services/api/client', () => ({
  fetchWorkouts: jest.fn(() => Promise.resolve(mockData)),
}));

test('fetches workouts', async () => {
  // Uses custom mock for this test only
});
```

### Partial Mocks

**Mock only specific exports:**

```typescript
jest.mock('@/services/database/workouts', () => ({
  ...jest.requireActual('@/services/database/workouts'), // Keep real exports
  createWorkout: jest.fn(), // Mock only this function
}));
```

## Mock Patterns

### Mocking Async Functions

```typescript
// Simple promise resolution
const mockFn = jest.fn(() => Promise.resolve('success'));

// Reject promise
const mockFn = jest.fn(() => Promise.reject(new Error('failed')));

// Async/await
const mockFn = jest.fn(async () => {
  await someAsyncOperation();
  return 'result';
});
```

### Mocking with Return Values

```typescript
// Single return value
mockFn.mockReturnValue('value');

// Different values per call
mockFn.mockReturnValueOnce('first').mockReturnValueOnce('second').mockReturnValue('default');

// Resolved promise
mockFn.mockResolvedValue('success');

// Rejected promise
mockFn.mockRejectedValue(new Error('failed'));
```

### Mocking Implementation

```typescript
// Custom implementation
mockFn.mockImplementation((arg) => {
  if (arg === 'valid') return 'success';
  throw new Error('invalid');
});

// Once implementation
mockFn.mockImplementationOnce(() => 'first call');
```

### Spy on Real Functions

```typescript
// Spy on module function
import * as utils from '@/utils';
const spy = jest.spyOn(utils, 'formatDate');

// Spy + mock implementation
spy.mockImplementation(() => '2025-01-31');

// Restore original
spy.mockRestore();
```

## Testing with Mocks

### Asserting Mock Calls

```typescript
import { MMKV } from 'react-native-mmkv';

test('stores data', () => {
  MMKV.set('key', 'value');

  // Assert called
  expect(MMKV.set).toHaveBeenCalled();

  // Assert call count
  expect(MMKV.set).toHaveBeenCalledTimes(1);

  // Assert arguments
  expect(MMKV.set).toHaveBeenCalledWith('key', 'value');

  // Assert last call
  expect(MMKV.set).toHaveBeenLastCalledWith('key', 'value');
});
```

### Resetting Mocks

```typescript
beforeEach(() => {
  jest.clearAllMocks(); // Clear call history
  // OR
  mockFn.mockClear(); // Clear call history for one mock
  mockFn.mockReset(); // Clear + reset to default
  mockFn.mockRestore(); // Restore original (for spies)
});
```

### Debugging Mocks

```typescript
test('debug mock calls', () => {
  mockFn('arg1', 'arg2');
  mockFn('arg3');

  // View all calls
  console.log(mockFn.mock.calls);
  // [ ['arg1', 'arg2'], ['arg3'] ]

  // View results
  console.log(mockFn.mock.results);
  // [ { type: 'return', value: ... }, ... ]

  // View this context
  console.log(mockFn.mock.instances);
});
```

## Anti-Patterns

### ❌ Over-Mocking

```typescript
// ❌ BAD: Mocking everything defeats testing purpose
jest.mock('@/services/database/workouts');
jest.mock('@/services/database/exercises');
jest.mock('@/utils/formatters');
jest.mock('@/utils/validators');
// Nothing is actually tested!
```

**Fix:** Only mock external dependencies

```typescript
// ✅ GOOD: Mock only external dependencies
jest.mock('react-native-mmkv');
jest.mock('@/services/supabase/client');
// Test internal code with real implementations
```

### ❌ Not Resetting Mocks

```typescript
// ❌ BAD: Mock state leaks between tests
test('test 1', () => {
  mockFn('value1');
});

test('test 2', () => {
  expect(mockFn).toHaveBeenCalledTimes(0); // FAILS - still has call from test 1
});
```

**Fix:** Clear mocks in beforeEach

```typescript
beforeEach(() => {
  jest.clearAllMocks(); // ✅ Reset before each test
});
```

### ❌ Incomplete Mock Implementation

```typescript
// ❌ BAD: Only mocked 'get', missing 'set'
jest.mock('react-native-mmkv', () => ({
  MMKV: {
    getString: jest.fn(),
    // Missing: set, delete, clearAll, etc.
  },
}));
```

**Fix:** Mock all used methods

```typescript
// ✅ GOOD: Complete mock
jest.mock('react-native-mmkv', () => ({
  MMKV: {
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn(),
  },
}));
```

## Advanced Patterns

### Mocking Module Dependencies

```typescript
// Module being tested imports dependency
import { formatDate } from '@/utils/formatters';

export function getFormattedWorkoutDate(workout) {
  return formatDate(workout.createdAt); // Uses real formatDate
}

// Test with mocked dependency
jest.mock('@/utils/formatters', () => ({
  formatDate: jest.fn(() => '2025-01-31'),
}));

test('formats workout date', () => {
  const result = getFormattedWorkoutDate(mockWorkout);
  expect(result).toBe('2025-01-31'); // Uses mocked formatDate
});
```

### Conditional Mocking

```typescript
// Mock only in specific tests
describe('with mocked API', () => {
  beforeEach(() => {
    jest.mock('@/services/api/client');
  });

  afterEach(() => {
    jest.unmock('@/services/api/client');
  });

  test('uses mock', () => { ... });
});

describe('with real API', () => {
  test('uses real implementation', () => { ... });
});
```

### Mocking Timers

```typescript
test('uses fake timers', () => {
  jest.useFakeTimers();

  const callback = jest.fn();
  setTimeout(callback, 1000);

  // Fast-forward time
  jest.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalled();

  jest.useRealTimers();
});
```

## Cross-References

- **Mocks README:** [**mocks**/README.md](../../__mocks__/README.md) - Complete mock inventory
- **Unit Testing Guide:** [unit-guide.md](./unit-guide.md) - Writing unit tests
- **Testing Overview:** [README.md](./README.md) - Three-tier strategy

## Resources

**Jest Mocking:**

- Manual Mocks: https://jestjs.io/docs/manual-mocks
- Mock Functions: https://jestjs.io/docs/mock-functions
- ES6 Mocks: https://jestjs.io/docs/es6-class-mocks
- Timer Mocks: https://jestjs.io/docs/timer-mocks
