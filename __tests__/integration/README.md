# Integration Tests

Integration tests for Halterofit using **LokiJS** (in-memory) + Mock Supabase API (msw).

**IMPORTANT LIMITATION:** These tests use LokiJS, NOT Real SQLite. WatermelonDB sync protocol columns (`_changed`, `_status`) and `synchronize()` method require native SQLite module, only available in E2E tests. Integration tests validate sync LOGIC, E2E tests validate sync PROTOCOL.

## Purpose

Test complete flows involving multiple services:
- Database sync (WatermelonDB ↔ Supabase)
- Auth flows (Supabase Auth)
- Network resilience (offline/online scenarios)

## Structure

```
integration/
├── database/           # Database sync integration tests (38 tests)
│   ├── sync-basic.test.ts           # 11 tests - pull/push/bidirectional sync
│   ├── conflict-resolution.test.ts  # 11 tests - last write wins, multi-device
│   └── schema-validation.test.ts    # 16 tests - Zod validation for sync protocol
│
├── setup.ts            # Global setup (msw server, custom matchers)
└── README.md           # This file
```

**Status:** Phase 1 complete (38 tests). Phase 2+ (auth, offline scenarios) planned for future phases.

## Key Differences from Unit Tests

| Aspect | Unit Tests | Integration Tests |
|--------|-----------|-------------------|
| **Database** | LokiJS (in-memory) | LokiJS (in-memory) |
| **Network** | No network | Mock Supabase (msw) |
| **Scope** | Single function/model | Multi-service flows |
| **Speed** | ⚡ <5s | 🟢 5-10s |
| **Purpose** | CRUD logic | Sync logic, conflict resolution |

## Setup

Integration tests use:
1. **LokiJS** - In-memory database adapter (same as unit tests)
2. **msw (Mock Service Worker)** - Mock Supabase RPC endpoints (pull_changes, push_changes)
3. **Network simulator** - Simulate offline/slow/intermittent connections
4. **Sync fixtures** - Generate realistic test data (workouts, conflicts, edge cases)

**Infrastructure:**
- `__tests__/__helpers__/network/mock-supabase.ts` - Mock Supabase backend
- `__tests__/__helpers__/network/network-simulator.ts` - Network conditions
- `__tests__/__helpers__/network/sync-fixtures.ts` - Test data generators
- `__tests__/integration/setup.ts` - Global setup (msw server, custom matchers)

## Running Tests

```bash
# Run all integration tests
npm run test:integration

# Run specific test file
npm run test:integration -- sync-basic.test.ts

# Watch mode
npm run test:integration -- --watch
```

## Test Coverage (Phase 1 - Complete)

**✅ sync-basic.test.ts (11 tests)**
- Pull changes from server (empty response, created records, multiple tables, timestamp filtering)
- Push changes to server (created, empty, deletions)
- Bidirectional sync (pull → push sequence, network error handling)
- Timestamp validation

**✅ conflict-resolution.test.ts (11 tests)**
- Last write wins - Basic (local newer, remote newer, multi-device conflicts)
- Server-side conflict resolution (push rejected if older, server state consistency)
- Edge cases (simultaneous updates, create-update conflicts, create-delete conflicts, update-delete conflicts)

**✅ schema-validation.test.ts (16 tests)**
- Pull changes response validation (Zod schema, timestamp range, sync metadata)
- Push changes request validation (schema compliance, UUID validation, empty push)
- Record schemas (workout, exercise, exercise set validation)
- Sync metadata validation (_status enum, _changed timestamp)

## Resources

- [TESTING.md § Integration Tests](../../docs/TESTING.md#integration-tests)
- [Network Helpers](../__helpers__/network/readme.md)
- [Sync Fixtures](../fixtures/sync/)
