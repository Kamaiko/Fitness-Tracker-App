# Unit Testing Guide

**Context:** Complete guide to writing and running unit tests in Halterofit
**Audience:** Developers writing Jest tests for business logic
**Environment:** Jest + LokiJS (in-memory database)

## Table of Contents

- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Helpers](#test-helpers)
- [Testing Patterns](#testing-patterns)
- [What to Test (and What NOT to Test)](#what-to-test-and-what-not-to-test)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Running Your First Test

```bash
# 1. Run all tests
npm test

# 2. Run specific test file
npm test -- workouts.test.ts

# 3. Run in watch mode (re-runs on file changes)
npm test -- --watch

# 4. Run with coverage
npm test -- --coverage
```

### Writing Your First Test

```typescript
// src/services/database/__tests__/my-feature.test.ts
import { Database } from '@nozbe/watermelondb';
import { createTestDatabase, cleanupTestDatabase } from '@tests/support/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@tests/support/database/factories';

describe('My Feature', () => {
  let database: Database;

  beforeEach(() => {
    database = createTestDatabase();
    resetTestIdCounter(); // CRITICAL: Always reset IDs
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  test('creates workout', async () => {
    const workout = await createTestWorkout(database, {
      title: 'Test Workout',
    });

    expect(workout.title).toBe('Test Workout');
    expect(workout).toBeValidWorkout(); // Custom matcher
  });
});
```

## Running Tests

### Command Reference

```bash
# Basic Commands
npm test                          # Run all tests once
npm test -- --watch               # Watch mode (re-run on changes)
npm test -- workouts.test.ts      # Run specific file
npm test -- --coverage            # Generate coverage report

# Coverage Options
npm test -- --coverage --collectCoverageFrom='src/services/database/**/*.ts'

# Debug Mode
npm test -- --verbose             # Show individual test results
npm test -- --no-cache            # Clear Jest cache
npm test -- --detectOpenHandles   # Find async issues

# Filter Tests
npm test -- --testNamePattern="creates workout"  # Run tests matching pattern
npm test -- --onlyChanged         # Only test changed files
```

### Pre-Commit Testing

**Recommended workflow before committing:**

```bash
# 1. Type check
npm run type-check

# 2. Run tests
npm test

# 3. Lint
npm run lint:fix

# 4. Format
npm run format

# 5. Commit using slash command
/commit
```

## Writing Tests

### Test File Structure

**Location:** Colocate tests with source code in `__tests__/` directories

```
src/services/database/
├── watermelon/
│   ├── models/
│   │   ├── Workout.ts
│   │   └── Exercise.ts
│   └── schema.ts
└── __tests__/                    # ✅ Tests colocated with source
    ├── workouts.test.ts
    ├── exercises.test.ts
    └── exercise-sets.test.ts
```

### Standard Test Template

```typescript
/**
 * [Feature] Unit Tests
 *
 * Tests [feature] with focus on:
 * - [Key aspect 1]
 * - [Key aspect 2]
 * - [Key aspect 3]
 *
 * @see {@link path/to/source.ts}
 */

import { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';
import { createTestDatabase, cleanupTestDatabase } from '@tests/support/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@tests/support/database/factories';
import { getAllRecords, countRecords } from '@tests/support/database/assertions';

describe('[Feature Name]', () => {
  let database: Database;

  beforeEach(() => {
    database = createTestDatabase();
    resetTestIdCounter(); // CRITICAL: Reset before each test
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  // Group related tests
  describe('[Sub-feature]', () => {
    test('[specific behavior]', async () => {
      // Arrange: Set up test data
      const workout = await createTestWorkout(database, {
        title: 'Test Workout',
      });

      // Act: Perform operation
      await database.write(async () => {
        await workout.update((w) => {
          w.title = 'Updated';
        });
      });

      // Assert: Verify results
      const updated = await database.get('workouts').find(workout.id);
      expect((updated as any).title).toBe('Updated');
    });
  });
});
```

### Best Practices

**1. Descriptive Test Names**

```typescript
// ❌ BAD: Vague test names
test('it works', () => { ... });
test('test 1', () => { ... });

// ✅ GOOD: Clear, descriptive names
test('creates workout with required fields', async () => { ... });
test('updates _changed timestamp on modification', async () => { ... });
test('soft deletes workout without removing from database', async () => { ... });
```

**2. AAA Pattern (Arrange, Act, Assert)**

```typescript
test('updates workout title', async () => {
  // Arrange: Set up test data
  const workout = await createTestWorkout(database, {
    title: 'Original',
  });

  // Act: Perform the operation
  await database.write(async () => {
    await workout.update((w) => {
      w.title = 'Updated';
    });
  });

  // Assert: Verify the result
  const updated = await database.get('workouts').find(workout.id);
  expect((updated as any).title).toBe('Updated');
});
```

**3. Test One Thing at a Time**

```typescript
// ❌ BAD: Testing multiple things
test('creates and updates and deletes workout', async () => {
  const workout = await createTestWorkout(database);
  await workout.update(...);
  await workout.destroyPermanently();
  // Too much in one test!
});

// ✅ GOOD: Separate tests for each operation
test('creates workout', async () => { ... });
test('updates workout', async () => { ... });
test('deletes workout', async () => { ... });
```

**4. Use Descriptive Comments**

```typescript
test('sorts workouts by started_at descending', async () => {
  // Create workouts in non-chronological order to verify sorting
  const workout1 = await createTestWorkout(database, {
    title: 'Oldest',
    started_at: dateInPast({ days: 3 }).toISOString(),
  });
  const workout2 = await createTestWorkout(database, {
    title: 'Newest',
    started_at: dateInPast({ days: 1 }).toISOString(),
  });

  // Query with descending sort (newest first)
  const workouts = await database.get('workouts').query(Q.sortBy('started_at', Q.desc)).fetch();

  // Verify sort order
  expect(workouts[0]?.id).toBe(workout2.id); // Newest first
  expect(workouts[1]?.id).toBe(workout1.id);
});
```

## Test Helpers

### Importing Helpers

**Always use `@tests` alias (not relative imports):**

```typescript
// ✅ GOOD: Use @tests alias
import { createTestDatabase, cleanupTestDatabase } from '@tests/support/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@tests/support/database/factories';
import { getAllRecords, wait } from '@tests/support/database/assertions';

// ❌ BAD: Relative imports (fragile, breaks when files move)
import { createTestDatabase } from '../../../tests/support/database/test-database';
```

### Database Setup

```typescript
import { createTestDatabase, cleanupTestDatabase } from '@tests/support/database/test-database';

describe('Tests', () => {
  let database: Database;

  beforeEach(() => {
    database = createTestDatabase(); // Creates fresh in-memory database
    resetTestIdCounter(); // CRITICAL: Reset ID counter
  });

  afterEach(async () => {
    await cleanupTestDatabase(database); // Clean up to prevent leaks
  });
});
```

### Factories (Test Data Generators)

```typescript
import {
  createTestWorkout,
  createTestExercise,
  createTestWorkoutExercise,
  createTestExerciseSet,
  createTestUser,
  resetTestIdCounter,
  createMultipleRecords,
} from '@tests/support/database/factories';

// Create with defaults
const workout = await createTestWorkout(database);
// { id: 'test-workout-1', title: 'Test Workout 1', user_id: 'test-user-1', ... }

// Create with overrides
const customWorkout = await createTestWorkout(database, {
  title: 'Leg Day',
  nutrition_phase: 'bulk',
});

// Create multiple records
const workouts = await createMultipleRecords(createTestWorkout, database, 10, (i) => ({ title: `Workout ${i + 1}` }));
```

### Assertions and Utilities

```typescript
import {
  getAllRecords,
  countRecords,
  wait,
  dateInPast,
  assertDatesApproximatelyEqual,
} from '@tests/support/database/assertions';

// Query helpers
const workouts = await getAllRecords(database, 'workouts');
const count = await countRecords(database, 'workouts');

// Time helpers
const yesterday = dateInPast({ days: 1 });
await wait(10); // Wait 10ms (for timestamp tests)

// Fuzzy date matching (within tolerance)
assertDatesApproximatelyEqual(workout.createdAt, new Date(), 1000);
```

### Custom Matchers

```typescript
// Defined in jest.setup.js, available globally
expect(workout).toBeValidWorkout();
expect(exercise).toBeValidExercise();
```

## Testing Patterns

### Testing CRUD Operations

```typescript
describe('CREATE Operations', () => {
  test('creates workout with required fields', async () => {
    const workout = await createTestWorkout(database, {
      title: 'Push Day',
      user_id: 'user-123',
    });

    expect(workout.title).toBe('Push Day');
    expect(workout.userId).toBe('user-123');
    expect(workout.createdAt).toBeDefined();
  });
});

describe('READ Operations', () => {
  test('reads workout by ID', async () => {
    const created = await createTestWorkout(database, {
      title: 'Leg Day',
    });

    const found = await database.get('workouts').find(created.id);
    expect((found as any).title).toBe('Leg Day');
  });
});

describe('UPDATE Operations', () => {
  test('updates workout title', async () => {
    const workout = await createTestWorkout(database, {
      title: 'Original',
    });

    await database.write(async () => {
      await workout.update((w: any) => {
        w.title = 'Updated';
      });
    });

    const updated = await database.get('workouts').find(workout.id);
    expect((updated as any).title).toBe('Updated');
  });
});

describe('DELETE Operations', () => {
  test('hard deletes workout permanently', async () => {
    const workout = await createTestWorkout(database);

    await database.write(async () => {
      await workout.destroyPermanently();
    });

    await expect(database.get('workouts').find(workout.id)).rejects.toThrow();
  });
});
```

### Testing Relationships

```typescript
test('creates workout with exercises and sets', async () => {
  // Create parent workout
  const workout = await createTestWorkout(database);

  // Create exercise
  const exercise = await createTestExercise(database, {
    name: 'Squat',
  });

  // Create relationship
  const workoutExercise = await createTestWorkoutExercise(database, {
    workout_id: workout.id,
    exercise_id: exercise.id,
    order_index: 0,
  });

  // Create sets
  await createTestExerciseSet(database, {
    workout_exercise_id: workoutExercise.id,
    set_number: 1,
    weight: 225,
    reps: 5,
  });

  // Verify relationships
  const sets = await database.get('exercise_sets').query(Q.where('workout_exercise_id', workoutExercise.id)).fetch();

  expect(sets).toHaveLength(1);
  expect((sets[0] as any).weight).toBe(225);
});
```

### Testing Queries

```typescript
test('queries workouts by user_id', async () => {
  const user1 = await createTestUser(database, { email: 'user1@example.com' });
  const user2 = await createTestUser(database, { email: 'user2@example.com' });

  await createTestWorkout(database, { user_id: user1.id, title: 'User1 Workout' });
  await createTestWorkout(database, { user_id: user2.id, title: 'User2 Workout' });

  const user1Workouts = await database.get('workouts').query(Q.where('user_id', user1.id)).fetch();

  expect(user1Workouts).toHaveLength(1);
  expect((user1Workouts[0] as any).title).toBe('User1 Workout');
});

test('sorts workouts by started_at descending', async () => {
  const workout1 = await createTestWorkout(database, {
    started_at: dateInPast({ days: 3 }).toISOString(),
  });
  const workout2 = await createTestWorkout(database, {
    started_at: dateInPast({ days: 1 }).toISOString(),
  });

  const workouts = await database.get('workouts').query(Q.sortBy('started_at', Q.desc)).fetch();

  expect(workouts[0]?.id).toBe(workout2.id); // Newest first
});
```

### Testing Performance

```typescript
test('queries 1000 workouts within performance budget', async () => {
  // Create bulk data
  await createMultipleRecords(createTestWorkout, database, 1000);

  // Measure query time
  const startTime = Date.now();
  const workouts = await database.get('workouts').query().fetch();
  const duration = Date.now() - startTime;

  expect(workouts).toHaveLength(1000);
  expect(duration).toBeLessThan(200); // Must complete in < 200ms
});
```

## What to Test (and What NOT to Test)

### ✅ DO Test in Jest (Unit Tests)

**CRUD Operations:**

- ✅ Create, Read, Update, Delete
- ✅ Required fields validation
- ✅ Optional fields
- ✅ Default values

**Queries:**

- ✅ Filtering (WHERE clauses)
- ✅ Sorting (ORDER BY)
- ✅ Pagination (LIMIT, OFFSET)
- ✅ Counting records

**Relationships:**

- ✅ belongs_to, has_many, children
- ✅ Relationship integrity
- ✅ Cascading behavior

**Business Logic:**

- ✅ Computed properties (getters)
- ✅ Validation logic
- ✅ State transitions

**Performance:**

- ✅ Query performance with large datasets
- ✅ Batch operations

### ❌ DON'T Test in Jest (E2E Tests Only)

**Sync Protocol:**

- ❌ `_changed` timestamp updates
- ❌ `_status` column behavior
- ❌ `synchronize()` method
- ❌ Push/pull changes to backend
- ❌ Conflict resolution

**Migrations:**

- ❌ Schema changes (ALTER TABLE)
- ❌ Data migrations
- ❌ Migration rollback

**Why:** LokiJS adapter doesn't support sync protocol or real SQLite migrations.
**Solution:** Use manual E2E tests on real device (see [Manual E2E Guide](./e2e-manual.md))

## Troubleshooting

### Common Issues

#### Issue: "Cannot find module '@tests/support/database/...'"

**Cause:** `@tests` alias not configured in jest.config.js

**Fix:**

```javascript
// jest.config.js
moduleNameMapper: {
  '^@tests/(.*)': '<rootDir>/tests/$1',
}
```

#### Issue: "LokiJS: Table 'workouts' not found"

**Cause:** Database not initialized in test

**Fix:** Ensure `createTestDatabase()` called in beforeEach

```typescript
beforeEach(() => {
  database = createTestDatabase(); // ✅ Creates database
  resetTestIdCounter();
});
```

#### Issue: "Test IDs are inconsistent across tests"

**Cause:** `resetTestIdCounter()` not called in beforeEach

**Fix:**

```typescript
beforeEach(() => {
  database = createTestDatabase();
  resetTestIdCounter(); // ✅ CRITICAL: Reset before each test
});
```

#### Issue: "Query failed: no such column: \_changed"

**Cause:** Trying to query sync protocol columns in Jest

**Fix:** Remove sync protocol queries from Jest tests, move to E2E

```typescript
// ❌ BAD: Querying _changed column
const changes = await database
  .get('workouts')
  .query(Q.where('_changed', Q.gt(timestamp)))
  .fetch();

// ✅ GOOD: Query regular columns
const workouts = await database
  .get('workouts')
  .query(Q.where('completed_at', Q.notEq(null)))
  .fetch();
```

#### Issue: "Tests timeout after 5+ seconds"

**Cause:** Database not cleaned up properly in afterEach

**Fix:**

```typescript
afterEach(async () => {
  await cleanupTestDatabase(database); // ✅ Clean up properly
});
```

#### Issue: "Mock not being used"

**Cause:** Mock file location incorrect

**Fix:** Ensure mock at `__mocks__/module-name.js` (exact match)

```
__mocks__/
├── expo-asset.js           # ✅ Matches 'expo-asset'
└── react-native-mmkv.js    # ✅ Matches 'react-native-mmkv'
```

## Coverage Strategy

### Current Coverage (Phase 0.5)

**Target:** 60-65% database layer

**What's Covered:**

- ✅ CRUD operations (create, read, update, delete)
- ✅ Queries (filtering, sorting, pagination)
- ✅ Relationships (workout → exercises → sets)
- ✅ Timestamps (created_at, updated_at)

**What's NOT Covered:**

- ❌ Sync protocol (\_changed, \_status) - Manual E2E only
- ❌ Migrations - Manual E2E only

### Viewing Coverage

```bash
# Generate coverage report
npm test -- --coverage

# Open HTML report (auto-opens in browser)
open coverage/lcov-report/index.html
```

### Coverage Thresholds

```javascript
// jest.config.js
coverageThreshold: {
  './src/services/database/': {
    branches: 0,      // Phase 0.5.27: Lowered from 60% (no branch coverage yet)
    functions: 1,     // Phase 0.5.27: Lowered from 65%
    lines: 1,         // Phase 0.5.27: Lowered from 65%
    statements: 1,    // Phase 0.5.27: Lowered from 65%
  },
}
```

## Cross-References

### Test Infrastructure

- **Test Root:** [tests/README.md](../../tests/README.md) - Architecture overview
- **Database Helpers:** [tests/support/database/README.md](../../tests/support/database/README.md) - Complete helper guide
- **Mocking Guide:** [mocks-guide.md](./mocks-guide.md) - Mocking external dependencies

### Testing Docs

- **Testing Overview:** [docs/testing/README.md](./README.md) - Three-tier strategy
- **Manual E2E:** [e2e-manual.md](./e2e-manual.md) - Sync protocol validation
- **Maestro E2E:** [e2e-maestro.md](./e2e-maestro.md) - Automation (Phase 3+)

### Project Docs

- **Database Guide:** [docs/DATABASE.md](../DATABASE.md) - WatermelonDB setup
- **Architecture:** [docs/ARCHITECTURE.md](../ARCHITECTURE.md) - Code structure
- **Technical Decisions:** [docs/TECHNICAL.md](../TECHNICAL.md) - ADR-007: Testing Strategy

## Resources

**Jest:**

- Official Docs: https://jestjs.io/
- React Native Testing: https://jestjs.io/docs/tutorial-react-native
- Mocking: https://jestjs.io/docs/mock-functions

**WatermelonDB:**

- Testing Guide: https://nozbe.github.io/WatermelonDB/Advanced/Testing.html
- LokiJS Adapter: https://nozbe.github.io/WatermelonDB/Advanced/Adapters.html#loki-js-adapter

**React Native Testing Library:**

- Docs: https://callstack.github.io/react-native-testing-library/
- Cheatsheet: https://testing-library.com/docs/react-testing-library/cheatsheet
