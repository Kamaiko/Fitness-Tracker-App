# ✅ Development Tasks

**Last Updated:** October 2025 (Revised after Architecture Deep Dive)
**Document Version:** 2.0

---

## 📊 Current Status

**Version:** 0.2.0 (Architecture Planning Complete)
**Progress:** ![](https://img.shields.io/badge/Progress-12%25-yellow)

### What's Working
- ✅ Expo SDK 54.0.12 with React 19.1.0
- ✅ Supabase client configured
- ✅ MMKV storage setup
- ✅ Zustand stores (auth, workout)
- ✅ Dark theme system (colors, spacing, typography)
- ✅ Home screen with Expo Router navigation
- ✅ App runs successfully on Android
- ✅ **Architectural decisions documented (WatermelonDB, FlashList, ExerciseDB, etc.)**

### What's Next (Critical Path)
- 🎯 **Phase 0.5:** WatermelonDB setup + DB schema implementation
- 🎯 **Phase 1:** Authentication + Performance libraries
- 🎯 **Phase 2:** Workout logging core features

---

## 🗺️ Revised Roadmap Overview

```
├── Phase 0: Setup ✅ (Weeks 1-2) - COMPLETED
├── Phase 0.5: Architecture Setup 🚧 (Week 3) - IN PROGRESS ⭐ CRITICAL
├── Phase 1: Auth & Foundation (Weeks 4-5) - NEXT
├── Phase 2: Workout Logging (Weeks 6-8)
├── Phase 3: Exercise Library (Weeks 9-10)
├── Phase 4: Analytics & Smart Features (Weeks 11-12)
└── Phase 5: Polish, Monitoring & Beta (Weeks 13-14)
```

**Target:** MVP Launch in 14 weeks (revised from 12 weeks)
**Reason for extension:** WatermelonDB integration + proper DB schema takes time but prevents future refactoring

---

## 📊 Progress Tracking

| Category | Completed | Total | Progress | Notes |
|----------|-----------|-------|----------|-------|
| **Infrastructure** | 18 | 18 | 100% | ✅ NativeWind + Victory Native migration complete |
| **Authentication** | 0 | 15 | 0% | Added nutrition phase management |
| **Workout Logging** | 0 | 28 | 0% | Added RIR, plate calculator, quick start |
| **Exercise Library** | 0 | 10 | 0% | **Reduced** (ExerciseDB API integration vs manual) |
| **Analytics** | 0 | 15 | 0% | **ENHANCED** (load management, personalized 1RM, workout reports, weekly summaries) |
| **Polish & Launch** | 0 | 18 | 0% | Added Sentry, compliance (GDPR), export |
| **Total** | 18 | 104 | 17% | Infrastructure phase complete ✅ |

---

## 🎯 Current Focus

**Week of October 2025** - Phase 0.5:
- [ ] 0.5.1 Setup WatermelonDB with Supabase sync
- [ ] 0.5.2 Implement revised database schema
- [ ] 0.5.3 Install FlashList
- [ ] 0.5.4 Install expo-image
- [ ] 0.5.5 Setup Sentry error monitoring

---

## ✅ Completed Tasks (18)

### Phase 0: Infrastructure & Setup
- [x] 0.1 Create Expo SDK 54 project with TypeScript
- [x] 0.2 Configure package.json with scripts
- [x] 0.3 Enable TypeScript strict mode
- [x] 0.4 Configure Expo Router for navigation
- [x] 0.5 Create Supabase project and get credentials
- [x] 0.6 Configure Supabase client in React Native
- [x] 0.7 Setup MMKV storage with helper functions
- [x] 0.8 Create Zustand stores (auth, workout)
- [x] 0.9 Implement dark theme system (colors, spacing, typography)
- [x] 0.10 Create initial home screen
- [x] 0.11 **Document architectural decisions (TECHNICAL.md updated)**
- [x] 0.12 **Migrate to NativeWind v4 (tailwind.config.js, babel, global.css)**
- [x] 0.13 **Refactor home screen with NativeWind (268→124 lines, 54% reduction)**
- [x] 0.14 **Switch from react-native-chart-kit to Victory Native v41**
- [x] 0.15 **Create example Victory Native chart component**
- [x] 0.16 **Update ADR-005 (NativeWind decision finalized)**
- [x] 0.17 **Update ADR-011 (Victory Native decision finalized)**
- [x] 0.18 **Document NativeWind usage in TECHNICAL.md**

---

## 📋 Phase 0.5: Architecture & Database Setup (0/7) ⭐ CRITICAL

**Timeline:** Week 3 | **Priority:** HIGHEST
**Goal:** Establish offline-first architecture and proper database schema before building features

### 0.5. Database & Storage Architecture

- [ ] 0.5.1 **Setup WatermelonDB with Supabase sync** (L - 4-6h) `[CRITICAL]`
  ```
  Tasks:
  - Install @nozbe/watermelondb
  - Configure SQLite adapter
  - Create WatermelonDB schema matching Supabase
  - Implement sync protocol with Supabase
  - Test offline-online synchronization
  - Document sync strategy in TECHNICAL.md

  Files to create:
  - src/services/database/watermelon.ts (WatermelonDB setup)
  - src/services/database/schema.ts (WatermelonDB schema)
  - src/services/database/sync.ts (Supabase sync logic)
  - src/models/ (WatermelonDB models for workouts, exercises, sets)

  Reference: https://supabase.com/blog/react-native-offline-first-watermelon-db
  ```

- [ ] 0.5.2 **Implement revised database schema in Supabase** (M - 3-4h) `[CRITICAL]`
  ```
  Tasks:
  - Create SQL migration with revised schema (see TECHNICAL.md § Database Schema)
  - Tables: users, exercises, workouts, workout_exercises, exercise_sets
  - Add fields: weight_unit, rir, rest_time_seconds, superset_group, etc.
  - Add nutrition phase tracking to users table (nutrition_phase, nutrition_phase_started_at)
  - Add subscription_tier to users table (future monetization)
  - Implement Row Level Security policies
  - Create indexes for performance
  - Seed initial data (test user)

  Files to create:
  - supabase/migrations/001_initial_schema.sql
  - scripts/seed-database.ts (optional seed script)

  Important: Schema MUST match WatermelonDB schema exactly
  ```

- [ ] 0.5.3 **Install and configure FlashList** (S - 1h)
  ```
  Tasks:
  - npm install @shopify/flash-list
  - Update metro.config.js if needed
  - Create example FlashList component for testing
  - Document usage patterns in TECHNICAL.md

  Files to create:
  - src/components/ui/ExampleFlashList.tsx (testing)
  ```

- [ ] 0.5.4 **Install and configure expo-image** (S - 1h)
  ```
  Tasks:
  - Install expo-image
  - Configure caching strategy
  - Create Image wrapper component with defaults
  - Test with sample exercise GIF

  Files to create:
  - src/components/ui/CachedImage.tsx (wrapper around expo-image)
  ```

- [ ] 0.5.5 **Setup Sentry for error monitoring** (M - 2h)
  ```
  Tasks:
  - Create Sentry account (free tier)
  - Install @sentry/react-native
  - Configure in app/_layout.tsx
  - Test error reporting
  - Add performance monitoring
  - Document in TECHNICAL.md

  Files to modify:
  - src/app/_layout.tsx (Sentry.init)
  - .env.example (SENTRY_DSN)
  ```

- [ ] 0.5.6 **Install simple-statistics for analytics algorithms** (S - 30min)
  ```
  Tasks:
  - npm install simple-statistics
  - Create analytics utilities folder
  - Implement personalized 1RM calculation with RIR adjustment (see TECHNICAL.md)
  - Implement load management calculations (acute/chronic load, fatigue ratio)
  - Implement context-aware plateau detection algorithm

  Files to create:
  - src/utils/analytics/calculations.ts (personalized 1RM, volume, load management)
  - src/utils/analytics/plateau.ts (Mann-Kendall with nutrition context)
  - src/utils/analytics/loadManagement.ts (acute/chronic, fatigue ratio)
  ```

- [ ] 0.5.7 **Update Zustand stores to persist via MMKV** (S - 1h)
  ```
  Tasks:
  - Add Zustand persist middleware
  - Configure MMKV storage adapter
  - Persist: user preferences, auth state, app settings
  - Test: Close app → Reopen → State persisted

  Files to modify:
  - src/stores/authStore.ts (add persist middleware)
  - src/stores/workoutStore.ts (if needed)
  ```

---

## 📋 Phase 1: Authentication & Foundation (0/14)

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
  - Session management with MMKV
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

### 4. Development Tools & Setup

- [ ] 4.1 Setup development environment file (S - 30min)
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

- [ ] 4.2 Create useful TypeScript types (M - 2h) `[src/types/]`
  ```
  Files to create:
  - src/types/database.ts (database tables interfaces including nutrition_phase)
  - src/types/exercises.ts (exercise, set, workout types)
  - src/types/user.ts (user, profile, nutrition phase types)
  - src/types/analytics.ts (load metrics, fatigue ratios, workout reports)
  - src/types/api.ts (API response types)
  ```

- [ ] 4.3 Add nutrition phase management screen (M - 3h) `[src/app/(tabs)/profile/nutrition.tsx]`
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

## 📋 Phase 2: Workout Logging (0/28)

**Timeline:** Weeks 6-8 | **Priority:** HIGH
**Goal:** Core workout logging functionality with excellent UX

### 5. Workout Session Core

- [ ] 5.1 Update workout session state management (M - 3h) `[src/stores/workoutStore.ts]`
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

- [ ] 5.2 Design workout active screen (L - 8h) `[src/app/(tabs)/workout/active.tsx]` `[CRITICAL UX]`
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

- [ ] 5.3 Implement rest timer with notifications (M - 4h) `[src/components/workout/RestTimer.tsx]`
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

- [ ] 5.4 Create workout history screen (M - 4h) `[src/app/(tabs)/workout/history.tsx]`
  ```
  Features:
  - List of past workouts (FlashList, paginated)
  - Filter by date range
  - Search by exercise name
  - Tap to view workout details
  - Swipe actions: Repeat, Delete
  - Calendar view (optional)

  Uses:
  - WatermelonDB queries with .observe() for reactive UI
  - Pagination with .take(20)
  ```

- [ ] 5.5 Create workout detail/summary screen (M - 3h) `[src/app/(tabs)/workout/[id].tsx]`
  ```
  Shows:
  - Workout date, duration
  - All exercises with sets (weight, reps, RPE, RIR)
  - Volume statistics
  - Personal records achieved
  - Notes
  - Actions: Repeat workout, Edit, Delete, Share
  ```

### 6. Exercise Selection & Management

- [ ] 6.1 Create exercise selection modal (L - 6h) `[src/components/workout/ExerciseSelector.tsx]` `[CRITICAL UX]`
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

- [ ] 6.2 Implement search algorithm (M - 3h) `[src/utils/search.ts]`
  ```
  Search strategy:
  - Full-text search on exercise name, muscle groups
  - Fuzzy matching (typos)
  - Ranking: exact match > starts with > contains
  - WatermelonDB .extend(rawSql) for custom queries if needed
  ```

- [ ] 6.3 Create favorites/starred system (S - 2h) `[src/stores/favoritesStore.ts]`
  ```
  - Store favorited exercise IDs in MMKV (simple array)
  - Toggle favorite function
  - Filter exercises to show only favorites
  - Zustand store for reactive UI
  ```

### 7. Set Logging Interface

- [ ] 7.1 Create set logging component (L - 6h) `[src/components/workout/SetLogger.tsx]` `[CRITICAL UX]`
  ```
  Design (minimize taps):
  - Pre-populated weight/reps from last set
  - Inline number inputs (no modals)
  - Quick buttons: +2.5kg, +5kg, -2.5kg, -5kg
  - Checkmark to complete set
  - Optional RIR button (small, non-intrusive)

  See TECHNICAL.md UX Best Practices § Quick Set Logging
  ```

- [ ] 7.2 Implement RPE tracking system (M - 3h) `[src/components/workout/RPESelector.tsx]`
  ```
  - Scale 1-10 (visual buttons)
  - Optional per-set
  - Can be toggled in settings
  - Color-coded (green 1-5, yellow 6-7, orange 8-9, red 10)
  ```

- [ ] 7.3 Implement RIR tracking (non-intrusive UX) (M - 3h) `[src/components/workout/RIRTracker.tsx]`
  ```
  Options (see TECHNICAL.md UX section):
  - Option A: End-of-workout prompt for all sets
  - Option B: Optional inline button per set
  - Settings toggle: Enable RIR | Prompt timing

  Scale 0-5 (0 = failure, 5 = easy)
  ```

- [ ] 7.4 Add set history display (M - 3h) `[src/components/workout/SetHistory.tsx]`
  ```
  Shows below current set input:
  - Last 3-5 sets for this exercise
  - From previous workouts
  - Format: "100kg × 8 reps (RPE 8) - 2 days ago"
  - Helps user choose progressive overload
  ```

- [ ] 7.5 Implement auto-suggestions for weight/reps (M - 4h)
  ```
  Logic:
  - If last workout RIR = 0-1 → Suggest +2.5kg
  - If last workout RIR = 2-3 → Suggest +1 rep
  - If last workout RIR = 4-5 → Suggest same weight, more reps
  - Show suggestion subtly (not forcing)
  ```

### 8. Workout Management Features

- [ ] 8.1 Implement "Start Empty Workout" (S - 2h)
  ```
  - Create new workout in WatermelonDB
  - Navigate to active workout screen
  - User adds exercises as they go
  ```

- [ ] 8.2 Implement "Repeat Last Workout" (M - 3h)
  ```
  - Fetch last workout for selected exercise or full workout
  - Pre-populate exercises and target sets
  - User logs actual performance
  - Show comparison with last time
  ```

- [ ] 8.3 Create workout templates (L - 6h) `[src/app/(tabs)/workout/templates.tsx]`
  ```
  - Save current workout as template
  - Name and describe template
  - List of saved templates
  - Start workout from template
  - Edit/Delete templates

  Uses workout_templates tables (see schema)
  ```

- [ ] 8.4 Implement workout notes (S - 2h) `[src/components/workout/NotesInput.tsx]`
  ```
  - Text area for workout notes
  - Saved to workouts.notes field
  - Also per-exercise notes (workout_exercises.notes)
  - Also per-set notes (exercise_sets.notes)
  ```

- [ ] 8.5 Add workout duration timer (S - 2h) `[src/components/workout/WorkoutTimer.tsx]`
  ```
  - Start when workout starts (workouts.started_at)
  - Display in header (MM:SS format)
  - Continues in background
  - Save total duration on workout end
  ```

- [ ] 8.6 **Implement Plate Calculator** (M - 4h) `[src/utils/plateCalculator.ts + Modal]` `[ESSENTIAL FEATURE]`
  ```
  Feature:
  - Small button/icon next to weight input
  - Opens modal showing plate breakdown
  - "Add per side: 20kg + 10kg + 2.5kg"
  - Support Olympic (20kg/45lbs) and Standard (15kg) bars
  - User-configurable available plates in settings

  See TECHNICAL.md UX Best Practices § Plate Calculator
  ```

- [ ] 8.7 Add quick weight change buttons (S - 2h)
  ```
  - Buttons: +5kg, +2.5kg, -2.5kg, -5kg (or lbs equivalent)
  - Located around weight input
  - One-tap weight adjustment
  - Haptic feedback on tap
  ```

---

## 📋 Phase 3: Exercise Library (0/10)

**Timeline:** Weeks 9-10 | **Priority:** MEDIUM
**MAJOR CHANGE:** Using ExerciseDB API instead of manual creation

### 9. ExerciseDB API Integration

- [ ] 9.1 **Integrate ExerciseDB API and seed Supabase** (L - 6h) `[CRITICAL TIME SAVER]`
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

- [ ] 9.2 Design exercise list screen (M - 4h) `[src/app/(tabs)/exercises/index.tsx]`
  ```
  Features:
  - FlashList for performance (500+ items)
  - Search bar (real-time, local WatermelonDB query)
  - Filters: Muscle group, Equipment, Difficulty
  - Show exercise GIF thumbnail (expo-image with caching)
  - Tap to view details
  - Quick add to workout button
  ```

- [ ] 9.3 Create exercise detail screen (M - 4h) `[src/app/(tabs)/exercises/[id].tsx]`
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

### 10. Custom Exercises & Management

- [ ] 10.1 Implement custom exercise creation (M - 4h) `[src/app/(tabs)/exercises/create.tsx]`
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

- [ ] 10.2 Add exercise images/videos (optional for custom) (M - 3h)
  ```
  - Upload to Supabase Storage
  - Image picker (expo-image-picker)
  - Video recording (expo-camera)
  - Store URL in exercises.image_url / video_url
  - Display in exercise detail screen
  ```

- [ ] 10.3 Create exercise filters (M - 3h) `[src/components/exercises/FilterPanel.tsx]`
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

### 11. Exercise History & Analytics

- [ ] 11.1 Show exercise history (M - 4h) `[src/components/exercises/ExerciseHistory.tsx]`
  ```
  For selected exercise, show:
  - Chart: Weight progression over time (Victory Native)
  - Chart: Volume progression (sets × reps × weight)
  - List: Last 10 workouts with this exercise
  - Personal records: Max weight, Max reps, Max volume
  - Average RPE/RIR
  ```

- [ ] 11.2 Implement progression tracking (M - 4h)
  ```
  Calculate and display:
  - Week-over-week change (%)
  - Month-over-month change (%)
  - All-time progress (first vs last workout)
  - Estimated 1RM progression
  - Visual indicators: ⬆️ improving, ➡️ plateau, ⬇️ regressing
  ```

---

## 📋 Phase 4: Analytics & Smart Features (0/15)

**Timeline:** Weeks 11-12 | **Priority:** HIGH
**MAJOR CHANGES:** Enhanced with context-aware analytics, load management, personalized 1RM, workout reports

### 12. Progress Dashboard

- [ ] 12.1 Create analytics dashboard (L - 6h) `[src/app/(tabs)/analytics/index.tsx]`
  ```
  Sections:
  - Weekly volume chart (bar chart - Victory Native)
  - Strength progression (line chart - selected exercises)
  - Workout frequency (calendar heatmap)
  - Personal records (list with badges)
  - Body part split (pie chart or bars)

  Charts library: Victory Native (see ADR-011)
  Data source: WatermelonDB aggregation queries
  ```

- [ ] 12.2 Implement context-aware volume tracking (M - 4h) `[src/lib/analytics/volume.ts]`
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

- [ ] 12.3 Add strength progression charts (M - 4h) `[src/components/analytics/StrengthChart.tsx]`
  ```
  Features:
  - Select exercise(s) to compare
  - X-axis: Time (weeks/months)
  - Y-axis: Weight or Estimated 1RM
  - Show trend line (linear regression)
  - Highlight PRs with markers
  - Zoom/pan gestures (Victory Native supports)
  ```

### 13. Advanced Analytics (Science-Based)

- [ ] 13.1 **Implement context-aware plateau detection** (M - 5h) `[src/lib/analytics/plateau.ts]` `[CRITICAL]`
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

- [ ] 13.2 Implement load management system (M - 4h) `[src/lib/analytics/loadManagement.ts]` `[NEW - CRITICAL]`
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

- [ ] 13.3 Implement personalized 1RM with RIR adjustment (M - 3h) `[src/lib/analytics/personalized1RM.ts]` `[NEW]`
  ```
  Enhancement over basic formulas:
  - Calculate base 1RM (avg of Epley, Brzycki, Lombardi)
  - Adjust by RIR: each RIR point = ~3.3% additional capacity
  - Example: 100kg × 8 @ RIR2 = higher e1RM than 105kg × 6 @ RIR0
  - Only use "working sets" (exclude warmups, RIR ≤ 3)
  - Track personal accuracy factor over time

  Compare PRs using adjusted 1RM, not just raw weight
  ```

- [ ] 13.4 Implement volume distribution analysis (M - 3h) `[src/lib/analytics/volumeDistribution.ts]`
  ```
  Analysis:
  - Volume per muscle group (pie chart)
  - Volume per movement pattern (push/pull/legs)
  - Volume per exercise category (compound vs isolation)
  - Volume per day of week (bar chart)
  - Recommendations: "Increase chest volume by 15% to match back"
  - Contextualize by nutrition phase
  ```

- [ ] 13.5 Add workout frequency & consistency analysis (M - 3h)
  ```
  Metrics:
  - Workouts per week (average, trend, by nutrition phase)
  - Most common workout days
  - Consistency score (%) - missed vs planned
  - Streak tracking (current, longest)
  - Calendar heatmap visualization
  - Session completion rate (started vs finished)
  ```

### 14. Performance Feedback & Reports

- [ ] 14.1 **Create post-workout report system** (L - 6h) `[src/components/analytics/WorkoutReport.tsx]` `[NEW - CRITICAL]`
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

- [ ] 14.2 **Create weekly summary system** (L - 5h) `[src/components/analytics/WeeklySummary.tsx]` `[NEW]`
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

- [ ] 14.3 Add context-aware weight suggestions (M - 4h) `[src/lib/suggestions/weightSuggestions.ts]`
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

## 📋 Phase 5: Polish, Monitoring & Beta Launch (0/18)

**Timeline:** Weeks 13-14 | **Priority:** HIGH
**ADDED:** Security, monitoring, compliance requirements

### 15. Performance Optimization

- [ ] 15.1 Optimize bundle size (M - 3h)
  ```
  - Run react-native-bundle-visualizer
  - Identify large dependencies
  - Code splitting for heavy features (charts, analytics)
  - Lazy load screens with React.lazy()
  - Remove unused dependencies
  - Target: <10MB bundle size
  ```

- [ ] 15.2 Improve cold start time (M - 3h)
  ```
  - Profile app launch with Sentry Performance
  - Defer non-critical initialization
  - Optimize WatermelonDB initial queries
  - Use skeleton screens during load
  - Target: <2s cold start
  ```

- [ ] 15.3 Add offline functionality verification (M - 2h)
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

### 16. Security & Compliance `[REQUIRED FOR APP STORE]`

- [ ] 16.1 **Create Privacy Policy** (M - 3h) `[REQUIRED]`
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

- [ ] 16.2 **Create Terms of Service** (M - 2h) `[REQUIRED]`
  ```
  Must include:
  - Liability disclaimers (NOT medical advice)
  - User-generated content policy
  - Account termination conditions
  - Acceptable use policy
  - Changes to terms

  Link in register screen (user must accept)
  ```

- [ ] 16.3 **Implement data deletion flow** (M - 3h) `[GDPR REQUIRED]`
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

- [ ] 16.4 **Implement data export** (M - 3h) `[GDPR REQUIRED]`
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

### 17. Monitoring & Analytics

- [ ] 17.1 **Setup user analytics** (M - 3h) `[PostHog or Mixpanel]`
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

- [ ] 17.2 **Verify Sentry monitoring** (S - 1h)
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

- [ ] 17.3 Setup performance monitoring (M - 2h)
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

### 18. Beta Launch Preparation

- [ ] 18.1 Create onboarding flow (M - 4h) `[src/app/(onboarding)/]`
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

- [ ] 18.2 Add user feedback system (M - 3h)
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

- [ ] 18.3 Prepare beta release (M - 4h)
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

- [ ] 18.4 Write beta testing guide (S - 1h)
  ```
  Document for beta testers:
  - How to install (TestFlight/Play Store link)
  - What to test
  - How to report bugs
  - Known limitations
  - Feedback form link
  ```

- [ ] 18.5 App Store compliance checklist (M - 2h)
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

## 📝 Task Management Guidelines

### Task Size Estimates
- **S** (Small): 1-2 hours
- **M** (Medium): 3-6 hours
- **L** (Large): 1-2 days

### Priority Levels
- **CRITICAL**: Blocking other tasks, must be done first
- **HIGH**: Core MVP features
- **MEDIUM**: Important but can be deferred
- **LOW**: Nice-to-have, post-MVP

### File Path Conventions
File paths in brackets `[path/to/file.tsx]` indicate where to create or modify code.

### Dependencies
Tasks are ordered chronologically within phases. Some tasks have dependencies:
- Phase 0.5 must be completed before Phase 1
- Database schema (0.5.2) must be done before any data-related features
- WatermelonDB setup (0.5.1) must be done before using database

---

## 🔄 How to Use This File

1. **Daily workflow:**
   - Check current phase
   - Pick next uncompleted task
   - Mark as `[x]` when done
   - Update progress tracking table

2. **Planning:**
   - Review upcoming phase tasks
   - Identify potential blockers
   - Adjust estimates if needed

3. **Progress tracking:**
   - Update "Current Status" section weekly
   - Celebrate completed phases
   - Document learnings in TECHNICAL.md if architecture changes

---

**Last Updated:** October 2025 (Post Architecture Deep Dive)
**Next Review:** After Phase 0.5 completion
