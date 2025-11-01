# Testing Documentation

**Context:** Comprehensive testing strategy for Halterofit
**Purpose:** Complete testing reference for AI agents and developers
**Audience:** Solo dev + AI agents

---

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm test -- --watch

# Specific file
npm test -- workouts.test.ts

# With coverage
npm test -- --coverage

# Debug mode
npm test -- --verbose --detectOpenHandles

# Filter by name
npm test -- --testNamePattern="creates workout"
```

### Pre-Commit Checklist

```bash
npm run type-check  # TypeScript verification
npm test            # All tests passing
npm run lint:fix    # Fix linting issues
npm run format      # Format code
/commit             # Smart commit (use slash command)
```

---

## 🧪 Testing Strategy: Three-Tier Approach

```
┌─────────────────────────────────────────────────────────────┐
│ Unit Tests (Jest + LokiJS)                                  │
│ ✅ Active: 37 tests passing                                 │
│ 📍 Coverage: 60-65% database layer                          │
│ ⚡ Fast: ~50-100ms per test                                 │
│ 🎯 What: CRUD, queries, relationships, business logic       │
│ ❌ Cannot: Test sync protocol (_changed, _status)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Manual E2E Tests (Expo Dev Build) - Phase 1                │
│ 📍 Environment: Real device + SQLite + JSI                  │
│ ⚡ Slow: ~15-20 min per session                             │
│ 🎯 What: Sync protocol, migrations, offline CRUD            │
│ ✅ Can: Test EVERYTHING (real environment)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Maestro E2E Automation - Phase 3+ (Not Yet Implemented)    │
│ 📅 Future: Automate validated manual flows                  │
│ 🎯 What: Complete user journeys (create → sync → verify)    │
└─────────────────────────────────────────────────────────────┘
```

### Progressive Validation Philosophy

1. **Unit Tests** - Fast feedback loop, every commit
2. **Manual E2E** - Validate unknowns, discover edge cases
3. **Maestro** - Automate known flows (Phase 3+)

---

## 📝 Unit Testing

### Test Template

```typescript
// src/services/database/__tests__/my-feature.test.ts
import { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';
import { createTestDatabase, cleanupTestDatabase } from '@test-helpers/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@test-helpers/database/factories';
import { getAllRecords, countRecords } from '@test-helpers/database/queries';
import { wait, dateInPast } from '@test-helpers/database/time';
import { assertDatesApproximatelyEqual } from '@test-helpers/database/assertions';

describe('My Feature', () => {
  let database: Database;

  beforeEach(() => {
    database = createTestDatabase();
    resetTestIdCounter(); // CRITICAL: Always reset
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  test('creates workout', async () => {
    const workout = await createTestWorkout(database, {
      title: 'Test Workout',
    });

    expect(workout.title).toBe('Test Workout');
    expect(workout).toBeValidWorkout(); // Custom matcher
  });
});
```

### What to Test (Unit)

**✅ DO Test:**

- CRUD operations (create, read, update, delete)
- Queries (filtering, sorting, pagination, counting)
- Relationships (belongs_to, has_many, children)
- Business logic (computed properties, validation, state transitions)
- Performance (query time with large datasets)

**❌ DON'T Test (E2E Only):**

- ❌ Sync protocol (`_changed`, `_status`, `synchronize()`)
- ❌ Migrations (schema changes, data migrations)
- ❌ Push/pull to backend
- ❌ Conflict resolution

**Why:** LokiJS adapter doesn't support sync protocol or real SQLite migrations.
**Solution:** Use manual E2E tests on real device.

### Import Patterns

**Always use `@test-helpers` alias:**

```typescript
// ✅ GOOD: Use aliases
import { createTestDatabase } from '@test-helpers/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@test-helpers/database/factories';
import { getAllRecords, countRecords } from '@test-helpers/database/queries';
import { wait, dateInPast } from '@test-helpers/database/time';
import { assertDatesApproximatelyEqual } from '@test-helpers/database/assertions';
import workoutFixtures from '@tests/fixtures/database/workouts.json';

// ❌ BAD: Relative imports
import { createTestDatabase } from '../../../tests/__helpers__/database/test-database';
```

### Test Helpers Reference

See [tests/**helpers**/database/readme.md](../../tests/__helpers__/database/readme.md) for complete reference.

**Quick Reference:**

- **Factories:** `createTestWorkout`, `createTestExercise`, `createTestExerciseSet`, `createMultipleRecords`
- **Queries:** `getAllRecords`, `getRecordById`, `countRecords`, `recordExists`
- **Time:** `wait`, `dateInPast`, `dateInFuture`
- **Assertions:** `assertDatesApproximatelyEqual`, `measureExecutionTime`

---

## 🎭 Mocking

### Mocking Strategy

**✅ Mock External Dependencies:**

- Native modules (react-native-mmkv, expo-asset)
- Network calls (Supabase, API clients)
- File system operations
- Third-party SDKs

**❌ Don't Mock Internal Code:**

- Your business logic (defeats testing purpose)
- Database models (test real behavior)
- Utilities (unless expensive operations)

### Current Mocks

**Location:** `__mocks__/` directory (auto-discovered by Jest)

- `expo-asset.js` - Expo Asset API
- `react-native-mmkv.js` - MMKV Storage (in-memory mock)
- `@supabase/supabase-js` - Mocked in jest.setup.js

### Mock Types

**1. Automatic Mocks (`__mocks__/`):**

```javascript
// __mocks__/my-native-module.js
const mockFunction = jest.fn(() => 'mock-value');
module.exports = { mockFunction };
```

Jest auto-discovers these files - no manual setup needed.

**2. Manual Mocks (jest.setup.js):**

```javascript
// jest.setup.js
jest.mock('@/services/supabase/client'); // All tests use this
```

**3. Per-Test Mocks:**

```typescript
jest.mock('@/services/api/client', () => ({
  fetchWorkouts: jest.fn(() => Promise.resolve(mockData)),
}));
```

### Essential Mock Patterns

```typescript
// ALWAYS reset mocks in beforeEach
beforeEach(() => {
  jest.clearAllMocks(); // Clear call history
});

// Mock async functions
const mockFn = jest.fn(() => Promise.resolve('success'));
mockFn.mockResolvedValue('success');
mockFn.mockRejectedValue(new Error('failed'));

// Assert mock calls
expect(MMKV.set).toHaveBeenCalledWith('key', 'value');
expect(MMKV.set).toHaveBeenCalledTimes(1);
```

---

## 🧑‍💻 Manual E2E Testing

### Why Manual First?

- **Discover unknowns:** Find edge cases before automating
- **Faster feedback:** Manual = immediate, Maestro setup = 1-2 days
- **Better automation:** Learn what to automate from manual tests

### What to Test (E2E)

**Critical: Sync Protocol Validation**

1. **Create Offline → Sync → Verify Remote**
   - Create workout offline (airplane mode ON)
   - Go online, run sync
   - Verify workout in Supabase dashboard
   - Verify `_changed` timestamp set correctly

2. **Update → Sync → Verify Timestamp**
   - Update workout
   - Run sync
   - Verify `_changed` updated

3. **Soft Delete → Sync → Verify Status**
   - Mark workout as deleted
   - Verify `_status = 'deleted'` in Supabase
   - Verify excluded from local queries

4. **Pull Changes from Server**
   - Create on device A → Sync
   - Pull on device B → Verify appears

**High Priority: Offline CRUD**

- Create/update/delete workout offline
- Verify persisted locally
- Verify relationships intact
- Go online → Sync → Verify remote

**Execution:**

1. `npm start` - Start Expo Dev Build
2. Launch on device (scan QR or press 'i'/'a')
3. Execute scenarios manually
4. Document failures as GitHub issues

---

## 🚨 Troubleshooting

### "Cannot find module '@test-helpers/...'"

**Cause:** Alias not configured

**Fix:**

```javascript
// jest.config.js
moduleNameMapper: {
  '^@test-helpers/(.*)': '<rootDir>/tests/__helpers__/$1',
}

// tsconfig.json
"paths": {
  "@test-helpers/*": ["tests/__helpers__/*"]
}
```

### "LokiJS: Table not found"

**Cause:** Database not initialized

**Fix:**

```typescript
beforeEach(() => {
  database = createTestDatabase(); // ✅ Create database
  resetTestIdCounter();
});
```

### "Test IDs are inconsistent"

**Cause:** `resetTestIdCounter()` not called

**Fix:**

```typescript
beforeEach(() => {
  database = createTestDatabase();
  resetTestIdCounter(); // ✅ CRITICAL: Reset before each test
});
```

### "Query failed: no such column: \_changed"

**Cause:** Trying to query sync protocol columns in Jest

**Fix:** Remove sync queries from Jest tests, move to E2E

```typescript
// ❌ BAD: Sync protocol in Jest
const changes = await database
  .get('workouts')
  .query(Q.where('_changed', Q.gt(timestamp)))
  .fetch();

// ✅ GOOD: Regular columns only
const workouts = await database
  .get('workouts')
  .query(Q.where('completed_at', Q.notEq(null)))
  .fetch();
```

### "Tests timeout after 5+ seconds"

**Cause:** Database not cleaned up

**Fix:**

```typescript
afterEach(async () => {
  await cleanupTestDatabase(database); // ✅ Always clean up
});
```

### "Mock not being used"

**Cause:** Mock file location incorrect

**Fix:** Ensure mock at `__mocks__/module-name.js` (exact filename match)

---

## 📊 Current Test Coverage

### Database Layer: 60-65%

**What's Covered:**

- ✅ CRUD operations
- ✅ Queries (filtering, sorting, pagination)
- ✅ Relationships (workout → exercises → sets)
- ✅ Timestamps (created_at, updated_at)

**What's NOT Covered:**

- ❌ Sync protocol (\_changed, \_status) - Manual E2E only
- ❌ Migrations - Manual E2E only

**Models Tested:**

- ✅ Workout (15 tests)
- ✅ Exercise (10 tests)
- ✅ ExerciseSet (12 tests)
- 🚧 WorkoutExercise (TODO)
- 🚧 User (TODO)

### Viewing Coverage

```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

---

## 🏗️ Test Infrastructure

### Directory Structure

```
tests/
├── __helpers__/              # Test helpers (factories, queries, time, assertions)
│   └── database/
│       ├── test-database.ts  # LokiJS setup
│       ├── factories.ts      # createTestWorkout, createTestExercise, etc.
│       ├── queries.ts        # getAllRecords, countRecords, etc.
│       ├── time.ts           # wait, dateInPast, dateInFuture
│       └── assertions.ts     # assertDatesApproximatelyEqual, etc.
│
├── fixtures/                 # Static test data (JSON)
│   ├── database/
│   │   ├── workouts.json     # Sample workouts
│   │   └── exercises.json    # Sample exercises
│   └── users/
│       └── sample-users.json # Test user personas
│
└── readme.md                 # Infrastructure overview
```

**See Also:**

- [tests/readme.md](../../tests/readme.md) - Infrastructure overview
- [tests/**helpers**/database/readme.md](../../tests/__helpers__/database/readme.md) - Helper reference
- [tests/fixtures/readme.md](../../tests/fixtures/readme.md) - Fixtures guide
- [**mocks**/README.md](../../__mocks__/README.md) - Mock inventory

---

## 🎯 Decision Records

### Why Three-Tier Testing?

**Question:** Why not just E2E tests for everything?

**Answer:** Speed vs Confidence Trade-off

| Test Type      | Speed              | Confidence                  | Cost        |
| -------------- | ------------------ | --------------------------- | ----------- |
| **Unit**       | ⚡ 5s for 37 tests | 🟡 Medium (LokiJS ≠ SQLite) | 💰 Low      |
| **Manual E2E** | 🐌 15-20 min       | ✅ High (real environment)  | 💰💰 Medium |
| **Maestro**    | 🟢 2-5 min         | ✅ High (real device)       | 💰💰💰 High |

**Strategy:** Use all three in progression (unit → manual E2E → automated E2E)

### Why Jest + LokiJS (not Real SQLite)?

**Question:** Why not test with real SQLite in Jest?

**Answer:** SQLite requires React Native JSI (not available in Node.js)

**Reasoning:**

1. Jest runs in Node.js environment
2. SQLite adapter requires React Native JSI (JavaScript Interface)
3. LokiJS is in-memory, works in Node.js
4. Production uses SQLite, tests use LokiJS (adapter pattern)

**Limitation:** LokiJS cannot test sync protocol (\_changed, \_status)
**Mitigation:** Manual E2E tests on real device with real SQLite

---

## 📖 Cross-References

### Test Infrastructure

- **Tests Root:** [tests/readme.md](../../tests/readme.md)
- **Database Helpers:** [tests/**helpers**/database/readme.md](../../tests/__helpers__/database/readme.md)
- **Fixtures:** [tests/fixtures/readme.md](../../tests/fixtures/readme.md)
- **Mocks:** [**mocks**/README.md](../../__mocks__/README.md)

### Project Docs

- **Database Guide:** [docs/DATABASE.md](../DATABASE.md) - WatermelonDB setup
- **Architecture:** [docs/ARCHITECTURE.md](../ARCHITECTURE.md) - Code structure
- **Technical:** [docs/TECHNICAL.md](../TECHNICAL.md) - ADRs
- **Contributing:** [docs/CONTRIBUTING.md](../CONTRIBUTING.md) - Workflow

---

## 🔗 Resources

### Jest

- Official Docs: https://jestjs.io/
- React Native Testing: https://jestjs.io/docs/tutorial-react-native
- Mocking: https://jestjs.io/docs/mock-functions
- Manual Mocks: https://jestjs.io/docs/manual-mocks

### WatermelonDB

- Testing Guide: https://nozbe.github.io/WatermelonDB/Advanced/Testing.html
- LokiJS Adapter: https://nozbe.github.io/WatermelonDB/Advanced/Adapters.html#loki-js-adapter
- Sync Protocol: https://nozbe.github.io/WatermelonDB/Advanced/Sync.html

### Expo Dev Build

- Dev Builds: https://docs.expo.dev/develop/development-builds/introduction/
- Testing on Device: https://docs.expo.dev/develop/development-builds/use-development-builds/

### Maestro (Phase 3+)

- Getting Started: https://maestro.mobile.dev/getting-started
- React Native Support: https://maestro.mobile.dev/platform-support/react-native
- YAML Reference: https://maestro.mobile.dev/api-reference/commands

### React Native Testing Library

- Docs: https://callstack.github.io/react-native-testing-library/
- Cheatsheet: https://testing-library.com/docs/react-testing-library/cheatsheet
