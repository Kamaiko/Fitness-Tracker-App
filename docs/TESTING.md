# Testing Strategy & Guide

**Purpose:** Strategic guide for testing Halterofit - explains WHEN and WHY to test
**Audience:** AI agents (primary) + Developers (secondary)
**Technical Details:** See [\_\_tests\_\_/README.md](../__tests__/README.md) for infrastructure setup

---

## Table of Contents

1. [Overview](#overview)
2. [Testing Strategy](#testing-strategy)
3. [Writing Tests](#writing-tests)
4. [Test Infrastructure](#test-infrastructure)
5. [Coverage & Metrics](#coverage--metrics)
6. [Troubleshooting](#troubleshooting)
7. [Resources](#resources)

---

## Overview

### Three-Tier Testing Strategy

| Type                     | Speed      | Confidence | Environment              | What to Test                                 |
| ------------------------ | ---------- | ---------- | ------------------------ | -------------------------------------------- |
| **Unit (Jest + LokiJS)** | ⚡ 5s      | 🟡 Medium  | Node.js                  | CRUD, queries, relationships, business logic |
| **Integration**          | 🟢 30s-1m  | ✅ High    | Node.js + Real SQLite    | API flows, sync, cross-service workflows     |
| **E2E (Manual/Maestro)** | 🐌 5-10min | ✅ High    | Real device + automation | Complete user journeys, offline flows        |

**Current Status:** 36 unit tests (60-65% coverage) + Manual E2E validation

### Quick Commands

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode (re-run on changes)
npm run test:coverage     # Coverage report
npm test -- filename.test # Run specific test file
```

**Note:** Pre-commit hooks automatically run type-check + tests + lint. See [CONTRIBUTING.md](./CONTRIBUTING.md) for git workflow.

---

## Testing Strategy

### Decision Tree: Which Test Type?

```
Can I test this in Jest with LokiJS (in-memory)?
│
├─ YES: Does it involve _changed, _status, or synchronize()?
│   ├─ NO → ✅ Unit Test (Jest + LokiJS)
│   └─ YES → ❌ E2E Only (Real SQLite required)
│
└─ NO: Need real device/SQLite?
    ├─ One-off scenario → Manual E2E
    ├─ Repeatable flow → Maestro E2E (Phase 3+)
    └─ Cross-service → Integration Test (Phase 1+)
```

### Unit Tests (Jest + LokiJS)

**✅ What to Test:**

- CRUD operations (create, read, update, delete)
- Queries (filter, sort, paginate with `Q.where`)
- Relationships (belongs_to, has_many associations)
- Business logic (computed properties, validations)
- Timestamps (created_at, updated_at with fuzzy matching)

**❌ What NOT to Test (E2E Only):**

- Sync protocol (`_changed`, `_status` columns)
- `synchronize()` method (push/pull to backend)
- Migrations (schema changes with real SQLite)
- Conflict resolution (multi-device scenarios)

**Why LokiJS?** Jest runs in Node.js. SQLite requires React Native JSI (not available in Node). LokiJS provides real WatermelonDB behavior in Node.js environment.

### Integration Tests (Phase 1+)

**When to Use:**

- Multiple services working together (database + API)
- Sync protocol validation (local → Supabase push/pull)
- Cross-component workflows (workout creation full flow)

**Status:** 📋 Planned for Phase 1+ (not implemented yet)

**Environment:** Node.js with real SQLite (NOT LokiJS) + Mock external APIs

**See:** [\_\_tests\_\_/integration/](../__tests__/integration/) for directory structure

### E2E Tests

#### Manual E2E (Current)

**When to Use:**

- Sync protocol testing (`_changed`, `_status`)
- Migrations (schema changes)
- Exploring unknowns (edge cases, offline scenarios)
- One-off validation before automation

**Speed:** 🐌 15-20 minutes (includes build + device testing)

#### Maestro E2E Automation (Phase 1+)

**When to Use:**

- High-value user journeys (login, workout creation)
- Regression testing before releases
- Repeatable flows validated manually first

**Speed:** 🟢 2-5 minutes (automated)

**Status:** 📋 Planned for Phase 1+ (Task 1.22 - Install Maestro)

**Directory:** `.maestro/` at project root

**Strategy:** Manual E2E first (discover edge cases) → Automate validated flows with Maestro

---

## Writing Tests

### Standard Test Pattern

```typescript
import { createTestDatabase, cleanupTestDatabase } from '@test-helpers/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@test-helpers/database/factories';

describe('Workouts', () => {
  let database: Database;

  beforeAll(() => {
    database = createTestDatabase(); // Create ONCE per suite
    resetTestIdCounter();
  });

  afterEach(async () => {
    await cleanupTestDatabase(database); // Reset data between tests
  });

  it('creates a workout with default values', async () => {
    const workout = await createTestWorkout(database);

    expect(workout.id).toBeDefined();
    expect(workout.startedAt).toBeInstanceOf(Date);
  });
});
```

**Key:** Use `beforeAll` (NOT `beforeEach`) to create shared database instance. Prevents Jest hanging by creating worker handles only once per suite. See [Troubleshooting](#database-lifecycle-pattern).

### Critical Rules

| Rule                                                         | Why                      | Consequence if Broken                  |
| ------------------------------------------------------------ | ------------------------ | -------------------------------------- |
| `resetTestIdCounter()` in `beforeAll` AFTER database created | Deterministic IDs        | Tests pass individually, fail in suite |
| `await cleanupTestDatabase(database)` in `afterEach`         | Prevent memory leaks     | Tests timeout, database locked         |
| Always `await` database operations                           | Async writes             | Race conditions, data not saved        |
| Use `@test-helpers/*` aliases (NOT relative imports)         | Works from any depth     | Import errors when files move          |
| Never query `_changed`, `_status` in Jest                    | LokiJS doesn't support   | `no such column: _changed`             |
| Never call `synchronize()` in Jest                           | Requires real SQLite     | Not a function error                   |
| Always wrap writes in `database.write()`                     | Writes must transactable | `Cannot modify database outside write` |

### WatermelonDB-Specific Patterns

**Relationships:**

```typescript
const exercises = await workout.exercises.fetch(); // has_many
const parentWorkout = await exercise.workout.fetch(); // belongs_to
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
const recent = await database.get('workouts').query(Q.sortBy('created_at', Q.desc), Q.take(10)).fetch();
```

**Timestamps (fuzzy matching):**

```typescript
import { assertDatesApproximatelyEqual } from '@test-helpers/database/assertions';

const before = new Date();
const workout = await createTestWorkout(database);
const after = new Date();

assertDatesApproximatelyEqual(workout.createdAt, before, after); // ±50ms tolerance
```

**See:** [\_\_tests\_\_/\_\_helpers\_\_/database/readme.md](../__tests__/__helpers__/database/readme.md) for complete API reference

---

## Test Infrastructure

### Directory Structure

```
__tests__/                      # All tests centralized (Phase 0.6 refactor)
├── unit/                       # Unit tests (Jest + LokiJS)
│   ├── services/database/      # Database CRUD tests
│   ├── services/auth/          # Auth tests (Phase 1+)
│   └── utils/                  # Utility function tests
│
├── integration/                # Integration tests (Phase 1+)
│   ├── database/               # Database sync integration
│   ├── workflows/              # Multi-service workflows
│   └── features/               # Cross-component features
│
├── __helpers__/                # Reusable test utilities
│   └── database/
│       ├── test-database.ts    # LokiJS setup/teardown
│       ├── factories.ts        # createTestWorkout, createTestExercise
│       ├── queries.ts          # getAllRecords, countRecords
│       ├── time.ts             # wait, dateInPast, dateInFuture
│       └── assertions.ts       # assertDatesApproximatelyEqual
│
└── fixtures/                   # Static test data (JSON)
    ├── database/workouts.json
    └── users/sample-users.json
```

**E2E Tests Location:**

- Manual: `e2e/manual/` (documentation)
- Maestro: `e2e/maestro/` (automated, Phase 1+)

**Mocks Location:** `__mocks__/` at project root (Jest auto-discovery)

### Module Aliases

```typescript
// ✅ GOOD: Use aliases (works from anywhere)
import { createTestWorkout } from '@test-helpers/database/factories';
import { getAllRecords } from '@test-helpers/database/queries';
import workoutFixtures from '@tests/fixtures/database/workouts.json';

// ❌ BAD: Relative imports (fragile, breaks when files move)
import { createTestWorkout } from '../../../__helpers__/database/factories';
```

### Test Helpers Overview

| File               | Purpose               | Key Functions                                                            |
| ------------------ | --------------------- | ------------------------------------------------------------------------ |
| `test-database.ts` | LokiJS setup/teardown | `createTestDatabase()`, `cleanupTestDatabase()`                          |
| `factories.ts`     | Create test data      | `createTestWorkout()`, `createTestExercise()`, `createTestExerciseSet()` |
| `queries.ts`       | Query utilities       | `getAllRecords()`, `countRecords()`, `recordExists()`                    |
| `time.ts`          | Time utilities        | `wait()`, `dateInPast()`, `dateInFuture()`                               |
| `assertions.ts`    | Custom assertions     | `assertDatesApproximatelyEqual()`                                        |

**Complete API:** [\_\_tests\_\_/\_\_helpers\_\_/database/readme.md](../__tests__/__helpers__/database/readme.md)
**Infrastructure Setup:** [\_\_tests\_\_/README.md](../__tests__/README.md)
**Fixtures Guide:** [\_\_tests\_\_/fixtures/readme.md](../__tests__/fixtures/readme.md)

### Mocking Strategy

**Current Mocks:**

| Module                  | Location                         | Purpose                 |
| ----------------------- | -------------------------------- | ----------------------- |
| `react-native-mmkv`     | `__mocks__/react-native-mmkv.js` | In-memory storage (Map) |
| `expo-asset`            | `__mocks__/expo-asset.js`        | Mock Asset.loadAsync()  |
| `@supabase/supabase-js` | `jest.setup.js`                  | Mock auth & API calls   |
| `@sentry/react-native`  | `jest.setup.js`                  | Mock error tracking     |

**Rule:** Mock external dependencies, test internal code with real behavior.

**See:** [\_\_mocks\_\_/README.md](../__mocks__/README.md) for complete inventory

---

## Coverage & Metrics

### Current Status

| Metric             | Value  | Target        | Status  |
| ------------------ | ------ | ------------- | ------- |
| **Total Tests**    | 36     | 50+ (Phase 1) | 🟡 72%  |
| **Database Layer** | 60-65% | 80%           | 🟡 75%  |
| **Execution Time** | ~5s    | <10s          | ✅ 100% |

**Covered:** CRUD, queries, relationships, timestamps
**NOT Covered:** Sync protocol, migrations, network ops (E2E only)

### Per Model

| Model           | Tests | Coverage | Priority        |
| --------------- | ----- | -------- | --------------- |
| Workout         | 15    | ~70%     | ✅ Good         |
| Exercise        | 10    | ~60%     | Increase to 80% |
| ExerciseSet     | 11    | ~65%     | Increase to 80% |
| WorkoutExercise | 0     | 0%       | ❌ Implement    |
| User            | 0     | 0%       | Phase 1         |

**View Coverage:** `npm test -- --coverage` → Opens `coverage/lcov-report/index.html`

### Phase Roadmap

- ✅ **Phase 0.6:** 36 unit tests, 60-65% coverage (architecture & foundation)
- 🔄 **Phase 1:** Add integration tests (auth, sync), expand to 50+ tests
- 🔄 **Phase 2-3:** Expand coverage (workouts, tracking), add Maestro E2E
- 🔄 **Phase 4-5:** Full E2E automation, regression suite

---

## Troubleshooting

### Common Errors

| Error                                        | Root Cause                     | Fix                                                                     |
| -------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| `Cannot find module '@test-helpers/...'`     | Alias not configured           | Add to `jest.config.js` + `tsconfig.json` paths                         |
| `LokiJS: Table 'workouts' not found`         | Database not initialized       | Add `createTestDatabase()` in `beforeAll`                               |
| `Test IDs inconsistent between runs`         | `resetTestIdCounter()` missing | Call in `beforeAll()` after `createTestDatabase()`                      |
| `Query failed: no such column: _changed`     | Querying sync protocol columns | Move to E2E tests (LokiJS doesn't support sync columns)                 |
| `Tests timeout after 5+ seconds`             | Database not cleaned up        | Add `cleanupTestDatabase()` in `afterEach`                              |
| `Mock not being used`                        | Mock file location incorrect   | Ensure `__mocks__/exact-module-name.js`                                 |
| `Database is closed` error                   | Using database after cleanup   | Ensure all async ops complete before `afterEach`                        |
| `Jest hangs or won't exit`                   | Too many database instances    | Use shared instance pattern (`beforeAll` not `beforeEach`)              |
| `Cannot modify database outside write block` | Missing `database.write()`     | Wrap all writes in `await database.write(async () => { /* writes */ })` |

### Database Lifecycle Pattern

**⚠️ Critical:** WatermelonDB with LokiJS requires shared database instance pattern.

**✅ Correct Pattern:**

```typescript
describe('My Tests', () => {
  let database: Database;

  beforeAll(() => {
    database = createTestDatabase(); // Create ONCE per suite
    resetTestIdCounter();
  });

  afterEach(async () => {
    await cleanupTestDatabase(database); // Reset data between tests
  });

  // Tests run with shared database instance
});
```

**Why This Works:**

- ✅ Creates worker handles ONCE per suite (not for every test)
- ✅ Handles remain constant throughout suite (no leaks)
- ✅ Data isolation maintained via `unsafeResetDatabase()`
- ✅ Jest exits cleanly when suite completes
- ✅ Industry-standard pattern for in-memory databases

**❌ Incorrect Pattern:**

```typescript
// DON'T DO THIS - creates 36 worker instances!
beforeEach(() => {
  database = createTestDatabase(); // ❌ Creates new instance every test
});
```

**Note on Jest Worker Warning:**

You may see this warning at the end of test runs:

```
A worker process has failed to exit gracefully and has been force exited.
```

**This is expected and beneficial:**

- ✅ Tests complete successfully (exit code 0)
- ✅ Tests run in ~5 seconds
- ✅ Jest exits cleanly (no hanging)
- ⚠️ Warning appears because LokiJS workers don't have close() methods (by design)
- 💡 **Critical benefit:** Without `--forceExit`, real memory leaks will now be detected!

The warning indicates Jest is properly detecting open handles (5 LokiJS workers, one per test suite). This is infinitely better than using `--forceExit` which would mask actual memory leaks in your test code.

**See:** [\_\_tests\_\_/README.md § Troubleshooting](../__tests__/README.md#troubleshooting) for detailed explanation

---

## Resources

### Internal Documentation

| Document                                                                                        | Purpose              | Key Sections                         |
| ----------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------ |
| [\_\_tests\_\_/README.md](../__tests__/README.md)                                               | Infrastructure setup | Structure, conventions, quick start  |
| [\_\_tests\_\_/\_\_helpers\_\_/database/readme.md](../__tests__/__helpers__/database/readme.md) | Test helpers API     | Complete function reference          |
| [\_\_tests\_\_/fixtures/readme.md](../__tests__/fixtures/readme.md)                             | Fixtures guide       | Fixtures vs factories                |
| [\_\_mocks\_\_/README.md](../__mocks__/README.md)                                               | Mock inventory       | All mocked modules                   |
| [DATABASE.md](./DATABASE.md)                                                                    | WatermelonDB guide   | Schema, models, CRUD, sync           |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                                                            | Code structure       | Folder organization, conventions     |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                                                            | Dev workflow         | Git workflow, pre-commit hooks       |
| [CLAUDE.md](../.claude/CLAUDE.md)                                                               | Project overview     | Tech stack, current phase, standards |

### External Resources

| Resource                         | URL                                                                         | Description               |
| -------------------------------- | --------------------------------------------------------------------------- | ------------------------- |
| **Jest Documentation**           | https://jestjs.io/                                                          | Official Jest docs        |
| **WatermelonDB Testing**         | https://nozbe.github.io/WatermelonDB/Advanced/Testing.html                  | Official testing guide    |
| **WatermelonDB LokiJS**          | https://nozbe.github.io/WatermelonDB/Advanced/Adapters.html#loki-js-adapter | LokiJS adapter            |
| **WatermelonDB Sync**            | https://nozbe.github.io/WatermelonDB/Advanced/Sync.html                     | Sync protocol             |
| **Maestro**                      | https://maestro.mobile.dev/getting-started                                  | E2E automation (Phase 3+) |
| **React Native Testing Library** | https://callstack.github.io/react-native-testing-library/                   | Component testing         |

---

**Last Updated:** 2025-11-06
**Version:** 4.0 (Refactored - Strategic SSoT)
**Maintainer:** Patrick Patenaude + AI Agents
