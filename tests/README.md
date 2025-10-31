# tests/ - Test Infrastructure

**Context:** Centralized test helpers, fixtures, and E2E tests (Phase 0.5.28 refactor)
**Purpose:** Reusable testing infrastructure across ALL test types (unit/integration/E2E)
**Constraints:** Helpers use `@tests` alias (`import { createTestWorkout } from '@tests/support/database/factories'`)

## Quick Reference

```typescript
// Import pattern (from any test file)
import { createTestWorkout } from '@tests/support/database/factories';
import { getAllRecords } from '@tests/support/database/assertions';
import { createTestDatabase } from '@tests/support/database/test-database';
```

## Directory Structure

```
tests/
├── support/              # Reusable test helpers
│   └── database/         # Database helpers (factories, assertions, test-database)
├── fixtures/             # Static test data (JSON)
│   ├── database/         # DB fixtures (workouts, exercises)
│   └── users/            # User fixtures
└── e2e/                  # E2E tests
    ├── manual/           # Phase 1 - Manual checklists
    └── maestro/          # Phase 3+ - Maestro automation (YAML)
```

## Decision Records

### Why tests/ at root (not src/**tests**/)?

**Answer:** Unit tests stay colocated (`src/**/__tests__/`), but **helpers** need to be accessible from:

- Unit tests (`src/services/database/__tests__/*.test.ts`)
- Integration tests (future: `src/services/api/__tests__/*.test.ts`)
- E2E tests (`tests/e2e/manual/`, `tests/e2e/maestro/`)

Centralized `tests/support/` = DRY, reusable across domains.

### Why NOT tests/support/shared/?

**Answer:** YAGNI (You Aren't Gonna Need It). No duplication yet (Phase 0.5 = database only).
**Future:** Extract to `tests/__helpers__/` AFTER 3+ domains duplicate helpers (Rule of Three).

## Anti-Patterns

❌ **Bad:** Import using relative paths

```typescript
import { createTestWorkout } from '../../../tests/support/database/factories';
```

✅ **Good:** Use `@tests` alias

```typescript
import { createTestWorkout } from '@tests/support/database/factories';
```

❌ **Bad:** Duplicate helper in multiple `__tests__/` directories

✅ **Good:** Extract to `tests/support/` and import via `@tests`

## Cross-References

- **Unit Testing Guide:** [docs/testing/README.md](../docs/testing/README.md)
- **Database Helpers:** [support/database/README.md](./support/database/README.md)
- **Mocking Strategy:** [**mocks**/README.md](../__mocks__/README.md)
- **E2E Strategy:** [e2e/README.md](./e2e/README.md)
