# Test Infrastructure

Centralized test infrastructure for Halterofit (Phase 0.6 - Reorganized).

## Structure

```
__tests__/
├── unit/                       # Unit tests (colocated by feature)
│   ├── services/
│   │   ├── database/           # Database CRUD tests
│   │   └── auth/               # Auth tests (Phase 1+)
│   └── utils/                  # Utility function tests
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
    ├── database/
    │   └── workouts.json
    └── users/
        └── sample-users.json
```

## Quick Start

```bash
# Run all unit tests
npm test

# Run integration tests (sync scenarios)
npm run test:integration

# Watch mode (unit tests)
npm run test:watch

# Watch mode (integration tests)
npm run test:integration:watch

# Coverage report
npm run test:coverage

# Run specific test file
npm test -- workouts.test.ts
```

## Module Aliases

Use these aliases instead of relative imports:

```typescript
// ✅ GOOD: Use aliases
import { createTestWorkout } from '@test-helpers/database/factories';
import { getAllRecords } from '@test-helpers/database/queries';
import workoutFixtures from '@tests/fixtures/database/workouts.json';

// ❌ BAD: Relative imports
import { createTestWorkout } from '../../../__helpers__/database/factories';
```

## Test Conventions

### Unit Tests

- **Location**: `__tests__/unit/**/*.test.ts`
- **Pattern**: Feature-based organization (mirror `src/` structure)
- **Purpose**: Fast feedback on business logic

### Integration Tests

- **Location**: `__tests__/integration/**/*.test.ts`
- **Pattern**: Workflow-based organization (sync scenarios, offline-first)
- **Purpose**: Test multiple services working together with mocked APIs
- **Infrastructure**: msw (Mock Service Worker) + network simulator + LokiJS
- **Run**: `npm run test:integration`

**Current Coverage (Phase 1):**
- ✅ sync-basic.test.ts - 11 tests (pull/push/bidirectional sync)
- ✅ conflict-resolution.test.ts - 11 tests (last write wins, multi-device)
- ✅ schema-validation.test.ts - 16 tests (Zod validation for sync protocol)
- **Total: 38 integration tests**

**Key Helpers:**
- `@test-helpers/network/mock-supabase` - Mock Supabase RPC endpoints
- `@test-helpers/network/network-simulator` - Simulate offline/slow/intermittent connections
- `@test-helpers/network/sync-fixtures` - Generate realistic sync test data

**Important Limitation:**
Integration tests use LokiJS (in-memory), NOT Real SQLite. WatermelonDB sync protocol columns (`_changed`, `_status`) and `synchronize()` method require native SQLite module, only available in E2E tests. See [integration/README.md](integration/README.md) for details.

### Helpers

- **Location**: `__tests__/__helpers__/**/*.ts`
- **Pattern**: Shared utilities for all tests
- **Import**: Always use `@test-helpers/*` alias

**Database Helpers:** (`@test-helpers/database/*`)
- `test-database.ts` - LokiJS setup/teardown
- `factories.ts` - createTestWorkout, createTestExercise
- `queries.ts` - getAllRecords, countRecords
- `time.ts` - wait, dateInPast, dateInFuture
- `assertions.ts` - assertDatesApproximatelyEqual

**Network Helpers:** (`@test-helpers/network/*`)
- `mock-supabase.ts` - Mock Supabase backend with in-memory store
- `network-simulator.ts` - Simulate offline/slow/intermittent connections
- `sync-fixtures.ts` - Generate realistic sync test data (workouts, conflicts, edge cases)

### Fixtures

- **Location**: `__tests__/fixtures/**/*.json`
- **Pattern**: Static test data
- **Import**: Always use `@tests/*` alias

## Common Patterns

### Standard Test Setup

```typescript
import { createTestDatabase, cleanupTestDatabase } from '@test-helpers/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@test-helpers/database/factories';

describe('Feature Tests', () => {
  let database: Database;

  beforeAll(() => {
    database = createTestDatabase(); // Create ONCE per suite
    resetTestIdCounter(); // CRITICAL: Reset IDs for determinism
  });

  afterEach(async () => {
    await cleanupTestDatabase(database); // Reset data between tests
  });

  it('tests something', async () => {
    const workout = await createTestWorkout(database);
    expect(workout).toBeDefined();
  });
});
```

**Important:** Use `beforeAll` (not `beforeEach`) to create a shared database instance. This prevents Jest from hanging by creating worker handles only once per test suite instead of for every test. See [Troubleshooting](#database-lifecycle-pattern) for details.

### Custom Matchers

```typescript
// Available custom matchers (from jest.setup.js)
expect(workout).toBeValidWorkout();
expect(exercise).toBeValidExercise();
```

## Troubleshooting

### "Cannot find module '@test-helpers/...'"

- Check `jest.config.js` has correct `moduleNameMapper`
- Check `tsconfig.json` has correct `paths`

### "Test IDs inconsistent between runs"

- Ensure `resetTestIdCounter()` is called in `beforeAll` (not `beforeEach`)
- Call it AFTER `createTestDatabase()`

### "Tests timeout"

- Add `await cleanupTestDatabase(database)` in `afterEach`
- Ensure all async operations complete

### Database Lifecycle Pattern

**Problem:** Jest hangs or won't exit after tests complete

**Root Cause:** Creating too many database instances creates excessive worker handles that Jest waits for

**Solution:** Use shared database instance pattern (one DB per test suite):

```typescript
// ✅ CORRECT: Create once per suite
beforeAll(() => {
  database = createTestDatabase(); // Worker created ONCE
  resetTestIdCounter();
});

// ❌ WRONG: Create for every test
beforeEach(() => {
  database = createTestDatabase(); // Worker created 36 times!
});
```

**Why This Works:**

- LokiJS adapter doesn't provide a `close()` method (by design)
- Shared instance creates worker handles only once per suite (5 workers for 5 suites instead of 36)
- Data isolation maintained via `cleanupTestDatabase()` in `afterEach`
- Jest's garbage collection handles cleanup when suite ends
- Industry-standard pattern for in-memory database testing

**Note on Worker Warning:**

You may still see this warning:

```
A worker process has failed to exit gracefully and has been force exited.
```

**This is expected and actually a GOOD sign:**

- ✅ Tests complete successfully (exit code 0)
- ✅ Tests run in ~5 seconds
- ✅ Jest exits cleanly (no hanging)
- ⚠️ Warning appears because LokiJS workers don't have close() methods
- 💡 Without `--forceExit`, real memory leaks will now be detected!

The warning indicates Jest is properly detecting open handles (the 5 LokiJS workers). This is infinitely better than using `--forceExit` which would mask REAL leaks in your test code.

## Resources

- [TESTING.md](../docs/TESTING.md) - Complete testing guide
- [Helper API](../tests/__helpers__/database/readme.md) - Helper functions reference
- [DATABASE.md](../docs/DATABASE.md) - WatermelonDB setup

## Phase Roadmap

- ✅ **Phase 0.6**: Unit tests (36 tests, 60-65% database coverage)
- ✅ **Phase 1 (Current)**: Integration tests - Sync infrastructure (38 tests)
  - ✅ msw + network simulator + sync fixtures
  - ✅ Basic sync operations (pull/push/bidirectional)
  - ✅ Conflict resolution (last write wins, multi-device)
  - ✅ Schema validation (Zod for sync protocol)
  - 🔄 Offline scenarios (Phase 3 - next)
- 🔄 **Phase 2-3**: Expand integration coverage (auth, workouts, tracking)
- 🔄 **Phase 4-5**: Maestro E2E automation
