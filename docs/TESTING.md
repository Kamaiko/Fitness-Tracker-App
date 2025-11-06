# Testing Guide

**Context:** Complete testing strategy and infrastructure for Halterofit
**Audience:** AI agents (primary) + Developers (secondary)
**Purpose:** Single source of truth for all testing practices

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Testing Strategy](#testing-strategy)
3. [Writing Tests](#writing-tests)
4. [Integration Testing (Phase 1+)](#integration-testing-phase-1)
5. [E2E Testing - Maestro (Phase 1+)](#e2e-testing---maestro-phase-1)
6. [Test Infrastructure](#test-infrastructure)
7. [Scripts - No Tests Needed](#scripts---no-tests-needed)
8. [Current Coverage](#current-coverage)
9. [Troubleshooting](#troubleshooting)
10. [Decision Records](#decision-records)
11. [Resources](#resources)

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

**Current:** 36 unit tests (60-65% coverage) + Manual E2E validation

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

## Integration Testing (Phase 1+)

Integration tests validate multiple components working together across service boundaries.

### When to Write Integration Tests

| Scenario                | Type        | Location                       | Example                     |
| ----------------------- | ----------- | ------------------------------ | --------------------------- |
| Database sync protocol  | Integration | `tests/integration/database/`  | Local → Supabase sync       |
| Multi-service workflows | Integration | `tests/integration/workflows/` | Workout creation full flow  |
| Cross-component flows   | Integration | `tests/integration/features/`  | Complete feature end-to-end |

### Unit vs Integration vs E2E

| Type            | Scope                 | Environment           | Speed       | What to Test                     |
| --------------- | --------------------- | --------------------- | ----------- | -------------------------------- |
| **Unit**        | Single function/class | Node.js + LokiJS      | ⚡ 5s       | CRUD, queries, business logic    |
| **Integration** | Multiple services     | Node.js + Real SQLite | 🟢 30s-1min | API flows, sync, cross-service   |
| **E2E**         | Full user journey     | Real device           | 🐌 5-10min  | Login, workout creation, offline |

### Structure & Conventions

**Location:** `tests/integration/`

**Run with:**

```bash
npm run test:integration   # Phase 1+ (not implemented yet)
```

**Environment:**

- Node.js with real SQLite (NOT LokiJS)
- Mock external APIs (Supabase)
- Real WatermelonDB sync protocol

### Example Integration Test

```typescript
// tests/integration/database/sync-protocol.test.ts
import { createTestDatabase } from '@test-helpers/database/test-database';
import { syncService } from '@/services/database/sync';

describe('Database Sync Integration', () => {
  let database: Database;

  beforeEach(async () => {
    database = createTestDatabase();
  });

  it('syncs local changes to Supabase', async () => {
    // Create workout locally
    const workout = await createTestWorkout(database);

    // Mark as changed (sync protocol)
    await database.write(async () => {
      await workout.update((w) => {
        w._status = 'created';
        w._changed = 'name,started_at';
      });
    });

    // Sync to Supabase
    const result = await syncService.push();

    expect(result.success).toBe(true);
    expect(result.pushedRecords).toContain(workout.id);
  });
});
```

### Implementation Status

| Feature                    | Status            | Phase    |
| -------------------------- | ----------------- | -------- |
| **Directory structure**    | 📋 Planned        | Phase 1+ |
| **npm script**             | ⏸️ Not created    | Phase 1+ |
| **SQLite setup**           | ⏸️ Not configured | Phase 1+ |
| **First integration test** | ⏸️ Not written    | Phase 1+ |

**Current Phase:** 0.5 (Architecture & Foundation) - Integration tests planned for Phase 1+

---

## E2E Testing - Maestro (Phase 1+)

Maestro is used for **automated E2E tests on real devices**, testing complete user journeys.

### Overview

| Aspect           | Details                               |
| ---------------- | ------------------------------------- |
| **Tool**         | Maestro Mobile Test Automation        |
| **Installation** | Phase 1 (Task 1.22) - NOT Phase 0.5   |
| **Location**     | `.maestro/` at project root           |
| **Test Format**  | YAML workflows                        |
| **Execution**    | `maestro test .maestro/`              |
| **Environment**  | Real device (iOS/Android) or emulator |

### When to Use Maestro

**✅ DO Use Maestro For:**

- High-value user journeys (login, workout creation, sync)
- Flows validated manually first (automate after confirmation)
- Regression testing before releases
- Critical paths (auth, data entry, offline flows)

**❌ DON'T Use Maestro For:**

- Unit-testable logic (use Jest)
- One-off scenarios (manual E2E faster)
- Edge cases (manual E2E more flexible)
- Early development (wait until features stable)

### Directory Structure

```
.maestro/
├── auth/                 # Phase 1 (Task 1.22)
│   ├── login.yaml       # Login flow
│   ├── signup.yaml      # Signup + verification
│   └── logout.yaml      # Logout flow
│
└── workout/             # Phase 3 (Task 3.90)
    ├── create-workout.yaml       # Create workout
    ├── add-exercises.yaml        # Add exercises to workout
    └── complete-workout.yaml     # Complete and save workout
```

### Example Maestro Test

```yaml
# .maestro/auth/login.yaml
appId: com.halterofit.app
---
- launchApp
- tapOn: 'Login'
- inputText: 'test@example.com'
- tapOn: 'Password'
- inputText: 'password123'
- tapOn: 'Sign In'
- assertVisible: 'Dashboard'
```

### Setup Timeline

| Phase         | Task           | Deliverable                  |
| ------------- | -------------- | ---------------------------- |
| **Phase 0.5** | ⏸️ Not started | Manual E2E only              |
| **Phase 1**   | Task 1.22      | Install Maestro + Auth tests |
| **Phase 3**   | Task 3.90      | Workout E2E tests            |

### Installation (Phase 1 Only)

**Do NOT install now** - Wait until Phase 1 (Task 1.22)

```bash
# Phase 1 installation (future)
curl -Ls "https://get.maestro.mobile.dev" | bash
maestro test .maestro/
```

### Manual E2E vs Maestro

| Aspect            | Manual E2E         | Maestro E2E        |
| ----------------- | ------------------ | ------------------ |
| **When**          | Now (Phase 0.5)    | Phase 1+           |
| **Speed**         | 🐌 15-20 min       | 🟢 2-5 min         |
| **Cost**          | Free (your time)   | Free (automated)   |
| **Flexibility**   | ✅ High            | 🟡 Medium          |
| **Repeatability** | ❌ Manual          | ✅ Automated       |
| **Best for**      | Exploring unknowns | Regression testing |

**Strategy:** Manual E2E first (discover edge cases) → Automate validated flows with Maestro (Phase 1+)

### Implementation Status

| Feature               | Status            | Phase               |
| --------------------- | ----------------- | ------------------- |
| **Maestro installed** | ⏸️ Not installed  | Phase 1             |
| **Auth tests**        | ⏸️ Not created    | Phase 1 (Task 1.22) |
| **Workout tests**     | ⏸️ Not created    | Phase 3 (Task 3.90) |
| **CI/CD integration** | ⏸️ Not configured | Phase 1+            |

**Current Phase:** 0.5 (Architecture & Foundation) - Maestro planned for Phase 1+

**See:** [TASKS.md § Task 1.22](./TASKS.md) for Maestro installation steps

---

## Test Infrastructure

### Directory Structure (Phase 0.6 - Reorganized)

```
__tests__/                      # All tests centralized (renamed from tests/)
├── unit/                       # Unit tests (colocated by feature)
│   ├── services/
│   │   ├── database/
│   │   │   ├── workouts.test.ts
│   │   │   ├── exercises.test.ts
│   │   │   └── sets.test.ts
│   │   └── auth/
│   └── utils/
│       └── formatters.test.ts
│
├── integration/                # Integration tests (Phase 1+)
│   ├── database/               # Database sync integration tests
│   ├── workflows/              # Multi-service workflow tests
│   └── features/               # Cross-component feature tests
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
    └── database/
        ├── workouts.json       # Sample workout data
        └── exercises.json      # Sample exercise data
```

**E2E Tests Location:** `e2e/manual/` (documentation) and `e2e/maestro/` (automated)

**Mocks Location:** `__mocks__/` (root, NOT in **tests**/)

| What                      | Where                    | Why                 |
| ------------------------- | ------------------------ | ------------------- |
| **External dependencies** | `__mocks__/` (root)      | Jest auto-discovery |
| **Internal test utils**   | `__tests__/__helpers__/` | Custom test logic   |
| **Static test data**      | `__tests__/fixtures/`    | JSON fixtures       |
| **E2E tests**             | `e2e/`                   | Separate from unit  |

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

## Scripts - No Tests Needed

Scripts in `scripts/` are **one-time maintenance utilities**, not runtime code.

### Why No Tests for scripts/?

| Script                              | Purpose                | Frequency            | Validation          | Tests Needed?   |
| ----------------------------------- | ---------------------- | -------------------- | ------------------- | --------------- |
| `exercisedb-full-dataset.json`      | Exercise data backup   | N/A (static data)    | Manual inspection   | ❌ No           |
| ~~`import-from-github-dataset.ts`~~ | Import exercises to DB | One-time (completed) | Zod + dry-run       | ❌ No (deleted) |
| ~~`rollback-exercisedb.ts`~~        | Rollback DB import     | Rarely (dev only)    | Manual confirmation | ❌ No (deleted) |

**Status:** Import completed, scripts deleted (no longer needed)

### Built-in Safeguards (Historical)

When scripts were active, they had:

1. **Zod Runtime Validation** - Catches data errors before DB write

   ```typescript
   const result = GitHubExerciseSchema.safeParse(rawData);
   if (!result.success) {
     console.error('Validation failed:', result.error);
   }
   ```

2. **Detailed Logging** - Console output shows progress/errors

   ```typescript
   console.log(`✅ Imported ${count} exercises`);
   ```

3. **README.md** - Troubleshooting guide for common issues

### Industry Standard

| Project     | One-time Scripts | Tests?                      |
| ----------- | ---------------- | --------------------------- |
| **Next.js** | Seed scripts     | ❌ No                       |
| **Prisma**  | Migrate & seed   | ❌ No (validation built-in) |
| **NestJS**  | DB seeds         | ❌ No                       |
| **Strapi**  | Content imports  | ❌ No                       |

**Pattern:** One-time scripts use built-in validation (Zod, schema checks) instead of test suites.

### ROI Analysis

| Aspect               | Cost                              | Benefit                      | ROI   |
| -------------------- | --------------------------------- | ---------------------------- | ----- |
| **Test creation**    | High (2-3h setup)                 | Low (one-time execution)     | 10%   |
| **Test maintenance** | Medium (Supabase mocks, fixtures) | Zero (script archived)       | 0%    |
| **Bug prevention**   | Low (Zod validates)               | Low (dry-run catches issues) | 15%   |
| **Confidence**       | Medium (tests)                    | Medium (dry-run + logging)   | Equal |

**Verdict:** Tests not justified. Zod validation + dry-run + logging = sufficient safeguards.

### Current State

**scripts/ Directory:**

```
scripts/
└── exercisedb-full-dataset.json  # Backup only (1.3MB)
```

**Deleted Scripts:**

- ~~`import-from-github-dataset.ts`~~ - Import completed, no longer needed
- ~~`rollback-exercisedb.ts`~~ - Rarely used, recoverable from git history
- ~~`README.md`~~ - Historical documentation
- ~~`tsconfig.json`~~ - No longer needed

**Rationale:**

- Import completed (1,500 exercises seeded)
- Scripts deleted (recoverable from git history if needed)
- Zod dependency removed (5.2MB saved)

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

| Error                                    | Root Cause                           | Fix                                                            |
| ---------------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| `Cannot find module '@test-helpers/...'` | Alias not configured                 | Add to `jest.config.js` + `tsconfig.json` paths                |
| `LokiJS: Table 'workouts' not found`     | Database not initialized             | Add `createTestDatabase()` in `beforeEach`                     |
| `Test IDs inconsistent between runs`     | `resetTestIdCounter()` not called    | Call in `beforeAll()` after `createTestDatabase()`             |
| `Query failed: no such column: _changed` | Querying sync protocol columns       | Move to Manual E2E tests (LokiJS doesn't support sync columns) |
| `Tests timeout after 5+ seconds`         | Database not cleaned up              | Add `cleanupTestDatabase()` in `afterEach`                     |
| `Mock not being used`                    | Mock file location incorrect         | Ensure `__mocks__/exact-module-name.js`                        |
| `Database is closed` error               | Using database after cleanup         | Ensure all async ops complete before `afterEach`               |
| `Jest hangs or won't exit`               | Creating too many database instances | Use shared instance pattern (`beforeAll` not `beforeEach`)     |

### Database Lifecycle Best Practice

WatermelonDB with LokiJS adapter requires a specific lifecycle pattern for Jest tests:

**✅ Correct Pattern: Shared Database Instance**

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

- ✅ Creates worker handles only ONCE (not for every test)
- ✅ Handles remain constant throughout suite (no leaks)
- ✅ Data isolation maintained via `unsafeResetDatabase()`
- ✅ Jest exits cleanly when suite completes
- ✅ Industry-standard pattern for in-memory databases

**❌ Incorrect Pattern: New Instance Per Test**

```typescript
// DON'T DO THIS - creates 36 worker instances!
beforeEach(() => {
  database = createTestDatabase(); // ❌ Creates new instance every test
});
```

**Why LokiJS Has No close() Method:**

- LokiJS is designed for in-memory usage where cleanup happens automatically
- The worker/bridge/dispatcher pattern maintains handles internally
- Shared instance pattern prevents handle accumulation
- Jest's garbage collection handles cleanup when test suite ends

**Note on Jest Worker Warning:**

You may still see this warning at the end of test runs:

```
A worker process has failed to exit gracefully and has been force exited.
```

**This is expected and actually beneficial:**

- ✅ Tests complete successfully (exit code 0)
- ✅ Tests run in ~5 seconds
- ✅ Jest exits cleanly (no hanging)
- ⚠️ Warning appears because LokiJS workers don't have close() methods (by design)
- 💡 **Critical benefit**: Without `--forceExit`, real memory leaks will now be detected!

The warning indicates Jest is properly detecting open handles (the 5 LokiJS workers, one per test suite). This is the industry-standard approach - infinitely better than using `--forceExit` which would mask actual memory leaks in your test code.

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
