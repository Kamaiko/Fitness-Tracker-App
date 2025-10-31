# Test Setup Utilities

Professional, reusable testing infrastructure for WatermelonDB database operations.

## 📁 Files Overview

### `test-database.ts`

SQLite in-memory database setup with 100% production parity.

**Key Functions:**

- `createTestDatabase()` - Creates fresh test database instance
- `cleanupTestDatabase(database)` - Resets database between tests

**Features:**

- ⚡ In-memory (:memory:) for speed (~10ms setup)
- 🎯 100% production parity (real SQLite)
- 🔒 Isolated per test (no side effects)
- 📦 Full migration support (v1 → v2)

### `factories.ts`

Test data factories following DRY principle.

**Available Factories:**

- `createTestUser(database, overrides?)` - Create user
- `createTestWorkout(database, overrides?)` - Create workout
- `createTestExercise(database, overrides?)` - Create exercise
- `createTestWorkoutExercise(database, overrides?)` - Create workout exercise
- `createTestExerciseSet(database, overrides?)` - Create exercise set

**Utility Functions:**

- `generateTestId(prefix)` - Generate unique test IDs
- `resetTestIdCounter()` - Reset ID counter per test
- `create*Data()` functions - Generate data without persisting

### `test-utils.ts`

Reusable helper functions and assertions.

**Categories:**

- **Query Helpers:** `getAllRecords`, `getRecordById`, `countRecords`, `recordExists`
- **Sync Protocol:** `assertSyncProtocolColumns`, `getSyncTimestamp`, `isRecordDeleted`
- **Time Manipulation:** `wait`, `dateInPast`, `dateInFuture`
- **Assertions:** `assertDatesApproximatelyEqual`, `assertArrayContainsObject`
- **Error Testing:** `expectAsyncError`
- **Batch Operations:** `createMultipleRecords`
- **Performance:** `measureExecutionTime`

---

## 🚀 Quick Start

### Basic Test Setup

```typescript
import { createTestDatabase, cleanupTestDatabase } from './setup/test-database';
import { createTestWorkout, resetTestIdCounter } from './setup/factories';
import { assertSyncProtocolColumns, countRecords } from './setup/test-utils';

describe('Workout CRUD', () => {
  let database: Database;

  beforeEach(() => {
    database = createTestDatabase();
    resetTestIdCounter(); // Consistent IDs per test
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  test('creates workout with sync protocol', async () => {
    const workout = await createTestWorkout(database);

    expect(workout.title).toBeDefined();
    assertSyncProtocolColumns(workout);
  });
});
```

---

## 📖 Usage Examples

### Example 1: Create Custom Test Data

```typescript
// With default values
const workout = await createTestWorkout(database);
// { title: 'Test Workout 1', status: 'in_progress', ... }

// With custom values
const workout = await createTestWorkout(database, {
  title: 'Leg Day',
  status: 'completed',
  duration_seconds: 3600,
});
// { title: 'Leg Day', status: 'completed', duration_seconds: 3600, ... }
```

### Example 2: Create Related Records

```typescript
// Create complete workout with exercises and sets
const user = await createTestUser(database);
const workout = await createTestWorkout(database, { user_id: user.id });
const exercise = await createTestExercise(database, { name: 'Bench Press' });

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
```

### Example 3: Test Sync Protocol

```typescript
test('updates _changed timestamp on modification', async () => {
  const workout = await createTestWorkout(database);
  const timestamp1 = getSyncTimestamp(workout);

  await wait(10); // Ensure timestamp difference

  await workout.update(() => {
    workout.title = 'Updated Title';
  });

  const timestamp2 = getSyncTimestamp(workout);
  expect(timestamp2).toBeGreaterThan(timestamp1);
});
```

### Example 4: Test Soft Deletes

```typescript
test('marks record as deleted', async () => {
  const workout = await createTestWorkout(database);

  expect(isRecordDeleted(workout)).toBe(false);
  assertSyncProtocolColumns(workout); // _status: null

  await workout.markAsDeleted();

  expect(isRecordDeleted(workout)).toBe(true);
  assertSyncProtocolColumns(workout, { shouldBeDeleted: true }); // _status: 'deleted'
});
```

### Example 5: Batch Creation

