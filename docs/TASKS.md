# 📋 Project Roadmap

**Project**: Halterofit v0.1.0
**Status**: 🟡 In Progress (Phase 0.5)
**Progress**: 21/98 tasks (21%) • ![](https://img.shields.io/badge/Progress-21%25-red)
**Timeline**: 16 weeks • Started 2025-01-20 • Target 2025-05-12
**Last Updated**: 2025-10-31 • **Next Milestone**: Complete Infrastructure & Begin Phase 1

---

## 📊 Executive Summary

**Current Focus**: Phase 0.5.D - Infrastructure Completion
**Phase Progress**: 20/26 tasks (77%) • **Overall**: 21/98 tasks (21%)
**Critical Blockers**: None • **Velocity**: ~4 tasks/week (excellent!)

### Recent Completions ✅

1. **0.5.3** - Configure FlashList (WorkoutList component, 120-item test, fixtures, docs)
2. **0.5.28** - Install & Launch Development Build (Android APK, hot reload verified)
3. **0.5.27** - Supabase Schema & Sync (migration, RLS policies, sync protocol, 37 tests)
4. **0.5.11** - Error Handling Layer (custom errors, try/catch, security validation)
5. **0.5.5** - Sentry Error Monitoring (production-only, privacy, DSN configured)

---

## 📋 Kanban

| 📝 TODO (Top 5)                  | 🔨 DOING | ✅ DONE (Last 5)            |
| -------------------------------- | -------- | --------------------------- |
| **0.5.4** expo-image `[S]` 🟡    |          | **0.5.3** FlashList config  |
| **1.1** Login screen `[M]` 🟠    |          | **0.5.28** Install & Launch |
| **1.2** Register screen `[M]` 🟠 |          | **0.5.27** Supabase sync    |
| **1.3** Supabase Auth `[M]` 🟠   |          | **0.5.11** Error handling   |
| **1.4** User profile `[M]` 🟠    |          | **0.5.5** Sentry monitoring |

**Progress**: Phase 0.5: 20/26 (77%) • Overall: 21/98 (21%)
**Velocity**: ~4 tasks/week (excellent!) • **ETA**: Phase 0.5 complete in ~1.5 weeks
**NEXT**: 0.5.4 Configure expo-image 🟡 Quick win

---

## 📖 Table of Contents

1. [📊 Executive Summary](#-executive-summary)
2. [📋 Kanban](#-kanban)
3. [🗺️ Development Roadmap](#development-roadmap)
4. [Phase 0.5: Architecture & Foundation (19/26)](#phase-05-architecture--foundation-1926)
5. [Phase 1: Authentication & Foundation (1/15)](#phase-1-authentication--foundation-115)
6. [Phase 2: Workout Logging (0/20)](#phase-2-workout-logging-020)
7. [Phase 3: Exercise Library & Testing (0/9)](#phase-3-exercise-library--testing-09)
8. [Phase 4: Analytics & Smart Features (0/11)](#phase-4-analytics--smart-features-011)
9. [Phase 5: Polish, Monitoring & Beta Launch (0/15)](#phase-5-polish-monitoring--beta-launch-015)

---

## Development Roadmap

```
Phase 0.5: Architecture & Foundation (19/26 tasks)
   ├─ Initial setup ✅
   ├─ Dev tools setup ✅
   ├─ EAS Build + Dev Client ✅
   ├─ WatermelonDB Schema & Models ✅
   ├─ WatermelonDB Database Operations ✅
   ├─ MMKV Storage Migration ✅
   ├─ Victory Native Charts Migration ✅
   ├─ Development Build Migration ✅
   └─ NEXT: Complete Infrastructure (0.5.3-4) ⚡ PRIORITY
        ↓
Phase 1: Authentication & Foundation (1/15 tasks)
   ├─ Supabase Auth integration
   ├─ Login/Register screens
   ├─ CI/CD pipeline ✅
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
   ├─ Progress charts (Victory Native)
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

| Phase     | Tasks  | Est. Time    | Status       | Dependencies                     |
| --------- | ------ | ------------ | ------------ | -------------------------------- |
| **0.5**   | 26     | 50-60h       | IN PROGRESS  | None (started)                   |
| **1**     | 15     | 25-30h       | BLOCKED      | ← Phase 0.5 migration + blockers |
| **2**     | 20     | 50-60h       | BLOCKED      | ← Phase 1 auth                   |
| **3**     | 9      | 30-40h       | BLOCKED      | ← Phase 2 workout core           |
| **4**     | 11     | 35-45h       | BLOCKED      | ← Phase 3 exercise library       |
| **5**     | 15     | 40-50h       | BLOCKED      | ← Phase 4 analytics              |
| **TOTAL** | **96** | **230-290h** | **20% done** | **12-15 weeks at 20h/week**      |

**⚠️ Critical Path:** Phase 0.5.D (Infrastructure) completes Phase 0.5, unblocking Phase 1.

---

## Phase 0.5: Architecture & Foundation (19/26)

**Timeline:** Weeks 1-7 | **Priority:** HIGHEST
**Goal:** Production-ready architecture and critical foundation

**Progress:** 19/26 tasks (73%) | **Est. Time Remaining:** ~7h (Phase 0.5 completion)

**Current Stack:** Development Build (WatermelonDB ✅ + MMKV ✅ + Victory Native ✅)
**Target Stack:** Development Build (WatermelonDB ✅ + MMKV ✅ + Victory Native ✅)

**Migration Status:** Database ✅ | Storage ✅ | Charts ✅ | Supabase Sync ✅ | Dev Build ✅
**Achievement:** Migrated early at 13% project completion, avoiding 40-60% code rewrite later.

---

### 0.5.A: Initial Setup & Analysis (5/5) ✅ COMPLETE

**Goal:** Establish project foundation with database, architecture, and development tools

- [x] 0.5.1 **Setup database with Supabase sync** (M - 4h) ✅
  - Supabase project created with PostgreSQL database
  - Initial schema design (users, workouts, exercises, sets)
  - Environment variables configured for API keys

- [x] 0.5.7 **Complete modular architecture refactor** (M - 3h) ✅
  - Organized codebase into modular structure (services, stores, components)
  - Established import patterns and barrel exports
  - Created ARCHITECTURE.md documentation

- [x] 0.5.8 **Technical audit and corrections planning** (M - 2h) ✅
  - Identified 8 critical corrections required
  - Created AUDIT_FIXES.md with prioritized action plan
  - Established migration strategy for native dependencies

- [x] 0.5.17 **Setup professional dev tools** (S - 30min) ✅
  - Configured ESLint with TypeScript and React plugins
  - Setup Prettier with project formatting standards
  - Integrated Husky for pre-commit hooks

- [x] 0.5.18 **Setup Jest testing infrastructure** (S - 1h) ✅
  - Installed Jest with React Native Testing Library
  - Configured LokiJS adapter for WatermelonDB testing
  - Created test helpers and fixtures structure

---

### 0.5.B: Development Build Migration (10/10) ✅ COMPLETE

**Goal:** Migrate to production-ready stack (WatermelonDB, MMKV, Victory Native, Development Build)

- [x] 0.5.20 **Setup EAS Build Account & CLI** (S - 30min) ✅
  - Created Expo account and installed EAS CLI globally
  - Configured project credentials and authentication
  - Verified EAS project linking and build readiness

- [x] 0.5.21 **Create eas.json Configuration** (S - 30min) ✅
  - Created development build profile (android/ios)
  - Configured build settings and distribution channels
  - Added environment variables for build variants

- [x] 0.5.22 **Install Native Packages & Build Development Build** (L - 2-3h) ✅
  - Installed WatermelonDB, MMKV, Victory Native with native dependencies
  - Generated Android APK (first successful build)
  - Resolved native module linking issues

- [x] 0.5.23 **Create WatermelonDB Models & Schema** (L - 2h) ✅
  - Created 5 models: User, Workout, Exercise, WorkoutExercise, ExerciseSet
  - Defined schema with relationships and indexes
  - Setup database initialization and migrations

- [x] 0.5.23.1 **Phase 1 Critical Fixes (Post-Analysis)** (M - 1.5h) ✅
  - Fixed async storage race conditions
  - Corrected model relationships and queries
  - Updated TypeScript types for strict mode

- [x] 0.5.24 **Migrate Database Operations to WatermelonDB** (L - 1.5h) ✅
  - Migrated CRUD operations from Supabase to WatermelonDB
  - Implemented dual API (Promise + Observable) for React hooks
  - Added 37 unit tests with LokiJS adapter

- [x] 0.5.25 **Migrate Storage to MMKV** (M - 1h) ✅
  - Replaced AsyncStorage with MMKV (10-30x faster)
  - Created Zustand persist adapter for MMKV
  - Migrated auth and workout stores to MMKV persistence

- [x] 0.5.26 **Migrate Charts to Victory Native** (M - 1h) ✅
  - Replaced react-native-chart-kit with Victory Native (Skia-based)
  - Created LineChart and BarChart abstraction components
  - Added example charts with skeleton states

- [x] 0.5.27 **Create Supabase Schema & Sync Functions** (L - 1.5h) ✅ 2025-01-31
  - SQL migration with 4 tables (users, workouts, exercises, sets)
  - Row-Level Security (RLS) policies for user data isolation
  - WatermelonDB sync protocol with 37 passing tests

- [x] 0.5.28 **Verify Development Build Launch** (S - 15min) ✅ 2025-01-31
  - Android APK installed and launched successfully
  - Hot reload verified (Metro Bundler connection stable)
  - All native dependencies functioning correctly

---

### 0.5.C: Critical Corrections - Blockers (4/4) ✅ COMPLETE

**Goal:** Store persistence, error handling, and monitoring

- [x] 0.5.9 **User ID Persistence with Zustand Persist** (M - 2.5h) ✅
  - Implemented Zustand persist middleware with MMKV adapter
  - User ID survives app restarts and reinstalls
  - Eliminated race conditions with async storage

- [x] 0.5.10 **Zustand Persist for Workout Store** (S - 1h) ✅
  - Added persistence for active workout state
  - Auto-restores in-progress workouts after app restart
  - Integrated with MMKV for fast synchronous reads

- [x] 0.5.11 **Error Handling Layer** (M - 3h) ✅
  - Custom error types: DatabaseError, AuthError, NetworkError
  - Try/catch blocks in all database operations with security validation
  - User-friendly messages + dev-mode technical details

- [x] 0.5.5 **Configure Sentry for error monitoring** (M - 2h) ✅
  - Production-only error tracking (disabled in dev mode)
  - Privacy-first: No PII in error reports
  - DSN configured with environment variables

---

### 0.5.D: Infrastructure Completion (0/2)

**Goal:** Configure remaining performance libraries

- [x] 0.5.3 **Configure FlashList for optimized lists** (S - 1h)
  - Created WorkoutList component (FlashList wrapper, memoized)
  - Created WorkoutListItem component (memoized, ~88px height)
  - Test screen with 120 mock workouts (smooth 60 FPS scroll)
  - Updated fixtures with 8 workout templates
  - Complete documentation (usage guide, Phase 2 integration)

- [ ] 0.5.4 **Configure expo-image with caching** (S - 1h)
  - Replace Image with ExpoImage in exercise library
  - Configure memory and disk cache (cachePolicy="memory-disk")
  - Test with exercise thumbnails (500+ images)

---

### 0.5.E: Optional Improvements (0/5)

**Goal:** Nice-to-have improvements (defer to Phase 1-2, implement progressively)

- [ ] 0.5.12 **Repository Pattern** (L - 8h)
  - Defer: Implement progressively in Phase 1-2
  - Impact: Makes future DB optimization easier

- [ ] 0.5.13 **Sync Conflict Detection** (L - 8h)
  - Defer: Must complete before Phase 2 (multi-device)
  - Impact: Prevents data corruption on conflicts

- [ ] 0.5.14 **Database Indexes** (M - 2h)
  - Defer: Add when performance becomes issue (500+ workouts)
  - Impact: Query performance

- [ ] 0.5.15 **Chart Abstraction** (M - 3h)
  - Defer: Victory Native already abstracted
  - Impact: Minimal (already using good library)

- [ ] 0.5.16 **Domain vs DB Types** (M - 4h)
  - Defer: Organize types during Phase 1-2 development
  - Impact: Minor code organization

---

## Phase 1: Authentication & Foundation (1/15)

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
  - Session management with MMKV encrypted storage
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

- [ ] 1.16 **Document Manual E2E Test Checklists** (S - 1.5h) `[e2e/manual/]`
  - Create `e2e/manual/sync-checklist.md` (Supabase sync scenarios)
  - Create `e2e/manual/offline-crud.md` (Offline CRUD operations)
  - Create `e2e/manual/auth-flows.md` (Login/logout/reset password)
  - Document prerequisites (Dev Build, test account, network toggle)
  - Include pass/fail criteria for each scenario
  - Reference: `src/services/database/__tests__/README.md` § E2E Testing

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

### 5. Completion: CI/CD & Features

- [x] 5.1 **Setup CI/CD pipeline with GitHub Actions** (M - 1.5h) ✅

  **Completed:** 2025-10-30 • **Refactored** with parallel architecture

  **Architecture:**
  - ⚡ **4 parallel jobs**: code-quality, unit-tests, security-scan, dependabot-auto-merge
  - 💾 **Caching**: TypeScript (.tsbuildinfo), ESLint (.eslintcache), Jest
  - 🔒 **Security**: npm audit HIGH/CRITICAL vulnerabilities fail build
  - 📊 **Performance**: ~30s (down from ~65s, 2.2x faster)
  - 🎯 **Coverage**: Reports uploaded, threshold ready for Phase 1 (40%)
  - 📝 **Documentation**: Complete CI/CD architecture guide in CONTRIBUTING.md

  **CD Workflows (Phase 2+):**
  - cd-preview.yml: EAS preview builds (disabled, manual only)
  - cd-production.yml: EAS production builds (disabled, manual only)

  **Dependabot Auto-Merge:**
  - ✅ GitHub Actions: All versions
  - ✅ Dev dependencies: Minor/patch
  - ✅ Runtime: Patch/minor only
  - ❌ Runtime major: Manual review with detailed comment

  **Badges:** CI status + Coverage in README.md

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
  - Auto-save to WatermelonDB

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
  - WatermelonDB reactive queries with .observe()
  - Pagination with Q.take/Q.skip
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
  - WatermelonDB local exercises table
  - No API calls (data already seeded from ExerciseDB)
  ```

- [ ] 7.2 Implement search algorithm (M - 3h) `[src/utils/search.ts]`

  ```
  Search strategy:
  - Full-text search on exercise name, muscle groups
  - Fuzzy matching (typos)
  - Ranking: exact match > starts with > contains
  - WatermelonDB Q.where() with Q.like() for pattern matching
  ```

- [ ] 7.3 Create favorites/starred system (S - 2h) `[src/stores/favoritesStore.ts]`
  ```
  - Store favorited exercise IDs in MMKV (simple array)
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
  - Create new workout in WatermelonDB
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

- [ ] 10.2 **Setup Maestro E2E Automation** (L - 6h) `[e2e/maestro/]`

  ```
  Tasks:
  - Install Maestro CLI and dependencies
  - Create e2e/maestro/ directory structure
  - Write initial E2E tests (login, create workout, sync)
  - Configure Maestro flows for critical user journeys
  - Document Maestro setup in docs/E2E_STRATEGY.md
  - Integrate with CI/CD (GitHub Actions + EAS Build)

  Test files to create:
  - e2e/maestro/auth-login.yaml
  - e2e/maestro/workout-create-offline.yaml
  - e2e/maestro/sync-offline-changes.yaml

  Reference: Manual checklists from Phase 1 (task 1.16)
  Framework: Maestro (YAML-based, simpler than Detox)
  CI Integration: Run on EAS Build preview (not every commit)

  Note: Requires manual E2E checklists from Phase 1 as baseline
  ```

### 11. ExerciseDB API Integration

- [ ] 11.1 **Integrate ExerciseDB API and seed Supabase** (L - 6h) `[CRITICAL TIME SAVER]`

  ```
  Tasks:
  - Sign up for ExerciseDB on RapidAPI (free tier or paid)
  - Fetch all exercises from API (1,300+ exercises)
  - Transform to our schema (match exercises table)
  - Bulk insert to Supabase exercises table
  - Sync to local WatermelonDB
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
  - Search bar (real-time, local WatermelonDB query)
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
  - WatermelonDB local
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
  - Apply filters to WatermelonDB query
  - Show active filter count badge
  ```

**Section removed - tasks renumbered above**

- [ ] 12.4 Show exercise history (M - 4h) `[src/components/exercises/ExerciseHistory.tsx]`

  ```
  For selected exercise, show:
  - Chart: Weight progression over time (Victory Native)
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
  - Weekly volume chart (bar chart - Victory Native)
  - Strength progression (line chart - selected exercises)
  - Workout frequency (calendar heatmap)
  - Personal records (list with badges)
  - Body part split (pie chart or bars)

  Charts library: Victory Native (professional charts)
  Data source: WatermelonDB aggregation queries
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

  Store aggregated data in WatermelonDB for performance
  ```

- [ ] 13.3 Add strength progression charts (M - 4h) `[src/components/analytics/StrengthChart.tsx]`
  ```
  Features:
  - Select exercise(s) to compare
  - X-axis: Time (weeks/months)
  - Y-axis: Weight or Estimated 1RM
  - Show trend line (linear regression)
  - Highlight PRs with markers
  - Pinch to zoom (Victory Native gestures)
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
  - Optimize WatermelonDB initial queries
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
  - Clear WatermelonDB local database
  - Clear MMKV storage
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
  Store completion in MMKV
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
