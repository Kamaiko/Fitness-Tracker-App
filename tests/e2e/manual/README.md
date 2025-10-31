# tests/e2e/manual/ - Manual Testing Checklists

**Context:** Phase 1 E2E testing (Manual validation before automation)
**Purpose:** Validate sync protocol and critical flows on real SQLite + JSI
**Constraints:** Requires Expo Dev Build on physical device or simulator

## Quick Reference

**Prerequisites:**

```bash
# 1. Start Expo Dev Build
npm start

# 2. Launch app on device
# - Press 'a' for Android
# - Press 'i' for iOS
# - OR scan QR code with Expo Go
```

**Test Execution:**

1. Open checklist markdown file (e.g., `sync-checklist.md`)
2. Follow steps sequentially
3. Mark checkboxes as you complete each step
4. Document failures with screenshots
5. Report issues in GitHub

## Directory Structure

```
tests/e2e/manual/
├── README.md               # This file - Manual testing guide
├── sync-checklist.md       # Sync protocol validation (CRITICAL)
└── offline-crud.md         # Offline CRUD validation
```

## Manual Test Checklists

### `sync-checklist.md` - Sync Protocol Validation

**Priority:** 🔴 CRITICAL
**Duration:** 15-20 minutes
**Why:** LokiJS cannot test sync protocol - requires real SQLite

**What It Tests:**

- `_changed` timestamp updates on create/update/delete
- `_status` column values ('created', 'updated', 'deleted')
- `synchronize()` method pushes changes to Supabase
- Conflict resolution (local vs remote changes)
- Offline queue persistence

**Test Scenarios:**

1. Create workout offline → Go online → Sync → Verify in Supabase
2. Update workout → Sync → Verify `_changed` timestamp updated
3. Soft delete workout → Sync → Verify `_status = 'deleted'` in Supabase
4. Create workout on device A → Sync → Pull on device B → Verify

### `offline-crud.md` - Offline CRUD Validation

**Priority:** 🟡 HIGH
**Duration:** 10-15 minutes
**Why:** Validate offline-first architecture works without network

**What It Tests:**

- Create workout offline (no network)
- Read workouts offline (local SQLite only)
- Update workout offline
- Delete workout offline
- Relationship integrity (workout → exercises → sets)

**Test Scenarios:**

1. Airplane mode ON → Create workout → Verify persisted
2. Airplane mode ON → Update workout → Verify persisted
3. Airplane mode ON → Delete workout → Verify soft delete
4. Airplane mode ON → Create complex workout (exercises + sets) → Verify relationships

## Manual Testing Protocol

### 1. Setup (Before Each Test Session)

```bash
# A. Ensure latest code
git pull
npm install

# B. Start Expo Dev Build
npm start

# C. Launch on device
# - Physical device: Scan QR code
# - Simulator: Press 'i' (iOS) or 'a' (Android)

# D. Reset database (fresh state)
# In app: Settings → Developer → Reset Database
```

### 2. Execution (During Test)

**For Each Checklist:**

