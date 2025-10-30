# 📋 Project Roadmap

**Project**: Halterofit v0.1.0
**Status**: 🟡 In Progress (Phase 0.5)
**Progress**: 11/97 tasks (11%) • ![](https://img.shields.io/badge/Progress-11%25-red)
**Timeline**: 16 weeks • Started 2025-01-20 • Target 2025-05-12
**Last Updated**: 2025-10-30 • **Next Milestone**: Complete Migration Stack (4 tasks remaining)

---

## 📊 Executive Summary

**Current Focus**: Phase 0.5.B - Development Build Migration
**Phase Progress**: 11/27 tasks (41%) • **Overall**: 11/97 tasks (11%)
**Critical Blockers**: None • **Velocity**: ~4 tasks/week (improved!)

### Recent Completions ✅

1. **0.5.24** - Migrate Database Operations to WatermelonDB ✅
2. **0.5.23.1** - Phase 1 Critical Fixes (comprehensive analysis + 6 fixes)
3. 0.5.23 - Create WatermelonDB Models & Schema
4. 0.5.22 - Install Native Packages & Build Development Build
5. 0.5.21 - Create eas.json Configuration

---

## 📋 Kanban

| 📝 TODO (Top 5)                        | 🔨 DOING | ✅ DONE (Last 5)               |
| -------------------------------------- | -------- | ------------------------------ |
| **0.5.25** Migrate to MMKV `[M]` 🟠    |          | **0.5.24** WatermelonDB ops ✅ |
| **0.5.26** Migrate to Victory `[M]` 🟠 |          | **0.5.23.1** Critical Fixes ✅ |
| **0.5.27** Supabase schema `[L]` 🟠    |          | **0.5.23** WatermelonDB models |
| **0.5.28** Test & Verify `[M]` 🟠      |          | **0.5.22** Install & Build ✅  |
| **0.5.3** FlashList `[S]` 🟡           |          | **0.5.21** eas.json config     |

**Progress**: Phase 0.5: 11/27 (41%) • Overall: 11/97 (11%)
**Velocity**: ~4 tasks/week (improved!) • **ETA**: Phase 0.5 complete in ~4 weeks
**NEXT**: 0.5.25 Migrate Storage to MMKV ⚡

---

## 📖 Table of Contents

1. [📊 Executive Summary](#-executive-summary)
2. [📋 Kanban](#-kanban)
3. [🗺️ Development Roadmap](#development-roadmap)
4. [Phase 0.5: Architecture & Foundation (11/27)](#phase-05-architecture--foundation-1127)
5. [Phase 1: Authentication & Foundation (0/15)](#phase-1-authentication--foundation-015)
6. [Phase 2: Workout Logging (0/20)](#phase-2-workout-logging-020)
7. [Phase 3: Exercise Library & Testing (0/9)](#phase-3-exercise-library--testing-09)
8. [Phase 4: Analytics & Smart Features (0/11)](#phase-4-analytics--smart-features-011)
9. [Phase 5: Polish, Monitoring & Beta Launch (0/15)](#phase-5-polish-monitoring--beta-launch-015)

---

## Development Roadmap

```
Phase 0.5: Architecture & Foundation (11/27 tasks)
   ├─ Initial setup ✅
   ├─ Dev tools setup ✅
   ├─ Architecture refactor ✅
   ├─ Audit analysis ✅
   ├─ EAS Build + Dev Client ✅
   ├─ WatermelonDB Schema & Models ✅
   ├─ Critical Fixes (comprehensive analysis) ✅
   ├─ WatermelonDB Database Operations ✅
   └─ NEXT: Complete Migration ⚡ PRIORITY
        ├─ Migrate storage to MMKV
        ├─ Migrate charts to Victory Native
        └─ Create Supabase schema & sync
        ↓
Phase 1: Authentication & Foundation (0/14 tasks)
   ├─ Supabase Auth integration
   ├─ Login/Register screens
   ├─ CI/CD pipeline
   └─ Type definitions
        ↓
Phase 2: Core Workout Logging (0/18 tasks)
   ├─ Active workout screen
   ├─ Set logging interface
   ├─ Rest timer
   └─ Workout history
        ↓
Phase 3: Exercise Library & Management (0/12 tasks)
   ├─ ExerciseDB API integration (1,300+ exercises)
   ├─ Exercise selector
   ├─ Custom exercises
   └─ Search & filters
        ↓
Phase 4: Analytics & Insights (0/15 tasks)
   ├─ Progress charts (react-native-chart-kit)
   ├─ Volume tracking
   ├─ Plateau detection (Mann-Kendall)
   └─ Workout reports
        ↓
Phase 5: Advanced Features (0/15 tasks)
   ├─ Workout templates
   ├─ Exercise substitutions
   ├─ Progressive overload tracking
   └─ Performance optimizations
        ↓
Phase 6: Polish & Launch (0/9 tasks)
   ├─ Onboarding
   ├─ Help documentation
   ├─ Privacy compliance (GDPR)
   └─ App store submission
```

### Phase Timeline & Effort

| Phase     | Tasks  | Est. Time    | Status      | Dependencies                     |
| --------- | ------ | ------------ | ----------- | -------------------------------- |
| **0.5**   | 27     | 50-60h       | IN PROGRESS | None (started)                   |
| **1**     | 15     | 25-30h       | BLOCKED     | ← Phase 0.5 migration + blockers |
| **2**     | 20     | 50-60h       | BLOCKED     | ← Phase 1 auth                   |
| **3**     | 9      | 30-40h       | BLOCKED     | ← Phase 2 workout core           |
| **4**     | 11     | 35-45h       | BLOCKED     | ← Phase 3 exercise library       |
| **5**     | 15     | 40-50h       | BLOCKED     | ← Phase 4 analytics              |
| **TOTAL** | **97** | **230-290h** | **7% done** | **12-15 weeks at 20h/week**      |

**⚠️ Critical Path:** Phase 0.5.B (Development Build Migration) must complete before infrastructure tasks.

---

## Phase 0.5: Architecture & Foundation (11/27)

**Timeline:** Weeks 1-7 | **Priority:** HIGHEST
**Goal:** Production-ready architecture and critical foundation

**Progress:** 11/27 tasks (41%) | **Est. Time Remaining:** 34-42h

**Current Stack:** Expo Go (expo-sqlite + AsyncStorage + react-native-chart-kit)
**Target Stack:** Development Build (WatermelonDB + MMKV + Victory Native)

**Why migrate NOW:** Codebase is small (6% complete). Migrating now avoids rewriting 40-60% of code later.

---

### 0.5.A: Initial Setup & Analysis (5/5) ✅ COMPLETE

- [x] 0.5.1 **Setup expo-sqlite with Supabase sync** (M - 4h) ✅
- [x] 0.5.7 **Complete modular architecture refactor** (M - 3h) ✅
- [x] 0.5.8 **Technical audit and corrections planning** (M - 2h) ✅
- [x] 0.5.17 **Setup professional dev tools** (S - 30min) ✅
- [x] 0.5.18 **Setup Jest testing infrastructure** (S - 1h) ✅

---

### 0.5.B: Development Build Migration (6/10) 🔨 IN PROGRESS

**Goal:** Migrate to production-ready stack while codebase is small

**Stack Changes:**

- expo-sqlite → WatermelonDB (reactive, offline-first ORM)
- AsyncStorage → MMKV (encrypted, 10-30x faster)
- react-native-chart-kit → Victory Native (professional charts)
- Expo Go → Development Build (enables native modules)

**Why NOW:** Only 6 tasks of code to migrate. Waiting until Phase 1-2 = rewriting 40-60% of app.

**Estimated Time:** 4-6 hours | **Tasks:** 10

---

#### ⚠️ Pre-Flight Checklist (DO FIRST)

Before starting migration:

1. ✅ Git status clean (commit/stash all changes)
2. ✅ Create backup branch: `git checkout -b backup/pre-migration`
3. ✅ EAS account created at https://expo.dev/signup
4. ✅ Supabase project ready (URL + anon key in .env)
5. ✅ Stable internet (EAS Build = 15-20min cloud build)
6. ✅ Android device/emulator available
7. ✅ ~2GB free disk space

**Commands to run BEFORE migration:**

```bash
# 1. Backup current state
git checkout -b backup/pre-migration
git add -A && git commit -m "chore: backup before dev build migration"
git checkout master

# 2. Verify environment
cat .env  # Check EXPO_PUBLIC_SUPABASE_URL and KEY are set
eas whoami  # Verify EAS login (or run: eas login)

# 3. Clean install (fresh start)
rm -rf node_modules package-lock.json
npm install
npm run type-check  # Verify no errors
```

**Recovery Plan (if migration fails):**

```bash
# Restore backup
git checkout backup/pre-migration
npm install
npm start  # Back to Expo Go
```

---

#### 📋 Migration Tasks (Follow Order)

- [x] 0.5.20 **Setup EAS Build Account & CLI** (S - 30min) ✅
  - Create free Expo account at https://expo.dev/signup
  - Install EAS CLI: `npm install -g eas-cli`
  - Login: `eas login`
  - Link project: `eas init`
  - Verify setup: `eas whoami`
  - Status: Ready for cloud builds

- [x] 0.5.21 **Create eas.json Configuration** (S - 30min) ✅
  - Create eas.json at project root
  - Configure development profile (`developmentClient: true`)
  - Configure preview and production profiles
  - Purpose: Development build config for EAS cloud builds
  - File: `eas.json`

- [x] 0.5.22 **Install Native Packages & Build Development Build** (L - 2-3h) ✅
  - **Phase A: Install Native Packages** ✅ COMPLETED
    - Installed: expo-dev-client, @nozbe/watermelondb, @nozbe/with-observables
    - Installed: react-native-mmkv, react-native-nitro-modules
    - Installed: victory-native, react-native-skia, @shopify/react-native-skia
    - Installed: @shopify/flash-list, expo-image, expo-notifications, expo-background-fetch
    - Installed: @sentry/react-native, simple-statistics, expo-constants
  - **Phase B: Configure Build Files** ✅ COMPLETED
    - Created `.npmrc` with `legacy-peer-deps=true`
    - Updated `babel.config.js` with decorators plugin
    - Fixed deprecated @testing-library/jest-native
  - **Phase C: Fix SDK Compatibility** ✅ COMPLETED
    - Fixed Jest 30.x → 29.7.0 for SDK 54 compatibility
    - Fixed all package version mismatches with `npx expo install --fix`
  - **Phase D: Build with EAS** ✅ COMPLETED
    - Android build SUCCESS (20 minutes)
    - APK: https://expo.dev/artifacts/eas/qh4rcVLpNNsBsSf58DJWnr.apk
    - Build ID: c4995844-799a-407b-b888-23cf488eedb3
  - Note: ALL native packages installed upfront to minimize rebuilds (smart strategy!)

- [x] 0.5.23 **Create WatermelonDB Models & Schema** (L - 2h) ✅
  - ✅ Enabled WatermelonDB transformer in metro.config.js
  - ✅ Created schema.ts with all 5 tables (users, exercises, workouts, workout_exercises, exercise_sets)
  - ✅ Created User.ts model with preferences fields
  - ✅ Created Exercise.ts model with 1,300+ exercises support
  - ✅ Created Workout.ts model with relations and computed properties
  - ✅ Created WorkoutExercise.ts junction model with ordering
  - ✅ Created ExerciseSet.ts model with RPE, RIR, estimated 1RM calculation
  - ✅ Setup database instance in `src/services/database/watermelon/index.ts`
  - ✅ Configured TypeScript experimentalDecorators in tsconfig.json
  - ✅ Verified TypeScript compilation - no errors
  - ✅ IMPROVEMENT: Added nutrition_phase to workouts for context-aware analytics
  - Files created: 7 files in src/services/database/watermelon/

- [x] 0.5.23.1 **Phase 1 Critical Fixes (Post-Analysis)** (M - 1.5h) ✅
  - **Comprehensive Project Analysis** (15-thought deep analysis):
    - Security audit (auth tokens, encryption, RLS)
    - Residual code detection (outdated comments, TODOs)
    - Dependency analysis (duplicates, wrong placement)
    - Schema consistency verification
    - Performance optimization opportunities
    - Identified 17 issues categorized by severity
  - **Critical Fixes Applied**:
    - ✅ Moved @nozbe/watermelondb to dependencies (production blocker)
    - ✅ Removed jest/@types/jest duplicates from dependencies
    - ✅ Added _.db_ files to .gitignore (GDPR/privacy protection)
    - ✅ Added 'synced' field indexes to WatermelonDB schema (performance)
    - ✅ Fixed nutrition_phase schema mismatch (expo-sqlite ↔ WatermelonDB)
    - ✅ Verified TypeScript compilation - no errors
  - **Development Build Testing**:
    - ✅ Fixed metro.config.js transformer conflict
    - ✅ Fixed react-native-css-interop missing dependency
    - ✅ Successfully connected dev build to Metro bundler
    - ✅ Verified hot reload works with development build
  - **Files modified**: package.json, .gitignore, schema.ts, db.ts, metro.config.js
  - **Result**: Production-ready configuration, zero critical blockers

- [x] 0.5.24 **Migrate Database Operations to WatermelonDB** (L - 1.5h) ✅
  - ✅ Deleted expo-sqlite package and all legacy files (db.ts, tests)
  - ✅ Rewrote workouts.ts (444 lines) with WatermelonDB Dual API
  - ✅ Updated sync.ts to use WatermelonDB queries
  - ✅ Implemented Promise API (CREATE, UPDATE, DELETE)
  - ✅ Implemented Observable API (READ operations - reactive)
  - ✅ Updated types: number → boolean, added nutrition_phase
  - ✅ Removed initDatabase() - WatermelonDB auto-initializes
  - ✅ TypeScript compilation verified (npx tsc --noEmit)

- [ ] 0.5.25 **Migrate Storage to MMKV** (M - 45min)
  - Note: Package react-native-mmkv already installed in 0.5.22
  - Create MMKV wrapper: `src/services/storage/mmkvStorage.ts`
  - Create MMKV instance with encryption key
  - Migrate authStorage from AsyncStorage to MMKV
  - Update stores to use MMKV for persistence
  - Keep same API (getItem, setItem, removeItem)
  - Remove @react-native-async-storage/async-storage dependency after migration
  - Reference: TECHNICAL.md ADR-009

- [ ] 0.5.26 **Migrate Charts to Victory Native** (M - 1h)
  - Note: Packages victory-native, react-native-skia already installed in 0.5.22
  - Create LineChart.tsx and BarChart.tsx components in src/components/charts/
  - Wrap Victory components with dark theme
  - Replace existing react-native-chart-kit usage in ExampleLineChart.tsx
  - Test chart rendering with sample data
  - Remove react-native-chart-kit dependency after migration
  - Note: Full charts implementation happens in Phase 4

- [ ] 0.5.27 **Create Supabase Schema & Sync Functions** (L - 1.5h)
  - Create `supabase/migrations/001_initial_schema.sql`
  - Create Supabase tables matching WatermelonDB schema
  - Add RLS policies (users see only their data)
  - Create pull_changes() and push_changes() PostgreSQL functions
  - Implement sync() function in `src/services/database/watermelon/sync.ts`
  - Test sync with sample data
  - Reference: DATABASE.md § Supabase Sync

- [ ] 0.5.28 **Test & Verify Development Build** (M - 45min)
  - Verify app launches with dev build on physical device
  - Test WatermelonDB creates/reads/updates data
  - Verify reactive queries update UI automatically
  - Test MMKV stores and retrieves auth tokens
  - Verify Supabase sync works (create → sync → check dashboard)
  - Test Victory Native charts render correctly
  - Run: `npm run type-check` (must pass)
  - Verify hot reload works normally with dev build

---

### ✅ Migration Complete Checklist

**After all 10 tasks complete, verify:**

1. ✅ **Dev build installed on device** - App launches without Expo Go
2. ✅ **WatermelonDB working** - Can create/read workouts
3. ✅ **MMKV working** - Settings persist after app restart
4. ✅ **Sync working** - Data appears in Supabase dashboard
5. ✅ **Hot reload working** - Code changes refresh instantly
6. ✅ **No TypeScript errors** - `npm run type-check` passes
7. ✅ **Git committed** - Migration changes committed to master

**Next Steps (After Migration):**

```bash
# 1. Commit migration
git add -A
git commit -m "feat(infrastructure): migrate to development build with WatermelonDB + MMKV + Victory Native"
git push origin master

# 2. Delete backup branch (if everything works)
git branch -D backup/pre-migration

# 3. Update progress tracking
# Mark Phase 0.5 Bis tasks as complete in TASKS.md

# 4. Move to Phase 0.5 audit corrections
# See Phase 0.5.D (8 critical corrections)
```

**Important Notes:**

- **Daily development workflow unchanged** - Still use `npm start` + QR scan
- **Rebuild only needed for native changes** - JS/TS changes still use hot reload
- **EAS Build commands:**
  - `eas build --profile development --platform android` - Rebuild dev client
  - `eas build --profile production --platform android` - Production build (later)
- **Documentation updated:** README.md, ARCHITECTURE.md, TECHNICAL.md already reflect new stack

---

### 0.5.C: Infrastructure Completion (0/4)

**Goal:** Install remaining libraries (in Development Build environment)

**Note:** Task 0.5.2 (Supabase schema) is now part of migration (0.5.28) to avoid duplication.

- [ ] 0.5.3 **Install and configure FlashList** (S - 1h)
- [ ] 0.5.4 **Install and configure expo-image** (S - 1h)
- [ ] 0.5.5 **Setup Sentry for error monitoring** (M - 2h)
- [ ] 0.5.6 **Install simple-statistics for analytics** (S - 30min)

---

### 0.5.D: Critical Corrections - Blockers (0/3)

**Goal:** Fix critical issues that BLOCK Phase 1 (done in WatermelonDB + MMKV system)

**Reference:** See [AUDIT_FIXES.md](./AUDIT_FIXES.md) for detailed implementation

- [ ] 0.5.9 **User ID Persistence (in MMKV)** (M - 4h) 🔴
  - Problem: User forgotten on app restart → data loss
  - Fix: Persist user ID in MMKV (not AsyncStorage)
  - Impact: BLOCKS Phase 1 auth

- [ ] 0.5.10 **Zustand Persist Middleware (in MMKV)** (M - 2h) 🔴
  - Problem: Workout state lost on crash
  - Fix: Add persist middleware to workout store using MMKV
  - Impact: BLOCKS workout logging

- [ ] 0.5.11 **Error Handling Layer** (M - 3h) 🟠
  - Problem: No proper error handling → bad UX
  - Fix: Global error boundary + toast notifications
  - Impact: Poor debugging experience

---

### 0.5.E: Optional Improvements (0/5)

**Goal:** Nice-to-have improvements (defer to Phase 1-2, implement progressively)

- [ ] 0.5.12 **Repository Pattern** (L - 8h) 🟡
  - Defer: Implement progressively in Phase 1-2
  - Impact: Makes future DB optimization easier

- [ ] 0.5.13 **Sync Conflict Detection** (L - 8h) 🟠
  - Defer: Must complete before Phase 2 (multi-device)
  - Impact: Prevents data corruption on conflicts

- [ ] 0.5.14 **Database Indexes** (M - 2h) 🟡
  - Defer: Add when performance becomes issue (500+ workouts)
  - Impact: Query performance

- [ ] 0.5.15 **Chart Abstraction** (M - 3h) 🟢
  - Defer: Victory Native already abstracted
  - Impact: Minimal (already using good library)

- [ ] 0.5.16 **Domain vs DB Types** (M - 4h) 🟢
  - Defer: Organize types during Phase 1-2 development
  - Impact: Minor code organization

---

## Phase 1: Authentication & Foundation (0/15)

**Timeline:** Weeks 4-5 | **Priority:** HIGH

### 1. Authentication Screens

- [ ] 1.1 Create login screen UI (M - 3h) `[src/app/(auth)/login.tsx]`
  - Email/password inputs (use Input component)
  - Login button (use Button component)
  - "Forgot password" link
  - "Create account" link
  - Loading state, error handling

- [ ] 1.2 Create register screen UI (M - 3h) `[src/app/(auth)/register.tsx]`
  - Email/password inputs
  - Password confirmation
  - Terms acceptance checkbox
  - Register button
  - Validation (email format, password strength)

- [ ] 1.3 Implement Supabase authentication integration (M - 4h) `[src/services/supabase/auth.ts]`
  - Sign up functionality
  - Sign in functionality
  - Sign out functionality
  - Session management with AsyncStorage (via Supabase SDK)
  - Error handling (user-friendly messages)

- [ ] 1.4 Add form validation utilities (S - 2h) `[src/utils/validation.ts]`
  - Email format validation (regex)
  - Password strength validation (min 8 chars, etc.)
  - Error message generation
  - Generic form validation helpers

- [ ] 1.5 Implement password reset flow (M - 3h) `[src/app/(auth)/reset-password.tsx]`
  - Request reset screen (email input)
  - Reset confirmation screen
  - Supabase email notification
  - Success/error states

### 2. Navigation Structure

- [ ] 2.1 Create tab navigation layout (M - 3h) `[src/app/(tabs)/_layout.tsx]`
  - Workout tab
  - Exercises tab
  - Analytics tab (renamed from "Stats")
  - Profile tab (renamed from "Settings")
  - Custom tab bar styling (dark theme)

- [ ] 2.2 Implement navigation guards (S - 2h) `[src/app/_layout.tsx]`
  - Redirect to login if not authenticated
  - Redirect to tabs if authenticated
  - Loading screen during auth check
  - Deep linking support

- [ ] 2.3 Create placeholder tab screens (M - 2h)
  - [src/app/(tabs)/workout.tsx] - Workout logging screen
  - [src/app/(tabs)/exercises.tsx] - Exercise library screen
  - [src/app/(tabs)/analytics.tsx] - Analytics dashboard
  - [src/app/(tabs)/profile.tsx] - User profile & settings

### 3. Core UI Components

- [ ] 3.1 Create Button component (S - 2h) `[src/components/ui/Button.tsx]`
  - Variants: primary, secondary, danger, ghost
  - Sizes: small, medium, large
  - Loading state with spinner
  - Disabled state
  - Haptic feedback on press

- [ ] 3.2 Create Input component (M - 3h) `[src/components/ui/Input.tsx]`
  - Types: text, email, password, number
  - Error state with message
  - Label and helper text
  - Icons (left/right)
  - Auto-focus, keyboard type
  - Dark theme styling

- [ ] 3.3 Create Card component (S - 2h) `[src/components/ui/Card.tsx]`
  - Standard card with elevation/shadow
  - Header section (optional title, subtitle)
  - Content section
  - Footer section (optional actions)
  - Pressable variant

### 4. TypeScript Types & Configuration

- [ ] 4.1 Create useful TypeScript types (M - 2h) `[src/types/]`

  ```
  Files to create:
  - src/types/database.ts (database tables interfaces including nutrition_phase)
  - src/types/exercises.ts (exercise, set, workout types)
  - src/types/user.ts (user, profile, nutrition phase types)
  - src/types/analytics.ts (load metrics, fatigue ratios, workout reports)
  - src/types/api.ts (API response types)

  Note: Types needed throughout Phase 1-2 development
  ```

- [ ] 4.2 Setup development environment file (S - 30min)

  ```
  Tasks:
  - Copy .env.example to .env
  - Add all required environment variables
  - Document in CONTRIBUTING.md
  - Add .env to .gitignore (already done)

  Variables needed:
  - EXPO_PUBLIC_SUPABASE_URL
  - EXPO_PUBLIC_SUPABASE_ANON_KEY
  - SENTRY_DSN
  - EXERCISEDB_API_KEY (if using paid tier)
  ```

### 5. Phase 1 Completion: CI/CD & Features

- [ ] 5.1 Setup CI/CD pipeline with GitHub Actions (M - 1.5h) ✅ RECOMMENDED

  ```
  Tasks:
  - Create .github/workflows/quality-checks.yml
  - Configure quality gates (type-check, lint, format-check, test:ci)
  - Add status badge to README.md
  - Test workflow on PR
  - Configure to run on push to main and all PRs

  Impact: Catches errors before merge, professional standard
  Reference: See PRD.md "Testing & QA Strategy"

  Note: Jest infrastructure already setup in Phase 0.5 (task 0.5.18)
  CI will run: type-check, lint, format-check, test:ci
  Tests will be written progressively in Phase 2-3

  Milestone: Completes Phase 1 foundation (auth + CI/CD)
  ```

- [ ] 5.2 Add nutrition phase management screen (M - 3h) `[src/app/(tabs)/profile/nutrition.tsx]`

  ```
  Features:
  - Current phase display (bulk/cut/maintenance)
  - Phase duration tracker
  - Simple toggle to change phase
  - Explanation of how phase affects analytics
  - History of past phases (optional for MVP)

  Updates users.nutrition_phase and nutrition_phase_started_at
  ```

---

## Phase 2: Workout Logging (0/20)

**Timeline:** Weeks 6-8 | **Priority:** HIGH
**Goal:** Core workout logging functionality with excellent UX

### 6. Workout Session Core

- [ ] 6.1 Update workout session state management (M - 3h) `[src/stores/workoutStore.ts]`

  ```
  State to manage:
  - Current workout (in progress)
  - Current exercise
  - Sets logged
  - Rest timer state
  - Auto-save to expo-sqlite

  Include:
  - Actions for starting/ending workout
  - Actions for adding exercise
  - Actions for logging set
  - Selectors for workout statistics
  ```

- [ ] 6.2 Design workout active screen (L - 8h) `[src/app/(tabs)/workout/active.tsx]` `[CRITICAL UX]`

  ```
  Features:
  - Exercise list (FlashList)
  - Current exercise highlighted
  - Set logging interface (minimize taps - see TECHNICAL.md UX section)
  - Auto-fill last weight/reps
  - Quick weight adjustment buttons (+2.5kg, +5kg, -2.5kg, -5kg)
  - Rest timer (visible, background-capable)
  - Workout duration timer
  - Save/End workout button
  - Swipe gestures for navigation

  Components needed:
  - ActiveWorkoutHeader
  - ExerciseListItem
  - SetLogger (inline editing)
  - RestTimer
  - WorkoutSummary
  ```

- [ ] 6.3 Implement rest timer with notifications (M - 4h) `[src/components/workout/RestTimer.tsx]`

  ```
  Features:
  - Auto-start after set completion (based on average rest time)
  - Background timer (continues when app minimized)
  - Push notification when complete
  - Quick actions in notification (+15s, Done)
  - Skip/Add time buttons in UI
  - Haptic feedback (10s, 5s, 0s countdown)
  - Sound notification (toggle in settings)

  Expo packages:
  - expo-notifications
  - expo-haptics
  - expo-background-fetch (keep timer alive)
  ```

- [ ] 6.4 Create workout history screen (M - 4h) `[src/app/(tabs)/workout/history.tsx]`

  ```
  Features:
  - List of past workouts (FlashList, paginated)
  - Filter by date range
  - Search by exercise name
  - Tap to view workout details
  - Swipe actions: Repeat, Delete
  - Calendar view (optional)

  Uses:
  - expo-sqlite queries for reactive UI
  - Pagination with LIMIT/OFFSET
  ```

- [ ] 6.5 Create workout detail/summary screen (M - 3h) `[src/app/(tabs)/workout/[id].tsx]`
  ```
  Shows:
  - Workout date, duration
  - All exercises with sets (weight, reps, RPE, RIR)
  - Volume statistics
  - Personal records achieved
  - Notes
  - Actions: Repeat workout, Edit, Delete, Share
  ```

### 7. Exercise Selection & Management

- [ ] 7.1 Create exercise selection modal (L - 6h) `[src/components/workout/ExerciseSelector.tsx]` `[CRITICAL UX]`

  ```
  Features:
  - Real-time search (debounced 300ms)
  - Filter by: Muscle group, Equipment, Difficulty
  - Recently used exercises (top of list)
  - Favorited exercises (starred)
  - FlashList for 500+ exercises performance
  - Exercise images/GIFs preview
  - Quick add button (no need to go back)

  Data source:
  - expo-sqlite local exercises table
  - No API calls (data already seeded from ExerciseDB)
  ```

- [ ] 7.2 Implement search algorithm (M - 3h) `[src/utils/search.ts]`

  ```
  Search strategy:
  - Full-text search on exercise name, muscle groups
  - Fuzzy matching (typos)
  - Ranking: exact match > starts with > contains
  - expo-sqlite raw SQL for custom queries if needed
  ```

- [ ] 7.3 Create favorites/starred system (S - 2h) `[src/stores/favoritesStore.ts]`
  ```
  - Store favorited exercise IDs in AsyncStorage (simple array)
  - Toggle favorite function
  - Filter exercises to show only favorites
  - Zustand store for reactive UI
  ```

### 8. Set Logging Interface

- [ ] 8.1 Create set logging component (L - 6h) `[src/components/workout/SetLogger.tsx]` `[CRITICAL UX]`

  ```
  Design (minimize taps):
  - Pre-populated weight/reps from last set
  - Inline number inputs (no modals)
  - Quick buttons: +2.5kg, +5kg, -2.5kg, -5kg
  - Checkmark to complete set
  - Optional RIR button (small, non-intrusive)

  See TECHNICAL.md UX Best Practices § Quick Set Logging
  ```

- [ ] 8.2 Implement RPE tracking system (M - 3h) `[src/components/workout/RPESelector.tsx]`

  ```
  - Scale 1-10 (visual buttons)
  - Optional per-set
  - Can be toggled in settings
  - Color-coded (green 1-5, yellow 6-7, orange 8-9, red 10)
  ```

- [ ] 8.3 Implement RIR tracking (non-intrusive UX) (M - 3h) `[src/components/workout/RIRTracker.tsx]`

  ```
  Options (see TECHNICAL.md UX section):
  - Option A: End-of-workout prompt for all sets
  - Option B: Optional inline button per set
  - Settings toggle: Enable RIR | Prompt timing

  Scale 0-5 (0 = failure, 5 = easy)
  ```

- [ ] 8.4 Add set history display (M - 3h) `[src/components/workout/SetHistory.tsx]`

  ```
  Shows below current set input:
  - Last 3-5 sets for this exercise
  - From previous workouts
  - Format: "100kg × 8 reps (RPE 8) - 2 days ago"
  - Helps user choose progressive overload
  ```

- [ ] 8.5 Implement auto-suggestions for weight/reps (M - 4h)
  ```
  Logic:
  - If last workout RIR = 0-1 → Suggest +2.5kg
  - If last workout RIR = 2-3 → Suggest +1 rep
  - If last workout RIR = 4-5 → Suggest same weight, more reps
  - Show suggestion subtly (not forcing)
  ```

### 9. Workout Management Features

- [ ] 9.1 Implement "Start Empty Workout" (S - 2h)

  ```
  - Create new workout in expo-sqlite
  - Navigate to active workout screen
  - User adds exercises as they go
  ```

- [ ] 9.2 Implement "Repeat Last Workout" (M - 3h)

  ```
  - Fetch last workout for selected exercise or full workout
  - Pre-populate exercises and target sets
  - User logs actual performance
  - Show comparison with last time
  ```

- [ ] 9.3 Create workout templates (L - 6h) `[src/app/(tabs)/workout/templates.tsx]`

  ```
  - Save current workout as template
  - Name and describe template
  - List of saved templates
  - Start workout from template
  - Edit/Delete templates

  Uses workout_templates tables (see schema)
  ```

- [ ] 9.4 Implement workout notes (S - 2h) `[src/components/workout/NotesInput.tsx]`

  ```
  - Text area for workout notes
  - Saved to workouts.notes field
  - Also per-exercise notes (workout_exercises.notes)
  - Also per-set notes (exercise_sets.notes)
  ```

- [ ] 9.5 Add workout duration timer (S - 2h) `[src/components/workout/WorkoutTimer.tsx]`

  ```
  - Start when workout starts (workouts.started_at)
  - Display in header (MM:SS format)
  - Continues in background
  - Save total duration on workout end
  ```

- [ ] 9.6 **Implement Plate Calculator** (M - 4h) `[src/utils/plateCalculator.ts + Modal]` `[ESSENTIAL FEATURE]`

  ```
  Feature:
  - Small button/icon next to weight input
  - Opens modal showing plate breakdown
  - "Add per side: 20kg + 10kg + 2.5kg"
  - Support Olympic (20kg/45lbs) and Standard (15kg) bars
  - User-configurable available plates in settings

  See TECHNICAL.md UX Best Practices § Plate Calculator
  ```

- [ ] 9.7 Add quick weight change buttons (S - 2h)
  ```
  - Buttons: +5kg, +2.5kg, -2.5kg, -5kg (or lbs equivalent)
  - Located around weight input
  - One-tap weight adjustment
  - Haptic feedback on tap
  ```

---

## Phase 3: Exercise Library & Testing (0/9)

**Timeline:** Weeks 9-10 | **Priority:** MEDIUM
**MAJOR CHANGE:** Using ExerciseDB API instead of manual creation

### 10. Automated Testing

**Note:** Jest infrastructure already setup in Phase 0.5 (task 0.5.18) ✅

```
COMPLETED in Phase 0.5 (task 0.5.18):
- ✅ Installed Jest + React Native Testing Library
- ✅ Configured jest.config.js with jest-expo preset
- ✅ Created jest.setup.js with Expo mocks
- ✅ Added test scripts to package.json
- ✅ Created 3 example test files (7 tests passing)

Reference: See task 0.5.18 for details
```

- [ ] 10.1 **Write unit tests for critical features** (L - 6h)

  ```
  Priority areas (60% coverage target):
  - src/utils/calculations/__tests__/ (1RM, volume, plate calculator)
  - src/utils/validators/__tests__/ (form validation, weight/reps)
  - src/utils/formatters/__tests__/ (weight, date, duration formatting)
  - src/services/database/__tests__/ (CRUD operations, sync logic)

  Test count target: 30-40 tests covering critical paths
  Focus: Data integrity, calculation accuracy, edge cases

  Files to create:
  - src/utils/calculations/__tests__/oneRepMax.test.ts
  - src/utils/validators/__tests__/workout.test.ts
  - src/services/database/__tests__/workouts.test.ts

  Note: Jest infrastructure ready, just write the tests
  ```

### 11. ExerciseDB API Integration

- [ ] 11.1 **Integrate ExerciseDB API and seed Supabase** (L - 6h) `[CRITICAL TIME SAVER]`

  ```
  Tasks:
  - Sign up for ExerciseDB on RapidAPI (free tier or paid)
  - Fetch all exercises from API (1,300+ exercises)
  - Transform to our schema (match exercises table)
  - Bulk insert to Supabase exercises table
  - Sync to local expo-sqlite
  - Mark as is_custom = false

  Script:
  - scripts/seed-exercises-from-exercisedb.ts

  API: https://v2.exercisedb.io/docs
  Time saved: 100-200 hours vs manual creation
  ```

- [ ] 11.2 Design exercise list screen (M - 4h) `[src/app/(tabs)/exercises/index.tsx]`

  ```
  Features:
  - FlashList for performance (500+ items)
  - Search bar (real-time, local expo-sqlite query)
  - Filters: Muscle group, Equipment, Difficulty
  - Show exercise GIF thumbnail (expo-image with caching)
  - Tap to view details
  - Quick add to workout button
  ```

- [ ] 11.3 Create exercise detail screen (M - 4h) `[src/app/(tabs)/exercises/[id].tsx]`
  ```
  Shows:
  - Exercise name
  - GIF/video demonstration (from ExerciseDB)
  - Target muscles (highlighted)
  - Equipment needed
  - Instructions (step-by-step)
  - Difficulty level
  - Personal history (if user has logged this exercise)
  - Actions: Add to favorites, Add to workout, View history
  ```

### 12. Custom Exercises & Management

- [ ] 12.1 Implement custom exercise creation (M - 4h) `[src/app/(tabs)/exercises/create.tsx]`

  ```
  Form:
  - Exercise name (required)
  - Type: strength, cardio, timed, bodyweight
  - Category: compound, isolation
  - Muscle groups (multi-select)
  - Equipment (select)
  - Instructions (text area)
  - Difficulty (select)
  - Mark as is_custom = true, created_by = current user

  Saved to:
  - Supabase exercises table
  - expo-sqlite local
  ```

- [ ] 12.2 Add exercise images/videos (optional for custom) (M - 3h)

  ```
  - Upload to Supabase Storage
  - Image picker (expo-image-picker)
  - Video recording (expo-camera)
  - Store URL in exercises.image_url / video_url
  - Display in exercise detail screen
  ```

- [ ] 12.3 Create exercise filters (M - 3h) `[src/components/exercises/FilterPanel.tsx]`

  ```
  Filters:
  - Muscle group: Chest, Back, Shoulders, Legs, Arms, Core, Full body
  - Equipment: Barbell, Dumbbell, Machine, Bodyweight, Cable, Other
  - Difficulty: Beginner, Intermediate, Advanced
  - Type: Strength, Cardio, Timed
  - Custom vs ExerciseDB

  Implementation:
  - Bottom sheet modal
  - Multiple selection (checkboxes)
  - Apply filters to expo-sqlite query
  - Show active filter count badge
  ```

**Section removed - tasks renumbered above**

- [ ] 12.4 Show exercise history (M - 4h) `[src/components/exercises/ExerciseHistory.tsx]`

  ```
  For selected exercise, show:
  - Chart: Weight progression over time (react-native-chart-kit)
  - Chart: Volume progression (sets × reps × weight)
  - List: Last 10 workouts with this exercise
  - Personal records: Max weight, Max reps, Max volume
  - Average RPE/RIR
  ```

- [ ] 12.5 Implement progression tracking (M - 4h)
  ```
  Calculate and display:
  - Week-over-week change (%)
  - Month-over-month change (%)
  - All-time progress (first vs last workout)
  - Estimated 1RM progression
  - Visual indicators: ⬆️ improving, ➡️ plateau, ⬇️ regressing
  ```

---

## Phase 4: Analytics & Smart Features (0/11)

**Timeline:** Weeks 11-12 | **Priority:** HIGH
**MAJOR CHANGES:** Enhanced with context-aware analytics, load management, personalized 1RM, workout reports

### 13. Progress Dashboard

- [ ] 13.1 Create analytics dashboard (L - 6h) `[src/app/(tabs)/analytics/index.tsx]`

  ```
  Sections:
  - Weekly volume chart (bar chart - react-native-chart-kit)
  - Strength progression (line chart - selected exercises)
  - Workout frequency (calendar heatmap)
  - Personal records (list with badges)
  - Body part split (pie chart or bars)

  Charts library: react-native-chart-kit (Expo Go compatible)
  Data source: expo-sqlite aggregation queries
  ```

- [ ] 13.2 Implement context-aware volume tracking (M - 4h) `[src/lib/analytics/volume.ts]`

  ```
  Calculations (see TECHNICAL.md Analytics section):
  - Total volume: Σ (sets × reps × weight) - exclude warmup sets
  - Effective volume: Weight by exercise position and RIR
  - Volume by muscle group, movement pattern
  - Volume by week/month with nutrition phase context
  - Compound vs isolation volume (1.5x multiplier for compounds)
  - Acute Load (7-day), Chronic Load (28-day), Fatigue Ratio

  Store aggregated data in expo-sqlite for performance
  ```

- [ ] 13.3 Add strength progression charts (M - 4h) `[src/components/analytics/StrengthChart.tsx]`
  ```
  Features:
  - Select exercise(s) to compare
  - X-axis: Time (weeks/months)
  - Y-axis: Weight or Estimated 1RM
  - Show trend line (linear regression)
  - Highlight PRs with markers
  - Pinch to zoom (react-native-chart-kit or manual implementation)
  ```

### 14. Advanced Analytics (Science-Based)

- [ ] 14.1 **Implement context-aware plateau detection** (M - 5h) `[src/lib/analytics/plateau.ts]` `[CRITICAL]`

  ```
  Algorithm (see TECHNICAL.md):
  - Use Mann-Kendall trend test (simple-statistics library)
  - Linear regression for slope
  - Analyze last 4-8 weeks of data
  - CONTEXT-AWARE: Check user nutrition phase
    - If cut: stable = success (not plateau)
    - If bulk: stable = true plateau
    - If maintenance: evaluate normally
  - Return: isPlateau (boolean), trend, confidence, contextMessage

  Science-based statistical analysis, NOT AI/ML
  ```

- [ ] 14.2 Implement load management system (M - 4h) `[src/lib/analytics/loadManagement.ts]` `[NEW - CRITICAL]`

  ```
  Metrics from sports science literature:
  - Acute Load: Sum of volume (last 7 days)
  - Chronic Load: Average volume (last 28 days)
  - Fatigue Ratio: Acute / Chronic
    - >1.5 = HIGH FATIGUE → suggest deload
    - 0.8-1.5 = OPTIMAL
    - <0.8 = DETRAINING → increase volume
  - Overtraining alerts based on sustained high ratios

  Display in dashboard and post-workout reports
  ```

- [ ] 14.3 Implement personalized 1RM with RIR adjustment (M - 3h) `[src/lib/analytics/personalized1RM.ts]` `[NEW]`

  ```
  Enhancement over basic formulas:
  - Calculate base 1RM (avg of Epley, Brzycki, Lombardi)
  - Adjust by RIR: each RIR point = ~3.3% additional capacity
  - Example: 100kg × 8 @ RIR2 = higher e1RM than 105kg × 6 @ RIR0
  - Only use "working sets" (exclude warmups, RIR ≤ 3)
  - Track personal accuracy factor over time

  Compare PRs using adjusted 1RM, not just raw weight
  ```

- [ ] 14.4 Implement volume distribution analysis (M - 3h) `[src/lib/analytics/volumeDistribution.ts]`

  ```
  Analysis:
  - Volume per muscle group (pie chart)
  - Volume per movement pattern (push/pull/legs)
  - Volume per exercise category (compound vs isolation)
  - Volume per day of week (bar chart)
  - Recommendations: "Increase chest volume by 15% to match back"
  - Contextualize by nutrition phase
  ```

- [ ] 14.5 Add workout frequency & consistency analysis (M - 3h)
  ```
  Metrics:
  - Workouts per week (average, trend, by nutrition phase)
  - Most common workout days
  - Consistency score (%) - missed vs planned
  - Streak tracking (current, longest)
  - Calendar heatmap visualization
  - Session completion rate (started vs finished)
  ```

### 15. Performance Feedback & Reports

- [ ] 15.1 **Create post-workout report system** (L - 6h) `[src/components/analytics/WorkoutReport.tsx]` `[NEW - CRITICAL]`

  ```
  Displayed immediately after "End Workout":
  - Performance Score (1-10) based on:
    - Volume vs historical average (adjusted by nutrition phase)
    - Intensity (avg RIR, set completion)
    - Consistency (adherence to plan/template)
  - Fatigue Estimate: Acute/Chronic Load ratio
    - "Low" / "Moderate" / "High"
  - Contextualized Feedback:
    - "Volume down 8% in cut - expected and healthy"
    - "Maintained intensity despite fatigue - excellent"
  - Recommendations:
    - "Consider extra rest day this week" (high fatigue)
    - "Good recovery indicators, push hard next session"

  Keep it concise (3-4 lines max), actionable, science-based
  ```

- [ ] 15.2 **Create weekly summary system** (L - 5h) `[src/components/analytics/WeeklySummary.tsx]` `[NEW]`

  ```
  Generated every Monday morning (background task):
  - Volume trends (by muscle group, vs previous week)
  - Personal records achieved
  - Consistency metrics (workouts completed, streak)
  - Load management status (acute/chronic ratio)
  - Deload recommendation if needed (sustained high fatigue)
  - Nutrition phase context ("Week 3 of cut, strength maintained")

  Push notification: "Your Weekly Summary is ready!"
  ```

- [ ] 15.3 Add context-aware weight suggestions (M - 4h) `[src/lib/suggestions/weightSuggestions.ts]`

  ```
  Science-based rules (NOT AI):
  - If last RIR = 0-1 AND nutrition = bulk → "+2.5kg"
  - If last RIR = 0-1 AND nutrition = cut → "Maintain weight"
  - If last RIR = 4-5 → "+1 rep or +2.5kg"
  - If plateau + bulk → "Consider deload or variation"
  - If fatigue ratio >1.4 → "Maintain or reduce volume"
  - If performance declining 2+ weeks → "Check recovery"

  Show as subtle suggestions, consider all context
  ```

---

## Phase 5: Polish, Monitoring & Beta Launch (0/15)

**Timeline:** Weeks 13-14 | **Priority:** HIGH
**ADDED:** Security, monitoring, compliance requirements

### 16. Performance Optimization

- [ ] 16.1 Optimize bundle size (M - 3h)

  ```
  - Run react-native-bundle-visualizer
  - Identify large dependencies
  - Code splitting for heavy features (charts, analytics)
  - Lazy load screens with React.lazy()
  - Remove unused dependencies
  - Target: <10MB bundle size
  ```

- [ ] 16.2 Improve cold start time (M - 3h)

  ```
  - Profile app launch with Sentry Performance
  - Defer non-critical initialization
  - Optimize expo-sqlite initial queries
  - Use skeleton screens during load
  - Target: <2s cold start
  ```

- [ ] 16.3 Add offline functionality verification (M - 2h)

  ```
  Test scenarios:
  - Start workout offline → Log sets → Go online → Verify sync
  - Edit workout offline → Go online → Verify sync
  - Conflict resolution (edit same workout on 2 devices offline)

  Ensure:
  - No "Network error" shown during workouts
  - Sync queue indicator visible
  - User notified when sync completes
  ```

### 17. Security & Compliance `[REQUIRED FOR APP STORE]`

- [ ] 17.1 **Create Privacy Policy** (M - 3h) `[REQUIRED]`

  ```
  Must include:
  - What data is collected (email, workouts, performance metrics)
  - How it's used (app functionality, analytics)
  - Third-party services (Supabase, Sentry, ExerciseDB)
  - User rights (access, deletion, export)
  - GDPR/CCPA compliance statements

  Host on website or in-app screen
  Link in app settings + login/register screens
  ```

- [ ] 17.2 **Create Terms of Service** (M - 2h) `[REQUIRED]`

  ```
  Must include:
  - Liability disclaimers (NOT medical advice)
  - User-generated content policy
  - Account termination conditions
  - Acceptable use policy
  - Changes to terms

  Link in register screen (user must accept)
  ```

- [ ] 17.3 **Implement data deletion flow** (M - 3h) `[GDPR REQUIRED]`

  ```
  Feature in Profile/Settings:
  - "Delete My Account" button (destructive action)
  - Confirmation dialog with warnings
  - Delete all data from Supabase (cascades via foreign keys)
  - Clear expo-sqlite local database
  - Clear AsyncStorage
  - Sign out user

  See TECHNICAL.md § Compliance code examples
  ```

- [ ] 17.4 **Implement data export** (M - 3h) `[GDPR REQUIRED]`

  ```
  Feature in Profile/Settings:
  - "Export My Data" button
  - Generate JSON file with all user data:
    - Profile, preferences
    - All workouts with exercises and sets
    - Custom exercises
    - Analytics history
  - Share via system share sheet
  - Email option

  Format: JSON (structured, human-readable)
  ```

### 18. Monitoring & Analytics

- [ ] 18.1 **Setup user analytics** (M - 3h) `[PostHog or Mixpanel]`

  ```
  Track events:
  - User registration
  - Workout started/completed
  - Exercise added
  - Set logged
  - Feature usage (templates, plate calculator, etc.)
  - Screen views

  Privacy:
  - No PII (use UUID as identifier)
  - Respect user opt-out
  - GDPR-compliant

  Free tier: PostHog (1M events/month)
  ```

- [ ] 18.2 **Verify Sentry monitoring** (S - 1h)

  ```
  Test:
  - Error reporting (throw test error)
  - Performance monitoring (slow query simulation)
  - Crash reporting (native crash simulation)
  - User context attached

  Setup alerts:
  - Crash rate >0.5% → Email notification
  - Error rate >5% → Slack notification (if team)
  ```

- [ ] 18.3 Setup performance monitoring (M - 2h)

  ```
  Monitor with Sentry:
  - Screen load times (target <500ms)
  - API call durations (target <1s)
  - Database query times (target <200ms)
  - Cold start time (target <2s)

  Set up dashboards for:
  - App performance overview
  - User experience metrics
  - Error trends
  ```

### 19. Beta Launch Preparation

- [ ] 19.1 Create onboarding flow (M - 4h) `[src/app/(onboarding)/]`

  ```
  Screens:
  - Welcome screen
  - Feature highlights (3-4 screens with images)
  - Preferences setup:
    - Units (kg/lbs)
    - Experience level
    - Goals (optional)
  - Skip option

  Show once on first launch
  Store completion in AsyncStorage
  ```

- [ ] 19.2 Add user feedback system (M - 3h)

  ```
  Options:
  - In-app feedback form
  - "Report Bug" button
  - "Request Feature" button
  - Email to support@halterofit.com (or similar)

  Integration:
  - Send to email via Supabase Edge Function
  - OR use service like UserVoice, Canny
  ```

- [ ] 19.3 Prepare beta release (M - 4h)

  ```
  Tasks:
  - Create app icon (512×512, 1024×1024 versions)
  - Create splash screen
  - Create app screenshots (iOS, Android)
  - Write app description for stores
  - Set up TestFlight (iOS) and Internal Testing (Android)
  - Configure EAS Build for production

  EAS Build:
  - eas build --platform ios --profile production
  - eas build --platform android --profile production
  - eas submit (when ready)
  ```

- [ ] 19.4 Write beta testing guide (S - 1h)

  ```
  Document for beta testers:
  - How to install (TestFlight/Play Store link)
  - What to test
  - How to report bugs
  - Known limitations
  - Feedback form link
  ```

- [ ] 19.5 App Store compliance checklist (M - 2h)

  ```
  iOS:
  - Privacy manifest (iOS 17+)
  - Required reason API declarations
  - Age rating (4+ suitable)
  - App icon (all sizes)
  - Screenshots (all device sizes)

  Android:
  - Privacy policy URL
  - Content rating questionnaire
  - Target SDK version (latest)
  - App icon (adaptive icon)
  - Screenshots (phone, tablet)
  ```

---

**Last Updated:** Auto-updated by task-tracker agent
**Next Review:** After Phase 0.5 completion
