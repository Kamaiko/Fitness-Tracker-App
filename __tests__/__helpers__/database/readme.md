# tests/**helpers**/database/ - Database Test Helpers

**Context:** Centralized database test infrastructure (Phase 0.6 refactor)
**Purpose:** Reusable test utilities for ALL database tests (unit/integration/E2E)
**Constraints:** LokiJS adapter (Jest) CANNOT test sync protocol - requires real SQLite (E2E only)

---

## Quick Reference

```typescript
// Import pattern (from ANY test file using @test-helpers alias)
import { createTestDatabase, cleanupTestDatabase } from '@test-helpers/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@test-helpers/database/factories';
import { getAllRecords, countRecords } from '@test-helpers/database/queries';
import { wait, dateInPast } from '@test-helpers/database/time';
import { assertDatesApproximatelyEqual } from '@test-helpers/database/assertions';

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

---

## Functions Reference

### test-database.ts

**Purpose:** LokiJS in-memory database setup for Jest tests

**Functions:**

- `createTestDatabase()` - Creates fresh in-memory database (~5ms)
- `cleanupTestDatabase(db)` - Resets database state (call in afterEach)

**Why LokiJS:** SQLite requires React Native JSI (not available in Node.js/Jest)

### factories.ts

**Purpose:** Test data generators with sensible defaults + override support

**ID Generation:**

- `generateTestId(prefix)` - Unique IDs (e.g., 'test-user-1')
- `resetTestIdCounter()` - Reset counter (**MUST** call in beforeEach)

**Data Factories (returns plain object):**

- `createTestUserData(overrides)`
- `createTestWorkoutData(overrides)`
- `createTestExerciseData(overrides)`
- `createTestWorkoutExerciseData(overrides)`
- `createTestExerciseSetData(overrides)`

**Database Factories (persists + returns model):**

- `createTestUser(db, overrides)`
- `createTestWorkout(db, overrides)`
- `createTestExercise(db, overrides)`
- `createTestWorkoutExercise(db, overrides)`
- `createTestExerciseSet(db, overrides)`

**Batch Operations:**

- `createMultipleRecords(factoryFn, db, count, overridesFn)` - Bulk creation

**Override Pattern:**

```typescript
// Uses sensible defaults
const workout = await createTestWorkout(database);

// Override specific fields
const customWorkout = await createTestWorkout(database, {
  title: 'Leg Day',
  nutrition_phase: 'bulk',
});
```

### queries.ts

**Purpose:** Database query helpers for test data retrieval

**Functions:**

- `getAllRecords(db, table)` - Fetch all records from table
- `getRecordById(db, table, id)` - Fetch single record by ID
- `countRecords(db, table, conditions?)` - Count records with optional WHERE clause
- `recordExists(db, table, id)` - Boolean existence check

**Example:**

```typescript
const workouts = await getAllRecords(database, 'workouts');
const count = await countRecords(database, 'workouts', [Q.where('completed_at', Q.notEq(null))]);
```

### time.ts

**Purpose:** Time manipulation helpers for timestamp testing

**Functions:**

- `wait(ms)` - Async delay for timestamp tests
- `dateInPast({ days?, hours?, minutes? })` - Generate historical dates
- `dateInFuture({ days?, hours?, minutes? })` - Generate future dates

**Example:**

```typescript
const yesterday = dateInPast({ days: 1 });
const tomorrow = dateInFuture({ days: 1 });
await wait(10); // Wait 10ms for timestamp to change
```

### assertions.ts

**Purpose:** Sync protocol helpers, assertion utilities, and performance testing

**Sync Protocol Helpers (⚠️ LIMITED IN JEST):**

- `assertSyncProtocolColumns(record, options?)` - Validate \_changed/\_status
- `getSyncTimestamp(record)` - Get \_changed as number
- `isRecordDeleted(record)` - Check if \_status === 'deleted'

**⚠️ Sync Protocol Limitation:**

- LokiJS CANNOT test `synchronize()` method or full sync protocol
- Full sync testing requires real SQLite (E2E tests only)
- See: [docs/TESTING.md § Manual E2E Testing](../../../docs/TESTING.md#-manual-e2e-testing)

**Assertion Helpers:**

- `assertDatesApproximatelyEqual(actual, expected, toleranceMs?)` - Fuzzy date matching

**Performance Testing:**

- `measureExecutionTime(fn)` - Returns `{ result, durationMs }`

**Custom Jest Matchers (in jest.setup.js):**

- `expect(workout).toBeValidWorkout()`
- `expect(exercise).toBeValidExercise()`

**Example:**

```typescript
assertDatesApproximatelyEqual(workout.createdAt, new Date(), 1000);