```typescript
test('creates multiple records efficiently', async () => {
  // Create 100 workouts with sequential titles
  const workouts = await createMultipleRecords(createTestWorkout, database, 100, (index) => ({
    title: `Workout ${index + 1}`,
  }));

  expect(workouts).toHaveLength(100);
  expect(workouts[0].title).toBe('Workout 1');
  expect(workouts[99].title).toBe('Workout 100');
});
```

### Example 6: Performance Testing

```typescript
test('query executes within performance budget', async () => {
  // Create 1000 records
  await createMultipleRecords(createTestWorkout, database, 1000);

  // Measure query performance
  const { result, durationMs } = await measureExecutionTime(async () => {
    return await database.get('workouts').query(Q.where('status', 'completed')).fetch();
  });

  expect(durationMs).toBeLessThan(100); // Must complete in < 100ms
});
```

### Example 7: Error Handling

```typescript
test('throws error when record not found', async () => {
  await expectAsyncError(async () => await getRecordById(database, 'workouts', 'non-existent-id'), /not found/i);
});
```

---

## 🎯 Best Practices

### 1. Always Reset ID Counter

```typescript
beforeEach(() => {
  database = createTestDatabase();
  resetTestIdCounter(); // ✅ Ensures consistent IDs per test
});
```

### 2. Cleanup After Each Test

```typescript
afterEach(async () => {
  await cleanupTestDatabase(database); // ✅ Prevents test pollution
});
```

### 3. Use Factories Over Manual Creation

```typescript
// ❌ Bad: Manual creation (verbose, not DRY)
const workout = await database.write(async () => {
  return await database.get('workouts').create((w) => {
    w.userId = 'user-1';
    w.title = 'Test';
    w.status = 'in_progress';
    // ... many more fields
  });
});

// ✅ Good: Use factory (DRY, consistent defaults)
const workout = await createTestWorkout(database, { title: 'Test' });
```

### 4. Test Sync Protocol Columns

```typescript
test('creates workout with sync protocol', async () => {
  const workout = await createTestWorkout(database);

  // ✅ Always verify sync columns
  assertSyncProtocolColumns(workout);
});
```

### 5. Use Type-Safe Assertions

```typescript
// ✅ Use custom assertion helpers
assertDatesApproximatelyEqual(workout.startedAt, new Date(), 1000);
assertArrayContainsObject(workouts, { title: 'Leg Day' });

// Instead of manual checks
expect(Math.abs(workout.startedAt.getTime() - new Date().getTime())).toBeLessThan(1000);
```

---

## 📊 Performance Benchmarks

Measured on average development machine:

| Operation                    | Time     | Notes                        |
| ---------------------------- | -------- | ---------------------------- |
| `createTestDatabase()`       | ~10ms    | In-memory setup              |
| `createTestWorkout()`        | ~5-10ms  | Single record creation       |
| `createMultipleRecords(100)` | ~500ms   | Batch creation (100 records) |
| Query 1000 records           | ~20-50ms | With simple WHERE clause     |
| `cleanupTestDatabase()`      | ~5ms     | Reset database               |

**Expected test suite performance:**

- Single test: ~100-150ms
- 50 tests: ~3-5 seconds
- Full suite (100+ tests): ~8-12 seconds

---

## 🔧 Troubleshooting

### Issue: Tests are slow

**Solution:**

1. Ensure using in-memory database (`:memory:`)
2. Batch multiple operations in single `database.write()`
3. Use `createMultipleRecords()` for bulk data
4. Avoid unnecessary `wait()` calls

### Issue: Flaky tests (inconsistent failures)

**Solution:**

1. Always call `resetTestIdCounter()` in `beforeEach`
2. Always call `cleanupTestDatabase()` in `afterEach`
3. Don't rely on exact timestamps - use `assertDatesApproximatelyEqual()`
4. Don't depend on test execution order

### Issue: "Record not found" errors

**Solution:**

1. Verify `createTest*()` was called before querying
2. Check ID matches between related records
3. Ensure database isn't cleaned up mid-test

---

## 📚 Related Documentation

- [WatermelonDB Docs](https://watermelondb.dev/docs/)
- [Jest Documentation](https://jestjs.io/docs/api)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🤝 Contributing

When adding new test utilities:

1. ✅ Add JSDoc comments explaining purpose and usage
2. ✅ Include usage examples in JSDoc
3. ✅ Follow DRY principle (reusable, not repetitive)
4. ✅ Update this README with examples
5. ✅ Ensure TypeScript strict mode compliance
