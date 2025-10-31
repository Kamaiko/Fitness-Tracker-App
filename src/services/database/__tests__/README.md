# Database Testing Strategy - Halterofit

**Version**: 2.0 (Simplified)
**Last Updated**: 2025-01-31
**Phase**: 0.5 - Post-Development Build Migration

---

## 🎯 Testing Philosophy

**CRITICAL UNDERSTANDING**: WatermelonDB sync protocol testing **CANNOT** be done in Jest with LokiJS adapter.

### Why Sync Testing Fails in Jest

1. **LokiJS is a Mock**: It simulates database behavior for CRUD tests only
2. **Sync Protocol Requires Real SQLite**: `_changed`, `_status`, and sync functions need React Native JSI
3. **No `synchronize()` in Jest**: Without calling `synchronize()`, WatermelonDB never initializes sync columns
4. **Structural Limitation**: This isn't a bug—it's an architectural constraint

**Reference**: See WatermelonDB docs on [Testing](https://watermelondb.dev/docs/Advanced/Testing) and [Sync](https://watermelondb.dev/docs/Sync/Frontend)

---

## ✅ What We Test in Jest (Unit Tests)

### Scope: Business Logic & CRUD Operations

**Test Files**:
- `unit/workouts.test.ts` - Workout CRUD, relationships, queries
- `unit/exercises.test.ts` - Exercise CRUD, filtering, custom exercises
- `unit/exercise-sets.test.ts` - Set CRUD, training metrics (RIR, RPE, 1RM)

**What Works**:
- ✅ Create, Read, Update, Delete operations
- ✅ Relationships (belongs_to, has_many, children)
- ✅ Queries (where, sort, pagination, count)
- ✅ Computed properties (getters)
- ✅ Batch operations
- ✅ Complex queries with joins

**What We DON'T Test**:
- ❌ Sync protocol (`_changed`, `_status` behavior)
- ❌ `synchronize()` function
- ❌ Migrations (schema changes need real SQLite)
- ❌ Push/pull changes to backend

---

## 🚀 What We Test in E2E (Integration Tests)

### Scope: Full Sync Flow with Real SQLite

**Environment:** Expo Dev Build + Real Device/Emulator

### Phase 1: Manual Testing Checklists

**Why Manual First:**
- Supabase backend being implemented
- Faster iteration without automation overhead
- Validates sync flows before investing in E2E framework

**Manual Test Checklist Location:** `e2e/manual/sync-checklist.md` (Phase 1)

**Key Scenarios to Test Manually:**
1. **First Sync** - User logs in, pulls initial data from Supabase
2. **Offline CRUD** - Create workout offline, verify `_changed` timestamp
3. **Push Changes** - Reconnect, verify offline changes sync to backend
4. **Conflict Resolution** - Handle server rejections gracefully
5. **Soft Deletes** - `markAsDeleted()` works, records excluded from queries

---

### Phase 3+: Automated E2E Tests (Maestro)

**Framework:** Maestro (simple YAML-based testing)
**CI Integration:** GitHub Actions + EAS Build
**Documentation:** `docs/E2E_STRATEGY.md`

**Example Maestro Test** (Future):
```yaml
# e2e/maestro/sync-offline-workout.yaml
appId: com.halterofit
---
- launchApp
- tapOn: "Create Workout"
- inputText: "Offline Leg Day"
- tapOn: "Save"
- assertVisible: "_changed timestamp updated"
- toggleAirplaneMode: off
- pullToRefresh
- assertVisible: "Synced to Supabase"
```

---

## 📁 Test Directory Structure

```
src/services/database/__tests__/
├── setup/
│   ├── test-database.ts        # LokiJS adapter config
│   ├── factories.ts             # Test data generators (DRY)
│   └── test-utils.ts            # Query/assertion helpers
├── workouts.test.ts             # ✅ Unit tests (Jest + LokiJS)
├── exercises.test.ts            # ✅ Unit tests (Jest + LokiJS)
├── exercise-sets.test.ts        # ✅ Unit tests (Jest + LokiJS)
└── README.md (this file)
```

**Simplified Structure:**
- No `/unit/` subdirectory - all Jest tests at same level
- Integration/E2E tests will be in `e2e/` at project root (Phase 1+)

**Removed** (moved to E2E strategy):
- ~~`integration/sync.test.ts`~~ - Requires real SQLite + `synchronize()`
- ~~`integration/migrations.test.ts`~~ - Requires real SQLite migrations

---

## 🧪 Running Tests

### Jest Unit Tests (CRUD Only)
```bash
npm test                    # Run all Jest tests
npm test -- workouts        # Run specific test file
npm test -- --coverage      # With coverage report
```

**Expected Results**:
- ✅ 37/37 tests passing (CRUD operations)
- ❌ 0 sync protocol tests (removed - moved to E2E)

### E2E Tests (Phase 1: Manual, Phase 3+: Maestro)
```bash
# Phase 1: Manual testing with checklists
# See: e2e/manual/sync-checklist.md

# Phase 3+: Automated with Maestro
# maestro test e2e/maestro/
```

---

## 📊 Coverage Strategy

### Phase 0.5 (Current): Database Layer Foundation
**Target**: 60-70% coverage for CRUD operations

```javascript
// jest.config.js
coverageThreshold: {
  './src/services/database/': {
    branches: 60,
    functions: 65,
    lines: 65,
    statements: 65,
  },
}
```

### Phase 1 (Future): Sync Implementation
**Target**: 80%+ coverage with E2E tests included

---

## ⚠️ Common Pitfalls

### ❌ DON'T Do This in Jest
```typescript
// WILL FAIL - LokiJS doesn't support sync queries
test('query changed records', async () => {
  const changes = await database
    .get('workouts')
    .query(Q.where('_changed', Q.gt(timestamp)))
    .fetch();
  // ❌ TypeError: _changed column doesn't exist in LokiJS
});
```

### ✅ DO This Instead
```typescript
// WORKS - Standard CRUD operations
test('query completed workouts', async () => {
  const workouts = await database
    .get('workouts')
    .query(Q.where('completed_at', Q.notEq(null)))
    .fetch();
  // ✅ Works perfectly with LokiJS
});
```

---

## 🔧 Troubleshooting

### Issue: "Cannot read property '_changed' of undefined"
**Cause**: Trying to access `record._raw._changed` in Jest
**Solution**: Remove sync protocol tests, move to E2E

### Issue: "Query failed: no such column: _changed"
**Cause**: LokiJS doesn't have `_changed` column
**Solution**: Don't query sync columns in Jest tests

### Issue: "Tests timing out after 5+ seconds"
**Cause**: Database not resetting properly in `afterEach`
**Solution**: Ensure `database.unsafeResetDatabase()` called

---

## 📚 References

- [WatermelonDB Testing Guide](https://watermelondb.dev/docs/Advanced/Testing)
- [WatermelonDB Sync Protocol](https://watermelondb.dev/docs/Sync)
- [LokiJS Adapter Limitations](https://github.com/Nozbe/WatermelonDB/blob/master/src/adapters/lokijs/README.md)
- Project: `docs/TECHNICAL.md` (ADR-005: Testing Strategy)

---

## ✨ Summary

| Test Type | Environment | What to Test | Tools |
|-----------|-------------|--------------|-------|
| **Unit** | Jest + LokiJS | CRUD, queries, relationships | Jest, @testing-library |
| **E2E** | Expo Dev Build | Sync protocol, offline-first | Detox, manual flows |

**Key Takeaway**: Accept the limitations, test what you can, defer what you can't.
