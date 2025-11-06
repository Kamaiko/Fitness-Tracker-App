# **tests**/fixtures/ - Static Test Data

**Context:** JSON fixtures for consistent test data
**Purpose:** Reusable, version-controlled static data (complements factories)
**Constraints:** Read-only data - use factories for database insertion

---

## Quick Reference

```typescript
// Import fixtures
import workoutFixtures from '@__tests__/fixtures/database/workouts.json';
import userFixtures from '@__tests__/fixtures/users/sample-users.json';

// Use with factories
const workout = await createTestWorkout(database, workoutFixtures.legDay);
```

---

## Directory Structure

```
__tests__/fixtures/
├── database/               # Database entity fixtures
│   ├── workouts.json       # Sample workouts
│   └── exercises.json      # Sample exercises
└── users/                  # User profile fixtures
    └── sample-users.json   # Test user personas
```

---

## Fixtures vs Factories

**When to Use Fixtures (JSON):**

- ✅ Static, reusable test data (e.g., "Leg Day" workout template)
- ✅ Complex nested structures (e.g., workout with exercises and sets)
- ✅ Multiple tests need EXACT same data

**When to Use Factories (TypeScript):**

- ✅ Unique test data per test
- ✅ Database insertion (fixtures are read-only)
- ✅ Dynamic data generation (e.g., 1000 workouts)

**Pattern: Combine Both**

```typescript
// Load fixture + use factory to insert
import legDayFixture from '@__tests__/fixtures/database/workouts.json';
const workout = await createTestWorkout(database, legDayFixture.legDay);
```

---

## Import Pattern

```typescript
// ✅ GOOD: Use @tests alias
import workoutFixtures from '@__tests__/fixtures/database/workouts.json';

test('creates workout from fixture', async () => {
  const workout = await createTestWorkout(database, workoutFixtures.legDay);
  expect(workout.title).toBe('Leg Day - Hypertrophy');
});

// ❌ BAD: Relative imports
import workoutFixtures from '../../../__tests__/fixtures/database/workouts.json';
```

---

## Decision Records

### Why JSON fixtures (not TypeScript)?

**Answer:** Portability + Simplicity

- Language-agnostic: Works in E2E tests without TypeScript
- Version control: Easy diff viewing
- No compilation needed

### Why NOT commit generated data?

**Answer:** Fixtures = Templates, Not Volume

- Version control bloat: Large JSON files slow down git
- Use factories for bulk data: `createMultipleRecords()`

```
✅ GOOD: __tests__/fixtures/database/workouts.json (10-20 templates, ~5KB)
❌ BAD: __tests__/fixtures/database/1000-workouts.json (~500KB - use factories!)
```

### Why organize by domain?

**Answer:** Scalability + Clear Ownership

Current structure allows adding more domains as project grows.

---

## Cross-References

- [**tests**/README.md](../readme.md) - Infrastructure overview
- [**tests**/**helpers**/database/readme.md](../__helpers__/database/readme.md) - Factory functions
- [docs/TESTING.md](../../docs/TESTING.md) - Complete testing guide
- [**mocks**/README.md](../../__mocks__/README.md) - Module mocks
