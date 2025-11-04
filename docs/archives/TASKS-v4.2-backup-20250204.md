# Project Roadmap

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Kanban](#kanban)
3. [Development Roadmap](#development-roadmap)
4. [Phase Timeline & Effort](#phase-timeline--effort)
5. [Phase 0.5: Architecture & Foundation (21/26)](#phase-05-architecture--foundation-2126)
6. [Phase 0.6: UI/UX Foundation (6/8)](#phase-06-uiux-foundation-68)
7. [Phase 1: Authentication & Foundation (1/27)](#phase-1-authentication--foundation-127)
8. [Phase 2: Workout Logging (0/21)](#phase-2-workout-logging-021)
9. [Phase 3: Exercise Library & Testing (0/10)](#phase-3-exercise-library--testing-010)
10. [Phase 4: Analytics & Smart Features (0/11)](#phase-4-analytics--smart-features-011)
11. [Phase 5: Polish, Monitoring & Beta Launch (0/16)](#phase-5-polish-monitoring--beta-launch-016)

---

**Project**: Halterofit v0.1.0
**Status**: 🟡 In Progress (Phase 0.6)
**Progress**: 28/119 tasks (24%)
**Timeline**: 17 weeks • Started 2025-01-20 • Target 2025-05-19
**Last Updated**: 2025-02-01 • **Next Milestone**: Complete Infrastructure & UI Foundation (Phase 0.6)

---

## Executive Summary

**Current Focus**: Phase 0.6.C - Foundation Infrastructure (ExerciseDB Import)
**Phase Progress**: 21/26 (Phase 0.5) + 6/8 (Phase 0.6) • **Overall**: 28/119 tasks (24%)
**Critical Blockers**: None • **Velocity**: ~5 tasks/week (excellent!)

### Recent Completions ✅

1. **0.6.6** - Setup environment variables (Supabase, Sentry, ExerciseDB API configured)
2. **0.6.4** - Install core components (Button, Input, Card, Alert, Progress, Skeleton)
3. **0.6.3** - Validate dark theme (HEX colors confirmed)
4. **0.6.9** - Design system (Competitor analysis, 245-line doc, Agile approach)
5. **0.6.2** - Configure @expo/vector-icons (Icon wrapper with 3 packs)

---

## Kanban

| TODO (Top 5)                         | DOING | DONE (Last 5)                   |
| ------------------------------------ | ----- | ------------------------------- |
| **0.6.8** ExerciseDB import `[L]` 🔥 |       | **0.6.6** Environment vars ✅   |
| **1.1** Validation tests `[S]` 🟠    |       | **0.6.4** Core components ✅    |
| **1.5** Login screen UI `[M]` 🟠     |       | **0.6.3** Dark theme ✅         |
| **1.6** Register screen UI `[M]` 🟠  |       | **0.6.9** Design system ✅      |
| **1.7** Supabase auth `[M]` 🟠       |       | **0.6.2** @expo/vector-icons ✅ |

**Progress**: Phase 0.5: 21/26 (81%) • Phase 0.6: 6/8 (75%) • Overall: 28/119 (24%)
**Velocity**: ~6 tasks/week (excellent!) • **ETA**: Phase 0.6 complete in 1-2 days
**NEXT**: 0.6.8 ExerciseDB Import 🔥 (3-4h) → Phase 1 Auth screens

---

## Development Roadmap

**Note:** Phase progress details are in the [Phase Timeline & Effort](#phase-timeline--effort) table and individual phase headers below. This visual shows high-level flow and completion status.

```
Phase 0.5: Architecture & Foundation (21/26 tasks)
   ├─ Initial setup ✅
   ├─ Dev tools setup ✅
   ├─ EAS Build + Dev Client ✅
   ├─ WatermelonDB Schema & Models ✅
   ├─ WatermelonDB Database Operations ✅
   ├─ MMKV Storage Migration ✅
   ├─ Victory Native Charts Migration ✅
   ├─ Development Build Migration ✅
   └─ COMPLETE: Infrastructure (0.5.3-4) ✅
        ↓
Phase 0.6: UI/UX Foundation (6/8 tasks) 75% ✅
   ├─ React Native Reusables (shadcn/ui base) ✅
   ├─ React Native Vector Icons integration ✅
   ├─ Single dark mode design system ✅
   ├─ Core components (Button, Input, Card, Alert) ✅
   ├─ Design system documentation ✅
   └─ ExerciseDB Import (next priority) 🔥
        ↓
Phase 1: Authentication & Foundation (1/27 tasks)
   ├─ Supabase Auth integration
   ├─ Login/Register screens
   ├─ CI/CD pipeline ✅
   └─ Type definitions
        ↓
Phase 2: Workout Logging (0/21 tasks)
   ├─ Active workout screen
   ├─ Set logging interface
   ├─ Rest timer
   └─ Workout history
        ↓
Phase 3: Exercise Library & Testing (0/10 tasks)
   ├─ ExerciseDB API integration (1,300+ exercises)
   ├─ Exercise selector
   ├─ Custom exercises
   └─ Search & filters
        ↓
Phase 4: Analytics & Smart Features (0/11 tasks)
   ├─ Progress charts (Victory Native)
   ├─ Volume tracking
   ├─ Plateau detection (simple trend)
   └─ Workout reports
        ↓
Phase 5: Polish, Monitoring & Beta Launch (0/16 tasks)
   ├─ Onboarding flow
   ├─ Sentry monitoring
   ├─ Privacy compliance (GDPR)
   └─ Beta testing program
```

### Phase Timeline & Effort

| Phase     | Tasks   | Est. Time    | Status       | Dependencies                |
| --------- | ------- | ------------ | ------------ | --------------------------- |
| **0.5**   | 26      | 50-60h       | 81% DONE     | None (started)              |
| **0.6**   | 8       | 14-17h       | IN PROGRESS  | ← Phase 0.5 complete        |
| **1**     | 27      | 54-67h       | BLOCKED      | ← Phase 0.6 UI foundation   |
| **2**     | 21      | 51-61h       | BLOCKED      | ← Phase 1 auth              |
| **3**     | 10      | 28-35h       | BLOCKED      | ← Phase 2 workout core      |
| **4**     | 11      | 35-45h       | BLOCKED      | ← Phase 3 exercise library  |
| **5**     | 16      | 43-53h       | BLOCKED      | ← Phase 4 analytics         |
| **TOTAL** | **119** | **275-348h** | **23% done** | **14-18 weeks at 20h/week** |

**⚠️ Critical Path:** Phase 0.5.D (Infrastructure) → Phase 0.6 (UI Foundation) → Phase 1 (Auth screens).

---

## Phase 0.5: Architecture & Foundation (21/26)

**Timeline:** Weeks 1-7 | **Priority:** HIGHEST
**Goal:** Production-ready architecture and critical foundation

**Progress:** 21/121 tasks (81%) | **Est. Time Remaining:** ~5h (Phase 0.5 completion)

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

### 0.5.D: Infrastructure Completion (2/2) ✅ COMPLETE

**Goal:** Configure remaining performance libraries

- [x] 0.5.3 **Configure FlashList for optimized lists** (S - 1h)
  - Created WorkoutList component (FlashList wrapper, memoized)
  - Created WorkoutListItem component (memoized, ~88px height)
  - Test screen with 120 mock workouts (smooth 60 FPS scroll)
  - Updated fixtures with 8 workout templates
  - Complete documentation (usage guide, Phase 2 integration)
- [x] 0.5.4 **Configure expo-image with caching** (S - 1h) ✅ 2025-10-31
  - Created CachedImage wrapper component (`src/components/ui/CachedImage.tsx`)
  - Default `cachePolicy="memory-disk"` (PRD <200ms requirement)
  - Skeleton placeholder + error handling with fallback images
  - Pre-built styles (avatar, thumbnails, banner)
  - Complete documentation (`src/components/ui/README.md`)
  - Updated `docs/TECHNICAL.md` (ADR-010b: expo-image ✅ COMPLETED)

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

---

## Phase 0.6: UI/UX Foundation (6/8)

**Timeline:** Week 8 | **Priority:** HIGH
**Goal:** Complete UI foundation and infrastructure setup for production-ready development

**Progress:** 6/121 tasks (75%) | **Est. Time Remaining:** ~3-4h (ExerciseDB import only)

**Stack:** React Native Reusables + @expo/vector-icons + NativeWind v4 + Reanimated v4
**Design:** Single dark mode, modern fitness aesthetic, animations-first

**Why Now:** Phase 1 (Auth screens) requires UI components. Installing component library now ensures visual cohesion from the start and avoids refactoring later.

---

### 0.6.A: Component Library Setup (3/3) ✅ COMPLETE

**Goal:** Install and configure React Native Reusables with design system

- [x] 0.6.1 **Install React Native Reusables + Dependencies** (M - 2h) ✅ 2025-01-30
  - Install `@react-native-reusables/cli` and core dependencies
  - Install `class-variance-authority`, `clsx`, `tailwind-merge`
  - Configure `components.json` with project aliases
  - Setup Metro bundler integration
  - Verify installation with test component

- [x] 0.6.2 **Configure @expo/vector-icons** (S - 30min) ✅ 2025-01-30
  - Verify `@expo/vector-icons` included in Expo SDK (already installed)
  - Choose primary icon pack (MaterialIcons, Ionicons, or FontAwesome)
  - Create icon wrapper component with default sizing and color
  - Test icons from multiple packs in example screen
  - Document icon usage patterns and available packs

- [x] 0.6.3 **Validate Dark Theme Configuration** (M - 1h) ✅ 2025-01-30
  - Confirmed tailwind.config.js with HEX dark mode colors
  - Validated design tokens (primary: #4299e1, background: #0A0A0A, etc.)
  - Typography scale and spacing system already configured
  - Created DESIGN_SYSTEM.md with competitor analysis and wireframes
  - Components tested and rendering correctly

---

### 0.6.B: Core Components Installation (1/2)

**Goal:** Install essential UI components via CLI

- [x] 0.6.4 **Install Phase 1 Components (Auth)** (M - 1.5h) ✅ 2025-01-30
  - Installed via CLI: button, input, label, card, alert, progress, skeleton, text
  - Fixed React imports in all RN Reusables components
  - Adapted Alert component to use @expo/vector-icons instead of lucide-react-native
  - Tested all components in ComponentShowcase (validation complete)
  - Components functional with HEX color system (no CSS variables needed)
  - Ready for Phase 1 Auth screens

- [ ] 0.6.5 **Install Navigation Components** (S - 1h) `[DEFERRED]`
  - **Status:** SKIPPED - Not required for Phase 1 (Auth screens)
  - Sheet/Tabs components can be installed later when needed (Phase 2+)
  - Auth screens use simple stack navigation (expo-router default)

---

### 0.6.C: Foundation Infrastructure (2/3) ✅ READY FOR 0.6.8

**Goal:** Setup complete development infrastructure before Phase 1

- [x] 0.6.6 **Setup Environment Variables** (S - 10min) `[.env + .env.example]` ✅ 2025-02-01
  - ✅ Copy .env.example to .env (done)
  - ✅ Add Supabase environment variables (done)
  - ✅ Add Sentry DSN (done)
  - ✅ Document setup in CONTRIBUTING.md (done)
  - ✅ Verify .env in .gitignore (done)
  - ✅ Add EXERCISEDB_API_KEY to .env (3d01c2ef9fmsh94e6c584e843697p1013c5jsn5b78d34c0e9c)
  - ✅ Add EXERCISEDB_API_HOST to .env (exercisedb.p.rapidapi.com)
  - ✅ Add EXERCISEDB_API_KEY template to .env.example
  - **Complete:** All environment variables configured for Phase 1 & ExerciseDB import

- [ ] 0.6.7 **Create Core TypeScript Types** (M - 2h) `[src/types/]` `[DEFERRED]`
  - **Status:** DEFERRED - Create types just-in-time during Phase 1-4
  - **Rationale:** YAGNI - WatermelonDB models already provide database types
  - **Structure cleaned:** Removed empty subdirs, simplified index.ts with JIT approach
  - **Just-in-Time plan:**
    - Phase 1: Create auth.ts (login/register types)
    - Phase 0.6.8: Create exercisedb.ts (API response types)
    - Phase 4: Create analytics.ts (report types)
  - Non-database types only (API responses, auth, form validation, UI state)

- [ ] 0.6.8 **Bulk Import ExerciseDB Library (1,300+ exercises)** (L - 3-4h) `[scripts/seed-exercisedb.ts]` 🔥 **NEXT PRIORITY**

  **Goal:** Import complete exercise library from ExerciseDB API to avoid 100-200h of manual data entry

  **Step 1: RapidAPI Account Setup** (10min)
  - Go to https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
  - Click "Sign Up" (top-right) → Use Google/GitHub/Email
  - Select "Basic" plan (FREE - 10,000 requests/month, 5 requests/second)
  - Navigate to "Endpoints" tab
  - Click "Test Endpoint" on any endpoint to subscribe to API
  - Copy your API key from "X-RapidAPI-Key" header (top-right of code snippet)

  **Step 2: Configure Environment Variables** (5min)
  - Add to `.env` file:
    ```
    EXERCISEDB_API_KEY=your_rapidapi_key_here
    EXERCISEDB_API_HOST=exercisedb.p.rapidapi.com
    ```
  - Add to `.env.example` (template):
    ```
    EXERCISEDB_API_KEY=your_rapidapi_key_here
    EXERCISEDB_API_HOST=exercisedb.p.rapidapi.com
    ```

  **Step 3: Create Import Script** (2-3h)
  - Create `scripts/seed-exercisedb.ts` with:
    1. Fetch ALL exercises: `GET /exercises` (returns 1,300+ exercises)
    2. Transform ExerciseDB format → Supabase schema:
       - `bodyPart` → `muscle_group`
       - `equipment` → `equipment`
       - `name` → `name` (capitalize)
       - `gifUrl` → `image_url`
       - Infer `difficulty` from equipment (barbell=intermediate, machine=beginner, etc.)
       - Set `is_custom = false`, `featured = false`
    3. Tag top 100 popular exercises as `featured = true` (Bench Press, Squat, Deadlift, etc.)
    4. Bulk insert to Supabase `exercises` table (single transaction)
    5. Sync to WatermelonDB via `synchronize()`

  **Step 4: Test & Validate** (30min)
  - Run script: `npm run seed:exercisedb`
  - Verify Supabase: ~1,300 rows in `exercises` table
  - Verify WatermelonDB: Exercises synced locally
  - Test image URLs work (ExerciseDB provides GIF animations)

  **Benefits:**
  - ✅ Complete exercise library from day 1 (no Phase 3 migration needed)
  - ✅ Saves 100-200 hours of manual exercise creation
  - ✅ Professional GIF animations included
  - ✅ Covers all muscle groups and equipment types

  **API Docs:** https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb

- [x] 0.6.9 **Design Brainstorming: Fitness Components** (M - 2-3h) ✅ 2025-01-30
  - Analyzed competitor UX (Strong, Hevy, fitness app patterns)
  - Documented design principles (Offline-first, Gym-optimized, Basic)
  - Defined interaction patterns (Quick-add, Inline editing, Swipe actions, Multi-modal feedback)
  - Documented animation strategy (Reanimated v4, 200-300ms timing, spring curves)
  - Created `docs/DESIGN_SYSTEM.md` with strategic design insights (245 lines)
  - Confirmed color palette (#4299e1 primary blue - trust/focus over #00E5FF cyan)
  - **Audit completed (2025-02-01):** Condensed from 394→245 lines, removed premature wireframes for Phase 2-3 features (aligned with Agile just-in-time design approach)
  - **Component audit:** All 8 installed components (Button, Input, Label, Card, Alert, Text, Progress, Skeleton) kept - needed for Phase 1 Auth or Phase 2+ features

---

---

## Phase 1: Authentication & Foundation (1/30)

**Timeline:** Weeks 4-5 | **Priority:** HIGH

### 1. Infrastructure & Types

**Goal:** Setup foundational infrastructure before implementing features

- [ ] 1.1 **Write unit tests for validation utilities** (S - 1.5h) `[src/utils/__tests__/validation.test.ts]`
  - Test email format validation (valid/invalid cases)
  - Test password strength validation (8+ chars, special chars)
  - Test edge cases (empty strings, SQL injection attempts)
  - Use Jest + @testing-library/react-native
  - TDD approach: Write tests BEFORE implementing validation.ts

- [ ] 1.2 **Setup Supabase Storage & image upload** (M - 2h) `[src/services/supabase/storage.ts]`
  - Configure storage bucket for profile images
  - Create upload utility (compress images before upload)
  - Create delete utility (cleanup old images)
  - Setup RLS policies for user-owned images
  - Test with example image upload

- [ ] 1.3 **Configure expo-notifications & background tasks** (S - 1h) `[src/services/notifications.ts]`
  - Setup push notification permissions
  - Create notification scheduler for rest timer
  - Create notification for workout reminders
  - Test local notifications
  - Defer: Push notifications to Phase 4

- [ ] 1.4 **Add form validation utilities** (S - 2h) `[src/utils/validation.ts]`
  - Email format validation (regex)
  - Password strength validation (min 8 chars, etc.)
  - Error message generation
  - Generic form validation helpers
  - **IMPORTANT:** Implement AFTER writing tests in task 1.1

### 2. Authentication Screens

- [ ] 1.5 **Create login screen UI** (M - 3h) `[src/app/(auth)/login.tsx]`
  - Email/password inputs (use Input component)
  - Login button (use Button component)
  - "Forgot password" link
  - "Create account" link
  - Loading state, error handling

- [ ] 1.6 **Create register screen UI** (M - 3h) `[src/app/(auth)/register.tsx]`
  - Email/password inputs
  - Password confirmation
  - Terms acceptance checkbox
  - Register button
  - Validation (email format, password strength)

- [ ] 1.7 **Implement Supabase authentication integration** (M - 4h) `[src/services/supabase/auth.ts]`
  - Sign up functionality
  - Sign in functionality
  - Sign out functionality
  - Session management with MMKV encrypted storage
  - Error handling (user-friendly messages)

- [ ] 1.8 **Implement password reset flow** (M - 3h) `[src/utils/validation.ts]`
  - Email format validation (regex)
  - Password strength validation (min 8 chars, etc.)
  - Error message generation
  - Generic form validation helpers

- [ ] 1.9 **Implement email verification flow** (M - 3h) `[src/app/(auth)/reset-password.tsx]`
  - Request reset screen (email input)
  - Reset confirmation screen
  - Supabase email notification
  - Success/error states

- [ ] 1.10 **Implement session refresh logic** (M - 2h) `[src/app/(auth)/verify-email.tsx]`
  - Deep link handler for verification token
  - Verification screen UI (loading, success, error states)
  - Supabase email verification integration
  - Auto-redirect to tabs on success
  - Resend verification email option

- [ ] 1.11 **Setup protected routes** (S - 1.5h) `[src/services/supabase/auth.ts]`
  - Auto-refresh tokens before expiry
  - Handle refresh failures gracefully
  - Store refresh token in MMKV encrypted storage
  - Silent refresh in background
  - Logout on permanent refresh failure

- [ ] 1.12 **Add biometric authentication** (M - 3h) `[src/services/auth/biometric.ts]`
  - Install expo-local-authentication
  - Face ID/Touch ID enrollment flow
  - Biometric re-authentication for quick login
  - Fallback to password if biometric fails
  - Settings toggle to enable/disable
  - Secure credential storage with MMKV encryption

- [ ] 1.13 **Create workout templates system** (L - 4h) `[src/services/database/templates.ts]`
  - Create workout_templates table with WatermelonDB schema
  - CRUD operations: save active workout as template
  - Template fields: name, exercises[], sets[], rest_times[]
  - Template loading: populate active workout from template
  - Template management UI: list, edit, delete templates
  - Integration: "Save as Template" button in workout screen
  - Benefits: Jefit-style routine reuse (core feature)

- [ ] 1.14 **Implement rest timer with auto-start** (M - 3h) `[src/components/workout/RestTimer.tsx]`
  - Auto-start timer after set completion (configurable delay)
  - Visual countdown (circular progress + seconds remaining)
  - Audio notification when rest period complete
  - Pause/resume/skip controls
  - Background timer support (continues when app backgrounded)
  - Notification support: expo-notifications integration
  - Benefits: Jefit-style pacing (essential for gym efficiency)

- [ ] 1.15 **Implement auto-save system** (M - 2.5h) `[src/hooks/workout/useAutoSave.ts]`
  - Debounced auto-save (500ms after last edit)
  - WatermelonDB batch writes for performance
  - Visual feedback: "Saving..." / "Saved" indicator
  - Integration: useWorkoutStore with MMKV persistence
  - Error handling: Retry failed saves with exponential backoff
  - Benefits: Jefit-style reliability (never lose workout data)

- [ ] 1.19 **Document Manual E2E Test Checklists** (S - 1.5h) `[e2e/manual/]`
  - Create `e2e/manual/sync-checklist.md` (Supabase sync scenarios)
  - Create `e2e/manual/offline-crud.md` (Offline CRUD operations)
  - Create `e2e/manual/auth-flows.md` (Login/logout/reset password)
  - Document prerequisites (Dev Build, test account, network toggle)
  - Include pass/fail criteria for each scenario
  - Reference: `src/services/database/__tests__/README.md` § E2E Testing

### 2. Navigation Structure

- [ ] 2.2 Create tab navigation layout (M - 3h) `[src/app/(tabs)/_layout.tsx]`
  - Workout tab
  - Exercises tab
  - Analytics tab (renamed from "Stats")
  - Profile tab (renamed from "Settings")
  - Custom tab bar styling (dark theme)

- [ ] 2.3 Implement navigation guards (S - 2h) `[src/app/_layout.tsx]`
  - Redirect to login if not authenticated
  - Redirect to tabs if authenticated
  - Loading screen during auth check
  - Deep linking support

- [ ] 2.4 Create placeholder tab screens (M - 2h)
  - [src/app/(tabs)/workout.tsx] - Workout logging screen
  - [src/app/(tabs)/exercises.tsx] - Exercise library screen
  - [src/app/(tabs)/analytics.tsx] - Analytics dashboard
  - [src/app/(tabs)/profile.tsx] - User profile & settings

- [ ] 2.5 **Configure deep linking & navigation types** (M - 2h) `[app.json + types]`
  - Configure app.json scheme: "halterofit://"
  - Setup linking config for expo-router
  - Create route handlers for auth tokens:
    - verify-email?token=xxx
    - reset-password?token=xxx
  - TypeScript navigation types for type-safe routing
  - Test deep links on physical device
  - Document deep link patterns

- [ ] 2.6 **Create network status indicator & sync queue** (M - 2.5h) `[src/components/shared/NetworkStatus.tsx]`
  - Offline badge indicator (top of screen)
  - Sync queue counter (pending changes)
  - Network connectivity monitoring (NetInfo)
  - Auto-sync when connection restored
  - Visual feedback during sync
  - User-friendly "Working offline" message

### 3. Core UI Components

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
  - src/types/database.ts (database tables interfaces including preferred_unit)
  - src/types/exercises.ts (exercise, set, workout types)
  - src/types/user.ts (user, profile, user preferences types)
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

- [ ] 4.3 **Create user settings screen** (M - 3h) `[src/app/(tabs)/profile/settings.tsx]`
  - Preferences section:
    - Units (kg/lbs toggle with conversion)
    - Language (future-ready, English only for MVP)
  - Notifications section:
    - Rest timer notifications toggle
    - Weekly summary notifications toggle
    - Achievement notifications toggle
  - Privacy section:
    - Biometric auth toggle
    - Data export button (links to 17.4)
    - Delete account button (links to 17.3)
  - About section:
    - App version
    - Privacy policy link
    - Terms of service link
  - Store preferences in MMKV for instant access

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

- [ ] 5.2 **Seed ExerciseDB to Supabase (popular exercises)** (M - 2h) `[scripts/seed-exercises.ts]`
  - Sign up for ExerciseDB API (RapidAPI)
  - Fetch 100 most popular exercises (barbell, dumbbell, bodyweight)
  - Transform to Supabase schema
  - Bulk insert to exercises table
  - Mark as is_custom = false
  - Sync to local WatermelonDB
  - Enables Phase 2 testing with real exercises
  - Note: Full 1,300+ import in Phase 3 (task 11.1)

- [ ] 5.3 **Setup Maestro E2E testing framework** (L - 6h) `[e2e/maestro/]`
  - Install Maestro CLI globally
  - Create e2e/maestro/ directory structure
  - Write auth flow tests:
    - auth-login.yaml (email/password login)
    - auth-register.yaml (new account creation)
    - auth-verification.yaml (email verification flow)
  - Write navigation tests:
    - navigation-tabs.yaml (tab switching)
    - navigation-deep-links.yaml (deep link handling)
  - Configure Maestro for Development Build
  - Document test execution in docs/testing/e2e-maestro.md
  - CI integration: Run on EAS Build preview (Phase 5)
  - Reference: Manual checklists from task 1.19

- [ ] 5.4 Add user preferences management screen (M - 3h) `[src/app/(tabs)/profile/nutrition.tsx]`

  ```
  Features:
  - Current phase display (kg/lbs)
  - Phase duration tracker
  - Simple toggle to change phase
  - Explanation of how phase affects analytics
  - History of past phases (optional for MVP)

  Updates users.preferred_unit and preferred_unit_started_at
  ```

---

## Phase 2: Workout Logging (0/20)

**Timeline:** Weeks 6-8 | **Priority:** HIGH
**Goal:** Core workout logging functionality with excellent UX

### 6. Workout Session Core

- [ ] 6.0 **Configure expo-notifications & background tasks** (S - 1h) `[src/services/notifications/]`
  - Configure notification permissions (iOS/Android)
  - Setup notification handlers (foreground, background, killed state)
  - Configure notification categories (rest timer, achievements, weekly)
  - Setup expo-background-fetch for timer persistence
  - Test notifications on physical device
  - Document notification setup in CONTRIBUTING.md
  - Required before task 6.3 (Rest Timer)

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
  - All exercises with sets (weight, reps, weight/reps)
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

  ```
  - Scale 1-10 (visual buttons)
  - Optional per-set
  - Can be toggled in settings
  - Color-coded (green 1-5, yellow 6-7, orange 8-9, red 10)
  ```

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
  - Format: "100kg × 8 reps  - 2 days ago"
  - Helps user choose progressive overload
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

## Phase 3: Exercise Library & Testing (0/10)

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

- [ ] 11.1 **Bulk import remaining ExerciseDB exercises** (L - 4h) `[CRITICAL TIME SAVER]`

  ```
  Tasks:
  - Fetch remaining 1,200+ exercises from ExerciseDB API
  - Transform to Supabase schema (match existing 100)
  - Bulk insert to exercises table
  - Sync to local WatermelonDB
  - Mark as is_custom = false

  Note: 100 popular exercises already seeded in Phase 1 (task 5.2)
  This task completes the full exercise library (1,300+ total)

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

**Note:** Custom exercise creation deferred per ADR-017 (Read-only exercise library for MVP).
Focus on ExerciseDB's 1,300+ exercises for Phase 0-3. Custom exercises in Phase 4+ if validated by users.

### 12. Custom Exercises & Management

- [ ] 12.0 **Setup Supabase Storage & image upload** (M - 2h) `[src/services/storage/]`
  - Create Supabase Storage bucket: "exercise-images"
  - Configure RLS policies (user can upload own images)
  - Setup expo-image-manipulator for compression
  - Create upload utility (compress → upload → return URL)
  - Image validation (max 5MB, jpg/png only)
  - Delete old image when uploading new one
  - Error handling and user feedback
  - Required before task 12.2 (custom exercise images)

- [ ] 12.1 **[DEFERRED - Phase 4+]** Implement custom exercise creation (M - 4h) `[src/app/(tabs)/exercises/create.tsx]`

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

- [ ] 12.2 **[DEFERRED - Phase 4+]** Add exercise images/videos (optional for custom) (M - 3h)

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

## Phase 4: Basic Analytics & Reports (0/9)

**Timeline:** Weeks 11-12 | **Priority:** MEDIUM
**Goal:** Simple, Jefit-style analytics - volume charts, PRs, history, basic trends

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

- [ ] 13.2 Implement basic volume tracking (M - 3h) `[src/lib/analytics/volume.ts]`

  ```
  Calculations:
  - Total volume: Σ (sets × reps × weight)
  - Volume by muscle group
  - Volume by week/month
  - Volume by exercise type

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

- [ ] 14.1 **Implement basic trend analysis** (M - 3h) `[src/lib/analytics/trends.ts]`

  ```
  Algorithm:
  - Linear regression for trend direction
  - Analyze last 4-8 weeks of data
  - Return: trend (increasing/stable/decreasing), slope
  - Simple statistical analysis (simple-statistics library)

  Display as arrows: ⬆️ improving, ➡️ stable, ⬇️ declining
  ```

- [ ] 14.3 Implement 1RM calculator (S - 2h) `[src/lib/analytics/oneRepMax.ts]`

  ```
  Formula: Epley (weight × (1 + reps/30))
  - Calculate for working sets (3-12 rep range optimal)
  - Track personal records by exercise
  - Display in exercise history and analytics

  Simple and reliable - standard formula used by Jefit and competitors
  ```

- [ ] 14.4 Implement volume distribution analysis (M - 3h) `[src/lib/analytics/volumeDistribution.ts]`

  ```
  Analysis:
  - Volume per muscle group (pie chart)
  - Volume per movement pattern (push/pull/legs)
  - Volume per exercise category (compound vs isolation)
  - Volume per day of week (bar chart)
  - Recommendations: "Increase chest volume by 15% to match back"
  - Simple distribution analysis
  ```

- [ ] 14.5 Add workout frequency & consistency analysis (M - 3h)
  ```
  Metrics:
  - Workouts per week (average, trend)
  - Most common workout days
  - Consistency score (%) - missed vs planned
  - Streak tracking (current, longest)
  - Calendar heatmap visualization
  - Session completion rate (started vs finished)
  ```

### 15. Performance Feedback & Reports

- [ ] 15.1 **Create post-workout summary** (M - 3h) `[src/components/analytics/WorkoutSummary.tsx]`

  ```
  Displayed after "End Workout":
  - Total volume (sets × reps × weight)
  - Total duration
  - Exercises completed
  - Personal records achieved (if any)
  - Simple motivational message

  Keep it concise (3-4 lines max), positive, clear
  ```

- [ ] 15.2 **Create weekly summary** (M - 3h) `[src/components/analytics/WeeklySummary.tsx]`

  ```
  Generated every Monday morning:
  - Total volume (vs previous week)
  - Personal records achieved
  - Workouts completed (consistency)
  - Most trained muscle groups

  Push notification: "Your Weekly Summary is ready!"
  ```

---

## Phase 5: Polish, Monitoring & Beta Launch (0/16)

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

- [ ] 17.5 **Implement backup & restore data** (M - 3h) `[src/services/backup/]`
  - Auto-backup to Supabase (workouts, exercises, settings)
  - Manual backup option (export + upload)
  - Restore from backup (download + import)
  - Conflict resolution (local vs cloud)
  - Last backup timestamp display
  - Backup before account deletion (safety)
  - Progress indicator during restore

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
