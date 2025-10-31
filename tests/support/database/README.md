# tests/support/database/ - Database Test Helpers

**Context:** Centralized database test infrastructure (Phase 0.5.28 refactor)
**Purpose:** Reusable test utilities for ALL database tests (unit/integration/E2E)
**Constraints:** LokiJS adapter (Jest) CANNOT test sync protocol - requires real SQLite (E2E only)

## Quick Reference

```typescript
// Import pattern (from ANY test file using @tests alias)
import { createTestDatabase, cleanupTestDatabase } from '@tests/support/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@tests/support/database/factories';
import { getAllRecords, wait, assertDatesApproximatelyEqual } from '@tests/support/database/assertions';

// Standard test setup
describe('Feature Tests', () => {
  let database: Database;

  beforeEach(() => {
    database = createTestDatabase();
    resetTestIdCounter(); // CRITICAL: Call in EVERY test file's beforeEach
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  test('example', async () => {
    const workout = await createTestWorkout(database, { title: 'Leg Day' });
    expect(workout).toBeValidWorkout(); // Custom matcher from jest.setup.js
  });
});
```

## File Inventory

### `test-database.ts` (~105 lines)

**Purpose:** LokiJS in-memory database setup for Jest tests
**Exports:**

- `createTestDatabase()` - Creates fresh in-memory database (5ms)
- `cleanupTestDatabase(db)` - Resets database state (call in afterEach)
- `TestDatabase` type - Type-safe database instance

**Why LokiJS?**

- SQLite requires React Native JSI (not available in Node.js/Jest)
- Production uses SQLite adapter
- LokiJS adapter used ONLY for Jest unit tests

**Performance:**

- Database creation: ~5ms
- Query execution: ~1-3ms
- Full test: ~50-100ms

### `factories.ts` (~481 lines)

**Purpose:** Test data generators with sensible defaults + override support
**Exports:**

**ID Generation:**

- `generateTestId(prefix)` - Unique IDs (e.g., 'test-user-1')
- `resetTestIdCounter()` - Reset counter (MUST call in beforeEach)

**Data Factories (returns plain object):**

- `createTestUserData(overrides)` - User data object
- `createTestWorkoutData(overrides)` - Workout data object
- `createTestExerciseData(overrides)` - Exercise data object
- `createTestWorkoutExerciseData(overrides)` - WorkoutExercise data object
- `createTestExerciseSetData(overrides)` - ExerciseSet data object

**Database Factories (persists + returns model):**

- `createTestUser(db, overrides)` - Creates User record
- `createTestWorkout(db, overrides)` - Creates Workout record
- `createTestExercise(db, overrides)` - Creates Exercise record
- `createTestWorkoutExercise(db, overrides)` - Creates WorkoutExercise record
- `createTestExerciseSet(db, overrides)` - Creates ExerciseSet record

**Batch Operations:**

- `createMultipleRecords(factoryFn, db, count, overridesFn)` - Bulk creation

**Override Pattern:**

```typescript
// Uses sensible defaults
const workout = await createTestWorkout(database);
// { id: 'test-workout-1', title: 'Test Workout 1', user_id: 'test-user-1', ... }

// Override specific fields
const customWorkout = await createTestWorkout(database, {
  title: 'Leg Day',
  nutrition_phase: 'bulk',
});
```

### `assertions.ts` (~446 lines)

**Purpose:** ALL test utilities (queries, sync, time, assertions, errors, batch ops, performance)
**Why NOT split to shared/?** YAGNI - Phase 0.5 = database only, extract AFTER 3+ domains duplicate (Rule of Three)

**Exports (8 categories):**

**1. Database Query Helpers:**

- `getAllRecords(db, table)` - Fetch all records
- `getRecordById(db, table, id)` - Fetch by ID
- `countRecords(db, table, conditions?)` - Count with optional WHERE
- `recordExists(db, table, id)` - Boolean existence check

**2. Sync Protocol Helpers (⚠️ LIMITED IN JEST):**

- `assertSyncProtocolColumns(record, options?)` - Validate \_changed/\_status
- `getSyncTimestamp(record)` - Get \_changed as number
- `isRecordDeleted(record)` - Check if \_status === 'deleted'

**Sync Protocol Limitation:**

