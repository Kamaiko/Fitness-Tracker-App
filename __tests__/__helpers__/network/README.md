# Network Helpers

Mock infrastructure for testing network operations and Supabase API interactions.

## Purpose

Provide utilities for:

- Mocking Supabase API endpoints (pull_changes, push_changes)
- Simulating network conditions (offline, online, slow)
- Generating sync test data (conflicts, changes)

## Files

### `mock-supabase.ts`

Mock Supabase API using msw (Mock Service Worker).

**Handlers:**

- `POST /rest/v1/rpc/pull_changes` - Mock pull sync
- `POST /rest/v1/rpc/push_changes` - Mock push sync

**Usage:**

```typescript
import { mockSupabaseServer } from '@test-helpers/network/mock-supabase';

beforeAll(() => mockSupabaseServer.listen());
afterEach(() => mockSupabaseServer.resetHandlers());
afterAll(() => mockSupabaseServer.close());
```

### `network-simulator.ts`

Simulate network conditions for offline-first testing.

**Functions:**

- `goOffline()` - Disconnect network
- `goOnline()` - Reconnect network
- `simulateSlow(delayMs)` - Add network latency
- `simulateIntermittent()` - Random connection drops

**Usage:**

```typescript
import { networkSimulator } from '@test-helpers/network/network-simulator';

await networkSimulator.goOffline();
// ... test offline behavior
await networkSimulator.goOnline();
// ... test sync
```

### `sync-fixtures.ts`

Generate test data for sync scenarios.

**Functions:**

- `generateChanges(type, count)` - Generate created/updated/deleted records
- `generateConflict(table, record)` - Generate conflict scenario
- `generateSyncResponse(changes, timestamp)` - Mock pull response

**Usage:**

```typescript
import { generateChanges, generateConflict } from '@test-helpers/network/sync-fixtures';

const changes = generateChanges('workouts', 5);
const conflict = generateConflict('workouts', existingWorkout);
```

## Dependencies

- **msw** - Mock Service Worker for API mocking
- **@nozbe/watermelondb** - Sync protocol types

## Installation

```bash
npm install -D msw
```

## Configuration

msw setup in `jest.setup.ts`:

```typescript
import { mockSupabaseServer } from '@test-helpers/network/mock-supabase';

beforeAll(() => mockSupabaseServer.listen({ onUnhandledRequest: 'error' }));
afterEach(() => mockSupabaseServer.resetHandlers());
afterAll(() => mockSupabaseServer.close());
```

## Resources

- [msw Documentation](https://mswjs.io/)
- [WatermelonDB Sync Protocol](https://nozbe.github.io/WatermelonDB/Advanced/Sync.html)
- [Integration Tests Guide](../../integration/README.md)