1. Open checklist markdown file
2. Read "Prerequisites" section
3. Execute "Test Steps" sequentially
4. Mark `- [ ]` → `- [x]` as you complete each step
5. If step FAILS:
   - Take screenshot
   - Note error message
   - Continue to next step (don't abort)

**Example:**

```markdown
## Test Steps

- [x] Step 1: Create workout "Leg Day"
- [x] Step 2: Add exercise "Squat"
- [ ] Step 3: Verify \_changed timestamp (FAILED - timestamp not updating)
- [x] Step 4: Complete workout
```

### 3. Documentation (After Test)

**For Each Failure:**

1. Create GitHub issue with template:

```markdown
**Test:** sync-checklist.md - Step 3
**Expected:** \_changed timestamp updates on workout update
**Actual:** Timestamp remains unchanged
**Screenshot:** [Attach screenshot]
**Device:** iPhone 14 Pro, iOS 17.2
**Build:** Expo Dev Build, Git SHA abc1234
```

2. Link issue to relevant code:

```markdown
**Related Code:**

- src/services/database/watermelon/models/Workout.ts:42
- src/services/database/watermelon/schema.ts:15
```

### 4. Iteration (After All Tests)

1. Review all failures
2. Prioritize fixes (CRITICAL → HIGH → MEDIUM → LOW)
3. Create fix PRs
4. Re-run failed tests after fixes
5. Update checklists if new edge cases discovered

## Decision Records

### Why Manual Testing Before Automation?

**Question:** Why not automate E2E tests with Maestro immediately?

**Answer:** Learn Before Automating

**Benefits:**

1. **Discover edge cases:** Manual testing reveals unexpected behaviors
2. **Validate approach:** Confirm sync protocol works before investing in automation
3. **Faster iteration:** Manual = immediate feedback, Maestro = setup overhead
4. **Better automation:** Manual testing reveals which flows to automate

**Example:**

```
Manual Testing (Phase 1):
- Execute sync checklist
- Discover: "Sync fails when workout has 0 exercises"
- Add edge case to checklist
- Fix bug immediately

Maestro Automation (Phase 3+):
- Automate validated flows (no surprises)
- Include edge case from manual testing
- Automation is stable (no flaky tests from unknown edge cases)
```

### Why Markdown Checklists (not Excel/Notion)?

**Question:** Why markdown checklists instead of Excel or Notion?

**Answer:** Version Control + Discoverability

**Benefits:**

1. **Git versioning:** Track checklist changes over time
2. **Diff viewing:** See what changed in checklists
3. **Colocated:** Tests live with test infrastructure (not external tool)
4. **No auth:** No login required (Excel Online, Notion)
5. **Portable:** Works offline, no internet required

**Comparison:**

```
Markdown (Chosen):
- ✅ Version controlled (git)
- ✅ Colocated with code
- ✅ Works offline
- ✅ No external dependencies

Excel/Notion (Rejected):
- ❌ Not version controlled
- ❌ External tool (requires auth)
- ❌ Requires internet
- ❌ Separate from codebase
```

### Why Real Device Testing (not Simulator Only)?

**Question:** Why test on real devices instead of simulator only?

**Answer:** Simulator ≠ Production

**Simulator Limitations:**

1. **Different SQLite implementation:** Simulator SQLite may behave differently
2. **No real network:** Cannot test true offline → online transitions
3. **Different performance:** Simulator is faster (hides performance issues)
4. **Missing hardware:** No real sensors (accelerometer, GPS, etc.)

**Testing Strategy:**

```
Priority 1: Real Device (iOS + Android)
- Test on actual iPhone/Android phone
- Validate sync protocol with real network
- Test offline → online transitions (airplane mode)

Priority 2: Simulator (iOS Simulator / Android Emulator)
- Quick sanity checks
- Debugging (easier than device)
- NOT sufficient for final validation
```

## Test Data Strategy

### Using Fixtures

**Import fixtures for consistent test data:**

```typescript
// tests/fixtures/database/workouts.json
{
  "legDay": {
    "title": "Leg Day - Hypertrophy",
    "nutrition_phase": "bulk",
    "exercises": [...]
  }
}
```

**Manual Test:**

```markdown
## Test Steps

1. Create workout with data from fixtures/database/workouts.json (legDay)
2. Verify title: "Leg Day - Hypertrophy"
3. Verify nutrition_phase: "bulk"
```

### Reset Database Between Tests

**Why:** Ensure clean state (no interference from previous tests)

**How:**

```markdown
## Prerequisites

1. Open app
2. Settings → Developer → Reset Database
3. Confirm reset
4. Verify: Workouts list is empty
```

## Anti-Patterns

### ❌ BAD: Not resetting database before tests

```markdown
## Test Steps (without reset)

1. Create workout "Leg Day" # May already exist from previous test!
2. Verify workout created # FAILS - duplicate workout
```

**Fix:**

```markdown
## Prerequisites

1. Reset database (Settings → Developer → Reset Database)

## Test Steps

1. Create workout "Leg Day" # ✅ Guaranteed fresh state
```

### ❌ BAD: Testing on simulator only

```markdown
## Test Environment

- iOS Simulator 17.2 (not real device)
```

**Fix:**

```markdown
## Test Environment

- iPhone 14 Pro, iOS 17.2 (real device)
- OR Samsung Galaxy S23, Android 14 (real device)
```

### ❌ BAD: Not documenting failures

```markdown
- [ ] Step 3: Verify sync (FAILED - but no details)
```

**Fix:**

```markdown
- [ ] Step 3: Verify sync (FAILED)
      **Error:** Network request failed with 401 Unauthorized
      **Screenshot:** screenshots/sync-failure-20250131.png
      **Next:** Create GitHub issue #123
```

### ❌ BAD: Skipping failed steps

```markdown
- [x] Step 1: Create workout
- [ ] Step 2: Sync workout (FAILED - skipped rest of test)
- [ ] Step 3: Verify in Supabase (not executed)
```

**Fix:**

```markdown
- [x] Step 1: Create workout
- [ ] Step 2: Sync workout (FAILED - but continued)
- [x] Step 3: Verify in Supabase (executed anyway to gather more info)
```

## Cross-References

- **E2E Strategy:** [tests/e2e/README.md](../README.md) - High-level E2E approach
- **Maestro Automation:** [tests/e2e/maestro/README.md](../maestro/README.md) - Phase 3+ automation (future)
- **Fixtures:** [tests/fixtures/README.md](../../fixtures/README.md) - Static test data
- **Database Helpers:** [tests/support/database/README.md](../../support/database/README.md) - Test utilities
- **Sync Protocol Docs:** [docs/DATABASE.md § Sync Protocol](../../../docs/DATABASE.md) - Technical details

## Test Execution Log Template

**Copy this template for each test session:**

```markdown
# Manual Test Execution - [Date]

## Environment

- **Device:** [iPhone 14 Pro / Samsung Galaxy S23]
- **OS:** [iOS 17.2 / Android 14]
- **Build:** [Expo Dev Build, Git SHA abc1234]
- **Tester:** [Your Name]

## Tests Executed

- [x] sync-checklist.md (15 min) - 12/15 passed
- [x] offline-crud.md (10 min) - 8/8 passed

## Failures

### sync-checklist.md - Step 3

**Expected:** \_changed timestamp updates
**Actual:** Timestamp unchanged
**Screenshot:** sync-failure-step3.png
**Issue:** #123

## Summary

- **Total Tests:** 2
- **Total Steps:** 23
- **Passed:** 20 (87%)
- **Failed:** 3 (13%)
- **Duration:** 25 minutes

## Next Steps

1. Fix issue #123 (timestamp not updating)
2. Re-run sync-checklist.md steps 3-5
3. Update checklist if new edge cases discovered
```

## Migration Notes (Phase 0.5.28 Refactor)

**New Directory:**

- Created `tests/e2e/manual/` for manual test checklists
- Extracted manual testing guide from `docs/E2E_STRATEGY.md`

**Benefits:**

- **Colocated:** Tests live with test infrastructure
- **Version controlled:** Track checklist changes over time
- **Discoverable:** AI agents can find tests in tests/ directory
- **Modular:** Separate manual (Phase 1) from automation (Phase 3+)

## Resources

**WatermelonDB Sync Protocol:**

- Sync Overview: https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
- Testing Sync: https://nozbe.github.io/WatermelonDB/Advanced/Sync.html#testing
- Sync Columns: https://nozbe.github.io/WatermelonDB/Advanced/Sync.html#sync-columns

**Expo Dev Build:**

- Dev Builds Guide: https://docs.expo.dev/develop/development-builds/introduction/
- Testing on Device: https://docs.expo.dev/develop/development-builds/use-development-builds/
- Debugging: https://docs.expo.dev/workflow/debugging/

**Supabase:**

- Dashboard: https://supabase.com/dashboard/project/_
- Database Browser: Navigate to "Table Editor" to verify synced data
- Logs: Navigate to "Logs" to see sync API calls
