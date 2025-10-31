# Maestro E2E Automation Guide (Phase 3+)

**Context:** Automated E2E testing with Maestro (Future - after manual validation)
**Purpose:** Automate critical user flows to prevent regressions
**Status:** 📅 Planned for Phase 3+ (Q2-Q3 2025)

## Why Maestro?

**vs Detox:**

- ✅ YAML-based (no JavaScript to maintain)
- ✅ React Native optimized
- ✅ Fast setup (~10 minutes)
- ✅ Simpler (less flakiness)

**vs Appium:**

- ✅ Mobile-first (not WebDriver overhead)
- ✅ Lightweight
- ✅ Better developer experience

## Quick Start (When Ready for Phase 3)

```bash
# 1. Install Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# 2. Verify installation
maestro --version

# 3. Create first flow
# tests/e2e/maestro/create-workout.yaml

# 4. Run test
maestro test tests/e2e/maestro/create-workout.yaml
```

## Maestro YAML Basics

### Simple Flow Example

```yaml
# tests/e2e/maestro/create-workout.yaml
appId: com.halterofit
---
- launchApp

# Navigate to create workout screen
- tapOn: 'New Workout'

# Fill form
- inputText: 'Leg Day'
- tapOn: 'Save'

# Verify creation
- assertVisible: 'Leg Day'
- assertVisible: 'Workout created successfully'
```

### Flow with Assertions

```yaml
# tests/e2e/maestro/sync-workout.yaml
appId: com.halterofit
---
- launchApp

# Create workout offline
- toggleNetworkConnection: false
- tapOn: 'New Workout'
- inputText: 'Offline Test'
- tapOn: 'Save'
- assertVisible: 'Offline Test'

# Sync when online
- toggleNetworkConnection: true
- tapOn: 'Settings'
- tapOn: 'Sync Now'

# Verify sync success
- assertVisible: 'Sync complete'
- assertNotVisible: 'Sync failed'
```

### Advanced Flow (Scroll, Wait, Conditional)

```yaml
appId: com.halterofit
---
- launchApp

# Scroll to find workout
- scrollUntilVisible:
    element: 'Push Day Workout'
    direction: DOWN

# Wait for data to load
- waitForAnimationToEnd

# Conditional tap
- tapOn:
    text: 'Edit'
    below: 'Push Day Workout'

# Update workout
- clearText
- inputText: 'Updated Push Day'
- tapOn: 'Save'
```

## Test Flows to Automate

### Phase 3.1: Critical Flows (Priority 1)

**1. Create Workout Flow**

```yaml
# create-workout.yaml
- Create workout with title
- Add exercise from library
- Add 3 sets with weight/reps
- Complete workout
- Verify completion
```

**2. Sync Flow**

```yaml
# sync-workflow.yaml
- Create workout offline
- Go online
- Trigger sync
- Verify sync success
- Verify in Supabase (external validation)
```

**3. Offline CRUD Flow**

```yaml
# offline-crud.yaml
- Enable airplane mode
- Create workout
- Update workout
- Delete workout
- Verify all persisted
- Go online, sync
```

### Phase 3.2: Common Flows (Priority 2)

**4. Edit Workout Flow**

```yaml
# edit-workout.yaml
- Navigate to workout list
- Select existing workout
- Edit title and notes
- Update exercise order
- Save changes
- Verify updates
```

**5. Delete Workout Flow**

```yaml
# delete-workout.yaml
- Navigate to workout
- Tap delete button
- Confirm deletion
- Verify soft delete (excluded from list)
- Sync to server
```

### Phase 3.3: Edge Cases (Priority 3)

**6. Conflict Resolution Flow**

```yaml
# conflict-resolution.yaml
- Create workout on device A
- Modify on device B (different changes)
- Sync both devices
- Verify conflict handling
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  pull_request:
    branches: [main, master]
  push:
    branches: [main, master]

jobs:
  e2e-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Maestro
        run: |
          curl -Ls "https://get.maestro.mobile.dev" | bash
          echo "$HOME/.maestro/bin" >> $GITHUB_PATH

      - name: Install dependencies
        run: npm install

      - name: Build iOS app
        run: eas build --platform ios --profile preview --non-interactive

      - name: Run E2E tests
        run: maestro test tests/e2e/maestro/
```

### Maestro Cloud Integration

```bash
# Upload flows to Maestro Cloud (for CI)
maestro cloud --apiKey=$MAESTRO_API_KEY \
  tests/e2e/maestro/create-workout.yaml \
  tests/e2e/maestro/sync-workflow.yaml
```

## Best Practices

### 1. Keep Flows Simple

```yaml
# ❌ BAD: Too complex, hard to debug
- tapOn: 'Settings'
- tapOn: 'Profile'
- tapOn: 'Edit'
- inputText: 'New Name'
# ... 50 more steps

# ✅ GOOD: Focused, single responsibility
# create-workout.yaml (one flow)
# edit-profile.yaml (separate flow)
```

