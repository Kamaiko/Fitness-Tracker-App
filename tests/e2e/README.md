# tests/e2e/ - End-to-End Testing Strategy

**Context:** Multi-phase E2E testing approach (Phase 0.5.28 refactor)
**Purpose:** Validate complete user flows on real devices with real SQLite
**Constraints:** Manual checklists (Phase 1) → Maestro automation (Phase 3+)

## Quick Reference

**Current Phase:** Phase 1 (Manual Testing)
**Status:** Ready for manual testing (checklists prepared)
**Automation:** Phase 3+ (Maestro YAML flows)

## Directory Structure

```
tests/e2e/
├── README.md               # This file - E2E strategy overview
├── manual/                 # Phase 1: Manual testing checklists
│   ├── README.md           # Manual testing guide
│   ├── sync-checklist.md   # Sync protocol validation (CRITICAL)
│   └── offline-crud.md     # Offline CRUD validation
└── maestro/                # Phase 3+: Maestro automation (YAML)
    └── README.md           # Maestro automation guide (future)
```

## Testing Philosophy

### Three-Tier Testing Strategy

| Test Type       | Environment    | What to Test                 | Tools                  | Status               |
| --------------- | -------------- | ---------------------------- | ---------------------- | -------------------- |
| **Unit**        | Jest + LokiJS  | CRUD, queries, relationships | Jest, @testing-library | ✅ Active (37 tests) |
| **Integration** | Expo Dev Build | Sync protocol, migrations    | Real SQLite + JSI      | 🚧 Phase 1 (Manual)  |
| **E2E**         | Real Device    | Full user flows              | Maestro (YAML)         | 📅 Phase 3+          |

**Key Insight:** WatermelonDB sync protocol (`_changed`, `_status`, `synchronize()`) **CANNOT** be tested in Jest with LokiJS adapter. Requires real SQLite environment.

## Phase Roadmap

### Phase 1 (Manual Testing) - CURRENT

**Status:** ✅ Ready for execution
**Goal:** Validate sync protocol and migrations on real devices
**Tools:** Manual checklists + Expo Dev Build

**Deliverables:**

- ✅ Manual test checklists (`manual/sync-checklist.md`, `manual/offline-crud.md`)
- ✅ Test fixtures for manual execution
- 🚧 Execute manual tests on real device
- 🚧 Document results

**Why Manual First:**

1. **Immediate feedback:** No Maestro setup delay
2. **Learn user flows:** Discover edge cases before automation
3. **Validate approach:** Confirm sync protocol works before investing in automation

### Phase 2 (Test Data Generation) - FUTURE

**Status:** 📅 Planned (after Phase 1 complete)
**Goal:** Automate test data seeding for manual tests
**Tools:** Expo Dev Build + TypeScript scripts

**Planned Features:**

- Seed script: `npm run test:seed` - Populate database with fixtures
- Reset script: `npm run test:reset` - Clear database
- Snapshot script: `npm run test:snapshot` - Export current state

### Phase 3+ (Maestro Automation) - FUTURE

**Status:** 📅 Planned (Q2 2025+)
**Goal:** Automate critical user flows with Maestro
**Tools:** Maestro YAML + Expo Dev Build

**Planned Flows:**

- Create workout → Add exercises → Complete workout → Sync
- Edit workout offline → Go online → Verify sync
- Delete workout → Sync → Verify cloud deletion

## Decision Records

### Why Manual Testing First (Phase 1)?

**Question:** Why not start with Maestro automation immediately?

**Answer:** Learn Before Automating

**Reasoning:**

1. **Unknown unknowns:** Don't know all sync edge cases yet
2. **Faster validation:** Manual testing = immediate feedback (Maestro = setup overhead)
3. **Lower cost:** Manual checklists = 2-3 hours, Maestro setup = 1-2 days
4. **Better automation:** Manual testing reveals which flows to automate

**Example:**

```
Phase 1 (Manual):
- Execute sync checklist on device
- Discover: "Sync fails when workout has 0 exercises"
- Add edge case to checklist
- Fix bug before automation

Phase 3 (Maestro):
- Automate validated flows (no surprises)
- Include edge case from Phase 1
```

### Why Maestro (not Detox/Appium)?

**Question:** Why Maestro for E2E automation?

**Answer:** React Native Focus + Simplicity

**Benefits:**

1. **YAML-based:** No JavaScript/TypeScript - just declarative flows
2. **React Native optimized:** Built for RN apps (Detox = generic)
3. **Low maintenance:** Simple flows = less flakiness
4. **Fast setup:** Minutes, not hours (vs Detox native setup)

**Comparison:**

```
Maestro (Chosen):
- YAML flows (easy to read/write)
- React Native optimized
- Fast setup (~10 minutes)

Detox (Rejected):
- JavaScript tests (more code to maintain)
- Generic (not RN-specific)
- Complex setup (1-2 hours)

Appium (Rejected):
- Heavyweight (WebDriver protocol)
- Overkill for mobile-only app
```

### Why tests/e2e/ (not src/e2e/)?

**Question:** Why E2E tests at `tests/e2e/` instead of `src/e2e/`?

**Answer:** E2E Tests ≠ Source Code

**Reasoning:**

1. **Not part of app bundle:** E2E tests don't ship to users
2. **Different environment:** Real devices, not Jest/Node.js
3. **Separate concerns:** Unit tests colocated, E2E tests centralized
4. **Tool expectations:** Maestro expects `tests/` or `e2e/` at root

## Current State (Phase 0.5.28)

