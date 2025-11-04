# Project Roadmap

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Kanban](#kanban)
3. [Development Roadmap](#development-roadmap)
4. [Phase Timeline & Effort](#phase-timeline--effort)
5. [Phase 0.5: Architecture & Foundation (21/21)](#phase-05-architecture--foundation-2121)
6. [Phase 0.6: UI/UX Foundation (6/7)](#phase-06-uiux-foundation-67)
7. [Phase 1: Authentication & Foundation (0/6)](#phase-1-authentication--foundation-06)
8. [Phase 2: Workout Plans & Navigation (0/12)](#phase-2-workout-plans--navigation-012)
9. [Phase 3: Active Workout Tracking (0/9)](#phase-3-active-workout-tracking-09)
10. [Phase 4: Profile & Settings (0/5)](#phase-4-profile--settings-05)
11. [Phase 5: Polish & Deployment (0/5)](#phase-5-polish--deployment-05)
12. [Deferred Tasks](#deferred-tasks-7-tasks)
13. [Post-MVP Backlog](#post-mvp-backlog)

---

**Project**: Halterofit v0.1.0
**Status**: 🟡 In Progress (Phase 0.6 - Finalizing)
**Progress**: 27/72 tasks (38%) • MVP Scope: 65 active + 7 deferred tasks
**Timeline**: 12-13 weeks • Started 2025-01-20 • Target 2025-04-15
**Last Updated**: 2025-11-04 • **Next Milestone**: Complete 0.6.8 ExerciseDB Import → Phase 1 Auth

---

## Executive Summary

**Current Focus**: Phase 0.6 - Finalizing ExerciseDB Import (0.6.8)
**Phase Progress**: 21/21 (Phase 0.5 - 100%) + 6/7 (Phase 0.6 - 86%) • **Overall**: 27/72 tasks (38%)
**Critical Blockers**: 0.6.8 ExerciseDB import (apply migrations + run script) • **Velocity**: ~5 tasks/week

### Recent Completions ✅

1. **0.6.9** - Design system (Competitor analysis, 245-line doc, Agile approach)
2. **0.6.6** - Setup environment variables (Supabase, Sentry, ExerciseDB API configured)
3. **0.6.4** - Install core components (Button, Input, Card, Alert, Progress, Skeleton)
4. **0.6.3** - Validate dark theme (HEX colors confirmed)
5. **0.6.2** - Configure @expo/vector-icons (Material, Ionicons, FontAwesome)

---

## Kanban

**Legend:** 🔥 High Priority | 🟠 Blocked/Pending | ✅ Done | `[S/M/L]` Size (Small/Medium/Large)

| TODO (Top 5)                         | DOING | DONE (Last 5)                 |
| ------------------------------------ | ----- | ----------------------------- |
| **0.6.8** ExerciseDB import `[L]` 🔥 |       | **0.6.9** Design system ✅    |
| **1.10** Login screen `[M]` 🟠       |       | **0.6.6** Environment vars ✅ |
| **1.20** Register screen `[M]`🟠     |       | **0.6.4** Core components ✅  |
| **1.30** Supabase auth `[M]` 🟠      |       | **0.6.3** Dark theme ✅       |
| **1.40** Password reset `[M]`        |       | **0.6.2** Vector icons ✅     |

**Progress**: Phase 0.5: 21/21 (100%) • Phase 0.6: 6/7 (86%) • Overall: 27/72 (38%)
**Velocity**: ~5 tasks/week • **ETA**: Phase 0.6 complete in 1 day, MVP in 12-13 weeks
**NEXT**: 0.6.8 ExerciseDB Import 🔥 (apply migrations + run import script) → Phase 1 Auth

---

## Development Roadmap

**Note:** MVP scope = 72 tasks total (65 active + 7 deferred). Analytics and advanced features moved to Post-MVP backlog.

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
Phase 0.6: UI/UX Foundation (6/7 tasks) 86% 🟡
   ├─ React Native Reusables ✅
   ├─ Vector Icons ✅
   ├─ Dark theme ✅
   ├─ Core components ✅
   ├─ Design system ✅
   ├─ ExerciseDB Import 🟡 (script ready, needs execution)
   └─ Infrastructure 86% complete
        ↓
Phase 1: Authentication & Foundation (0/6 tasks) 🔄
   ├─ Login/Register screens
   ├─ Supabase Auth integration
   ├─ Password reset flow
   ├─ Protected routes
   └─ Maestro E2E setup
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

| Phase     | Tasks  | Est. Time | Status             | Dependencies                   |
| --------- | ------ | --------- | ------------------ | ------------------------------ |
| **0.5**   | 21     | 50-60h    | 100% DONE ✅       | None (started)                 |
| **0.6**   | 7      | 14-17h    | 86% IN PROGRESS 🟡 | ← Phase 0.5 complete           |
| **1**     | 6      | ~15h      | BLOCKED 🟠         | ← Phase 0.6 (0.6.8 incomplete) |
| **2**     | 12     | ~31h      | BLOCKED            | ← Phase 1 auth                 |
| **3**     | 9      | ~27h      | BLOCKED            | ← Phase 2 plans                |
| **4**     | 5      | ~11h      | BLOCKED            | ← Phase 3 (parallel OK)        |
| **5**     | 5      | ~9h       | BLOCKED            | ← Phases 1-4 complete          |
| **TOTAL** | **72** | **~125h** | **38% done**       | **12-13 weeks at 10h/week**    |

**⚠️ Critical Path:** Phase 0.6 (ExerciseDB) → Phase 1 (Auth) → Phase 2 (Plans) → Phase 3 (Active Workout)

**📊 MVP Scope Change:**

- Original: 119 tasks, 17 weeks
- Refined: 72 total (65 active + 7 deferred) tasks, 12-13 weeks (~45% reduction)
- Excludes: 7 deferred/optional tasks + 47 Post-MVP features
- Analytics, advanced features → Post-MVP backlog

---

## Phase 0.5: Architecture & Foundation (21/21) ✅ COMPLETE

**Timeline:** Weeks 1-7 | **Priority:** HIGHEST
**Goal:** Production-ready architecture and critical foundation

**Progress:** 21/21 tasks (100%) | **Status:** COMPLETE ✅ | **Optional tasks deferred:** 5 tasks in section 0.5.E

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

- [x] 0.5.4 **Configure expo-image with caching** (S - 1h) ✅ 2025-01-31
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

## Phase 0.6: UI/UX Foundation (6/7)

**Timeline:** Week 8 | **Priority:** HIGH
**Goal:** Complete UI foundation and infrastructure setup for production-ready development

**Progress:** 6/7 tasks (86%) | **Est. Time Remaining:** ~3-4h (ExerciseDB import only) | **Deferred tasks:** 2 (0.6.5, 0.6.7)

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

- [ ] 0.6.8 **Bulk Import ExerciseDB Library (1,300+ exercises)** (L - 4h) 🟡 IN PROGRESS

  **Strategy:** Database Seeding at Build Time (Option A) - Import once, users sync from Supabase

  **Status:** 80% complete - Script ready, awaiting execution

  **✅ Step 1: RapidAPI Account Setup** - COMPLETE
  - RapidAPI account created
  - Basic plan subscribed (FREE - 10,000 requests/month)
  - API key obtained

  **✅ Step 2: Configure Environment Variables** - COMPLETE
  - `.env` configured with EXERCISEDB_API_KEY
  - `.env` configured with EXERCISEDB_API_HOST (exercisedb.p.rapidapi.com)
  - `.env.example` updated with SUPABASE_SERVICE_ROLE_KEY template

  **✅ Step 3: Create Import Script** - COMPLETE
  - Created `scripts/import-exercisedb.ts` (387 lines, production-ready)
  - Created `scripts/rollback-exercisedb.ts` (rollback script)
  - Fetch ALL exercises from ExerciseDB API (1,300+ exercises)
  - **Pure 1:1 mapping** (ADR-019 - Zero custom fields, zero transformations)
  - 14 ExerciseDB fields: exercisedb_id, name, body_parts, target_muscles, secondary_muscles, equipments, exercise_type, instructions, exercise_tips, variations, overview, image_url, video_url, keywords
  - Upsert to Supabase (handles re-runs for quarterly updates)
  - Zod validation, --dry-run mode, batch processing
  - Added `npm run import-exercisedb` script to package.json
  - Created `scripts/README.md` with complete usage docs

  **✅ Step 4: Create Supabase Migrations** - COMPLETE
  - Created 6 SQL migration files in `supabase/migrations/`:
    - `20251104010000_add_exercisedb_id_column.sql`
    - `20251104020000_fix_search_path_security.sql`
    - `20251104030000_cleanup_duplicate_exercisedb_id_indexes.sql`
    - Plus 3 earlier migrations (align schema, remove custom fields)
  - Schema ready for ExerciseDB data structure

  **✅ Step 5: Documentation & Cleanup** - COMPLETE
  - Added "ExerciseDB Import Strategy" section to DATABASE.md
  - Cleaned up DATABASE.md (removed custom exercises mentions per ADR-017)
  - Updated TASKS.md Post-MVP Backlog with migration path

  **🟡 Step 6: Execute Import** - PENDING (Blocker for Phase 1)
  - **TODO:** Apply Supabase migrations: Push 6 migration files to Supabase
  - **TODO:** Run `npm run import-exercisedb` to populate database
  - **TODO:** Verify 1,300+ exercises imported successfully
  - **Estimated time:** 15-30 minutes
  - **Blocks:** Phase 1 (Auth requires database ready)

  **References:**
  - Import Script: [scripts/import-exercisedb.ts](../scripts/import-exercisedb.ts)
  - Documentation: [scripts/README.md](../scripts/README.md)
  - Strategy: [DATABASE.md § ExerciseDB Import Strategy](DATABASE.md#exercisedb-import-strategy)
  - API Docs: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb

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

## Phase 1: Authentication & Foundation (0/6)

**Timeline:** Weeks 9-10 | **Priority:** HIGH
**Goal:** Login/Register basics + Maestro E2E setup

**Progress:** 0/6 tasks (0%) | **Est. Time:** ~15h (2 weeks)

**Dependencies:** Phase 0.6 complete (UI components ready)

**Key Note:** Biometric auth removed (not needed - user logs in once). Simple email/password authentication only.

---

- [ ] 1.10 **Create login screen UI** (M - 2h) `[src/app/(auth)/login.tsx]`
      **Components**: Button, Input, Label, Alert (from 0.6.4 - React Native Reusables)
  - Email/password inputs (Input + Label components)
  - Login button (Button component with loading state)
  - "Forgot password" link → 1.40
  - "Create account" link → 1.20
  - Error handling with Alert component
  - Dark theme styling (#4299e1 primary blue)

- [ ] 1.20 **Create register screen UI** (M - 2h) `[src/app/(auth)/register.tsx]`
      **Components**: Button, Input, Label, Alert (from 0.6.4 - React Native Reusables)
  - Email/password inputs with validation (Input + Label)
  - Password confirmation field
  - Terms acceptance checkbox
  - Register button (Button component with loading state)
  - Link back to login (1.10)
  - Validation: email format, password ≥8 chars
  - Error display with Alert component

- [ ] 1.30 **Implement Supabase Auth integration** (M - 3h) `[src/services/auth/]`
  - Sign up functionality
  - Sign in functionality
  - Sign out functionality
  - Session management (JWT tokens in MMKV)
  - Error handling with user-friendly messages
  - Auth state persistence across app restarts

- [ ] 1.40 **Implement password reset flow** (M - 2h) `[src/app/(auth)/reset-password.tsx]`
  - Request reset screen (email input)
  - Supabase password reset email
  - Deep link handler for reset token
  - New password form
  - Success/error states

- [ ] 1.50 **Setup protected routes & navigation guards** (S - 1.5h) `[src/app/_layout.tsx]`
  - Redirect to login if not authenticated
  - Redirect to Workout tab if authenticated
  - Loading screen during auth check
  - Deep linking support for auth flows

- [ ] 1.60 **Setup Maestro E2E + Auth tests** (L - 4h) `[.maestro/auth/]`
  - Install Maestro CLI globally
  - Create .maestro/auth/ directory
  - Write auth-login.yaml (email/password login flow)
  - Write auth-register.yaml (new account creation)
  - Write auth-password-reset.yaml (reset flow)
  - Document test execution in docs/TESTING.md
  - Run tests on Development Build to verify

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

**Note:** These tasks are part of MVP scope (included in 72 total) but deferred to be implemented just-in-time or when needed, following YAGNI and Agile principles.

**Status:** Tracked but not blocking MVP progress. Can be completed progressively during Phases 1-4.

---

### 📋 Deferred Task List

**From Phase 0.5.E: Optional Improvements** (5 tasks)

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
**MVP Active Tasks:** 65 tasks
**MVP Total (Active + Deferred):** 72 tasks

---

---

## Post-MVP Backlog

**Note:** These features are OUT OF SCOPE for MVP. They will be prioritized post-launch based on user feedback and product-market fit validation.

**Total Post-MVP tasks:** ~60+ features deferred from original roadmap

---

### Analytics & Progression

**Priority:** HIGH (first post-MVP features to implement)

- Volume tracking (weekly/monthly charts with Victory Native)
- Personal records tracking with badges and celebrations
- Strength progression charts (line charts, trend analysis)
- 1RM estimation (Epley formula: weight × (1 + reps/30))
- Plateau detection (Mann-Kendall statistical test with simple-statistics library)
- Workout summaries (post-workout report: duration, volume, PRs)
- Weekly summary notifications (Monday morning push notifications)
- Volume distribution analysis (pie charts by muscle group)

**Estimated effort:** ~35-45h (Phase 4 from original roadmap)

---

### UX Enhancements

**Priority:** MEDIUM

- **Plate calculator** (modal from weight input showing required plates per side)
- **Set history** (last 3-5 sets display below input for progressive overload reference)
- **Notes per workout/exercise/set** (text area for observations)
- **Onboarding flow** (3-4 screens with feature highlights on first launch)
- **Profile image upload** (Supabase Storage integration, expo-image-picker)
- **Superset/circuit support** (exercise grouping with visual indicators)

**Estimated effort:** ~20-25h

---

### Advanced Features

**Priority:** LOW (validate with users first)

- **Custom exercise creation** (user-defined exercises with image upload)
  - Migration path documented in [ADR-017](archives/ADR-017-No-Custom-Exercises-MVP.md)
  - Add `is_custom` and `created_by` fields to exercises table
  - RLS policies for user ownership
  - Sync protocol update for cross-device custom exercises
  - UI: "Create Custom Exercise" button in Exercise Library
  - Form: name, muscle groups, instructions, equipment, image upload (Supabase Storage)
  - **Estimated effort:** ~8-12h (Phase 3+)
- **RPE/RIR tracking** (Rating of Perceived Exertion / Reps In Reserve)
- **Auto-weight suggestions** (rule-based, context-aware recommendations)
- **Load management** (acute/chronic load ratios, overtraining alerts)
- **Context-aware analytics** (nutrition phase tracking: bulk/cut/maintenance)
- **Exercise video demonstrations** (user-recorded, Supabase Storage)
- **Advanced E2E testing** (full Maestro suite covering all user flows)

**Estimated effort:** ~40-50h

---

### Infrastructure & Polish

**Priority:** AS NEEDED

- **Auto-Sync ExerciseDB Updates** (Supabase Edge Function)
  - Automated weekly check for new ExerciseDB exercises
  - Supabase Edge Function calls ExerciseDB API
  - Upserts new exercises into PostgreSQL
  - Users receive updates via WatermelonDB sync (automatic)
  - Eliminates manual quarterly re-imports (current: `npm run import-exercisedb`)
  - Rate limit management (free tier: 10,000 req/month)
  - **Estimated effort:** ~6-8h (serverless architecture)
  - **Dependencies:** MVP complete, validated user adoption
- **Supabase MCP Server Installation** (Developer Experience Enhancement)
  - Install Supabase MCP server for Claude Code integration
  - Enables Claude to query Supabase database directly during development
  - Faster debugging and development workflows (no manual SQL Editor navigation)
  - Query optimization suggestions and schema validation
  - **Estimated effort:** ~30-45 min (one-time setup)
  - **Dependencies:** ExerciseDB import complete (already done)
  - **Documentation:** [Supabase MCP GitHub](https://github.com/supabase-community/supabase-mcp-server)
  - **Optional:** Not critical for MVP, but improves developer velocity
- **Multi-language support (i18n)** - Defer until international expansion
- **Social features** (share workouts, follow friends) - Defer until user base >1,000
- **Coach-client relationship** (team accounts) - Defer until B2B validation
- **Performance dashboards** (Sentry Performance monitoring) - Already setup, just add custom metrics
- **Biometric authentication** (Face ID/Touch ID) - Not critical (user logs in once)

**Estimated effort:** ~15-20h (polish items only)

---

**Last Updated:** 2025-02-04
**Next Review:** After Phase 1 completion (Auth screens done)
