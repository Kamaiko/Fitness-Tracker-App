# Manual E2E Testing Guide (Phase 1)

**Context:** Manual testing checklist execution on real devices
**Purpose:** Validate sync protocol and offline-first behavior before automation
**Environment:** Expo Dev Build + Real Device/Simulator

## Quick Start

```bash
# 1. Start Expo Dev Build
npm start

# 2. Launch on device (scan QR code or press 'i'/'a')

# 3. Execute manual checklists
# - tests/e2e/manual/sync-checklist.md
# - tests/e2e/manual/offline-crud.md

# 4. Document results in GitHub issues
```

## Why Manual Testing First?

**Learn Before Automating:**

- **Unknown unknowns:** Discover sync edge cases before investing in automation
- **Faster feedback:** Manual = immediate execution, Maestro = 1-2 days setup
- **Better automation:** Manual testing reveals which flows to automate
- **Lower cost:** 2-3 hours manual testing vs days of automation setup

**Example:**

```
Phase 1 (Manual):
→ Execute sync checklist
→ Discover: "Sync fails when workout has 0 exercises"
→ Fix bug immediately
→ Update checklist

Phase 3 (Maestro):
→ Automate validated flows (stable, no surprises)
→ Include edge case from manual testing
```

## What to Test

### Critical: Sync Protocol Validation

**Why:** LokiJS (Jest) CANNOT test sync protocol - requires real SQLite + JSI

**Test Scenarios:**

1. **Create Offline → Sync → Verify Remote**
   - Create workout offline (airplane mode ON)
   - Go online, run sync
   - Verify workout in Supabase dashboard
   - Verify `_changed` timestamp set correctly

2. **Update → Sync → Verify Timestamp**
   - Update workout
   - Run sync
   - Verify `_changed` timestamp updated
   - Verify changes in Supabase

3. **Soft Delete → Sync → Verify Status**
   - Mark workout as deleted
   - Run sync
   - Verify `_status = 'deleted'` in Supabase
   - Verify excluded from local queries

4. **Pull Changes from Server**
   - Create workout on device A
   - Sync from device A
   - Pull on device B
   - Verify workout appears on device B

### High Priority: Offline CRUD

**Test Scenarios:**

1. **Offline Create**
   - Airplane mode ON
   - Create workout with exercises and sets
   - Verify persisted locally
   - Verify relationships intact

2. **Offline Update**
   - Airplane mode ON
   - Update existing workout
   - Verify changes persisted
   - Verify `updated_at` timestamp updated

3. **Offline Delete**
   - Airplane mode ON
   - Delete workout (soft delete)
   - Verify still in database but marked deleted
   - Verify excluded from queries

## Test Execution

### Prerequisites

```bash
# 1. Build app
npm start

# 2. Reset database (fresh state)
# In app: Settings → Developer → Reset Database

# 3. Load test fixtures (optional)
# Use tests/fixtures/database/workouts.json for consistent data
```

### Execution Steps

**1. Open Checklist**

```
tests/e2e/manual/
├── sync-checklist.md       # Open this file
└── offline-crud.md         # Or this file
```

**2. Follow Steps Sequentially**

```markdown
## Test Steps

- [ ] Step 1: Create workout "Leg Day"
- [ ] Step 2: Add exercise "Squat" with 3 sets
- [ ] Step 3: Complete workout
- [ ] Step 4: Verify \_changed timestamp (Settings → Developer → View Database)
- [ ] Step 5: Run sync (Settings → Sync Now)
- [ ] Step 6: Verify in Supabase dashboard
```

**3. Mark Completion**

```markdown
- [x] Step 1: Create workout "Leg Day" ✅
- [x] Step 2: Add exercise "Squat" with 3 sets ✅
- [ ] Step 3: Complete workout (FAILED - see issue #123)
```

**4. Document Failures**

```markdown
**Test:** sync-checklist.md - Step 3
**Expected:** Workout status changes to 'completed'
**Actual:** Status remains 'in_progress'
**Screenshot:** screenshots/step3-failure.png
**Device:** iPhone 14 Pro, iOS 17.2
**Build:** Expo Dev Build, Git SHA abc1234
```

### Troubleshooting

**Issue: Sync button not visible**

```
Solution: Settings → Developer → Enable Sync Button
```

**Issue: Cannot see \_changed timestamp**

```
Solution: Settings → Developer → View Database → Select workout
```

**Issue: Supabase dashboard shows no data**

```
Solution: Verify Supabase URL in .env.local
Check: Settings → Developer → View Supabase URL
```

## Test Checklists

### Sync Protocol Checklist

**File:** [tests/e2e/manual/sync-checklist.md](../../tests/e2e/manual/sync-checklist.md)

**Duration:** 15-20 minutes
**Priority:** 🔴 CRITICAL

**Scenarios:**

- Create offline → Sync → Verify remote
- Update → Sync → Verify timestamp
- Soft delete → Sync → Verify status
- Pull changes from server
- Conflict resolution (local vs remote)

### Offline CRUD Checklist

**File:** [tests/e2e/manual/offline-crud.md](../../tests/e2e/manual/offline-crud.md)

**Duration:** 10-15 minutes
**Priority:** 🟡 HIGH

**Scenarios:**

- Create workout offline
- Update workout offline
- Delete workout offline
- Complex relationships offline
- Airplane mode → Online transition

## Next Steps

**After Manual Testing:**

1. **Fix Bugs**
   - Address all failed test cases
   - Create GitHub issues for blockers
   - Prioritize: CRITICAL → HIGH → MEDIUM → LOW

2. **Refine Checklists**
   - Add edge cases discovered during testing
   - Remove redundant steps
   - Update expected behavior

3. **Plan Automation (Phase 3)**
   - Identify most critical flows for automation
   - Set up Maestro locally
   - Convert 2-3 manual tests to Maestro YAML

## Cross-References

- **Manual Test Checklists:** [tests/e2e/manual/README.md](../../tests/e2e/manual/README.md)
- **E2E Strategy:** [tests/e2e/README.md](../../tests/e2e/README.md)
- **Maestro Automation:** [e2e-maestro.md](./e2e-maestro.md) - Phase 3+ automation
- **Sync Protocol Docs:** [docs/DATABASE.md § Sync](../DATABASE.md)

## Resources

**WatermelonDB Sync:**

- Sync Protocol: https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
- Testing Sync: https://nozbe.github.io/WatermelonDB/Advanced/Sync.html#testing

**Expo Dev Build:**

- Dev Builds Guide: https://docs.expo.dev/develop/development-builds/introduction/
- Testing on Device: https://docs.expo.dev/develop/development-builds/use-development-builds/

**Supabase:**

- Dashboard: https://supabase.com/dashboard/project/_
- Database Browser: Navigate to "Table Editor" to verify synced data
