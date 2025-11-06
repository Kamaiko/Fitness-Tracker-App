# Sync Fixtures

Static test data for WatermelonDB sync scenarios.

## Purpose

Provide realistic test data for:

- Basic sync operations (create, update, delete)
- Conflict resolution scenarios
- Multi-device sync scenarios
- Edge cases (partial sync, retry queue)

## Files

### `basic-changes.json`

Standard sync changes for happy path testing.

**Structure:**

```json
{
  "workouts": {
    "created": [...],
    "updated": [...],
    "deleted": [...]
  },
  "exercises": { ... },
  "exercise_sets": { ... }
}
```

### `conflicts.json`

Conflict scenarios for last-write-wins testing.

**Scenarios:**

- Same record modified on 2 devices (different timestamps)
- Create-delete conflict
- Update-delete conflict

### `offline-scenarios.json`

Data for offline-first testing.

**Scenarios:**

- Create workout offline → sync online
- Update sets offline → sync online
- Delete workout offline → sync online

### `edge-cases.json`

Edge case scenarios.

**Scenarios:**

- Partial sync (connection lost mid-sync)
- Retry queue persistence
- Large batch sync (1000+ records)

## Usage

```typescript
import basicChanges from '@tests/fixtures/sync/basic-changes.json';
import conflicts from '@tests/fixtures/sync/conflicts.json';

// Mock server response
mockSupabaseServer.use(
  http.post('/rest/v1/rpc/pull_changes', () => {
    return HttpResponse.json({
      changes: basicChanges,
      timestamp: Date.now(),
    });
  })
);
```

## Maintenance

**When to update:**

- Schema changes (new columns, tables)
- New sync scenarios discovered
- Edge cases found in production

**Guidelines:**

- Keep realistic data (valid UUIDs, timestamps)
- Document each scenario clearly
- Keep files focused (one concern per file)

## Resources

- [WatermelonDB Sync Protocol](https://nozbe.github.io/WatermelonDB/Advanced/Sync.html)
- [Sync Test Examples](../../integration/database/)
