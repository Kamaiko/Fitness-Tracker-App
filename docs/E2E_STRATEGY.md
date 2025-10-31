# E2E Testing Strategy - Halterofit

**Version**: 1.0
**Last Updated**: 2025-01-31
**Phase**: Manual Testing (Phase 1) → Maestro Automation (Phase 3+)

---

## 🎯 Overview

This document defines the end-to-end (E2E) testing strategy for Halterofit, focusing on real-device testing of WatermelonDB sync protocol and offline-first functionality.

**Why E2E Tests?**

WatermelonDB's sync protocol (`_changed`, `_status`, `synchronize()`) requires React Native's JSI bridge and real SQLite database. Jest with LokiJS adapter **CANNOT** test sync functionality - this is an architectural constraint, not a limitation.

**Reference**: [WatermelonDB Testing Docs](https://watermelondb.dev/docs/Advanced/Testing)

---

## 📋 Two-Phase Approach

### Phase 1: Manual Testing (Current - v0.1.x)

**Timeline**: During Supabase backend implementation
**Goal**: Validate sync flows before investing in automation
**Deliverable**: Manual test checklists in `e2e/manual/`

**Why Manual First?**
- Backend API still being implemented
- Faster iteration without automation overhead
- Validates business logic before freezing test scenarios
- Builds institutional knowledge of critical user flows

**Checklist Locations** (Task 1.16):
- `e2e/manual/sync-checklist.md` - Supabase sync scenarios
- `e2e/manual/offline-crud.md` - Offline CRUD operations
- `e2e/manual/auth-flows.md` - Authentication flows

---

### Phase 3+: Maestro Automation (Future - v1.0+)

**Timeline**: After app stabilizes (Phase 3: Enhancements)
**Goal**: Automate critical user journeys in CI/CD
**Deliverable**: Maestro YAML tests in `e2e/maestro/`

**Why Maestro?**
- ✅ Simple YAML syntax (no JavaScript/TypeScript required)
- ✅ Works with Expo Dev Builds out of the box
- ✅ Easier to maintain than Detox (native driver complexity)
- ✅ Fast execution on EAS Build preview
- ✅ Cross-platform (iOS + Android with same tests)

**Task Reference**: Task 10.2 - Setup Maestro E2E Automation (6h)

---

## 🧪 Test Scenarios

### Critical User Journeys (Priority 1)

**1. First Sync Flow**
- User logs in for first time
- App pulls initial data from Supabase
- Verify workout templates, exercises, user settings loaded
- **Pass Criteria**: All data visible, no sync errors

**2. Offline CRUD Operations**
- Turn off network connectivity
- Create workout with exercises and sets
- Verify `_changed` timestamp updated
- Verify data persists after app restart
- **Pass Criteria**: Data saved locally, `_changed` set correctly

**3. Push Changes to Backend**
- Reconnect to network
- Trigger manual sync or pull-to-refresh
- Verify offline changes pushed to Supabase
- Verify `_changed` cleared after successful sync
- **Pass Criteria**: Backend data matches local, no conflicts

**4. Conflict Resolution**
- Create data offline
- Simulate server rejection (duplicate ID, validation error)
- Verify app handles conflict gracefully
- **Pass Criteria**: User sees error message, data not lost

**5. Soft Delete Verification**
- Mark workout as deleted (`markAsDeleted()`)
- Verify record excluded from queries
- Verify `_status: 'deleted'` set in database
- Verify deleted record syncs to backend
- **Pass Criteria**: UI hides record, sync includes delete operation

---

### Secondary Scenarios (Priority 2)

**6. Batch Operations**
- Create multiple workouts in quick succession
- Verify all changes tracked independently
- Verify batch sync succeeds
- **Pass Criteria**: All records sync without race conditions

**7. Schema Migrations**
- Install app with older schema version
- Trigger automatic migration on startup
- Verify data preserved after migration
- **Pass Criteria**: No data loss, app functions normally

**8. Network Interruption**
- Start sync operation
- Disable network mid-sync
- Verify app handles interruption gracefully
- Reconnect and retry sync
- **Pass Criteria**: Partial changes rolled back, retry succeeds

---

## 📁 Directory Structure

```
e2e/
├── manual/                          # Phase 1 - Manual test checklists
│   ├── sync-checklist.md           # Supabase sync scenarios (Scenarios 1-5)
│   ├── offline-crud.md             # Offline CRUD operations (Scenario 2)
│   ├── auth-flows.md               # Login/logout/password reset
│   └── README.md                   # Manual testing guide
│
└── maestro/                         # Phase 3+ - Automated tests
    ├── auth-login.yaml             # User login flow
    ├── workout-create-offline.yaml # Create workout while offline
    ├── sync-offline-changes.yaml   # Sync offline changes to backend
    ├── conflict-resolution.yaml    # Handle server conflicts
    └── soft-delete.yaml            # Soft delete verification
```

**Note**: Only `e2e/manual/` exists in Phase 1. `e2e/maestro/` will be created in Phase 3 (Task 10.2).

---

## 🚀 Phase 1: Manual Testing Guide

### Prerequisites

1. **Development Build Installed** (Task 0.5.20-0.5.26 completed)
   ```bash
   eas build --profile development --platform ios
   # or
   eas build --profile development --platform android
   ```

2. **Test Supabase Project** (separate from production)
   - Create test account with known credentials
   - Populate with sample workout templates
   - Configure in `.env.development`

3. **Network Toggle Capability**
   - iOS: Settings → Airplane Mode
   - Android: Quick Settings → Airplane Mode
   - Alternatively: Use iOS Simulator/Android Emulator network controls

### Running Manual Tests

**Step 1: Review Checklist**
- Open `e2e/manual/sync-checklist.md`
- Identify scenario to test (e.g., "First Sync Flow")

**Step 2: Setup Test Environment**
- Uninstall app (clean slate)
- Enable network connectivity
- Prepare test data in Supabase dashboard

**Step 3: Execute Test**
- Follow checklist step-by-step
- Record observations (screenshots helpful)
- Mark pass/fail for each step

**Step 4: Document Results**
- Add notes to checklist (inline comments)
- If failure: Create GitHub issue with steps to reproduce
- If pass: Initial tester name and date

**Example Checklist Entry:**
```markdown
## Scenario 1: First Sync Flow

- [x] Login with test account (test@example.com)
- [x] Verify loading indicator during initial sync
- [x] Verify workout templates loaded (5 templates expected)
- [x] Verify exercises populated (150+ exercises)
- [ ] Verify user settings synced (FAILED - timeout after 30s)

**Notes**: Initial sync timed out on slow 3G connection. Need retry logic.
**Tester**: @username
**Date**: 2025-01-31
```

---

## 🤖 Phase 3+: Maestro Automation Guide

### Installation (Future - Task 10.2)

```bash
# Install Maestro CLI
brew tap mobile-dev-inc/tap
brew install maestro

# Verify installation
maestro --version
```

### Example Test: Offline Workout Creation

**File**: `e2e/maestro/workout-create-offline.yaml`

```yaml
appId: com.halterofit  # Replace with actual bundle ID
---
# Scenario 2: Offline CRUD Operations

- launchApp

# Disable network
- runFlow:
    file: ./flows/disable-network.yaml

# Navigate to workout creation
- tapOn: "New Workout"
- assertVisible: "Create Workout"

# Fill workout details
- tapOn: "Workout Title"
- inputText: "Offline Leg Day"
- tapOn: "Add Exercise"
- tapOn: "Squat"
- inputText:
    text: "100"
    id: "weight-input"
- inputText:
    text: "5"
    id: "reps-input"

# Save workout
- tapOn: "Save Workout"
- assertVisible: "Workout saved locally"

# Verify data persistence
- stopApp: com.halterofit
- launchApp
- assertVisible: "Offline Leg Day"

# Re-enable network and sync
- runFlow:
    file: ./flows/enable-network.yaml
- swipeDown  # Pull to refresh
- assertVisible: "Synced to cloud"
```

### Running Maestro Tests

```bash
# Run single test
maestro test e2e/maestro/workout-create-offline.yaml

# Run all tests in directory
maestro test e2e/maestro/

# Run with specific device
maestro test --device "iPhone 15 Pro" e2e/maestro/

# Generate test report
maestro test --format junit e2e/maestro/ > test-results.xml
```

---

## 🔄 CI/CD Integration

### Phase 1: Manual Testing (No CI/CD)

Manual tests are **NOT** run in CI/CD. They are executed manually before releases:
- Before merging Phase 1 PR (Supabase integration)
- Before v0.1.0 release (MVP)
- Before v1.0.0 release (Production)

**Checklist Tracking**: Use GitHub Projects or linear issue board to track manual test execution.

---

### Phase 3+: Maestro in CI/CD

**When to Run**:
- ✅ On EAS Build preview (before release builds)
- ✅ On demand (manual workflow dispatch)
- ❌ NOT on every commit (too slow, costs $$$)

**GitHub Actions Workflow** (Future):

```yaml
# .github/workflows/e2e-maestro.yml
name: E2E Tests (Maestro)

on:
  workflow_dispatch:  # Manual trigger only
  push:
    branches:
      - release/*      # Run on release branches

jobs:
  e2e-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Maestro
        run: |
          brew tap mobile-dev-inc/tap
          brew install maestro

      - name: Download EAS Build
        run: |
          eas build:download --platform ios --profile preview

      - name: Install app on simulator
        run: |
          xcrun simctl boot "iPhone 15 Pro"
          xcrun simctl install booted ./build.ipa

      - name: Run Maestro tests
        run: maestro test e2e/maestro/

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: maestro-results-ios
          path: maestro-results/

  e2e-android:
    runs-on: ubuntu-latest
    steps:
      # Similar steps for Android
      - uses: actions/checkout@v4
      - name: Setup Maestro
        run: curl -Ls "https://get.maestro.mobile.dev" | bash
      # ... similar to iOS job
```

**Cost Optimization**:
- Use EAS Build's built-in caching
- Run E2E only on release branches
- Run subset of critical tests on every preview build
- Full test suite only before production releases

---

## 📊 Test Coverage Goals

### Phase 1 (Manual)

**Target**: 100% of critical user journeys tested manually
- ✅ First sync (Scenario 1)
- ✅ Offline CRUD (Scenario 2)
- ✅ Push changes (Scenario 3)
- ✅ Conflict resolution (Scenario 4)
- ✅ Soft deletes (Scenario 5)

**Cadence**: Run full checklist before each release

---

### Phase 3+ (Automated)

**Target**: 80% of manual tests automated with Maestro

**Priority 1 Automation** (v1.0):
- Scenario 1: First sync
- Scenario 2: Offline CRUD
- Scenario 3: Push changes

**Priority 2 Automation** (v1.1+):
- Scenario 4: Conflict resolution
- Scenario 5: Soft deletes
- Scenario 6: Batch operations

**Scenarios NOT Automated**:
- Schema migrations (too complex, low frequency)
- Network interruption edge cases (flaky in CI/CD)

---

## ⚠️ Common Pitfalls

### Manual Testing

**❌ DON'T**:
- Test on production Supabase project (use separate test project)
- Skip network toggle verification (easy to forget)
- Test on debug build (performance not representative)

**✅ DO**:
- Use consistent test data (same workouts, exercises)
- Document deviations from checklist
- Create GitHub issues for failures immediately
- Re-test after fixing issues

---

### Maestro Automation

**❌ DON'T**:
- Hardcode test data IDs (use dynamic queries)
- Run E2E on every commit (expensive, slow)
- Test implementation details (e.g., internal state)

**✅ DO**:
- Use `assertVisible` for user-facing text
- Add `wait` steps for network operations (avoid flakiness)
- Test from user's perspective (tap, swipe, input)
- Keep tests short (<2 minutes each)

---

## 📚 References

- [WatermelonDB Testing Guide](https://watermelondb.dev/docs/Advanced/Testing)
- [WatermelonDB Sync Protocol](https://watermelondb.dev/docs/Sync)
- [Maestro Documentation](https://maestro.mobile.dev/)
- [EAS Build Preview](https://docs.expo.dev/build/introduction/)
- Project: `src/services/database/__tests__/README.md` (Unit testing strategy)
- Project: `docs/TECHNICAL.md` (ADR-005: Testing Strategy)

---

## ✨ Summary

| Phase | Timeline | Environment | Framework | Status |
|-------|----------|-------------|-----------|--------|
| **Phase 1** | v0.1.x | Dev Build + Real Device | Manual Checklists | 🚧 In Progress |
| **Phase 3+** | v1.0+ | Dev Build + Simulator/Emulator | Maestro (YAML) | 📅 Planned |

**Key Takeaway**: Start manual, automate later. Validate business logic before freezing test scenarios.

**Next Actions**:
1. Complete Task 1.16 - Document manual E2E checklists
2. Execute manual tests before v0.1.0 release
3. Complete Task 10.2 - Setup Maestro automation (Phase 3)
