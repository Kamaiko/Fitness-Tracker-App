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
# Run all tests
npm test

# Watch mode
npm run test:watch

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
- **Pattern**: Workflow-based organization
- **Purpose**: Test multiple services working together

### Helpers

- **Location**: `__tests__/__helpers__/**/*.ts`
- **Pattern**: Shared utilities for all tests
- **Import**: Always use `@test-helpers/*` alias

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

  beforeEach(() => {
    database = createTestDatabase();
    resetTestIdCounter(); // CRITICAL: Reset IDs for determinism
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  it('tests something', async () => {
    const workout = await createTestWorkout(database);
    expect(workout).toBeDefined();
  });
});
```

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

- Ensure `resetTestIdCounter()` is called in `beforeEach`
- Call it AFTER `createTestDatabase()`

### "Tests timeout"

- Add `await cleanupTestDatabase(database)` in `afterEach`
- Ensure all async operations complete

### Jest Worker Process Warning

When running `npm test`, you may see:

```
A worker process has failed to exit gracefully and has been force exited.
```

**This is expected behavior** with LokiJS (in-memory database):

- **Root cause**: LokiJS (in-memory adapter) doesn't have explicit connection cleanup, causing Jest workers to wait indefinitely for handles to close
- **Solution**: Tests use `--forceExit` flag to force worker termination after tests complete
- **Impact**: None - all tests pass in ~5 seconds
- **Without `--forceExit`**: Tests would hang indefinitely (20+ minutes observed in testing)

**Technical Details**: This is a known limitation when using in-memory database adapters with Jest. LokiJS maintains internal handles that Jest's worker processes cannot detect as "finished". The `--forceExit` flag is the recommended solution for this specific scenario.

## Resources

- [TESTING.md](../docs/TESTING.md) - Complete testing guide
- [Helper API](../tests/__helpers__/database/readme.md) - Helper functions reference
- [DATABASE.md](../docs/DATABASE.md) - WatermelonDB setup

## Phase Roadmap

- ✅ **Phase 0.6**: Unit tests (36 tests, 60-65% coverage)
- 🔄 **Phase 1**: Integration tests (auth, sync)
- 🔄 **Phase 2-3**: Expand coverage (workouts, tracking)
- 🔄 **Phase 4-5**: Maestro E2E automation
