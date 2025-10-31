# tests/fixtures/ - Static Test Data

**Context:** JSON fixtures for consistent test data across ALL test types (Phase 0.5.28 refactor)
**Purpose:** Reusable, version-controlled static test data (complements dynamic factories)
**Constraints:** Read-only data - use factories for database insertion

## Quick Reference

```typescript
// Import fixtures in tests
import workoutFixtures from '@tests/fixtures/database/workouts.json';
import userFixtures from '@tests/fixtures/users/sample-users.json';

// Use with factories
const workout = await createTestWorkout(database, workoutFixtures.legDay);
```

## Directory Structure

```
tests/fixtures/
├── README.md               # This file
├── database/               # Database entity fixtures
│   ├── workouts.json       # Sample workouts (bulk/cut/maintenance)
│   └── exercises.json      # Sample exercises (compound/isolation)
└── users/                  # User profile fixtures
    └── sample-users.json   # Test user personas
```

## Fixtures vs Factories

**When to Use Fixtures (JSON):**

- ✅ Static, reusable test data (e.g., "Leg Day" workout template)
- ✅ Complex nested structures (e.g., workout with exercises and sets)
- ✅ Multiple tests need EXACT same data
- ✅ E2E tests requiring realistic data
- ✅ Version control test data changes

**When to Use Factories (TypeScript):**

- ✅ Unique test data per test (e.g., `createTestWorkout({ title: 'Unique' })`)
- ✅ Database insertion (fixtures are read-only)
- ✅ Dynamic data generation (e.g., 1000 workouts)
- ✅ Relationship creation (e.g., workout → exercises → sets)

**Recommended Pattern: Combine Both**

```typescript
// 1. Load fixture for structure
import legDayFixture from '@tests/fixtures/database/workouts.json';

// 2. Use factory to insert (with fixture overrides)
const workout = await createTestWorkout(database, legDayFixture.legDay);

// 3. Modify for test-specific needs
await database.write(async () => {
  await workout.update((w) => {
    w.completedAt = new Date(); // Test-specific override
  });
});
```

## Fixture Format

### Database Fixtures (`database/*.json`)

**Purpose:** Sample workouts, exercises, sets for testing

**Format:**

```json
{
  "legDay": {
    "title": "Leg Day - Hypertrophy",
    "nutrition_phase": "bulk",
    "notes": "Focus on time under tension",
    "exercises": [
      {
        "name": "Barbell Squat",
        "order_index": 0,
        "rest_seconds": 180,
        "sets": [
          { "set_number": 1, "weight": 135, "reps": 10, "is_warmup": true },
          { "set_number": 2, "weight": 225, "reps": 8, "rir": 2, "rpe": 8 }
        ]
      }
    ]
  },
  "pushDay": { ... },
  "pullDay": { ... }
}
```

**Naming Convention:**

- `workouts.json` - Sample workout templates
- `exercises.json` - Exercise library (compound, isolation, cardio)

### User Fixtures (`users/*.json`)

**Purpose:** Test user personas (beginner, intermediate, advanced)

**Format:**

```json
{
  "beginner": {
    "email": "beginner@example.com",
    "name": "Beginner User",
    "preferences": {
      "nutrition_phase": "maintenance",
      "training_frequency": 3
    }
  },
  "advanced": {
    "email": "advanced@example.com",
    "name": "Advanced User",
    "preferences": {
      "nutrition_phase": "bulk",
      "training_frequency": 6
    }
  }
}
```

## Decision Records

### Why JSON fixtures (not TypeScript)?

**Answer:** Portability + Simplicity

**Benefits:**

1. **Language-agnostic:** Can be used by Maestro E2E tests (YAML) without TypeScript
2. **Version control:** Easy diff viewing (JSON vs compiled TS)
3. **Readability:** Non-developers (designers, QA) can edit JSON
4. **No compilation:** Load directly without TypeScript compiler

**Alternative (rejected):**

```typescript
// ❌ BAD: TypeScript fixtures (harder to use in E2E)
export const legDayFixture: TestWorkoutData = {
  title: 'Leg Day',
  nutrition_phase: 'bulk',
  // ... complex type checking, requires compilation
};
```