- LokiJS stores `_changed` as string (SQLite as number)
- LokiJS CANNOT test `synchronize()` method
- Full sync testing requires real SQLite (E2E tests only)
- See: [src/services/database/__tests__/README.md § Sync Protocol Testing]

**3. Time Manipulation:**

- `wait(ms)` - Async delay (for timestamp tests)
- `dateInPast({ days?, hours?, minutes? })` - Historical dates
- `dateInFuture({ days?, hours?, minutes? })` - Future dates

**4. Assertion Helpers:**

- `assertDatesApproximatelyEqual(actual, expected, toleranceMs?)` - Fuzzy date matching
- `assertArrayContainsObject(array, expectedProps)` - Find object in array by properties

**5. Error Testing:**

- `expectAsyncError(fn, expectedMessage)` - Assert async errors

**6. Batch Operations:**

- `createMultipleRecords(createFn, db, count, overridesFn?)` - Bulk record creation

**7. Performance Testing:**

- `measureExecutionTime(fn)` - Returns `{ result, durationMs }`

**8. Custom Jest Matchers (in jest.setup.js):**

- `expect(workout).toBeValidWorkout()` - Domain-specific assertions
- `expect(exercise).toBeValidExercise()`

## Decision Records

### Why assertions.ts contains EVERYTHING?

