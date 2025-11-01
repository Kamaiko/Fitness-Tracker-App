# Testing Guide

**Context:** Comprehensive testing strategy for Halterofit
**Purpose:** Complete testing reference for AI agents and developers
**Audience:** AI agents (primary) + Solo developer (secondary)

---

## Table of Contents

1. [Quick Reference for AI Agents](#quick-reference-for-ai-agents)
   - [Decision Tree: Which Test Type?](#decision-tree-which-test-type)
   - [Critical Rules for AI](#critical-rules-for-ai)
   - [WatermelonDB-Specific Patterns](#watermelondb-specific-patterns)
2. [Quick Start (Developer)](#quick-start-developer)
3. [Testing Strategy: Three-Tier Approach](#testing-strategy-three-tier-approach)
4. [Unit Testing](#unit-testing)
5. [Mocking](#mocking)
6. [Manual E2E Testing](#manual-e2e-testing)
7. [Troubleshooting](#troubleshooting)
8. [Current Test Coverage](#current-test-coverage)
9. [Test Infrastructure](#test-infrastructure)
10. [Decision Records](#decision-records)
11. [Cross-References & Resources](#cross-references--resources)

---

## Quick Reference for AI Agents

### Decision Tree: Which Test Type?

```
Can I test this feature in Jest with LokiJS (in-memory)?
│
├─ YES: Does it involve _changed, _status, or synchronize()?
│   ├─ NO → ✅ Unit Test (Jest + LokiJS)
│   └─ YES → ❌ Manual E2E (Real SQLite required)
│
└─ NO: Need real device/SQLite?
    ├─ One-off scenario → Manual E2E
    ├─ Repeatable user flow → Maestro (Phase 3+)
    └─ Sync protocol → Manual E2E (MUST test)
```

**Rule of Thumb:** If it touches sync protocol or migrations → E2E. Everything else → Unit test first.

---

### Critical Rules for AI

**⚠️ MUST DO (or tests will fail/be flaky):**

| Rule                                                                | Why                                        | Consequence if Broken                   |
| ------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------- |
| `resetTestIdCounter()` in `beforeEach` AFTER `createTestDatabase()` | IDs must be deterministic across test runs | Tests pass individually, fail in suite  |
| `await cleanupTestDatabase(database)` in `afterEach`                | Prevent memory leaks                       | Tests timeout after 5s, database locked |
| Always `await` database operations                                  | Database writes are async                  | Race conditions, data not saved         |
| Use `@test-helpers/*` aliases, NEVER relative imports               | Aliases work from any depth                | Import errors when files move           |
| Test files in `src/**/__tests__/*.test.ts`                          | Jest auto-discovery pattern                | Tests not found by Jest                 |

**❌ NEVER DO (will break immediately):**

| What                                               | Why                                  | Error Message                                |
| -------------------------------------------------- | ------------------------------------ | -------------------------------------------- |
| Query `_changed`, `_status`, `_deleted_at` in Jest | LokiJS doesn't support sync protocol | `no such column: _changed`                   |
| Call `synchronize()` in Jest                       | Requires real SQLite + network       | Not a function error                         |
| Mock WatermelonDB database                         | Need real behavior for queries       | Defeats purpose of testing                   |
| Use `any` types in test code                       | TypeScript strict mode enforced      | Type error, won't compile                    |
| Forget `database.write()` wrapper                  | Writes must be in transaction        | `Cannot modify database outside write block` |

**🎯 DECISION LOGIC:**

```
Need to write test?
│
├─ Does it query/modify _changed, _status, or call synchronize()?
│   └─ YES → ❌ STOP. Document as Manual E2E scenario instead.
│
├─ Does it test migrations or schema changes?
│   └─ YES → ❌ STOP. Document as Manual E2E scenario instead.
│
└─ CRUD/queries/relationships/business logic?
    └─ YES → ✅ Write Jest unit test
             1. Create database in beforeEach
             2. Reset ID counter
             3. Write test
             4. Clean up in afterEach
```

**📋 QUICK CHECKLIST (before running test):**

- [ ] File location: `src/**/__tests__/*.test.ts`
- [ ] Imports use `@test-helpers/*` aliases
- [ ] `beforeEach`: creates database + resets counter
- [ ] `afterEach`: cleans up database
- [ ] No queries on `_changed`, `_status`, `_deleted_at`
- [ ] All database ops have `await`
- [ ] Writes wrapped in `database.write()`

---

### WatermelonDB-Specific Patterns

**🔗 Pattern 1: Test Relationships (non-obvious syntax)**

```typescript
// Fetch related records using WatermelonDB associations
const exercises = await workout.exercises.fetch(); // has_many
const parentWorkout = await exercise.workout.fetch(); // belongs_to
```

**⏱️ Pattern 2: Test Timestamps (fuzzy matching required)**

```typescript
// Timestamps are auto-generated, need fuzzy comparison
const before = new Date();
const workout = await createTestWorkout(database);
const after = new Date();
assertDatesApproximatelyEqual(workout.createdAt, before, after);
```

**🔍 Pattern 3: WatermelonDB Queries (Q.where syntax)**

```typescript
import { Q } from '@nozbe/watermelondb';

// Filter with Q.where (NOT standard SQL syntax)
const completed = await database
  .get('workouts')
  .query(Q.where('completed_at', Q.notEq(null)))
  .fetch();

// Sort + paginate
const workouts = await database.get('workouts').query(Q.sortBy('created_at', Q.desc), Q.skip(10), Q.take(5)).fetch();
```

---

## Quick Start (Developer)

**Test file location:** `src/**/__tests__/*.test.ts` (Jest auto-discovery)

**Pre-commit requirements:**

- `npm run type-check` (TypeScript validation - MUST pass)
- `npm test` (All tests passing)
- `npm run lint:fix && npm run format` (Code style)
- `/commit` (Conventional commits enforced via Husky hooks)

**Order matters:** Type check → Tests → Style → Commit (fast feedback first)

---

## Testing Strategy: Three-Tier Approach

| Test Type                | Speed        | Confidence                  | Environment              | What to Test                                                  | What NOT to Test                                            |
| ------------------------ | ------------ | --------------------------- | ------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------- |
| **Unit (Jest + LokiJS)** | ⚡ 5s        | 🟡 Medium (LokiJS ≠ SQLite) | Node.js                  | CRUD, queries, relationships, business logic, performance     | `_changed`, `_status`, `synchronize()`, migrations, network |
| **Manual E2E**           | 🐌 15-20 min | ✅ High (real env)          | Real device + SQLite     | Sync protocol, migrations, offline flows, edge case discovery | Repeatable flows (automate with Maestro instead)            |
| **Maestro (Phase 3+)**   | 🟢 2-5 min   | ✅ High                     | Real device + automation | Repeatable user journeys, regression tests                    | One-off scenarios (manual E2E faster)                       |

**Current Status:** 37 unit tests (60-65% coverage) + Manual E2E validation (sync protocol)

**Strategy:** Unit tests for fast feedback → Manual E2E for unknowns → Automate high-value flows (Phase 3+)

---

## Unit Testing

| ✅ DO Test (Unit)                           | ❌ DON'T Test (E2E Only)              | Why                           |
| ------------------------------------------- | ------------------------------------- | ----------------------------- |
| CRUD operations                             | Sync protocol (`_changed`, `_status`) | LokiJS doesn't support sync   |
| Queries (filter, sort, paginate)            | Migrations (schema changes)           | Requires real SQLite          |
| Relationships (belongs_to, has_many)        | Push/pull to backend                  | Requires network              |
| Business logic (computed props, validation) | Conflict resolution                   | Requires real sync            |
| Performance (query time)                    | Multi-device scenarios                | Requires multiple instances   |
| Timestamps (created_at, updated_at)         | JSI bridging                          | Requires React Native runtime |

**Rule:** If it touches `_changed`, `_status`, or `synchronize()` → E2E. Otherwise → Unit test.

**Test Helpers Available:**

- **Setup/Teardown:** `createTestDatabase()`, `cleanupTestDatabase()`, `resetTestIdCounter()`
- **Factories:** `createTestWorkout()`, `createTestExercise()`, `createTestExerciseSet()`
- **Queries:** `getAllRecords()`, `countRecords()`, `recordExists()`
- **Time:** `dateInPast()`, `dateInFuture()`, `wait()`
- **Assertions:** `assertDatesApproximatelyEqual()`

**Import from:** `@test-helpers/database/*` (NEVER use relative imports)

**Full API:** [tests/**helpers**/database/readme.md](../tests/__helpers__/database/readme.md)

---

## Mocking

| ✅ DO Mock                                     | ❌ DON'T Mock                | Why                          |
| ---------------------------------------------- | ---------------------------- | ---------------------------- |
| Native modules (react-native-mmkv, expo-asset) | Your business logic          | Defeats purpose of testing   |
| Network calls (Supabase, API clients)          | Database models              | Need to test real behavior   |
| File system operations                         | WatermelonDB queries         | Testing core functionality   |
| Third-party SDKs (Sentry, analytics)           | Utilities (unless expensive) | Keep tests fast and reliable |

**Rule:** Mock external dependencies, test internal code.

**Mock Types:**

- **Automatic** (`__mocks__/module-name.js`) - Jest auto-discovers, no config needed
- **Manual** (`jest.setup.js`) - Configure once, applies to all tests
- **Per-Test** (top of test file) - Specific to one test suite

**Critical:** ALWAYS `jest.clearAllMocks()` in `beforeEach` to prevent test pollution

**Current Mocks Inventory:**

| Module                  | Location                         | Mock Type | Purpose                 | Example Usage                         |
| ----------------------- | -------------------------------- | --------- | ----------------------- | ------------------------------------- |
| `react-native-mmkv`     | `__mocks__/react-native-mmkv.js` | Automatic | In-memory storage (Map) | Storage tests without native module   |
| `expo-asset`            | `__mocks__/expo-asset.js`        | Automatic | Mock Asset.loadAsync()  | Test asset loading without files      |
| `@supabase/supabase-js` | `jest.setup.js`                  | Manual    | Mock auth & API calls   | Test without real Supabase connection |
| `@sentry/react-native`  | `jest.setup.js`                  | Manual    | Mock error tracking     | Test without sending errors to Sentry |

**Adding New Mocks:**

1. **Automatic:** Create `__mocks__/module-name.js`
2. **Manual:** Add to `jest.setup.js`
3. **Document:** Update this table

---

## Manual E2E Testing

**Why Manual First:** Discover unknowns → Faster feedback (5 min vs 2 days Maestro setup) → Learn what to automate

**Philosophy:** Manual exploration → Document findings → Automate validated flows (Phase 3+)

---

**Critical Scenarios (MUST TEST - Cannot test in Jest):**

**Sync Protocol Validation:**

- Scenario 1: Create Offline → Sync → Verify Remote
- Scenario 2: Update → Sync → Verify Timestamp
- Scenario 3: Soft Delete → Sync → Verify Status
- Scenario 4: Pull Changes from Server

**Offline CRUD:**

- Scenario 5: Create Workout Offline
- Scenario 6: Update Workout Offline
- Scenario 7: Delete Workout Offline

**Migrations:**

- Scenario 8: Schema Migration

**Detailed execution steps:** See `tests/e2e/manual/` directory

**Bug Reporting:** Document scenario number, environment, expected vs actual behavior, reproduction steps, impact level

---

## Troubleshooting

| Error Message                                                     | Root Cause                                                             | Fix                                                                                                                                                                                     | Prevention                                 |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `Cannot find module '@test-helpers/...'`                          | Alias not configured in `jest.config.js` or `tsconfig.json`            | Add to `jest.config.js` → `moduleNameMapper: { '^@test-helpers/(.*)': '<rootDir>/tests/__helpers__/$1' }` and `tsconfig.json` → `paths: { "@test-helpers/*": ["tests/__helpers__/*"] }` | Always use aliases, never relative imports |
| `LokiJS: Table 'workouts' not found`                              | Database not initialized in `beforeEach`                               | Add `database = createTestDatabase()` in `beforeEach`                                                                                                                                   | Always create database before each test    |
| `Test IDs are inconsistent between runs`                          | `resetTestIdCounter()` not called                                      | Add `resetTestIdCounter()` in `beforeEach` AFTER `createTestDatabase()`                                                                                                                 | ALWAYS reset counter in `beforeEach`       |
| `Query failed: no such column: _changed`                          | Trying to query sync protocol columns in Jest (LokiJS doesn't support) | Remove sync queries from Jest tests. Move to Manual E2E tests on real device                                                                                                            | Never query `_changed`, `_status` in Jest  |
| `Tests timeout after 5+ seconds`                                  | Database not cleaned up, memory leak                                   | Add `await cleanupTestDatabase(database)` in `afterEach`                                                                                                                                | ALWAYS clean up in `afterEach`             |
| `Mock not being used (real module called)`                        | Mock file location incorrect or filename mismatch                      | Ensure mock at `__mocks__/exact-module-name.js` (filename MUST match package name exactly)                                                                                              | Check `__mocks__/` directory structure     |
| `TypeError: mockFn.mockResolvedValue is not a function`           | Function not mocked with `jest.fn()`                                   | Replace with `jest.fn()`: `const mockFn = jest.fn();` then `mockFn.mockResolvedValue('result')`                                                                                         | Always create mocks with `jest.fn()`       |
| `expect(received).toHaveLength() - received has type 'undefined'` | Query returned undefined, likely wrong table name                      | Check table name matches schema: `database.get('workouts')` not `database.get('workout')`                                                                                               | Use `getAllRecords()` helper for debugging |
| `Database is closed` error in tests                               | Trying to use database after cleanup                                   | Ensure all async operations complete before `afterEach`. Use `await` on all promises                                                                                                    | Always `await` database operations         |

---

## Current Test Coverage

| Metric                      | Value  | Target        | Status  |
| --------------------------- | ------ | ------------- | ------- |
| **Total Tests**             | 37     | 50+ (Phase 1) | 🟡 74%  |
| **Database Layer Coverage** | 60-65% | 80%           | 🟡 75%  |
| **Test Execution Time**     | ~5s    | <10s          | ✅ 100% |

**Covered:** CRUD, queries (Q.where, Q.sortBy), relationships, timestamps
**NOT Covered (E2E only):** Sync protocol (`_changed`, `_status`), migrations, network ops

**Models:**

| Model           | Tests    | Coverage | Priority                      |
| --------------- | -------- | -------- | ----------------------------- |
| Workout         | 15 tests | ~70%     | ✅ Good                       |
| Exercise        | 10 tests | ~60%     | Increase to 80%               |
| ExerciseSet     | 12 tests | ~65%     | Increase to 80%               |
| WorkoutExercise | 0 tests  | 0%       | ❌ Implement (junction table) |
| User            | 0 tests  | 0%       | ❌ Implement (auth)           |

**View coverage:** `npm test -- --coverage` → `open coverage/lcov-report/index.html`

---

## Test Infrastructure

### Directory Structure

```
tests/
├── __helpers__/              # Reusable test utilities
│   └── database/
│       ├── test-database.ts  # LokiJS setup & teardown
│       ├── factories.ts      # createTestWorkout, createTestExercise, etc.
│       ├── queries.ts        # getAllRecords, countRecords, etc.
│       ├── time.ts           # wait, dateInPast, dateInFuture
│       ├── assertions.ts     # assertDatesApproximatelyEqual, etc.
│       └── readme.md         # Helper documentation
│
├── fixtures/                 # Static test data (JSON)
│   ├── database/
│   │   ├── workouts.json     # Sample workout data
│   │   └── exercises.json    # Sample exercise data
│   ├── users/
│   │   └── sample-users.json # Test user personas
│   └── readme.md             # Fixtures documentation
│
├── e2e/                      # E2E test documentation
│   └── manual/
│       ├── offline-crud.md   # Offline CRUD scenarios
│       └── sync-checklist.md # Sync protocol validation
│
└── readme.md                 # Infrastructure overview
```

**Navigation:** Each directory has `readme.md` explaining contents and usage.

---

### Quick Navigation Table

| Path                               | Purpose                 | Key Files                                        | When to Use                      |
| ---------------------------------- | ----------------------- | ------------------------------------------------ | -------------------------------- |
| `tests/__helpers__/database/`      | Database test utilities | `test-database.ts`, `factories.ts`, `queries.ts` | Every unit test (import helpers) |
| `tests/fixtures/database/`         | Sample test data        | `workouts.json`, `exercises.json`                | Testing with realistic data      |
| `tests/e2e/manual/`                | E2E scenario docs       | `offline-crud.md`, `sync-checklist.md`           | Manual testing on device         |
| `src/services/database/__tests__/` | Unit tests              | `workouts.test.ts`, `exercises.test.ts`          | Testing database operations      |
| `__mocks__/`                       | Jest mocks              | `react-native-mmkv.js`, `expo-asset.js`          | Auto-discovered by Jest          |

**Full Documentation:** See [tests/readme.md](../tests/readme.md), [tests/**helpers**/database/readme.md](../tests/__helpers__/database/readme.md)

---

### Why **mocks** at Root? (Not in tests/)

**Structure principle:**

```
project-root/
├── __mocks__/              ← External dependencies (Jest auto-discovery)
│   ├── react-native-mmkv.js
│   └── expo-asset.js
│
└── tests/
    ├── __helpers__/        ← Internal test utilities
    └── fixtures/           ← Static test data
```

**Distinction:**

| Location             | Purpose                          | What Goes Here                      | Example                                                    |
| -------------------- | -------------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| `__mocks__/` (root)  | Mock **external dependencies**   | Packages from `node_modules`        | `react-native-mmkv`, `expo-asset`, `@supabase/supabase-js` |
| `tests/__helpers__/` | **Internal utilities** for tests | Test factories, queries, assertions | `createTestWorkout()`, `countRecords()`                    |
| `tests/fixtures/`    | **Static test data**             | JSON files, sample data             | `workouts.json`, `users.json`                              |

**Why root for **mocks**?**

1. **Jest Convention** - Jest auto-discovers mocks in `__mocks__/` adjacent to `node_modules` (no config needed)
2. **Semantic Clarity** - Clear separation: external (mocks) vs internal (helpers) vs data (fixtures)
3. **Standard Practice** - Follows Jest official docs recommendation

**If moved to tests/**mocks**/:**

- ❌ Jest won't auto-discover
- ❌ Need manual `moduleNameMapper` config for each mock
- ❌ Breaks Jest convention

**Reference:** [Jest Manual Mocks](https://jestjs.io/docs/manual-mocks)

---

## Decision Records

**Q: Why Three-Tier Testing?**
A: Speed vs Confidence. Unit (5s, medium confidence) → Manual E2E (15-20 min, high confidence) → Maestro (2-5 min automated, Phase 3+). Progressive validation strategy.

**Q: Why Jest + LokiJS (not Real SQLite)?**
A: Jest runs in Node.js. SQLite requires React Native JSI (not available in Node). LokiJS works in Node.js. **Limitation:** Cannot test sync protocol (`_changed`, `_status`) → Use Manual E2E for sync.

**Q: Why Manual E2E Before Maestro?**
A: Discover unknowns first (5 min) vs Maestro setup (1-2 days). Manual finds edge cases → Automate validated flows only (Phase 3+).

**Q: Why Not Mock WatermelonDB?**
A: Need real database behavior (queries, relationships, transactions). LokiJS provides real behavior without React Native. **Philosophy:** Test internal code with real behavior, mock external dependencies only.

---

## Cross-References & Resources

### Internal Documentation

| Document                                                                        | Purpose                       | Key Sections                                         |
| ------------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------- |
| [CLAUDE.md](../.claude/CLAUDE.md)                                               | Project overview, conventions | Tech stack, Testing strategy, Documentation map      |
| [TASKS.md](./TASKS.md)                                                          | Project roadmap               | Phase 0.5 (testing tasks), Kanban board              |
| [DATABASE.md](./DATABASE.md)                                                    | WatermelonDB guide            | Schema, models, CRUD operations, relationships       |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                                            | Code structure                | Folder organization, import patterns, conventions    |
| [TECHNICAL.md](./TECHNICAL.md)                                                  | Architecture Decision Records | ADRs for tech choices, testing decisions             |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                                            | Development workflow          | Git workflow, pre-commit hooks, commands             |
| [tests/readme.md](../tests/readme.md)                                           | Test infrastructure overview  | Helper organization, fixtures, mocks                 |
| [tests/**helpers**/database/readme.md](../tests/__helpers__/database/readme.md) | Helper API reference          | Complete API docs for factories, queries, assertions |
| [tests/fixtures/readme.md](../tests/fixtures/readme.md)                         | Fixtures guide                | Using fixtures, creating new fixtures                |
| [**mocks**/README.md](../__mocks__/README.md)                                   | Mock inventory                | All mocked modules, usage examples                   |

---

### External Resources

| Resource                         | URL                                                                         | Description                                      |
| -------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ |
| **Jest Documentation**           | https://jestjs.io/                                                          | Official Jest docs (setup, API, guides)          |
| **Jest React Native Guide**      | https://jestjs.io/docs/tutorial-react-native                                | Testing React Native apps with Jest              |
| **Jest Mock Functions**          | https://jestjs.io/docs/mock-functions                                       | Mocking guide (jest.fn, mockResolvedValue, etc.) |
| **Jest Manual Mocks**            | https://jestjs.io/docs/manual-mocks                                         | Creating manual mocks in `__mocks__/`            |
| **WatermelonDB Testing**         | https://nozbe.github.io/WatermelonDB/Advanced/Testing.html                  | Official WatermelonDB testing guide              |
| **WatermelonDB LokiJS Adapter**  | https://nozbe.github.io/WatermelonDB/Advanced/Adapters.html#loki-js-adapter | Using LokiJS for tests                           |
| **WatermelonDB Sync**            | https://nozbe.github.io/WatermelonDB/Advanced/Sync.html                     | Sync protocol documentation                      |
| **Expo Dev Builds**              | https://docs.expo.dev/develop/development-builds/introduction/              | Setting up development builds                    |
| **Testing on Device**            | https://docs.expo.dev/develop/development-builds/use-development-builds/    | Running tests on real devices                    |
| **Maestro Getting Started**      | https://maestro.mobile.dev/getting-started                                  | E2E automation framework (Phase 3+)              |
| **Maestro React Native**         | https://maestro.mobile.dev/platform-support/react-native                    | React Native support in Maestro                  |
| **React Native Testing Library** | https://callstack.github.io/react-native-testing-library/                   | Testing React Native components                  |
| **Testing Library Cheatsheet**   | https://testing-library.com/docs/react-testing-library/cheatsheet           | Quick reference for queries and assertions       |

---

**Last Updated:** 2025-11-01
**Version:** 2.0 (Consolidated from `docs/testing/readme.md`)
**Maintainer:** Patrick Patenaude + AI Agents