### Why NOT commit generated data (e.g., 1000 workouts)?

**Answer:** Fixtures = Templates, Not Volume

**Reasoning:**

1. **Version control bloat:** Large JSON files slow down git
2. **Generated data = factory job:** Use `createMultipleRecords()` instead
3. **Fixtures = reusable templates:** Focus on quality, not quantity

**Examples:**

```
✅ GOOD: Template fixtures (commit these)
tests/fixtures/database/workouts.json  (10-20 templates, ~5KB)
tests/fixtures/users/sample-users.json (5-10 personas, ~2KB)

❌ BAD: Generated fixtures (DON'T commit)
tests/fixtures/database/1000-workouts.json  (~500KB - use factories!)
```

### Why organize by domain (database/, users/)?

**Answer:** Scalability + Clear Ownership

**Future Expansion:**

```
tests/fixtures/
├── database/           # Database entities
│   ├── workouts.json
│   └── exercises.json
├── users/              # User profiles
│   └── sample-users.json
├── analytics/          # 🆕 Analytics data (Phase 2)
│   └── sample-stats.json
└── api/                # 🆕 API responses (Phase 1)
    └── mock-responses.json
```

## Import Patterns

### ✅ GOOD: Import with @tests alias

```typescript
import workoutFixtures from '@tests/fixtures/database/workouts.json';
import userFixtures from '@tests/fixtures/users/sample-users.json';

test('creates workout from fixture', async () => {
  const workout = await createTestWorkout(database, workoutFixtures.legDay);
  expect(workout.title).toBe('Leg Day - Hypertrophy');
});
```

### ❌ BAD: Relative imports

```typescript
import workoutFixtures from '../../../tests/fixtures/database/workouts.json';
```

### ❌ BAD: Hardcoding fixture data in tests

```typescript
test('creates leg day workout', async () => {
  const workout = await createTestWorkout(database, {
    title: 'Leg Day - Hypertrophy', // ❌ Duplicate data (use fixture!)
    nutrition_phase: 'bulk',
    notes: 'Focus on time under tension',
    // ... 50 lines of hardcoded data
  });
});
```

**Fix:**

```typescript
import legDayFixture from '@tests/fixtures/database/workouts.json';

test('creates leg day workout', async () => {
  const workout = await createTestWorkout(database, legDayFixture.legDay);
  // ✅ DRY - fixture is reusable
});
```

## Anti-Patterns

### ❌ BAD: Modifying fixtures in tests

```typescript
import workoutFixtures from '@tests/fixtures/database/workouts.json';

test('test 1', async () => {
  workoutFixtures.legDay.title = 'Modified'; // ❌ Mutates shared fixture!
  const workout = await createTestWorkout(database, workoutFixtures.legDay);
});

test('test 2', async () => {
  const workout = await createTestWorkout(database, workoutFixtures.legDay);
  expect(workout.title).toBe('Leg Day - Hypertrophy'); // ❌ FAILS - title was mutated!
});
```

**Fix: Use spread operator to clone**

```typescript
test('test with modified fixture', async () => {
  const modified = { ...workoutFixtures.legDay, title: 'Modified' };
  const workout = await createTestWorkout(database, modified);
  // ✅ Original fixture unchanged
});
```

### ❌ BAD: Mixing factories and fixtures inconsistently

```typescript
// Test file 1
test('test 1', async () => {
  const workout = await createTestWorkout(database, {
    title: 'Leg Day', // ❌ Hardcoded
  });
});

// Test file 2
test('test 2', async () => {
  const workout = await createTestWorkout(database, legDayFixture); // ✅ Fixture
});

// Now "Leg Day" structure differs across tests!
```

**Fix: Standardize on fixtures for common scenarios**

```typescript
// ALL tests use fixture
test('test 1', async () => {
  const workout = await createTestWorkout(database, legDayFixture.legDay);
});

test('test 2', async () => {
  const workout = await createTestWorkout(database, legDayFixture.legDay);
});
```

### ❌ BAD: Creating fixtures for test-specific data

