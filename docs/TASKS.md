# Project Roadmap

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Kanban](#kanban)
3. [Development Roadmap](#development-roadmap)
4. [Phase Timeline & Effort](#phase-timeline--effort)
5. [Phase 0.5: Architecture & Foundation (21/21)](#phase-05-architecture--foundation-2121)
6. [Phase 0.6: UI/UX Foundation (8/8)](#phase-06-uiux-foundation-88)
7. [Phase 1: Authentication & Foundation (0/16)](#phase-1-authentication--foundation-016)
8. [Phase 2: Workout Plans & Navigation (0/12)](#phase-2-workout-plans--navigation-012)
9. [Phase 3: Active Workout Tracking (0/9)](#phase-3-active-workout-tracking-09)
10. [Phase 4: Profile & Settings (0/5)](#phase-4-profile--settings-05)
11. [Phase 5: Polish & Deployment (0/5)](#phase-5-polish--deployment-05)
12. [Deferred Tasks](#deferred-tasks-7-tasks)
13. [Post-MVP Backlog](#post-mvp-backlog)

---

**Project**: Halterofit v0.1.0
**Status**: 🔄 In Progress (Phase 1 - Authentication & Foundation)
**Progress**: 29/76 tasks (38%) • MVP Scope: 76 active + 7 deferred tasks
**Timeline**: 13.5-14 weeks • Started 2025-01-20 • Target 2025-04-22
**Last Updated**: 2025-11-06 • **Next Milestone**: Phase 1 Auth Implementation 🚀

---

## Executive Summary

**Current Focus**: Phase 1 - Authentication & Foundation (Auth UI + Testing Infrastructure)
**Phase Progress**: 21/21 (Phase 0.5 - 100%) + 8/8 (Phase 0.6 - 100%) • **Overall**: 29/76 tasks (38%)
**Critical Blockers**: None • **Velocity**: ~5 tasks/week

**Recent Milestones**: See [CHANGELOG.md](./CHANGELOG.md) for completed tasks and release notes

---

## Kanban

**Legend:** 🔥 High Priority | 🟠 Blocked/Pending | ✅ Done | `[S/M/L]` Size (Small/Medium/Large)

| TODO (Top 5)                      | DOING | DONE (Last 5)                  |
| --------------------------------- | ----- | ------------------------------ |
| **1.10** Login screen `[M]`       |       | **0.6.8** ExerciseDB import ✅ |
| **1.11** Register screen `[M]`    |       | **0.6.10** Schema fix ✅ 🔥    |
| **1.14** Supabase auth `[M]`      |       | **0.6.9** Design system ✅     |
| **1.13** Protected routes `[S]`   |       | **0.6.6** Environment vars ✅  |
| **1.15** Auth test infra `[S]` 🔥 |       | **0.6.4** Core components ✅   |

**Progress**: Phase 0.5: 21/21 (100%) • Phase 0.6: 8/8 (100%) • Phase 1: 0/16 (0%) • Overall: 29/76 (38%)
**Velocity**: ~5 tasks/week • **ETA**: Phase 1 completion in ~3 weeks, MVP in 12 weeks
**NEXT**: 1.10 Login Screen (2h) → Phase 1 Auth kickoff ⚡

---

## Development Roadmap

**Note:** MVP scope = 83 tasks total (76 active + 7 deferred). Analytics and advanced features moved to Post-MVP backlog.

```
Phase 0.5: Architecture & Foundation (21/21 tasks) 100% ✅
   ├─ Initial setup ✅
   ├─ Dev tools setup ✅
   ├─ EAS Build + Dev Client ✅
   ├─ WatermelonDB Schema & Models ✅
   ├─ WatermelonDB Database Operations ✅
   ├─ MMKV Storage Migration ✅
   ├─ Victory Native Charts Migration ✅
   ├─ Development Build Migration ✅
   └─ Infrastructure Complete ✅
        ↓
Phase 0.6: UI/UX Foundation (8/8 tasks) 100% ✅
   ├─ React Native Reusables ✅
   ├─ Vector Icons ✅
   ├─ Dark theme ✅
   ├─ Core components ✅
   ├─ Design system ✅
   ├─ Environment variables ✅
   ├─ Schema Fix ✅
   ├─ ExerciseDB Import ✅
   └─ Infrastructure Complete ✅
        ↓
Phase 1: Authentication & Foundation (0/16 tasks) 🔄
   ├─ A: Auth UI & Screens (5 tasks)
   ├─ B: Testing Infrastructure (8 tasks) 🆕
   └─ C: Database Enhancements (3 tasks) 🆕
        ↓
Phase 2: Workout Plans & Navigation (0/12 tasks)
   ├─ Bottom tabs (Workout, Profile)
   ├─ Workout sub-tabs (Find, Planned)
   ├─ Jefit-style Plan system
   ├─ "All Plans" management
   ├─ Exercise selector (1,300+ ExerciseDB)
   └─ Workout Day creation/editing
        ↓
Phase 3: Active Workout Tracking (0/9 tasks)
   ├─ Active workout screen
   ├─ Swipe gestures between exercises
   ├─ Set logging (W marker, weight, reps)
   ├─ Rest timer + notifications
   ├─ Auto-fill from last workout
   └─ Workout history
        ↓
Phase 4: Profile & Settings (0/5 tasks)
   ├─ Profile screen
   ├─ Settings (units, logout)
   └─ GDPR compliance (export, delete)
        ↓
Phase 5: Polish & Deployment (0/5 tasks)
   ├─ Sentry verification
   ├─ Performance optimization
   └─ TestFlight/Play Store
        ↓
    🎉 MVP COMPLETE

    (Post-MVP: Analytics, Plate Calculator, Set History, etc.)
```

### Phase Timeline & Effort

| Phase     | Tasks  | Est. Time | Status       | Dependencies                  |
| --------- | ------ | --------- | ------------ | ----------------------------- |
| **0.5**   | 21     | 50-60h    | 100% DONE ✅ | None (started)                |
| **0.6**   | 8      | 15-18h    | 100% DONE ✅ | ← Phase 0.5 complete          |
| **1**     | 16     | ~31h      | READY 🟢     | ← Phase 0.6 complete          |
| **2**     | 12     | ~31h      | BLOCKED      | ← Phase 1 auth                |
| **3**     | 9      | ~27h      | BLOCKED      | ← Phase 2 plans               |
| **4**     | 5      | ~11h      | BLOCKED      | ← Phase 3 (parallel OK)       |
| **5**     | 5      | ~9h       | BLOCKED      | ← Phases 1-4 complete         |
| **TOTAL** | **76** | **~157h** | **35% done** | **13.5-14 weeks at 10h/week** |

**⚠️ Critical Path:** Phase 1 (Auth + Tests) → Phase 2 (Plans) → Phase 3 (Active Workout)

**📊 MVP Scope Update (Post-Audit):**

- Original: 119 tasks, 17 weeks
- Pre-Audit: 72 total (65 active + 7 deferred) tasks, 12-13 weeks (~45% reduction)
- **Post-Audit: 83 total (76 active + 7 deferred) tasks, 13.5-14 weeks** 🆕
- **Added**: 12 tasks (+31h) for quality/reliability (schema fix, auth tests, DB enhancements)
- **Excludes**: 7 deferred/optional tasks + 47 Post-MVP features
- Analytics, advanced features → Post-MVP backlog

---

## Phase 0.5: Architecture & Foundation (21/21) ✅ COMPLETE

**Timeline:** Weeks 1-7 | **Priority:** HIGHEST
**Goal:** Production-ready architecture and critical foundation

**Progress:** 21/21 tasks (100%) | **Status:** COMPLETE ✅ | **Deferred:** 5 optional tasks (0.5.12-0.5.16)
**Stack:** Development Build (WatermelonDB + MMKV + Victory Native + Supabase Sync)
**Details:** See [CHANGELOG.md § 2025-01-31](./CHANGELOG.md#2025-01-31---phase-05-complete-)

---

### 0.5.A: Initial Setup & Analysis (5/5) ✅ COMPLETE

- [x] 0.5.1 **Setup database with Supabase sync** (M - 4h) ✅
- [x] 0.5.7 **Complete modular architecture refactor** (M - 3h) ✅
- [x] 0.5.8 **Technical audit and corrections planning** (M - 2h) ✅
- [x] 0.5.17 **Setup professional dev tools** (S - 30min) ✅
- [x] 0.5.18 **Setup Jest testing infrastructure** (S - 1h) ✅

---

### 0.5.B: Development Build Migration (10/10) ✅ COMPLETE

- [x] 0.5.20 **Setup EAS Build Account & CLI** (S - 30min) ✅
- [x] 0.5.21 **Create eas.json Configuration** (S - 30min) ✅
- [x] 0.5.22 **Install Native Packages & Build Development Build** (L - 2-3h) ✅
- [x] 0.5.23 **Create WatermelonDB Models & Schema** (L - 2h) ✅
- [x] 0.5.23.1 **Phase 1 Critical Fixes (Post-Analysis)** (M - 1.5h) ✅
- [x] 0.5.24 **Migrate Database Operations to WatermelonDB** (L - 1.5h) ✅
- [x] 0.5.25 **Migrate Storage to MMKV** (M - 1h) ✅
- [x] 0.5.26 **Migrate Charts to Victory Native** (M - 1h) ✅
- [x] 0.5.27 **Create Supabase Schema & Sync Functions** (L - 1.5h) ✅ 2025-01-31
- [x] 0.5.28 **Verify Development Build Launch** (S - 15min) ✅ 2025-01-31

---

### 0.5.C: Critical Corrections - Blockers (4/4) ✅ COMPLETE

- [x] 0.5.9 **User ID Persistence with Zustand Persist** (M - 2.5h) ✅
- [x] 0.5.10 **Zustand Persist for Workout Store** (S - 1h) ✅
- [x] 0.5.11 **Error Handling Layer** (M - 3h) ✅
- [x] 0.5.5 **Configure Sentry for error monitoring** (M - 2h) ✅

---

### 0.5.D: Infrastructure Completion (2/2) ✅ COMPLETE

- [x] 0.5.3 **Configure FlashList for optimized lists** (S - 1h) ✅
- [x] 0.5.4 **Configure expo-image with caching** (S - 1h) ✅ 2025-01-31

---

---

## Phase 0.6: UI/UX Foundation (8/8) ✅ COMPLETE

**Timeline:** Week 8 | **Priority:** ✅ COMPLETE
**Progress:** 8/8 tasks (100%) ✅ | **Completed:** 2025-11-06 | **Deferred:** 2 tasks (0.6.5, 0.6.7)
**Stack:** React Native Reusables + @expo/vector-icons + NativeWind v4 + Reanimated v4
**Details:** See [CHANGELOG.md § 2025-11-06](./CHANGELOG.md#2025-11-06---phase-06-complete-)

---

### 0.6.A: Component Library Setup (3/3) ✅ COMPLETE

- [x] 0.6.1 **Install React Native Reusables + Dependencies** (M - 2h) ✅ 2025-01-30
- [x] 0.6.2 **Configure @expo/vector-icons** (S - 30min) ✅ 2025-01-30
- [x] 0.6.3 **Validate Dark Theme Configuration** (M - 1h) ✅ 2025-01-30

---

### 0.6.B: Core Components Installation (1/1) ✅ COMPLETE

- [x] 0.6.4 **Install Phase 1 Components (Auth)** (M - 1.5h) ✅ 2025-01-30

---

### 0.6.C: Foundation Infrastructure (4/4) ✅ COMPLETE

- [x] 0.6.6 **Setup Environment Variables** (S - 10min) ✅ 2025-02-01
- [x] **Bulk Import ExerciseDB Library (1,500+ exercises)** (L - 4h) ✅ 2025-11-06
- [x] 0.6.9 **Design Brainstorming: Fitness Components** (M - 2-3h) ✅ 2025-01-30
- [x] 0.6.10 **Fix nutrition_phase schema mismatch** (XS - 1h) 🔥 ✅ 2025-11-04

---

---

## Phase 1: Authentication & Foundation (0/16)

**Timeline:** Weeks 9-11 | **Priority:** HIGH
**Goal:** Login/Register basics + Testing infrastructure (90% auth coverage) + Database enhancements

**Progress:** 0/16 tasks (0%) | **Est. Time:** ~31h (3 weeks)

**Dependencies:** Phase 0.6 complete (UI components ready + schema fix 0.6.10)

**Key Note:** Biometric auth removed (not needed - user logs in once). Simple email/password authentication only.

**Organization:** Tasks grouped by category (A: Auth UI, B: Testing, C: Database) for clarity and logical execution flow.

**📐 Architecture Decision (ADR):**
Auth implementation follows **Hooks + Services + Store** pattern for optimal testability and code clarity:

- **Store** (Zustand): Pure state only (user, isAuthenticated, isLoading)
- **Services** (`auth/`): Raw Supabase API calls (signIn, signUp, signOut)
- **Hooks** (`useAuth`): Business logic wrapper integrating store + services

**Rationale:** 3x easier testing (8 testing tasks in Phase 1.B), industry standard, positive ROI.
→ **Full implementation details:** [PHASE1_PLAN.md](./PHASE1_PLAN.md)

---

### A: Auth UI & Screens (5 tasks - ~10.5h)

→ **Implementation Guide:** [PHASE1_PLAN.md § Task Details A](./PHASE1_PLAN.md#task-details-a-auth-ui--screens)

- [ ] 1.10 **Create login screen UI** (M - 2h) `[src/app/(auth)/login.tsx]`
  - Email/password inputs with validation
  - Login button with loading state
  - Links: "Forgot password" (→1.12), "Create account" (→1.11)
  - Error handling with Alert component
  - Uses: Button, Input, Label, Alert (React Native Reusables)

- [ ] 1.11 **Create register screen UI** (M - 2h) `[src/app/(auth)/register.tsx]`
  - Email/password inputs with confirmation field
  - Validation: email format, password ≥8 chars, terms acceptance
  - Register button with loading state + link to login
  - Error display with Alert component
  - Uses: Button, Input, Label, Alert (React Native Reusables)

- [ ] 1.12 **Implement password reset flow** (M - 2h) `[src/app/(auth)/reset-password.tsx]`
  - Request reset screen (email input) + deep link handler
  - Supabase password reset email integration
  - New password form with success/error states

- [ ] 1.13 **Setup protected routes & navigation guards** (S - 1.5h) `[src/app/_layout.tsx]`
  - Redirect: unauthenticated → login, authenticated → Workout tab
  - Loading screen during auth check
  - Deep linking support for auth flows

- [ ] 1.14 **Implement Supabase Auth integration** (M - 3h) `[src/services/auth/]`
  - Core functions: signIn(), signUp(), signOut(), refreshSession()
  - Session management (JWT tokens in MMKV via storage abstraction)
  - Error handling with user-friendly messages
  - Auth state persistence across app restarts

---

### B: Testing Infrastructure (8 tasks - ~16.5h)

**Goal:** Achieve 90% auth test coverage to prevent security vulnerabilities and user lockout issues.

→ **Implementation Guide:** [PHASE1_PLAN.md § Task Details B](./PHASE1_PLAN.md#task-details-b-testing-infrastructure)

- [ ] 1.15 **Create auth test infrastructure (factories, mocks, helpers)** (S - 2h) 🔥 HIGH
  - Reusable test utilities for auth testing
  - Deliverables: `__tests__/__helpers__/auth/` (factories.ts, mocks.ts)
  - Provides: createTestAuthUser(), createTestSession(), mock Supabase, mock MMKV
  - Blocks: 1.16, 1.17, 1.18, 1.19, 1.20

- [ ] 1.16 **Write auth service tests (login, register, reset password)** (M - 4h) 🔥 CRITICAL
  - Coverage target: 90%+ (auth is critical path)
  - Test cases: valid/invalid credentials, network errors, rate limiting, duplicate email, weak password, token expiry
  - Blocked by: 1.14 (auth service), 1.15 (test infrastructure)

- [ ] 1.17 **Write auth store tests (Zustand persist, rehydration)** (S - 2h) 🟠 HIGH
  - Test cases: setUser(), signOut(), MMKV persist, rehydration on app start, corrupted JSON handling, loading state transitions
  - Blocked by: 1.15 (MMKV mock)

- [ ] 1.18 **Write auth validation tests (database services)** (S - 2h) 🔥 CRITICAL
  - Security tests: unauthenticated access, user ID mismatch, ownership validation, authorization bypass attempts
  - Blocked by: 1.15 (auth factories)

- [ ] 1.19 **Write sync error handling tests** (M - 4h) 🟠 MEDIUM
  - Test cases: network failures (timeout, 500, DNS), conflict resolution (last-write-wins), partial sync failures, auto-sync debouncing
  - Blocked by: 1.15 (network mocks)

- [ ] 1.20 **Write MMKV storage edge case tests** (S - 2h) 🟢 MEDIUM
  - Test cases: storage full, invalid JSON, encryption failures
  - Blocked by: 1.15 (MMKV mock)

- [ ] 1.21 **Add CI coverage threshold (70% global, 90% auth)** (XS - 30min) 🔥 HIGH
  - Update jest.config.js → coverageThreshold (global: 70%, auth services: 90%, database: 80%)
  - Update `.github/workflows/ci.yml` to fail on threshold miss
  - Blocked by: None (can set immediately)

- [ ] 1.22 **Setup Maestro E2E + Auth tests** (L - 4h) `[.maestro/auth/]`
  - Install Maestro CLI + create `.maestro/auth/` directory
  - Write test flows: auth-login.yaml, auth-register.yaml, auth-password-reset.yaml
  - Document execution in [TESTING.md](./TESTING.md)
  - Run tests on Development Build to verify

---

### C: Database Enhancements (3 tasks - ~10h)

**Goal:** Improve database reliability and prevent data loss/corruption.

→ **Implementation Guide:** [PHASE1_PLAN.md § Task Details C](./PHASE1_PLAN.md#task-details-c-database-enhancements)

- [ ] 1.30 **Implement cascading delete logic (workout → exercises → sets)** (S - 2h) 🟠 HIGH
  - Issue: deleteWorkout() only marks workout as deleted, leaves orphaned child records
  - Fix: Manually cascade through relations before marking deleted
  - File: [workouts.ts:664-698](../src/services/database/operations/workouts.ts#L664-L698)
  - Testing: Verify child records also deleted after sync

- [ ] 1.31 **Enhance User model with relations & helper methods** (M - 3h) 🟠 HIGH
  - Add: `workouts` relation (has_many), `getActiveWorkout()`, `getWorkoutCount()`
  - File: [User.ts](../src/services/database/local/models/User.ts)
  - Testing: Unit tests for helpers

- [ ] 1.32 **Add sync retry with exponential backoff** (L - 5h) 🟠 HIGH
  - Add: syncWithRetry(maxRetries = 3) with exponential backoff (1s, 2s, 4s)
  - Features: Auto-retry failed syncs, prevent server overload, persist failed syncs to offline queue (MMKV)
  - File: [sync.ts](../src/services/database/remote/sync.ts)
  - Testing: Manual E2E (network failure scenarios)

---

---

## Phase 2: Workout Plans & Navigation (0/12)

**Timeline:** Weeks 11-14 | **Priority:** CRITICAL
**Goal:** Jefit-style navigation with Find/Planned tabs + Plan management

**Progress:** 0/12 tasks (0%) | **Est. Time:** ~31h (4 weeks)

**Dependencies:**

- Phase 1 complete (Auth required for user-specific plans)
- Phase 0.6.8 complete (ExerciseDB needed for plan creation)

**Key Screens:** See `docs/images/emptyPlan.jpeg` and `docs/images/FullPlan.jpeg`

---

- [ ] 2.10 **Create bottom tab navigation** (M - 2h) `[src/app/(tabs)/_layout.tsx]`
  - 2 main tabs: Workout, Profile
  - Tab icons (from @expo/vector-icons)
  - Active/inactive states
  - Dark theme styling
  - Tab bar positioned at bottom

- [ ] 2.20 **Create Workout sub-tabs** (M - 3h) `[src/app/(tabs)/workout/_layout.tsx]`
  - 2 sub-tabs: Find, Planned
  - Horizontal tab bar (top of screen)
  - Sub-tab switching animations
  - Default to "Planned" tab on first load
  - Settings icon (gear) in header → Phase 4.30

- [ ] 2.30 **Create "All Plans" modal** (M - 2h) `[src/components/workout/AllPlansModal.tsx]`
  - Modal triggered by "All Plans" button (top-right)
  - List of saved plans (FlashList)
  - Each item: Plan name, days count, last modified date
  - Tap to activate plan → switches to "Planned" tab
  - Empty state: "No saved plans yet"
  - Close button

- [ ] 2.40 **Create "Find" tab UI** (M - 3h) `[src/app/(tabs)/workout/find.tsx]`
  - Browse pre-made workout plans
  - Plan cards: Name, image, description, days count, difficulty
  - Tap plan → View plan details
  - "Save Plan" button → Adds to "All Plans" (2.30)
  - FlashList for performance
  - Search/filter (optional for MVP, defer if time constraint)

- [ ] 2.50 **Seed 1-2 workout plan templates** (S - 1h) `[scripts/seed-plans.ts]`
  - Create 1-2 example plans (e.g., "PPL 5x/week", "Upper/Lower 4x/week")
  - Insert to Supabase workout_plans table
  - Mark as is_template = true (public templates)
  - Include exercises from ExerciseDB (requires 0.6.8 complete)
  - Sync to WatermelonDB

- [ ] 2.60 **Implement "Create Plan" flow** (L - 4h) `[src/app/(tabs)/workout/create-plan.tsx]`
  - Button in "Planned" tab header (top-right)
  - On tap: Create new plan with name "New Workout"
  - Initialize with 1 day: "MON Workout Day #1"
  - Redirect to "Planned" tab showing new plan
  - Replace current active plan display
  - Store plan in WatermelonDB + Supabase

- [ ] 2.70 **Implement Plan CRUD operations** (M - 2h) `[src/services/database/plans.ts]`
  - Rename plan (tap plan name in header)
  - Delete plan (confirmation dialog)
  - Activate plan (switch active plan)
  - Duplicate plan (optional for MVP)
  - WatermelonDB + Supabase sync

- [ ] 2.80 **Create Workout Day card component** (M - 3h) `[src/components/workout/WorkoutDayCard.tsx]`
  - Card design from emptyPlan.jpeg/FullPlan.jpeg
  - Left: Muscle group icon (auto-generated from exercises)
  - Center: Day name, Est. time, exercises count, last completed date
  - Right: 3-dots menu (rename, delete), chevron (view details)
  - Blue border for current day
  - Drag handle for reordering (optional for MVP)

- [ ] 2.90 **Implement "Add a day" functionality** (M - 2h) `[src/components/workout/AddDayButton.tsx]`
  - Button below last workout day card
  - On tap: Create new day "Workout Day #N" (N = count + 1)
  - Auto-scroll to new day
  - Update plan in WatermelonDB + Supabase

- [ ] 2.100 **Implement Workout Day CRUD** (M - 2h) `[src/components/workout/WorkoutDayMenu.tsx]`
  - 3-dots menu opens bottom sheet
  - Options: Rename, Delete (with confirmation)
  - Rename: Inline text input or modal
  - Delete: Remove day from plan, shift remaining days
  - Update plan in WatermelonDB + Supabase

- [ ] 2.110 **Create exercise selector modal** (L - 4h) `[src/components/workout/ExerciseSelector.tsx]`
      **Tech**: WatermelonDB reactive queries + FlashList + expo-image (all installed ✓)
  - Modal with search bar (auto-focused)
  - **Real-time search** (300ms debounce) on 1,300+ ExerciseDB exercises:
    ```typescript
    exercises.query(Q.where('name', Q.like(`%${term}%`))).observeWithColumns(['name', 'body_parts', 'equipments']);
    ```
  - Filter by body_parts, equipments (bottom sheet with JSON array queries)
  - Exercise cards: Name, GIF thumbnail (expo-image cached), body parts, equipments
  - FlashList for performance (estimatedItemSize: 80)
  - Tap exercise → Add to workout day
  - Close modal after adding

  **Jefit Pattern**: Real-time search with instant results (confirmed via research)

- [ ] 2.120 **Add exercises to workout days** (M - 3h) `[src/app/(tabs)/workout/day-details/[dayId].tsx]`
  - "Day Details" tab/screen showing exercises for selected day
  - Exercise list (FlashList): Name, sets, reps, rest time
  - "Add Exercise" button → Opens 2.110 selector
  - Drag to reorder exercises (optional for MVP)
  - Tap exercise → Edit sets/reps (modal or inline)
  - Delete exercise (swipe or 3-dots menu)
  - Save changes to WatermelonDB + Supabase

---

---

## Phase 3: Active Workout Tracking (0/9)

**Timeline:** Weeks 15-17 | **Priority:** CRITICAL
**Goal:** Start workout → Swipe exercises → Log sets → Rest timer

**Progress:** 0/9 tasks (0%) | **Est. Time:** ~27h (3 weeks)

**Dependencies:** Phase 2 complete (need plans and exercises to start workout)

**Key Features:** Swipe gestures (ESSENTIAL), Warmup sets "W" marker (ESSENTIAL), Rest timer with notifications (ESSENTIAL)

---

- [ ] 3.10 **Create active workout screen UI** (L - 4h) `[src/app/(tabs)/workout/active.tsx]`
  - Full-screen view (hide tabs while workout active)
  - Header: Workout name, duration timer, "End Workout" button
  - Exercise cards (swipeable, one visible at a time)
  - Footer: Rest timer display, set logging interface
  - Skeleton state while loading

- [ ] 3.20 **Implement swipe gesture between exercises** (M - 3h) `[src/components/workout/ExerciseSwiper.tsx]`
      **Tech**: react-native-gesture-handler + react-native-reanimated v4 (both installed ✓)
  - Horizontal Pan gesture (swipe left/right to navigate exercises)
  - **Spring animations** (per DESIGN_SYSTEM.md):
    ```typescript
    withSpring(targetValue, { damping: 20, stiffness: 90 });
    ```
  - Timing: 200-300ms transitions
  - Exercise indicator (1/5, 2/5, etc.) with animated progress
  - Edge case: Disable swipe during set input (prevent accidental navigation)
  - Haptic feedback on exercise change (`Haptics.impactAsync()`)

  **Jefit Pattern**: Swipe left/right navigation confirmed (research: "seamless exercise selection by swiping")

- [ ] 3.30 **Create set logging interface** (L - 4h) `[src/components/workout/SetLogger.tsx]`
  - Set list: Display all sets for current exercise
  - Each set row: Set # (or "W" for warmup), Weight input, Reps input, Checkmark
  - Warmup toggle: Tap set # to toggle "W" marker
  - Quick weight buttons: +5kg, +2.5kg, -2.5kg, -5kg (or lbs)
  - Tap checkmark → Save set to WatermelonDB
  - Visual: Completed sets grayed out, current set highlighted

- [ ] 3.40 **Auto-fill weight/reps from last workout** (M - 2h) `[logic layer]`
  - Query WatermelonDB for last completed workout with same exercise
  - Pre-fill weight and reps for all sets
  - User can edit before saving
  - Handle first-time exercise (no history): Empty fields
  - Display "Last workout: 100kg × 8 reps" as hint

- [ ] 3.50 **Implement rest timer with notifications** (M - 4h) `[src/components/workout/RestTimer.tsx]`
      **Tech**: expo-notifications (already installed ✓)
  - Auto-start after set logged (default 90s, adjustable in settings)
  - Circular progress indicator (Reanimated v4)
  - Countdown timer (MM:SS format)
  - Controls: +15s, -15s, Skip, Restart
  - Audio + haptic feedback at 0:00
  - **Local scheduled notification** when timer complete (works even if app killed)
    - Use `Notifications.scheduleNotificationAsync()` with trigger delay
    - Background/killed state support (Android/iOS)

  **Jefit Learning**: Recent Jefit versions had negative UX feedback - timer "too dominant", blocks set selection. **Design balance**: Timer visible but NOT blocking UI interactions

- [ ] 3.60 **Configure notification permissions & channels** (S - 1h) `[src/services/notifications/]`
      **Tech**: expo-notifications (already installed ✓)
  - Request notification permissions on first timer use
  - Setup notification channels (Android): "Rest Timer" channel
  - Configure notification behavior (sound, vibration, priority)
  - Handle notification tap → navigate to active workout screen
  - Test notifications in background/killed states (physical device)

- [ ] 3.70 **Implement workout completion flow** (M - 2h) `[workout end logic]`
  - "End Workout" button (confirmation dialog)
  - Calculate total duration, volume, exercises completed
  - Set completed_at timestamp
  - Save to WatermelonDB, sync to Supabase
  - Navigate to workout summary screen (simple version, no analytics)
  - Clear active workout state

- [ ] 3.80 **Create workout history screen** (M - 3h) `[src/app/(tabs)/workout/history.tsx]`
  - List of past workouts (FlashList, paginated 20/page)
  - Each item: Date, duration, exercises count, volume
  - Tap → View workout detail (exercises, sets, reps logged)
  - Swipe actions: "Repeat" (start new workout from this template), "Delete"
  - Empty state: "No workouts logged yet"

- [ ] 3.90 **Add Maestro E2E workout tests** (L - 3h) `[.maestro/workout/]`
  - Write workout-start.yaml (start workout from plan)
  - Write workout-log-set.yaml (log set, verify saved)
  - Write workout-swipe.yaml (swipe between exercises)
  - Write workout-rest-timer.yaml (rest timer flow)
  - Write workout-complete.yaml (end workout, verify history)
  - Run tests on Development Build to verify

---

---

## Phase 4: Profile & Settings (0/5)

**Timeline:** Week 18 | **Priority:** MEDIUM
**Goal:** Profile screen, settings, GDPR compliance

**Progress:** 0/5 tasks (0%) | **Est. Time:** ~11h (1-2 weeks)

**Dependencies:** None (can develop in parallel with Phase 3)

**Key Features:** Units (kg/lbs), Logout, Account deletion, Data export

---

- [ ] 4.10 **Create Profile screen UI** (M - 2h) `[src/app/(tabs)/profile.tsx]`
  - Avatar (initials, no image upload for MVP)
  - Username/email display
  - Stats: Total workouts, total volume, streak
  - Buttons: Settings, Logout
  - Dark theme styling

- [ ] 4.20 **Implement logout functionality** (S - 1h) `[auth service]`
  - "Logout" button in Profile screen
  - Clear Supabase session
  - Clear MMKV auth tokens
  - Clear WatermelonDB user data (optional for MVP)
  - Redirect to login screen

- [ ] 4.30 **Create Settings screen** (M - 2h) `[src/app/(tabs)/profile/settings.tsx]`
  - Accessible from gear icon (top-right header)
  - Units section: kg/lbs toggle
  - Account section: Export data, Delete account
  - Save preferences to Supabase + MMKV
  - Dark theme styling

- [ ] 4.40 **Implement account deletion (GDPR)** (M - 3h) `[GDPR compliance]`
  - "Delete Account" button in Settings (destructive style)
  - Confirmation dialog: "This will permanently delete all your data"
  - Cascade delete: Supabase foreign keys delete all workouts, plans, sets
  - Clear WatermelonDB local database
  - Clear MMKV storage
  - Logout and redirect to login

- [ ] 4.50 **Implement data export (GDPR)** (M - 3h) `[GDPR compliance]`
  - "Export My Data" button in Settings
  - Generate JSON file: Profile, plans, workouts, exercises, sets
  - Include metadata: export_date, user_id, total_workouts
  - Share via system share sheet (email, cloud storage)
  - Show success message with file path

---

---

## Phase 5: Polish & Deployment (0/5)

**Timeline:** Week 19 | **Priority:** HIGH
**Goal:** Production-ready MVP

**Progress:** 0/5 tasks (0%) | **Est. Time:** ~9h (1 week)

**Dependencies:** Phases 1-4 complete (all MVP features done)

---

- [ ] 5.10 **Verify Sentry monitoring** (S - 1h) `[already setup in 0.5.5]`
  - Test error reporting (throw test error)
  - Verify crash reports appear in Sentry dashboard
  - Verify performance monitoring (slow query simulation)
  - Setup alerts: Crash rate >0.5%, error rate >5%
  - Confirm production-only tracking (disabled in dev)

- [ ] 5.20 **Performance optimization** (M - 3h) `[bundle + cold start]`
  - Run react-native-bundle-visualizer
  - Identify large dependencies, remove unused
  - Code splitting for heavy features (charts defer to post-MVP)
  - Optimize WatermelonDB initial queries
  - Lazy load screens with React.lazy()
  - Target: <10MB bundle, <2s cold start

- [ ] 5.30 **Create EAS production build** (M - 2h) `[EAS Build]`
  - Create production profile in eas.json
  - Configure environment variables for production
  - Build Android: eas build --platform android --profile production
  - Build iOS: eas build --platform ios --profile production
  - Test builds on physical devices

- [ ] 5.40 **Setup TestFlight/Play Store internal testing** (M - 2h)
  - iOS: Submit to TestFlight via eas submit
  - Android: Submit to Play Store Internal Testing
  - Add 5-10 internal testers (friends, colleagues)
  - Document installation instructions

- [ ] 5.50 **Create beta testing guide** (S - 1h) `[docs/BETA_TESTING_GUIDE.md]`
  - Installation instructions (TestFlight/Play Store links)
  - What to test (critical user flows)
  - How to report bugs (email, form, GitHub issues)
  - Known limitations
  - Expected timeline for fixes

---

---

## Deferred Tasks (7 tasks)

**Note:** These tasks are part of MVP scope (included in 83 total) but deferred to be implemented just-in-time or when needed, following YAGNI and Agile principles.

**Status:** Tracked but not blocking MVP progress. Can be completed progressively during Phases 1-4.

---

### 📋 Deferred Task List

**From Phase 0.5: Optional Improvements** (5 tasks - 0.5.12 to 0.5.16)

- **0.5.12** Repository Pattern `[L - 8h]` → Defer: Implement progressively in Phase 1-2
  - Impact: Makes future DB optimization easier
  - Not blocking: Current direct database access works fine for MVP

- **0.5.13** Sync Conflict Detection `[L - 8h]` → Defer: Must complete before Phase 2 (multi-device)
  - Impact: Prevents data corruption on conflicts
  - Timeline: Implement when multi-device sync becomes active

- **0.5.14** Database Indexes `[M - 2h]` → Defer: Add when performance becomes issue (500+ workouts)
  - Impact: Query performance optimization
  - Not blocking: Performance acceptable with <100 workouts

- **0.5.15** Chart Abstraction `[M - 3h]` → Defer: Victory Native already abstracted
  - Impact: Minimal (already using good library)
  - Not needed: Current abstraction sufficient

- **0.5.16** Domain vs DB Types `[M - 4h]` → Defer: Organize types during Phase 1-2 development
  - Impact: Minor code organization
  - Just-in-time: Create types as features are built

**From Phase 0.6: UI/UX Foundation** (2 tasks)

- **0.6.5** Install Navigation Components `[S - 1h]` → Defer: Not required for Phase 1 (Auth screens)
  - Impact: Sheet/Tabs components for Phase 2+
  - Timeline: Install when needed for workout navigation

- **0.6.7** Create Core TypeScript Types `[M - 2h]` → Defer: Create types just-in-time during Phase 1-4
  - Impact: Non-database types (API responses, auth, form validation, UI state)
  - YAGNI: WatermelonDB models already provide database types
  - Just-in-time plan:
    - Phase 1: Create `auth.ts` (login/register types)
    - Phase 0.6.8: Create `exercisedb.ts` (API response types)
    - Phase 4: Create `analytics.ts` (report types)

---

**Total Deferred:** 7 tasks (~26h estimated)
**MVP Active Tasks:** 76 tasks
**MVP Total (Active + Deferred):** 83 tasks

---

---

## Post-MVP Backlog

> 📖 **See [BACKLOG.md](./BACKLOG.md)** for ~60+ post-launch features

**Priority Categories:**

- 🔥 **Analytics & Progression** (~35-45h) - Volume charts, 1RM estimation, plateau detection
- ✨ **UX Enhancements** (~20-25h) - Plate calculator, set history, notes
- 🚀 **Advanced Features** (~40-50h) - Custom exercises, RPE tracking, auto-suggestions
- 🛠️ **Infrastructure** (~15-20h) - Auto-sync, i18n, social features