const { result, durationMs } = await measureExecutionTime(async () => {
  return await database.get('workouts').query().fetch();
});
expect(durationMs).toBeLessThan(200); // Performance budget
```

---

## Decision Records

### Why split assertions.ts into queries.ts, time.ts, and assertions.ts?

**Answer:** Single Responsibility Principle (SRP) + Better Discoverability

**Problem with Original assertions.ts (446 lines):**

- Mixed 8 different responsibilities in one file
- Hard to find specific helpers
- Query helpers mixed with time helpers mixed with sync protocol helpers

**Phase 0.6 Refactor:**

- **queries.ts** - Database query helpers (getAllRecords, countRecords, etc.)
- **time.ts** - Time manipulation (wait, dateInPast, dateInFuture)
- **assertions.ts** - Sync protocol, assertions, performance testing

**Benefits:**

- Clear separation of concerns
- Easier to find what you need
- Follows React Testing Library pattern (query functions separate from assertions)

### Why test-database.ts at **helpers**/database/ (not tests/setup/)?

**Answer:** Accessibility from all test types + Centralized DRY

**Test Infrastructure Hierarchy:**

```
src/services/database/__tests__/    # Unit tests (colocated)
├── workouts.test.ts                # Imports from @test-helpers/database/
├── exercises.test.ts               # Imports from @test-helpers/database/
└── exercise-sets.test.ts           # Imports from @test-helpers/database/

src/services/api/__tests__/         # Integration tests (Phase 1)
└── sync.test.ts                    # ALSO imports from @test-helpers/database/
```

**Centralized location = DRY, reusable across ALL test types**

### Why **helpers**/ instead of support/?

**Answer:** Jest Convention Alignment + Future Compatibility

**Jest Conventions:**

- `__mocks__/` - Automatic mocks (double underscore)
- `__tests__/` - Colocated tests (double underscore)
- `__helpers__/` - Test helpers (double underscore pattern)

**Future Compatibility:**

- `tests/__helpers__/` - Backend logic (database, factories, queries)
- `tests/test-utils/` - Frontend RTL utilities (Phase 1-2) - Reserved

**Anti-Pattern:**

```typescript
// ❌ BAD: Non-standard naming
tests/support/         # Not Jest convention

// ✅ GOOD: Jest convention
tests/__helpers__/     # Follows __mocks__, __tests__ pattern
```

---

## Import Patterns

### ✅ GOOD: Use @test-helpers alias

```typescript
import { createTestDatabase } from '@test-helpers/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@test-helpers/database/factories';
import { getAllRecords, countRecords } from '@test-helpers/database/queries';
import { wait, dateInPast } from '@test-helpers/database/time';
import { assertDatesApproximatelyEqual } from '@test-helpers/database/assertions';
```

### ❌ BAD: Relative imports

```typescript
import { createTestDatabase } from '../../../tests/__helpers__/database/test-database';
import { createTestWorkout } from './setup/factories'; // WRONG: setup/ no longer exists
```

### ❌ BAD: Import from wrong location

```typescript
import { createTestWorkout } from '@/services/database/__tests__/setup/factories'; // WRONG: moved to @test-helpers
import { getAllRecords } from '@tests/support/database/assertions'; // WRONG: renamed to @test-helpers
```

---

## Anti-Patterns

### ❌ Not resetting ID counter

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

### ❌ Testing sync protocol in Jest

```typescript
test('synchronize() pushes changes to server', async () => {
  const workout = await createTestWorkout(database);
  await database.synchronize(); // ❌ LokiJS doesn't support sync protocol!
});
```

**Fix:** Move sync tests to E2E (real SQLite + JSI)

### ❌ Not cleaning up database

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

---

## Cross-References

### Test Infrastructure

- **Test Root README:** [tests/readme.md](../../readme.md) - Architecture overview
- **Fixtures:** [tests/fixtures/readme.md](../../fixtures/readme.md) - Test data
- **Mocks:** [**mocks**/README.md](../../../__mocks__/README.md) - Mock inventory

### Testing Guides

- **Complete Testing Guide:** [docs/TESTING.md](../../../docs/TESTING.md) - Unit + Mocking + E2E
- **Project Docs:** [docs/DATABASE.md](../../../docs/DATABASE.md) - WatermelonDB setup