**Answer:** YAGNI (You Aren't Gonna Need It) + Rule of Three

**Current State:**

- Phase 0.5 = database domain ONLY
- No duplication across domains (only 1 domain exists)
- All helpers are database-specific (queries, sync protocol, etc.)

**Future Extraction Plan:**

- IF 3+ domains duplicate helpers (e.g., API tests, UI tests, E2E tests)
- THEN extract to `tests/__helpers__/` (NOT `support/shared/`)
- Examples of future shared helpers:
  - `waitForCondition(predicate, timeout)` - Polling helper
  - `mockDateNow(date)` - Global time mocking
  - `generateUUID()` - ID generation

**Anti-Pattern:**

```typescript
// ❌ BAD: Premature abstraction
tests/support/shared/        # Empty or 1-2 functions
tests/support/database/      # Still domain-specific

// ✅ GOOD: Extract AFTER proven duplication
tests/__helpers__/           # Global helpers (3+ domains duplicate)
tests/support/database/      # Database-specific only
tests/support/api/           # API-specific helpers (Phase 1+)
```

### Why test-database.ts at support/database/ (not tests/setup/)?

**Answer:** Accessibility from all test types

**Test Infrastructure Hierarchy:**

```
src/services/database/__tests__/         # Unit tests (colocated)
├── workouts.test.ts                     # Imports from @tests/support/database/
├── exercises.test.ts                    # Imports from @tests/support/database/
└── exercise-sets.test.ts                # Imports from @tests/support/database/

src/services/api/__tests__/              # Integration tests (Phase 1)
└── sync.test.ts                         # ALSO imports from @tests/support/database/

tests/e2e/                               # E2E tests (Phase 3)
└── manual/sync-checklist.md             # ALSO uses database helpers
```

**Centralized location = DRY, reusable across ALL test types**

## Import Patterns

### ✅ GOOD: Use @tests alias

```typescript
import { createTestDatabase } from '@tests/support/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@tests/support/database/factories';
import { getAllRecords, wait } from '@tests/support/database/assertions';
```

### ❌ BAD: Relative imports

```typescript
import { createTestDatabase } from '../../../tests/support/database/test-database';
import { createTestWorkout } from './setup/factories'; // WRONG: setup/ no longer exists
```

### ❌ BAD: Import from wrong location

```typescript
import { createTestWorkout } from '@/services/database/__tests__/setup/factories'; // MOVED
```

## Anti-Patterns

### ❌ BAD: Not resetting ID counter

```typescript
describe('Tests', () => {
  // Missing resetTestIdCounter() - IDs will increment across tests!
  test('test 1', async () => {
    const workout = await createTestWorkout(database);
    expect(workout.id).toBe('test-workout-1'); // FAILS if other tests ran first
  });
});
```

**Fix:**

```typescript
beforeEach(() => {
  database = createTestDatabase();
  resetTestIdCounter(); // ✅ Always reset in beforeEach
});
```

### ❌ BAD: Testing sync protocol in Jest

```typescript
test('synchronize() pushes changes to server', async () => {
  const workout = await createTestWorkout(database);
  await database.synchronize(); // ❌ LokiJS doesn't support sync protocol!
});
```

**Fix:** Move sync tests to E2E (real SQLite + JSI):

```typescript
// tests/e2e/manual/sync-checklist.md
- [ ] Create workout, sync, verify on server
```

### ❌ BAD: Not cleaning up database

```typescript
afterEach(async () => {
  // Missing cleanup - state leaks to next test!
});
```

**Fix:**

```typescript
afterEach(async () => {
  await cleanupTestDatabase(database); // ✅ Always clean up
});
```

## Cross-References

- **Test Root README:** [tests/README.md](../../README.md) - Architecture overview
- **Unit Testing Guide:** [src/services/database/**tests**/README.md](../../../src/services/database/__tests__/README.md)
- **Sync Protocol Strategy:** [docs/testing/e2e-manual.md](../../../docs/testing/e2e-manual.md) (Phase 1)
- **Mocking Guide:** [**mocks**/README.md](../../../__mocks__/README.md)
- **E2E Testing:** [tests/e2e/README.md](../../e2e/README.md) (Phase 3+)

## Usage Examples

### Standard Test Setup

```typescript
import { Database } from '@nozbe/watermelondb';
import { createTestDatabase, cleanupTestDatabase } from '@tests/support/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@tests/support/database/factories';
import { getAllRecords, countRecords } from '@tests/support/database/assertions';

describe('Workout CRUD', () => {
  let database: Database;

  beforeEach(() => {
    database = createTestDatabase();
    resetTestIdCounter();
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  test('creates workout', async () => {
    const workout = await createTestWorkout(database, {
      title: 'Leg Day',
      nutrition_phase: 'bulk',
    });

    expect(workout.title).toBe('Leg Day');
    expect(workout.nutritionPhase).toBe('bulk');
    expect(workout).toBeValidWorkout(); // Custom matcher
  });
});
```

### Batch Creation

```typescript
test('queries 1000 workouts', async () => {
  const workouts = await createMultipleRecords(createTestWorkout, database, 1000, (i) => ({
    title: `Workout ${i + 1}`,
  }));

  expect(workouts).toHaveLength(1000);
  expect(workouts[0]?.title).toBe('Workout 1');
});
```

### Performance Testing

```typescript
test('query performance', async () => {
  await createMultipleRecords(createTestWorkout, database, 1000);

  const { result, durationMs } = await measureExecutionTime(async () => {
    return await getAllRecords(database, 'workouts');
  });

  expect(result).toHaveLength(1000);
  expect(durationMs).toBeLessThan(200); // Performance budget
});
```

### Time-based Testing

```typescript
test('sorts by started_at', async () => {
  const workout1 = await createTestWorkout(database, {
    title: 'Oldest',
    started_at: dateInPast({ days: 3 }).toISOString(),
  });

  const workout2 = await createTestWorkout(database, {
    title: 'Newest',
    started_at: dateInPast({ days: 1 }).toISOString(),
  });

  const workouts = await database.get('workouts').query(Q.sortBy('started_at', Q.desc)).fetch();

  expect(workouts[0]?.id).toBe(workout2.id); // Newest first
});
```

### Relationship Testing

```typescript
test('creates workout with exercises and sets', async () => {
  const workout = await createTestWorkout(database);
  const exercise = await createTestExercise(database, { name: 'Squat' });
  const workoutExercise = await createTestWorkoutExercise(database, {
    workout_id: workout.id,
    exercise_id: exercise.id,
    order_index: 0,
  });

  const set1 = await createTestExerciseSet(database, {
    workout_exercise_id: workoutExercise.id,
    set_number: 1,
    weight: 225,
    reps: 5,
  });

  const set2 = await createTestExerciseSet(database, {
    workout_exercise_id: workoutExercise.id,
    set_number: 2,
    weight: 225,
    reps: 5,
  });

  const sets = await database.get('exercise_sets').query(Q.where('workout_exercise_id', workoutExercise.id)).fetch();

  expect(sets).toHaveLength(2);
});
```
