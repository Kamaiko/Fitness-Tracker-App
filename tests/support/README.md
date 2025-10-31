# tests/support/ - Reusable Test Helpers

**Context:** Centralized helpers accessible from ALL test types (Phase 0.5.28 refactor)
**Purpose:** DRY principle - write once, use everywhere (unit/integration/E2E tests)
**Constraints:** Domain-scoped organization (database/, api/, ui/ - future expansion)

## Quick Reference

```typescript
// Import from ANY test file using @tests alias
import { createTestDatabase } from '@tests/support/database/test-database';
import { createTestWorkout } from '@tests/support/database/factories';
import { getAllRecords } from '@tests/support/database/assertions';
```

## Directory Structure

```
tests/support/
└── database/           # Database test helpers (~1000 lines)
    ├── README.md       # Database helpers documentation
    ├── test-database.ts    # LokiJS setup (~105 lines)
    ├── factories.ts        # Test data generators (~481 lines)
    └── assertions.ts       # ALL utilities (~446 lines)
```

## Current State (Phase 0.5)

**Only Database Helpers Exist:**

- Phase 0.5 = database layer foundation only
- No API helpers yet (Phase 1+)
- No UI helpers yet (Phase 2+)
- No E2E helpers yet (Phase 3+)

## Future Expansion Plan

### Phase 1+ (API Integration Tests)

```
tests/support/
├── database/           # Existing helpers
└── api/                # 🆕 API test helpers
    ├── README.md
    ├── mock-server.ts      # Mock API server setup
    ├── api-factories.ts    # API response generators
    └── api-assertions.ts   # HTTP assertions
```

### Phase 2+ (UI Component Tests)

```
tests/support/
├── database/
├── api/
└── ui/                 # 🆕 UI test helpers
    ├── README.md
    ├── render-helpers.ts   # Testing Library wrappers
    ├── ui-factories.ts     # Component prop generators
    └── ui-assertions.ts    # DOM assertions
```

### Phase 3+ (E2E Test Helpers)

```
tests/support/
├── database/
├── api/
├── ui/
└── e2e/                # 🆕 E2E helpers
    ├── README.md
    ├── maestro-helpers.ts  # Maestro utilities
    └── device-setup.ts     # Device config
```

## Decision Records

### Why NOT tests/support/shared/?

**Question:** Should we create `tests/support/shared/` for global helpers?