### 2. Use Descriptive Test IDs

```typescript
// ✅ GOOD: Add testID to components
<Button testID="create-workout-button">Create Workout</Button>
```

```yaml
# ✅ GOOD: Use testID in Maestro
- tapOn:
    id: 'create-workout-button'
```

### 3. Wait for Elements

```yaml
# ❌ BAD: Immediate assertion (may fail on slow devices)
- tapOn: 'Save'
- assertVisible: 'Saved'

# ✅ GOOD: Wait for element
- tapOn: 'Save'
- waitForAnimationToEnd
- assertVisible: 'Saved'
```

### 4. Reset State Between Tests

```yaml
# ✅ GOOD: Reset before test
- launchApp:
    clearState: true # Clear app data

# OR manually reset
- tapOn: 'Settings'
- tapOn: 'Developer'
- tapOn: 'Reset Database'
- tapOn: 'Confirm'
```

## Debugging Flows

### Run in Interactive Mode

```bash
# Interactive mode (step-by-step)
maestro test -d tests/e2e/maestro/create-workout.yaml
```

### Record Screenshots

```yaml
# Add screenshot step for debugging
- tapOn: 'Save'
- takeScreenshot: 'after-save' # Saves to maestro/screenshots/
- assertVisible: 'Saved'
```

### View Console Logs

```bash
# Run with verbose logging
maestro test --verbose tests/e2e/maestro/create-workout.yaml
```

## Migration from Manual Tests

### Step 1: Validate Manual Test

```markdown
# Manual test (tests/e2e/manual/sync-checklist.md)

- [x] Create workout "Leg Day"
- [x] Add exercise "Squat"
- [x] Complete workout
- [x] Sync to server
- [x] Verify in Supabase
```

### Step 2: Convert to Maestro YAML

```yaml
# Maestro test (tests/e2e/maestro/sync-workflow.yaml)
appId: com.halterofit
---
- launchApp

- tapOn: 'New Workout'
- inputText: 'Leg Day'
- tapOn: 'Save'

- tapOn: 'Add Exercise'
- tapOn: 'Squat' # From exercise library
- tapOn: 'Add'

- tapOn: 'Complete Workout'
- assertVisible: 'Workout completed'

- tapOn: 'Settings'
- tapOn: 'Sync Now'
- assertVisible: 'Sync complete'
```

### Step 3: Run and Refine

```bash
# Run Maestro test
maestro test tests/e2e/maestro/sync-workflow.yaml

# Iterate on failures
# - Add waits
# - Fix selectors
# - Handle edge cases
```

## Anti-Patterns

### ❌ Automating Before Manual Validation

```yaml
# ❌ BAD: Automating unknown flow
- tapOn: 'Mystery Button' # Not validated manually - may be wrong flow
```

**Fix:** Always validate manually first (Phase 1)

### ❌ Flaky Selectors

```yaml
# ❌ BAD: Fragile selector
- tapOn: 'Button' # Which button?

# ✅ GOOD: Specific selector
- tapOn:
    text: 'Create Workout'
    below: 'Workouts'
```

### ❌ No State Reset

```yaml
# ❌ BAD: Assumes clean state
- tapOn: 'Workouts'
- assertVisible: 0 workouts # May fail if previous test left data

# ✅ GOOD: Reset state
- launchApp:
    clearState: true
- tapOn: 'Workouts'
- assertVisible: 0 workouts
```

## Next Steps (Phase 3 Kickoff)

**1. Setup (1-2 hours)**

```bash
# Install Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Verify setup
maestro --version
maestro studio  # Launch interactive studio
```

**2. Create First Flow (2-3 hours)**

```yaml
# Start simple: create-workout.yaml
# Convert from manual test: sync-checklist.md
```

**3. Integrate with CI (1-2 hours)**

```yaml
# Add GitHub Actions workflow
# Configure Maestro Cloud
```

**4. Expand Coverage (Ongoing)**

```yaml
# Add flows incrementally
# Prioritize: Critical → Common → Edge cases
```

## Cross-References

- **Maestro Automation:** [tests/e2e/maestro/README.md](../../tests/e2e/maestro/README.md)
- **E2E Strategy:** [tests/e2e/README.md](../../tests/e2e/README.md)
- **Manual E2E:** [e2e-manual.md](./e2e-manual.md) - Phase 1 manual testing
- **Testing Overview:** [README.md](./README.md) - Three-tier strategy

## Resources

**Maestro:**

- Getting Started: https://maestro.mobile.dev/getting-started
- React Native: https://maestro.mobile.dev/platform-support/react-native
- YAML Reference: https://maestro.mobile.dev/api-reference/commands
- CI/CD: https://maestro.mobile.dev/ci-cd/github-actions
- Maestro Cloud: https://maestro.mobile.dev/cloud

**Expo Dev Build:**

- Dev Builds: https://docs.expo.dev/develop/development-builds/introduction/
- Testing: https://docs.expo.dev/develop/development-builds/use-development-builds/