```typescript
// tests/fixtures/database/workouts.json
{
  "testWorkout1SpecificToOneTest": { ... }, // ❌ Too specific
  "testWorkout2SpecificToOneTest": { ... }  // ❌ Too specific
}
```

**Fix: Fixtures = reusable templates, factories = test-specific**

```typescript
// ✅ GOOD: Fixture for reusable template
const legDay = await createTestWorkout(database, legDayFixture.legDay);

// ✅ GOOD: Factory for test-specific data
const uniqueWorkout = await createTestWorkout(database, {
  title: 'Test-specific workout',
  user_id: testUserId,
});
```

## Cross-References

- **Test Root README:** [tests/README.md](../README.md) - Architecture overview
- **Database Helpers:** [support/database/README.md](../support/database/README.md) - Factory functions
- **E2E Testing:** [e2e/README.md](../e2e/README.md) - Using fixtures in E2E tests
- **Mocking Guide:** [**mocks**/README.md](../../__mocks__/README.md) - Module mocks vs fixtures

## Usage Examples

### Example 1: Workout Fixture

```json
// tests/fixtures/database/workouts.json
{
  "legDayBulk": {
    "title": "Leg Day - Hypertrophy (Bulk)",
    "nutrition_phase": "bulk",
    "notes": "Focus on progressive overload",
    "exercises": [
      {
        "name": "Barbell Squat",
        "order_index": 0,
        "rest_seconds": 180,
        "sets": [
          { "set_number": 1, "weight": 135, "reps": 10, "is_warmup": true },
          { "set_number": 2, "weight": 225, "reps": 8, "rir": 2, "rpe": 8 },
          { "set_number": 3, "weight": 245, "reps": 6, "rir": 1, "rpe": 9 }
        ]
      },
      {
        "name": "Romanian Deadlift",
        "order_index": 1,
        "rest_seconds": 120,
        "sets": [{ "set_number": 1, "weight": 185, "reps": 10, "rir": 3, "rpe": 7 }]
      }
    ]
  }
}
```

### Example 2: Using Fixture in Test

```typescript
import { Database } from '@nozbe/watermelondb';
import { createTestDatabase, cleanupTestDatabase } from '@tests/support/database/test-database';
import {
  createTestWorkout,
  createTestExercise,
  createTestWorkoutExercise,
  createTestExerciseSet,
} from '@tests/support/database/factories';
import workoutFixtures from '@tests/fixtures/database/workouts.json';

describe('Workout from Fixture', () => {
  let database: Database;

  beforeEach(() => {
    database = createTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  test('creates leg day workout from fixture', async () => {
    const fixture = workoutFixtures.legDayBulk;

    // 1. Create workout from fixture
    const workout = await createTestWorkout(database, {
      title: fixture.title,
      nutrition_phase: fixture.nutrition_phase,
      notes: fixture.notes,
    });

    // 2. Create exercises from fixture
    for (const exerciseData of fixture.exercises) {
      const exercise = await createTestExercise(database, {
        name: exerciseData.name,
      });

      const workoutExercise = await createTestWorkoutExercise(database, {
        workout_id: workout.id,
        exercise_id: exercise.id,
        order_index: exerciseData.order_index,
        rest_seconds: exerciseData.rest_seconds,
      });

      // 3. Create sets from fixture
      for (const setData of exerciseData.sets) {
        await createTestExerciseSet(database, {
          workout_exercise_id: workoutExercise.id,
          ...setData,
        });
      }
    }

    // Assertions
    expect(workout.title).toBe('Leg Day - Hypertrophy (Bulk)');
    expect(workout.nutritionPhase).toBe('bulk');
  });
});
```

## Migration Notes (Phase 0.5.28 Refactor)

**New Directory:**

- Created `tests/fixtures/` for static test data
- Organized by domain (database/, users/)
- Ready for expansion (api/, analytics/ in Phase 1+)

**Benefits:**

- **DRY:** Reusable test data across unit/integration/E2E tests
- **Version control:** Track test data changes over time
- **Consistency:** Same "Leg Day" structure in all tests
- **Portability:** JSON fixtures work in Maestro E2E tests (YAML)