### What Exists Now:

- ✅ `tests/e2e/` directory structure
- ✅ `manual/` directory for checklists
- ✅ `maestro/` directory for future automation
- ✅ This README (strategy overview)

### What's Missing (Pending Phase 1 Execution):

- 🚧 `manual/sync-checklist.md` - Sync protocol validation steps
- 🚧 `manual/offline-crud.md` - Offline CRUD validation steps
- 🚧 Manual test execution on real device
- 🚧 Test result documentation

### What's Coming (Phase 3+):

- 📅 Maestro YAML flows
- 📅 CI/CD integration (GitHub Actions + Maestro Cloud)
- 📅 Visual regression testing (screenshots)

## Import Patterns

### Manual Tests (Phase 1)

```markdown
<!-- manual/sync-checklist.md -->

## Prerequisites

- Load test fixtures from tests/fixtures/database/workouts.json
- Reset database: Settings → Developer → Reset Database

## Test Steps

1. Create workout "Leg Day" (use fixture data)
2. Add exercise "Squat" with 3 sets
3. Complete workout
4. Verify \_changed timestamp updated
5. Run sync: Settings → Sync Now
6. Verify workout appears in Supabase dashboard
```

### Maestro Tests (Phase 3+)

```yaml
# maestro/create-workout.yaml
appId: com.halterofit.app
---
- launchApp
- tapOn: 'New Workout'
- inputText: 'Leg Day'
- tapOn: 'Save'
- assertVisible: 'Leg Day'
```

## Anti-Patterns

### ❌ BAD: Testing sync protocol in Jest

```typescript
// src/services/database/__tests__/sync.test.ts
test('synchronize() pushes changes to server', async () => {
  const workout = await createTestWorkout(database);
  await database.synchronize(); // ❌ LokiJS doesn't support sync protocol!
  // Test will pass but doesn't validate real sync behavior
});
```

**Fix:** Move to manual E2E test

```markdown
<!-- tests/e2e/manual/sync-checklist.md -->

- [ ] Create workout
- [ ] Run sync (Settings → Sync Now)
- [ ] Verify workout in Supabase dashboard
```

### ❌ BAD: Automating before manual validation

```yaml
# ❌ Automating unknown flow
- launchApp
- tapOn: 'New Workout'
# ... 50 lines of automation
# (No manual validation - may automate wrong flow!)
```

**Fix:** Manual first, then automate

```
1. Execute manual checklist on device
2. Refine steps based on actual behavior
3. Convert validated steps to Maestro YAML
```

### ❌ BAD: Committing test database state

```
tests/e2e/
└── test-database.db  # ❌ Don't commit database files!
```

**Fix:** Use fixtures + seed scripts

```
tests/fixtures/database/
└── workouts.json     # ✅ Commit fixtures, NOT database files
```

## Cross-References

- **Test Root README:** [tests/README.md](../README.md) - Architecture overview
- **Manual Testing Guide:** [manual/README.md](./manual/README.md) - Phase 1 execution guide
- **Maestro Automation:** [maestro/README.md](./maestro/README.md) - Phase 3+ automation (future)
- **Database Helpers:** [support/database/README.md](../support/database/README.md) - Test utilities
- **Fixtures:** [fixtures/README.md](../fixtures/README.md) - Static test data
- **Unit Testing Strategy:** [src/services/database/**tests**/README.md](../../src/services/database/__tests__/README.md)

## Migration Notes (Phase 0.5.28 Refactor)

**What Changed:**

```
BEFORE:
docs/E2E_STRATEGY.md        # Monolithic strategy doc (removed)

AFTER:
tests/e2e/
├── README.md               # High-level strategy (this file)
├── manual/README.md        # Manual testing guide (Phase 1)
└── maestro/README.md       # Automation guide (Phase 3+)

docs/testing/
├── e2e-manual.md           # Phase 1 guide (migrated from E2E_STRATEGY.md)
└── e2e-maestro.md          # Phase 3+ guide (migrated from E2E_STRATEGY.md)
```

**Benefits:**

- **Modular:** Separate concerns (manual vs automation)
- **Scalable:** Easy to add new test types
- **Discoverable:** Tests colocated with test infrastructure
- **AI-optimized:** Context-rich READMEs for AI agents

## Next Steps (Phase 1 Execution)

1. **Create manual checklists:**
   - `manual/sync-checklist.md` - Sync protocol validation
   - `manual/offline-crud.md` - Offline CRUD validation

2. **Execute manual tests:**
   - Run Expo Dev Build on real device
   - Follow checklists step-by-step
   - Document results (pass/fail + screenshots)

3. **Iterate:**
   - Refine checklists based on findings
   - Fix bugs discovered during manual testing
   - Update unit tests to prevent regressions

4. **Plan Phase 3:**
   - Identify most critical flows for automation
   - Set up Maestro locally
   - Convert 2-3 manual tests to Maestro YAML

## Resources

**Maestro Documentation:**

- Official Docs: https://maestro.mobile.dev/
- React Native Guide: https://maestro.mobile.dev/platform-support/react-native
- YAML Reference: https://maestro.mobile.dev/api-reference/commands

**WatermelonDB Sync:**

- Sync Protocol: https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
- Testing Sync: https://nozbe.github.io/WatermelonDB/Advanced/Sync.html#testing

**Expo Dev Build:**

- Dev Builds Guide: https://docs.expo.dev/develop/development-builds/introduction/
- Testing on Device: https://docs.expo.dev/develop/development-builds/use-development-builds/