**Answer:** NO - YAGNI (You Aren't Gonna Need It) + Rule of Three

**Reasoning:**

1. **Current state:** Phase 0.5 = database domain ONLY
2. **No duplication:** Only 1 domain exists (no duplication across domains yet)
3. **Premature abstraction:** Creating `shared/` now = guessing future needs
4. **Rule of Three:** Extract to shared ONLY after 3+ domains duplicate helpers

**Future Extraction Trigger:**

- **IF** 3+ domains (database/, api/, ui/) duplicate the SAME helper
- **THEN** extract to `tests/__helpers__/` (NOT support/shared/)
- **Example:** `waitForCondition()` used in database, api, AND ui tests

**Example of Premature Abstraction:**

```
❌ BAD: Guessing future needs
tests/support/
├── shared/                 # Only 1-2 functions (mostly empty)
│   └── time-helpers.ts     # Only used by database tests
└── database/
    ├── test-database.ts
    ├── factories.ts
    └── assertions.ts       # Already has time helpers

✅ GOOD: Extract AFTER proven duplication
tests/
├── __helpers__/            # 🆕 Global helpers (after 3+ domains duplicate)
│   ├── time-helpers.ts     # Used by database, api, ui tests
│   └── polling-helpers.ts  # Used across multiple domains
└── support/
    ├── database/           # Database-specific only
    ├── api/                # API-specific only
    └── ui/                 # UI-specific only
```

### Why domain-scoped organization (database/, api/, ui/)?

**Answer:** Locality of Behavior + Clear Ownership

**Benefits:**

1. **Discoverability:** Database developers find helpers in `tests/support/database/`
2. **Isolation:** Changes to database helpers don't affect API tests
3. **Scalability:** Can add domains without restructuring existing helpers
4. **Clear ownership:** Each domain team owns their helper directory

**Alternative (rejected):**

```
❌ BAD: Organize by helper type (hard to find domain-specific helpers)
tests/support/
├── factories/              # Which domain?
│   ├── user-factory.ts     # Database or API?
│   └── workout-factory.ts
├── assertions/             # Which domain?
│   ├── db-assertions.ts    # Mix of domains
│   └── api-assertions.ts
└── setup/
    └── database-setup.ts

✅ GOOD: Organize by domain (clear ownership)
tests/support/
├── database/               # All database helpers here
│   ├── test-database.ts
│   ├── factories.ts
│   └── assertions.ts
└── api/                    # All API helpers here (Phase 1+)
    ├── mock-server.ts
    ├── factories.ts
    └── assertions.ts
```

## Import Patterns

### ✅ GOOD: Use @tests alias

```typescript
// From unit test (src/services/database/__tests__/workouts.test.ts)
import { createTestDatabase } from '@tests/support/database/test-database';

// From integration test (src/services/api/__tests__/sync.test.ts)
import { createTestWorkout } from '@tests/support/database/factories';

// From E2E test helper (tests/e2e/helpers/setup.ts)
import { getAllRecords } from '@tests/support/database/assertions';
```

### ❌ BAD: Relative imports

```typescript
// ❌ From unit test (fragile, breaks if test moves)
import { createTestDatabase } from '../../../tests/support/database/test-database';

// ❌ From E2E test (even worse - 6 levels deep)
import { createTestWorkout } from '../../../support/database/factories';
```

## Anti-Patterns

### ❌ BAD: Duplicating helpers across tests

```typescript
// src/services/database/__tests__/setup/factories.ts
export function createTestWorkout(db) { ... }

// src/services/api/__tests__/helpers/factories.ts
export function createTestWorkout(db) { ... } // ❌ DUPLICATE!
```

**Fix:** Centralize in `tests/support/database/factories.ts`

### ❌ BAD: Creating shared/ prematurely

```typescript
// tests/support/shared/time-helpers.ts
export function wait(ms) { ... } // Only used by 1 domain

// tests/support/database/assertions.ts
import { wait } from '../shared/time-helpers'; // ❌ Unnecessary abstraction
```

**Fix:** Keep in `database/assertions.ts` until 3+ domains duplicate

### ❌ BAD: Mixing domain helpers

```typescript
// tests/support/database/factories.ts
export function createTestWorkout(db) { ... }
export function createMockApiResponse(data) { ... } // ❌ API helper in database/!
```

**Fix:** Move API helpers to `tests/support/api/factories.ts` (Phase 1+)

## Cross-References

- **Test Root README:** [tests/README.md](../README.md) - Architecture overview
- **Database Helpers:** [database/README.md](./database/README.md) - Complete database helper guide
- **Unit Testing Guide:** [docs/testing/unit-guide.md](../../docs/testing/unit-guide.md)
- **Mocking Patterns:** [**mocks**/README.md](../../__mocks__/README.md)

## Migration Notes (Phase 0.5.28 Refactor)

**What Changed:**

```
BEFORE (scattered):
src/services/database/__tests__/
├── setup/                  # ❌ Only accessible from database tests
│   ├── test-database.ts
│   ├── factories.ts
│   └── test-utils.ts
└── workouts.test.ts

AFTER (centralized):
tests/support/
└── database/               # ✅ Accessible from ALL test types
    ├── test-database.ts    # Moved from src/services/database/__tests__/setup/
    ├── factories.ts        # Moved from src/services/database/__tests__/setup/
    └── assertions.ts       # Renamed from test-utils.ts

src/services/database/__tests__/
└── workouts.test.ts        # Imports from @tests/support/database/
```

**Benefits:**

- DRY: Write once, use everywhere
- Accessibility: E2E tests can now use database factories
- Scalability: Ready for API/UI helpers (Phase 1+)
- Maintainability: Single source of truth for each helper

## Usage Example

```typescript
// src/services/database/__tests__/workouts.test.ts
import { Database } from '@nozbe/watermelondb';
import { createTestDatabase, cleanupTestDatabase } from '@tests/support/database/test-database';
import { createTestWorkout, resetTestIdCounter } from '@tests/support/database/factories';
import { getAllRecords } from '@tests/support/database/assertions';

describe('Workout CRUD', () => {
  let database: Database;

  beforeEach(() => {
    database = createTestDatabase();
    resetTestIdCounter();
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  test('creates workout', async () => {
    const workout = await createTestWorkout(database, { title: 'Leg Day' });
    expect(workout.title).toBe('Leg Day');
  });
});
```
