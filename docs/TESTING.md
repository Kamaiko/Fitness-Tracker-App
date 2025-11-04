# Testing Guide

**Context:** Complete testing strategy and infrastructure for Halterofit
**Audience:** AI agents (primary) + Developers (secondary)
**Purpose:** Single source of truth for all testing practices

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Testing Strategy](#testing-strategy)
3. [Writing Tests](#writing-tests)
4. [Test Infrastructure](#test-infrastructure)
5. [Current Coverage](#current-coverage)
6. [Troubleshooting](#troubleshooting)
7. [Decision Records](#decision-records)
8. [Resources](#resources)

---

## Quick Start

### Commands

```bash
# Run all tests
npm test

# Watch mode (re-run on file change)
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific test file
npm test -- workouts.test.ts
```

### Pre-commit Requirements

Tests MUST pass before commit:

```bash
npm run type-check    # TypeScript validation
npm test              # All tests passing
npm run lint:fix      # Code style
npm run format        # Prettier
```

**Order matters:** Type check → Tests → Style → Commit (fast feedback first)

### Decision Tree: Which Test Type?

```
Can I test this in Jest with LokiJS (in-memory)?
│
├─ YES: Does it involve _changed, _status, or synchronize()?
│   ├─ NO → ✅ Unit Test (Jest + LokiJS)
│   └─ YES → ❌ Manual E2E (Real SQLite required)
│
└─ NO: Need real device/SQLite?
    ├─ One-off scenario → Manual E2E
    └─ Sync protocol → Manual E2E (MUST test)
```

**Rule:** Sync protocol or migrations → E2E. Everything else → Unit test.

---

## Testing Strategy

### Three-Tier Approach

| Type                     | Speed        | Confidence | Environment              | What to Test                                 |
| ------------------------ | ------------ | ---------- | ------------------------ | -------------------------------------------- |
| **Unit (Jest + LokiJS)** | ⚡ 5s        | 🟡 Medium  | Node.js                  | CRUD, queries, relationships, business logic |
| **Manual E2E**           | 🐌 15-20 min | ✅ High    | Real device + SQLite     | Sync protocol, migrations, offline flows     |
| **Maestro (Phase 3+)**   | 🟢 2-5 min   | ✅ High    | Real device + automation | Repeatable user journeys                     |

**Current:** 37 unit tests (60-65% coverage) + Manual E2E validation

**Strategy:** Unit tests for fast feedback → Manual E2E for unknowns → Automate high-value flows (Phase 3+)

### What to Test Where

| ✅ Unit Test                         | ❌ E2E Only                           |
| ------------------------------------ | ------------------------------------- |
| CRUD operations                      | Sync protocol (`_changed`, `_status`) |
| Queries (filter, sort, paginate)     | Migrations (schema changes)           |
| Relationships (belongs_to, has_many) | Push/pull to backend                  |
| Business logic (computed props)      | Conflict resolution                   |
| Timestamps (created_at, updated_at)  | Multi-device scenarios                |

---

## Writing Tests

### Critical Rules

**⚠️ MUST DO:**

| Rule                                                                | Why                  | Consequence if Broken                  |
| ------------------------------------------------------------------- | -------------------- | -------------------------------------- |
| `resetTestIdCounter()` in `beforeEach` AFTER `createTestDatabase()` | Deterministic IDs    | Tests pass individually, fail in suite |
| `await cleanupTestDatabase(database)` in `afterEach`                | Prevent memory leaks | Tests timeout, database locked         |
| Always `await` database operations                                  | Async writes         | Race conditions, data not saved        |
| Use `@test-helpers/*` aliases                                       | Works from any depth | Import errors when files move          |
| Test files in `src/**/__tests__/*.test.ts`                          | Jest auto-discovery  | Tests not found                        |

**❌ NEVER DO:**

| What                                | Why                            | Error                                        |
| ----------------------------------- | ------------------------------ | -------------------------------------------- |
| Query `_changed`, `_status` in Jest | LokiJS doesn't support sync    | `no such column: _changed`                   |
| Call `synchronize()` in Jest        | Requires real SQLite + network | Not a function error                         |
| Mock WatermelonDB database          | Need real behavior             | Defeats purpose of testing                   |
| Use `any` types in test code        | TypeScript strict mode         | Type error, won't compile                    |
| Forget `database.write()` wrapper   | Writes must be in transaction  | `Cannot modify database outside write block` |

### Standard Test Pattern

```typescript
import { createTestDatabase, cleanupTestDatabase } from '@test-helpers/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@test-helpers/database/factories';
import { getAllRecords } from '@test-helpers/database/queries';

describe('Workouts', () => {
  let database: Database;

  beforeEach(async () => {
    database = createTestDatabase();
    resetTestIdCounter(); // AFTER createTestDatabase
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  it('creates a workout', async () => {
    const workout = await createTestWorkout(database);

    expect(workout.id).toBeDefined();
    expect(workout.startedAt).toBeInstanceOf(Date);
  });
});
```

### WatermelonDB-Specific Patterns

**Relationships:**

```typescript
// Fetch related records using WatermelonDB associations
const exercises = await workout.exercises.fetch(); // has_many
const parentWorkout = await exercise.workout.fetch(); // belongs_to
```

**Timestamps (fuzzy matching):**

```typescript
import { assertDatesApproximatelyEqual } from '@test-helpers/database/assertions';

const before = new Date();
const workout = await createTestWorkout(database);
const after = new Date();

assertDatesApproximatelyEqual(workout.createdAt, before, after);
```

**Queries (Q.where syntax):**

```typescript
import { Q } from '@nozbe/watermelondb';

// Filter with Q.where (NOT standard SQL)
const completed = await database
  .get('workouts')
  .query(Q.where('completed_at', Q.notEq(null)))
  .fetch();

// Sort + paginate
const workouts = await database.get('workouts').query(Q.sortBy('created_at', Q.desc), Q.skip(10), Q.take(5)).fetch();
```

### Anti-Patterns

**❌ Using Relative Imports:**

```typescript
// ❌ BAD: Fragile, breaks when files move
import { createTestWorkout } from '../../../tests/__helpers__/database/factories';

// ✅ GOOD: Use alias
import { createTestWorkout } from '@test-helpers/database/factories';
```

**❌ Duplicating Helpers:**

```typescript
// ❌ BAD: Helper duplicated in multiple __tests__/ directories
src / services / database / __tests__ / helpers / createTestWorkout.ts;
src / services / api / __tests__ / helpers / createTestWorkout.ts; // Duplicate!

// ✅ GOOD: Extract to centralized location
tests / __helpers__ / database / factories.ts; // Single source of truth
```

**❌ Mixing Helpers and Fixtures:**

```typescript
// ❌ BAD: Helper function in fixtures directory
tests / fixtures / database / createTestWorkout.ts; // Wrong location!

// ✅ GOOD: Clear separation
tests / __helpers__ / database / factories.ts; // Helper functions
tests / fixtures / database / workouts.json; // Static data
```

---

## Test Infrastructure

### Directory Structure

```
tests/
├── __helpers__/          # Reusable test utilities
│   └── database/
│       ├── test-database.ts    # LokiJS setup/teardown
│       ├── factories.ts        # createTestWorkout, createTestExercise
│       ├── queries.ts          # getAllRecords, countRecords
│       ├── time.ts             # wait, dateInPast, dateInFuture
│       └── assertions.ts       # assertDatesApproximatelyEqual
│
├── fixtures/             # Static test data (JSON)
│   └── database/
│       ├── workouts.json       # Sample workout data
│       └── exercises.json      # Sample exercise data
│
├── e2e/                  # E2E test documentation
│   └── manual/
│       ├── offline-crud.md     # Offline CRUD scenarios
│       └── sync-checklist.md   # Sync protocol validation
│
└── readme.md             # Quick reference → points to this doc
```

**Unit Tests Location:** `src/**/__tests__/*.test.ts` (Jest auto-discovery)

**Mocks Location:** `__mocks__/` (root, NOT in tests/)

| What                      | Where                | Why                 |
| ------------------------- | -------------------- | ------------------- |
| **External dependencies** | `__mocks__/` (root)  | Jest auto-discovery |
| **Internal test utils**   | `tests/__helpers__/` | Custom test logic   |
| **Static test data**      | `tests/fixtures/`    | JSON fixtures       |

### Module Aliases

**@test-helpers (Helpers):**

```typescript
// Import test helpers
import { createTestWorkout, resetTestIdCounter } from '@test-helpers/database/factories';
import { getAllRecords, countRecords } from '@test-helpers/database/queries';
import { wait, dateInPast } from '@test-helpers/database/time';
import { assertDatesApproximatelyEqual } from '@test-helpers/database/assertions';
import { createTestDatabase, cleanupTestDatabase } from '@test-helpers/database/test-database';
```

**@tests (Fixtures):**

```typescript
// Import fixtures
import workoutFixtures from '@tests/fixtures/database/workouts.json';
import userFixtures from '@tests/fixtures/users/sample-users.json';
```

**Configuration:**

```typescript
// jest.config.js
moduleNameMapper: {
  '^@test-helpers/(.*)': '<rootDir>/tests/__helpers__/$1',
  '^@tests/(.*)': '<rootDir>/tests/$1',
}

// tsconfig.json
"paths": {
  "@test-helpers/*": ["tests/__helpers__/*"],
  "@tests/*": ["tests/*"]
}
```

### Test Helpers Reference

| Helper             | Purpose               | Key Functions                                                            |
| ------------------ | --------------------- | ------------------------------------------------------------------------ |
| `test-database.ts` | LokiJS setup/teardown | `createTestDatabase()`, `cleanupTestDatabase()`                          |
| `factories.ts`     | Create test data      | `createTestWorkout()`, `createTestExercise()`, `createTestExerciseSet()` |
| `queries.ts`       | Query utilities       | `getAllRecords()`, `countRecords()`, `recordExists()`                    |
| `time.ts`          | Time utilities        | `wait()`, `dateInPast()`, `dateInFuture()`                               |
| `assertions.ts`    | Custom assertions     | `assertDatesApproximatelyEqual()`                                        |

**See:** [tests/**helpers**/database/readme.md](../tests/__helpers__/database/readme.md) for complete API

### Mocking

**Current Mocks:**

| Module                  | Location                         | Purpose                 |
| ----------------------- | -------------------------------- | ----------------------- |
| `react-native-mmkv`     | `__mocks__/react-native-mmkv.js` | In-memory storage (Map) |
| `expo-asset`            | `__mocks__/expo-asset.js`        | Mock Asset.loadAsync()  |
| `@supabase/supabase-js` | `jest.setup.js`                  | Mock auth & API calls   |
| `@sentry/react-native`  | `jest.setup.js`                  | Mock error tracking     |

**Rule:** Mock external dependencies, test internal code.

**See:** [**mocks**/README.md](../__mocks__/README.md) for complete inventory

---

## Current Coverage

| Metric             | Value  | Target        | Status  |
| ------------------ | ------ | ------------- | ------- |
| **Total Tests**    | 36     | 50+ (Phase 1) | 🟡 72%  |
| **Database Layer** | 60-65% | 80%           | 🟡 75%  |
| **Execution Time** | ~5s    | <10s          | ✅ 100% |

**Covered:** CRUD, queries, relationships, timestamps
**NOT Covered (E2E only):** Sync protocol, migrations, network ops

### Per Model

| Model           | Tests | Coverage | Priority        |
| --------------- | ----- | -------- | --------------- |
| Workout         | 15    | ~70%     | ✅ Good         |
| Exercise        | 10    | ~60%     | Increase to 80% |
| ExerciseSet     | 12    | ~65%     | Increase to 80% |
| WorkoutExercise | 0     | 0%       | ❌ Implement    |
| User            | 0     | 0%       | ❌ Implement    |

**View coverage:** `npm test -- --coverage` → `open coverage/lcov-report/index.html`

---

## Troubleshooting

| Error                                    | Root Cause                             | Fix                                              |
| ---------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| `Cannot find module '@test-helpers/...'` | Alias not configured                   | Add to `jest.config.js` + `tsconfig.json` paths  |
| `LokiJS: Table 'workouts' not found`     | Database not initialized               | Add `createTestDatabase()` in `beforeEach`       |
| `Test IDs inconsistent between runs`     | `resetTestIdCounter()` not called      | Call AFTER `createTestDatabase()`                |
| `Query failed: no such column: _changed` | Querying sync protocol columns in Jest | Move to Manual E2E tests                         |
| `Tests timeout after 5+ seconds`         | Database not cleaned up                | Add `cleanupTestDatabase()` in `afterEach`       |
| `Mock not being used`                    | Mock file location incorrect           | Ensure `__mocks__/exact-module-name.js`          |
| `Database is closed` error               | Using database after cleanup           | Ensure all async ops complete before `afterEach` |

---

## Decision Records

**Q: Why Three-Tier Testing?**
A: Speed vs Confidence. Unit (5s, medium confidence) → Manual E2E (15-20 min, high confidence) → Maestro (2-5 min automated, Phase 3+). Progressive validation strategy.

**Q: Why Jest + LokiJS (not Real SQLite)?**
A: Jest runs in Node.js. SQLite requires React Native JSI (not available in Node). LokiJS works in Node.js. **Limitation:** Cannot test sync protocol → Use Manual E2E for sync.

**Q: Why Manual E2E Before Maestro?**
A: Discover unknowns first (5 min) vs Maestro setup (1-2 days). Manual finds edge cases → Automate validated flows only (Phase 3+).

**Q: Why Not Mock WatermelonDB?**
A: Need real database behavior (queries, relationships, transactions). LokiJS provides real behavior without React Native. **Philosophy:** Test internal code with real behavior, mock external dependencies only.

**Q: Why tests/ at root (not src/**tests**/)?**
A: Different access patterns:

- **Unit tests:** Colocated in `src/**/__tests__/` (close to implementation)
- **Helpers:** Centralized in `tests/__helpers__/` (accessible from ALL tests)
- **Fixtures:** Centralized in `tests/fixtures/` (shared static data)

Helpers are accessible from unit tests, future integration tests, and manual E2E.

**Q: Why **helpers**/ (not support/)?**
A: Convention alignment + clarity:

- Follows Jest conventions (`__mocks__/`, `__tests__/`, `__helpers__/`)
- Double underscore signals "special test directory"
- More descriptive than generic "support"

**Q: Why **mocks**/ at root (not in tests/)?**
A: Jest convention - auto-discovers mocks in `__mocks__/` adjacent to `node_modules` (no config needed). If moved to `tests/__mocks__/`:

- ❌ Jest won't auto-discover
- ❌ Need manual `moduleNameMapper` for each mock
- ❌ Breaks Jest convention

---

## Resources

### Internal Documentation

| Document                                                                        | Purpose              | Key Sections                     |
| ------------------------------------------------------------------------------- | -------------------- | -------------------------------- |
| [CLAUDE.md](../.claude/CLAUDE.md)                                               | Project overview     | Tech stack, Testing strategy     |
| [TASKS.md](./TASKS.md)                                                          | Project roadmap      | Phase 0.5 tasks, Kanban          |
| [DATABASE.md](./DATABASE.md)                                                    | WatermelonDB guide   | Schema, models, CRUD             |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                                            | Code structure       | Folder organization, conventions |
| [TECHNICAL.md](./TECHNICAL.md)                                                  | ADRs                 | Tech choices, testing decisions  |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                                            | Dev workflow         | Git workflow, pre-commit hooks   |
| [tests/**helpers**/database/readme.md](../tests/__helpers__/database/readme.md) | Helper API reference | Complete API docs                |
| [**mocks**/README.md](../__mocks__/README.md)                                   | Mock inventory       | All mocked modules               |

### External Resources

| Resource                         | URL                                                                         | Description               |
| -------------------------------- | --------------------------------------------------------------------------- | ------------------------- |
| **Jest Documentation**           | https://jestjs.io/                                                          | Official Jest docs        |
| **Jest React Native**            | https://jestjs.io/docs/tutorial-react-native                                | React Native testing      |
| **Jest Mock Functions**          | https://jestjs.io/docs/mock-functions                                       | Mocking guide             |
| **Jest Manual Mocks**            | https://jestjs.io/docs/manual-mocks                                         | Creating mocks            |
| **WatermelonDB Testing**         | https://nozbe.github.io/WatermelonDB/Advanced/Testing.html                  | Official testing guide    |
| **WatermelonDB LokiJS**          | https://nozbe.github.io/WatermelonDB/Advanced/Adapters.html#loki-js-adapter | LokiJS adapter            |
| **WatermelonDB Sync**            | https://nozbe.github.io/WatermelonDB/Advanced/Sync.html                     | Sync protocol             |
| **Expo Dev Builds**              | https://docs.expo.dev/develop/development-builds/introduction/              | Development builds        |
| **Maestro**                      | https://maestro.mobile.dev/getting-started                                  | E2E automation (Phase 3+) |
| **React Native Testing Library** | https://callstack.github.io/react-native-testing-library/                   | Component testing         |

---

**Last Updated:** 2025-02-04
**Version:** 3.0 (Refactored - integrated tests/readme.md)
**Maintainer:** Patrick Patenaude + AI Agents
