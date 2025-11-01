# tests/ - Test Infrastructure

**Context:** Centralized test helpers and fixtures (Refactored Phase 0.6)
**Purpose:** Reusable testing infrastructure accessible from all test types
**Conventions:** Use `@test-helpers` for helpers, `@tests` for fixtures

---

## Quick Reference

```typescript
// Import test helpers (factories, queries, time, assertions)
import { createTestWorkout, resetTestIdCounter } from '@test-helpers/database/factories';
import { getAllRecords, countRecords } from '@test-helpers/database/queries';
import { wait, dateInPast } from '@test-helpers/database/time';
import { assertDatesApproximatelyEqual } from '@test-helpers/database/assertions';
import { createTestDatabase, cleanupTestDatabase } from '@test-helpers/database/test-database';

// Import fixtures
import workoutFixtures from '@tests/fixtures/database/workouts.json';
import userFixtures from '@tests/fixtures/users/sample-users.json';
```

---

## Directory Structure

```
tests/
├── __helpers__/              # Test helpers (backend logic)
│   └── database/
│       ├── test-database.ts  # LokiJS setup (createTestDatabase, cleanupTestDatabase)
│       ├── factories.ts      # Data generators (createTestWorkout, createTestExercise, etc.)
│       ├── queries.ts        # Query helpers (getAllRecords, countRecords, etc.)
│       ├── time.ts           # Time helpers (wait, dateInPast, dateInFuture)
│       └── assertions.ts     # Assertions (assertDatesApproximatelyEqual, etc.)
│
└── fixtures/                 # Static test data (JSON)
    ├── database/
    │   ├── workouts.json     # Sample workouts
    │   └── exercises.json    # Sample exercises
    └── users/
        └── sample-users.json # Test user personas
```

**Location of Tests:**

- Unit tests: Colocated in `src/**/__tests__/*.test.ts`
- E2E tests: Manual execution on real device (documented in docs/testing/readme.md)

---

## Module Aliases

### @test-helpers (Backend Logic)

```typescript
// jest.config.js
moduleNameMapper: {
  '^@test-helpers/(.*)': '<rootDir>/tests/__helpers__/$1',
}

// tsconfig.json
"paths": {
  "@test-helpers/*": ["tests/__helpers__/*"]
}
```

**Usage:** Import all test helpers using this alias

### @tests (General Infrastructure)

```typescript
// jest.config.js
moduleNameMapper: {
  '^@tests/(.*)': '<rootDir>/tests/$1',
}

// tsconfig.json
"paths": {
  "@tests/*": ["tests/*"]
}
```

**Usage:** Import fixtures using this alias

---

## Decision Records

### Why tests/ at root (not src/**tests**/)?

**Question:** Why not keep everything in src/?

**Answer:** Different access patterns

- **Unit tests:** Colocated in `src/**/__tests__/` (close to implementation)
- **Helpers:** Centralized in `tests/__helpers__/` (accessible from ALL tests)
- **Fixtures:** Centralized in `tests/fixtures/` (shared static data)

**Benefit:** Helpers are accessible from:

- Unit tests (`src/services/database/__tests__/`)
- Future integration tests (`src/services/api/__tests__/`)
- Manual E2E tests

### Why **helpers**/ (not support/)?

**Question:** Why not name it support/ or utils/?

**Answer:** Convention alignment + clarity

- Follows Jest conventions (`__mocks__/`, `__tests__/`, `__helpers__/`)
- Double underscore pattern signals "special test directory"
- More descriptive than generic "support"
- Avoids confusion with npm support packages

### Why separate database/ subdirectory?

**Question:** Why not flat structure in **helpers**/?

**Answer:** Future scalability

Current structure allows adding more domains:

```
tests/__helpers__/
├── database/     # Database helpers (current)
├── api/          # API test helpers (Phase 1+)
└── analytics/    # Analytics helpers (Phase 2+)
```

---

## Anti-Patterns

### ❌ Using Relative Imports

```typescript
// ❌ BAD: Fragile, breaks when files move
import { createTestWorkout } from '../../../tests/__helpers__/database/factories';
```

```typescript
// ✅ GOOD: Use alias
import { createTestWorkout } from '@test-helpers/database/factories';
```

### ❌ Duplicating Helpers

```typescript
// ❌ BAD: Helper duplicated in multiple __tests__/ directories
src / services / database / __tests__ / helpers / createTestWorkout.ts;
src / services / api / __tests__ / helpers / createTestWorkout.ts; // Duplicate!
```

```typescript
// ✅ GOOD: Extract to centralized location
tests / __helpers__ / database / factories.ts; // Single source of truth
```

### ❌ Mixing Helpers and Fixtures

```typescript
// ❌ BAD: Helper function in fixtures directory
tests / fixtures / database / createTestWorkout.ts; // Wrong location!
```

```typescript
// ✅ GOOD: Clear separation
tests / __helpers__ / database / factories.ts; // Helper functions
tests / fixtures / database / workouts.json; // Static data
```

---

## Cross-References

### Test Infrastructure

- **Complete Testing Guide:** [docs/testing/readme.md](../docs/testing/readme.md) - Unit + Mocking + E2E
- **Database Helpers Reference:** [**helpers**/database/readme.md](./__helpers__/database/readme.md)
- **Fixtures Guide:** [fixtures/readme.md](./fixtures/readme.md)
- **Mocks Inventory:** [**mocks**/README.md](../__mocks__/README.md)

### Project Docs

- **Database Guide:** [docs/DATABASE.md](../docs/DATABASE.md) - WatermelonDB setup
- **Architecture:** [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) - Code structure
- **Contributing:** [docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md) - Development workflow
