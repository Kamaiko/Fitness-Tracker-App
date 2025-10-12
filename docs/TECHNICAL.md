# 🏗️ Technical Documentation

**Last Updated:** January 2025
**Version:** 0.2.0
**Status:** Phase 0.5 - Foundation

---

## 📑 Table of Contents

- [📐 Architecture Overview](#-architecture-overview)
- [📦 Technology Stack](#-technology-stack)
- [🏛️ Architecture Decisions (ADRs)](#️-architecture-decisions-adrs)
  - [ADR-001: Expo SDK vs Bare React Native](#adr-001-expo-sdk-vs-bare-react-native)
  - [ADR-002: Supabase vs Firebase vs AWS Amplify](#adr-002-supabase-vs-firebase-vs-aws-amplify)
  - [ADR-003: TypeScript Strict Mode](#adr-003-typescript-strict-mode)
  - [ADR-004: Database Strategy - expo-sqlite](#adr-004-database-strategy---expo-sqlite)
  - [ADR-005: Navigation with Expo Router](#adr-005-navigation-with-expo-router)
  - [ADR-006: State Management - Zustand + React Query](#adr-006-state-management---zustand--react-query)
  - [ADR-007: Styling with NativeWind](#adr-007-styling-with-nativewind)
  - [ADR-008: Testing Strategy](#adr-008-testing-strategy)
  - [ADR-009: Storage Strategy - AsyncStorage](#adr-009-storage-strategy---asyncstorage)
  - [ADR-010: Performance Libraries](#adr-010-performance-libraries)
  - [ADR-011: Charts Library - react-native-chart-kit](#adr-011-charts-library---react-native-chart-kit)
- [📁 Project Structure](#-project-structure)
- [🎨 Design System](#-design-system)
- [🗄️ Database Schema](#️-database-schema)
- [📊 Analytics & Algorithms](#-analytics--algorithms)
- [💰 Business Model & Monetization](#-business-model--monetization-strategy)
- [🔐 Security & Monitoring](#-security--monitoring)
- [⚡ Performance Guidelines](#-performance-guidelines)
- [📋 Coding Standards](#-coding-standards)
- [🔧 Development Workflow](#-development-workflow)
- [🚀 Deployment](#-deployment)
- [🎨 UX Best Practices](#-ux-best-practices-from-strong-hevy-jefit)
- [📚 Resources](#-resources)

---

## 📐 Architecture Overview

### Philosophy

- **Mobile-First:** Optimized for mobile experience
- **Offline-First:** Works without internet connection (CRITICAL)
- **Performance-First:** <2s cold start, 60fps animations
- **Type-Safe:** TypeScript strict mode throughout
- **Simple & Pragmatic:** Choose simplicity over complexity

### Key Decision: expo-sqlite + Supabase Sync

**Why expo-sqlite instead of WatermelonDB:**

- ✅ **Expo Go Compatible** - No Dev Client required
- ✅ **Offline-First** - CRITICAL priority from PRD
- ✅ **Learning Opportunity** - Understand sync logic
- ✅ **Performance** - Sufficient for <1000 users
- ✅ **Migration Path** - Easy upgrade to WatermelonDB when needed

### Storage Stack

```
┌─────────────────────────────────────────┐
│         USER ACTIONS (UI)               │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│    ZUSTAND (temporary UI state)         │
│    - Active workout, form inputs        │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│    EXPO-SQLITE (offline-first)          │
│    - Workouts, exercises, sets          │
│    - Instant save, no network wait      │
│    - Flag: synced (0 or 1)             │
└─────────────┬───────────────────────────┘
              │
              ▼ (background sync)
┌─────────────────────────────────────────┐
│    SUPABASE (cloud backup)              │
│    - PostgreSQL + Row Level Security    │
│    - Conflict: last write wins          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    ASYNCSTORAGE (preferences only)      │
│    - Auth tokens, user settings         │
└─────────────────────────────────────────┘
```

**Component Rationale:**

| Component        | Role               | Why This Choice                             |
| ---------------- | ------------------ | ------------------------------------------- |
| **expo-sqlite**  | Main database      | Expo Go + Offline-first + Performance       |
| **AsyncStorage** | Simple prefs       | Already installed + Sufficient for settings |
| **Supabase**     | Cloud sync         | No custom backend + RLS + Realtime          |
| **Zustand**      | Temporary UI state | Minimal (1KB) + Simple + TypeScript         |

### Data Flow: Logging a Set

```
1. User taps "Log Set"
   └─> Component: <SetLogger />

2. ZUSTAND update (instant UI)
   └─> workoutStore.addSet({ weight: 100, reps: 8 })

3. EXPO-SQLITE save (instant, <10ms)
   └─> await logSet(workoutExerciseId, setNumber, data)
   └─> INSERT INTO exercise_sets ... synced = 0

4. UI shows success ✅ (no waiting!)

5. BACKGROUND SYNC (non-blocking)
   └─> autoSync()
       ├─> Get unsynced sets (synced = 0)
       ├─> Batch 50 sets at a time
       ├─> supabase.from('exercise_sets').upsert(batch)
       └─> UPDATE exercise_sets SET synced = 1
```

**User Experience:** <10ms (instant), Sync: 1-3s (invisible)

---

## 📦 Technology Stack

**Frontend:** Expo SDK 54 + React Native 0.81 + TypeScript 5.9 (strict) | Expo Router 6 | NativeWind v4 (Tailwind CSS) | Zustand 5 + React Query 5.90 | expo-sqlite (offline-first) + AsyncStorage | FlashList + expo-image + react-native-chart-kit

**Backend:** Supabase (PostgreSQL + Auth JWT/RLS + Storage + Realtime)

**External:** ExerciseDB API (1,300+ exercises) | Sentry (monitoring) | RevenueCat (future subscriptions)

**Dev Tools:** Metro bundler | ESLint + Prettier + Husky + lint-staged + Commitlint | Jest + React Native Testing Library

**Current Phase:** Phase 0.5 - 100% Expo Go compatible (offline-first with expo-sqlite)

---

## 🏛️ Architecture Decisions (ADRs)

### ADR-001: Expo SDK 54 Managed Workflow

**Decision:** Expo managed workflow for rapid MVP development

**Rationale:** No native configuration, built-in tools (Expo Go, EAS Build), faster iteration

**Trade-offs:** Limited to Expo-compatible libraries, ~500KB larger bundle vs bare workflow

**Status:** ✅ Implemented

---

### ADR-002: Zustand for State Management

**Decision:** Zustand for global state (auth, workout session)

**Rationale:** Minimal boilerplate (~1KB vs Redux 20KB), excellent TypeScript support, sufficient for MVP scope

**Trade-offs:** Smaller ecosystem than Redux, fewer middleware options

**Status:** ✅ Implemented

---

### ADR-003: React Query for Server State

**Decision:** React Query for Supabase data caching

**Rationale:** Automatic cache invalidation, built-in loading/error states, optimistic updates

**Trade-offs:** Learning curve, additional dependency (~20KB)

**Status:** ✅ Installed (not yet used)

---

### ADR-004: expo-sqlite for Offline-First Storage (Phase 0.5+)

**Decision:** expo-sqlite with manual Supabase sync (Phase 0.5+), migrate to WatermelonDB at 1000+ users

**Current Implementation (Phase 0.5):**

- `src/services/database/` - SQLite with type-safe CRUD + sync
- Used for: workouts, exercises, sets (offline-first relational data)
- ✅ Expo Go compatible (expo-sqlite is built-in)
- ✅ Excellent performance (native SQLite)
- ✅ Manual sync with Supabase (~200 lines code)

**Storage Architecture:**
| Storage | Speed | Use Case | Phase | Expo Go |
|---------|-------|----------|-------|---------|
| **expo-sqlite** | Fast | Workouts, exercises, sets | 0.5+ | ✅ |
| **AsyncStorage** | Slow | Auth tokens, preferences | 0+ | ✅ |
| **WatermelonDB** | Fast | Replace expo-sqlite (auto sync) | 3+ | ❌ |
| **MMKV** | Fast | Replace AsyncStorage (encrypted) | 3+ | ❌ |

**Why expo-sqlite Now:**

- ✅ Offline-first required (CRITICAL priority in PRD)
- ✅ Expo Go compatible (no Dev Client needed yet)
- ✅ Learning opportunity (understand sync logic)
- ✅ Performance sufficient for <1000 users
- ✅ Migration path clear when needed

**Migration to WatermelonDB (When 1000+ users OR performance issues):**

```
Current: expo-sqlite + manual sync (200 lines)
Future:  WatermelonDB + auto sync (20 lines)

Migration time: 2-3 days
Benefits: Reactive queries, better conflict resolution, auto sync
```

**Trade-offs:**

- ⚠️ Manual sync code (vs WatermelonDB auto sync)
- ⚠️ Simple conflict resolution (last write wins vs smart merge)
- ✅ Full control and understanding
- ✅ No Dev Client required

**Status:** ✅ Implemented (expo-sqlite + sync) | 📋 Future (WatermelonDB migration when scaling)

---

### ADR-005: NativeWind (Tailwind CSS) for Styling

**Decision:** NativeWind v4 for all styling (switched from StyleSheet in Phase 0.5)

**Rationale:**

- 2-3x faster development (className vs StyleSheet.create)
- Easier maintenance and modifications
- Industry standard (massive documentation, community)
- Solo developer doing all coding = no learning curve issue
- Timing perfect (minimal UI code written)

**Trade-offs:**

- Initial setup: 2-3 hours
- Slightly larger bundle (+50KB)
- Peer dependency warnings (React 19.1 vs 19.2, non-blocking)

**ROI:** 2-3h investment vs 10-20h saved over 14 weeks

**Status:** ✅ Implemented (Phase 0.5)

---

### ADR-006: Relative Imports (No Path Aliases)

**Decision:** Relative imports for MVP

**Rationale:** Avoid babel-plugin-module-resolver complexity

**Future:** Add `@/` aliases when codebase exceeds 50 files

**Status:** ✅ Implemented

---

### ADR-007: Manual Testing for MVP

**Decision:** Skip Jest/Detox initially

**Rationale:** Faster MVP delivery, comprehensive tests pre-production

**Future:** Add Jest + Detox before v1.0 launch

**Status:** ✅ Decided

---

### ADR-008: Supabase Backend

**Decision:** Supabase for auth, database, storage, real-time

**Rationale:** No backend code, Row Level Security, free tier generous (500MB DB, 50K monthly active users)

**Trade-offs:** Vendor lock-in (mitigated: PostgreSQL is portable)

**Status:** ✅ Implemented

---

### ADR-009: WatermelonDB + Hybrid Storage Strategy (Phase 3)

**Decision:** WatermelonDB (SQLite) with Supabase sync + MMKV + Zustand hybrid

**Context:** Zero data loss requirement; instant UI responsiveness critical during workouts; true offline-first architecture needed

**Current Phase (0-2) - Simplified:**

- AsyncStorage only (Expo Go compatible)
- No native modules
- Sufficient for MVP UI/UX development

**Phase 3 Architecture (Dev Client Required):**

| Layer            | Purpose                             | Examples                  | Performance         | Native Module |
| ---------------- | ----------------------------------- | ------------------------- | ------------------- | ------------- |
| **WatermelonDB** | Relational data (syncs to Supabase) | Workouts, exercises, sets | 20x > AsyncStorage  | ✅ SQLite     |
| **MMKV**         | Local-only key-value                | Auth tokens, preferences  | 30x > AsyncStorage  | ✅ C++        |
| **Zustand**      | Temporary UI state                  | `isWorkoutActive`, forms  | In-memory (instant) | ❌            |

**Phase 3 Data Flow:**

```
User Input → Zustand → WatermelonDB → Supabase (when online)
                ↓
              MMKV (persist selected Zustand slices)
```

**Benefits:**

- Zero latency during workouts (no network waits)
- Guaranteed data reliability
- Automatic conflict resolution
- Each tool optimized for specific use case

**Trade-offs:**

- Requires Dev Client (native build)
- 3 storage layers (complexity)
- 4-6 hour initial setup
- Learning curve for sync protocol

**Migration Timeline:**

- **Phase 0-2:** AsyncStorage only
- **Phase 3 Week 1:** Create Dev Client + install WatermelonDB
- **Phase 3 Week 2:** Implement sync protocol
- **Phase 3 Week 3:** Migrate existing data from AsyncStorage

**Status:** 📋 Planned for Phase 3

---

### ADR-010: FlashList for High-Performance Lists

**Decision:** FlashList for all lists (exercise library, workout history)

**Rationale:**

- 54% FPS improvement (36.9 → 56.9 FPS), 82% CPU reduction
- Cell recycling (10x faster than FlatList virtualization)
- Critical for 500+ exercise library on Android low-end devices

**Migration:**

```typescript
// Add estimatedItemSize prop
<FlashList data={items} renderItem={...} estimatedItemSize={80} />
```

**Trade-offs:** +50KB bundle, requires manual item height estimation

**Status:** 📋 Planned (Phase 1)

---

### ADR-011: Charts Strategy - react-native-chart-kit

**Decision:** Use react-native-chart-kit for MVP (Phase 0-5)

**Current Implementation (Expo Go):**

- **Library:** react-native-chart-kit
- **Rationale:**
  - ✅ Pure JavaScript + react-native-svg (100% Expo Go compatible)
  - ✅ Sufficient for MVP analytics (line, bar, pie charts)
  - ✅ No native modules required
  - ✅ Battle-tested, stable, maintained
  - ✅ Covers all MVP chart needs
- **Limitations:** Basic zoom/pan, limited multi-line (2-3 max), basic customization

**Future Considerations (Post-MVP, if needed):**

- **Alternative:** Victory Native v41 (Skia-based) or recharts-native
- **When to consider:**
  - If users demand advanced features (multi-line comparisons, complex interactions)
  - If performance becomes an issue with 1000+ data points
  - If willing to migrate to Dev Client/native build
- **Migration effort:** ~3h (abstraction layer exists in codebase)

**Trade-offs:**

- Current: Limited features but maintains Expo Go simplicity
- Future: Better features but requires native build (complexity increase)

**Status:** ✅ Implemented with react-native-chart-kit (Phase 0.5)

---

### ADR-012: ExerciseDB API Integration

**Decision:** Seed exercise library from ExerciseDB API (1,300+ exercises)

**Rationale:**

- **Time savings:** 190 hours (200h manual creation → 10h integration)
- **Quality:** Professional GIFs, instructions, categorization
- **Coverage:** Exceeds 500 exercise target

**Implementation:**

```typescript
// One-time seed: ExerciseDB → Supabase → WatermelonDB
// Runtime: No API calls (local-only search/filtering)
```

**Data Ownership:** Seeded to our Supabase (full control), users add custom exercises

**Trade-offs:** Initial API dependency (one-time), license compliance required

**Alternatives:** Wger API (200 exercises), API Ninjas (1,000)

**Status:** 📋 Planned (Phase 3)

---

## 📁 Project Structure

### Current Structure (v0.1.0)

```
src/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout (StatusBar + Stack)
│   ├── index.tsx                 # Home screen (minimal)
│   └── +not-found.tsx            # 404 error screen
│
├── services/                     # External services
│   ├── supabase/
│   │   └── client.ts             # Supabase client
│   └── storage/
│       └── mmkv.ts               # MMKV wrapper
│
├── stores/                       # Zustand stores
│   ├── authStore.ts              # Auth state
│   └── workoutStore.ts           # Workout state
│
└── theme/                        # Design system
    ├── index.ts                  # Re-exports
    ├── colors.ts                 # Dark theme palette
    ├── spacing.ts                # 8px grid
    └── typography.ts             # Modular scale
```

### Future Structure (Post-MVP)

```
src/
├── app/
│   ├── (tabs)/                   # Tab navigation
│   ├── (auth)/                   # Auth screens
│   └── (modals)/                 # Modals
│
├── components/                   # Reusable components
│   ├── ui/                       # Base UI (Button, Input, Card)
│   ├── workout/                  # Workout components
│   └── analytics/                # Analytics components
│
├── hooks/                        # Custom hooks
├── utils/                        # Utilities
└── types/                        # TypeScript types
```

### Naming Conventions

- **Files:** PascalCase for components (`Button.tsx`), camelCase for utilities (`validation.ts`)
- **Components:** PascalCase (`HomeScreen`, `SetLogger`)
- **Functions:** camelCase (`calculateVolume`, `formatWeight`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RPE`, `DEFAULT_TIMER`)
- **Types/Interfaces:** PascalCase (`User`, `WorkoutSession`)

---

## 🎨 Design System

**Dark Theme (configured in `tailwind.config.js`):**

- Backgrounds: `bg-background` (#0A0A0A), `bg-background-surface` (#1A1A1A), `bg-background-elevated` (#2A2A2A)
- Primary: `bg-primary` (#4299e1), `bg-primary-dark`, `bg-primary-light`
- Semantic: `text-success`, `text-warning`, `text-danger`, `text-info`
- Text: `text-foreground` (primary), `text-foreground-secondary`, `text-foreground-tertiary`

**Spacing (8px grid in Tailwind):**

```tsx
className = 'p-xs'; // padding: 4px
className = 'p-sm'; // padding: 8px
className = 'p-md'; // padding: 16px
className = 'p-lg'; // padding: 24px
className = 'p-xl'; // padding: 32px
className = 'p-2xl'; // padding: 48px
className = 'p-3xl'; // padding: 64px
```

**Typography (Tailwind + custom scale):**

```tsx
className = 'text-xs'; // 12px
className = 'text-sm'; // 14px
className = 'text-base'; // 16px
className = 'text-lg'; // 20px
className = 'text-xl'; // 24px
className = 'text-2xl'; // 28px
className = 'text-3xl'; // 32px
className = 'text-4xl'; // 36px
```

**Example Usage:**

```tsx
// BEFORE (StyleSheet)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', padding: 16 }
});
<View style={styles.container}>

// AFTER (NativeWind)
<View className="flex-1 bg-background-surface p-md">
```

**Result:** 60% less code, 2-3x faster development, easier maintenance

_→ See `tailwind.config.js` for complete config_

---

## 🗄️ Database Schema

### Schema Design Principles

**Critical Design Decisions:**

1. **Support Multiple Exercise Types:** Strength, cardio, bodyweight, timed exercises
2. **Flexible Measurement Units:** kg/lbs, cm/inches, metric/imperial
3. **Superset/Circuit Support:** Grouping exercises with proper ordering
4. **Rest Time Tracking:** For density analytics and progressive overload
5. **RIR (Reps in Reserve):** Optional per-set difficulty tracking
6. **Future-Proof:** Fields for wearable integration, advanced metrics

**Important:** Schema must be identical in both Supabase (PostgreSQL) and WatermelonDB (SQLite) for proper sync.

---

### Core Tables

#### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- User Preferences
  preferred_unit TEXT DEFAULT 'kg', -- 'kg' or 'lbs'
  preferred_distance_unit TEXT DEFAULT 'km', -- 'km' or 'miles'

  -- Nutrition Phase Tracking (CRITICAL for context-aware analytics)
  nutrition_phase TEXT DEFAULT 'maintenance', -- 'bulk', 'cut', 'maintenance'
  nutrition_phase_started_at TIMESTAMP, -- Track phase duration for analytics

  -- Future: Subscription tracking
  subscription_tier TEXT DEFAULT 'free', -- 'free' or 'pro'
  subscription_expires_at TIMESTAMP,

  -- Profile data (flexible JSONB for non-critical fields)
  profile_data JSONB -- { name, age, experience_level, goals, etc. }
);
```

**Design Notes:**

- `preferred_unit` eliminates need to convert stored weights
- `nutrition_phase` + `nutrition_phase_started_at` enable context-aware analytics ("stable performance in cut = success")
- `subscription_tier` added now (even if unused) to avoid migration later
- `profile_data` JSONB for flexibility without schema changes

---

#### exercises

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT, -- 'compound', 'isolation', 'cardio', 'stretching'
  exercise_type TEXT NOT NULL, -- 'strength', 'cardio', 'timed', 'bodyweight'

  -- Targeting
  muscle_groups TEXT[], -- ['chest', 'triceps']
  primary_muscle TEXT, -- Main muscle worked
  equipment TEXT, -- 'barbell', 'dumbbell', 'machine', 'bodyweight', 'cardio_machine'

  -- Content
  instructions TEXT,
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  image_url TEXT, -- URL to exercise GIF/image
  video_url TEXT,

  -- Metadata
  is_custom BOOLEAN DEFAULT FALSE, -- User-created vs from ExerciseDB
  created_by UUID REFERENCES users(id), -- NULL if from ExerciseDB
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);
CREATE INDEX idx_exercises_equipment ON exercises(equipment);
```

**Design Notes:**

- `exercise_type` differentiates strength from cardio from timed exercises
- `is_custom` separates ExerciseDB imports from user-created exercises
- GIN index on `muscle_groups` array for fast filtering

---

#### workouts

```sql
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Timing
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP, -- NULL if workout in progress
  duration_seconds INTEGER, -- Total workout duration

  -- Metadata
  title TEXT, -- Optional workout name (e.g., "Push Day A")
  notes TEXT,
  template_id UUID REFERENCES workout_templates(id), -- Future: link to template

  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Sync metadata (for WatermelonDB)
  _status TEXT DEFAULT 'synced', -- 'synced', 'pending', 'conflict'
  _changed TEXT -- Timestamp of last local change
);

CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_started_at ON workouts(started_at DESC);
```

**Design Notes:**

- `started_at` instead of `date` for precise tracking
- `completed_at` NULL allows tracking active workouts
- `_status` and `_changed` for WatermelonDB sync protocol

---

#### workout_exercises

**NEW TABLE** - Critical for superset/circuit support

```sql
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),

  -- Ordering & Grouping
  order_index INTEGER NOT NULL, -- 1, 2, 3... for exercise order
  superset_group TEXT, -- 'A', 'B', etc. Groups exercises in supersets

  -- Optional metadata per exercise in this workout
  notes TEXT, -- Exercise-specific notes for this workout
  target_sets INTEGER, -- Planned number of sets
  target_reps INTEGER, -- Planned reps
  target_rpe INTEGER, -- Planned RPE

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(workout_id, order_index) -- Ensure unique ordering
);

CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
```

**Design Notes:**

- `order_index` maintains exercise order in workout
- `superset_group` enables: Superset A (exercise 1, 2), Superset B (exercise 3, 4)
- Allows same exercise multiple times in workout with different targets

**Example Superset Structure:**

```
order_index | exercise_name    | superset_group
1           | Bench Press      | A
2           | Bent-Over Row    | A  (superset with Bench)
3           | Incline Press    | B
4           | Pull-ups         | B  (superset with Incline)
5           | Tricep Dips      | NULL (standalone)
```

---

#### exercise_sets

```sql
CREATE TABLE exercise_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_exercise_id UUID REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL, -- 1, 2, 3...

  -- Performance Data (nullable based on exercise_type)
  weight DECIMAL(6,2), -- Actual weight used
  weight_unit TEXT, -- 'kg' or 'lbs' (stored per set for historical accuracy)
  reps INTEGER, -- Repetitions completed
  duration_seconds INTEGER, -- For timed exercises (plank, etc.)
  distance_meters DECIMAL(10,2), -- For cardio

  -- Intensity & Difficulty
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
  rir INTEGER CHECK (rir >= 0 AND rir <= 5), -- Reps in Reserve (0-5)

  -- Timing
  rest_time_seconds INTEGER, -- Actual rest before this set
  completed_at TIMESTAMP,

  -- Metadata
  notes TEXT, -- Set-specific notes ("felt heavy", "good form", etc.)
  is_warmup BOOLEAN DEFAULT FALSE,
  is_failure BOOLEAN DEFAULT FALSE, -- Taken to muscular failure
  is_dropset BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  _status TEXT DEFAULT 'synced',
  _changed TEXT
);

CREATE INDEX idx_exercise_sets_workout_exercise ON exercise_sets(workout_exercise_id);
CREATE INDEX idx_exercise_sets_completed_at ON exercise_sets(completed_at DESC);
```

**Design Notes:**

- `weight_unit` stored per set (user might change preference over time)
- Both `rpe` AND `rir` supported (users prefer different metrics)
- `rest_time_seconds` critical for density tracking
- Boolean flags (`is_warmup`, `is_failure`, `is_dropset`) for advanced analytics
- All measurement fields nullable (different exercise types use different fields)

**Field Usage by Exercise Type:**
| Exercise Type | weight | reps | duration | distance |
|---------------|--------|------|----------|----------|
| Strength | ✅ | ✅ | ❌ | ❌ |
| Bodyweight | ❌ | ✅ | ❌ | ❌ |
| Timed | ❌ | ❌ | ✅ | ❌ |
| Cardio | ❌ | ❌ | ✅ | ✅ |

---

### Future Tables (Post-MVP)

#### workout_templates

```sql
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE, -- Future: sharing templates
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### template_exercises

```sql
CREATE TABLE template_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  order_index INTEGER,
  superset_group TEXT,
  target_sets INTEGER,
  target_reps_min INTEGER,
  target_reps_max INTEGER,
  target_rpe INTEGER
);
```

### Row Level Security (RLS)

```sql
-- Users can only see their own data
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own workouts"
  ON workouts FOR SELECT
  USING (auth.uid() = user_id);

-- Exercises are public
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercises are public"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);
```

---

## 📊 Analytics & Algorithms

**Principle:** Use scientifically validated formulas (no reinventing). Science-based, context-aware analytics. Avoid AI/ML for MVP.

### Core Calculations

| Metric                | Formula                                                  | Implementation                                   |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| **Personalized 1RM**  | Average of Epley, Brzycki, Lombardi **+ RIR adjustment** | `weight * (1 + reps/30) * (1 + RIR * 0.033)`     |
| **Volume**            | Sets × Reps × Weight (context-aware)                     | Compound: 1.5x multiplier, warmups excluded      |
| **Acute Load**        | Sum of volume (last 7 days)                              | Rolling 7-day window                             |
| **Chronic Load**      | Average volume (last 28 days)                            | 4-week baseline                                  |
| **Fatigue Ratio**     | Acute Load / Chronic Load                                | >1.5 = high fatigue, <0.8 = detraining           |
| **Plateau Detection** | Mann-Kendall + nutrition context                         | `slope < 0.5 && pValue > 0.05 && phase != 'cut'` |

### Advanced Analytics Implementation

**Personalized 1RM with RIR Adjustment:**

```typescript
// Traditional formula doesn't account for proximity to failure
// 100kg × 8 @ RIR2 > 105kg × 6 @ RIR0 (more strength capacity)
function calculatePersonalized1RM(weight, reps, rir) {
  const epley = weight * (1 + reps / 30);
  const brzycki = weight * (36 / (37 - reps));
  const lombardi = weight * Math.pow(reps, 0.1);
  const baseEstimate = (epley + brzycki + lombardi) / 3;

  // RIR adjustment: each RIR = ~3.3% additional capacity
  const rirAdjustment = 1 + rir * 0.033;
  return baseEstimate * rirAdjustment;
}
```

**Load Management & Fatigue:**

```typescript
function calculateFatigueMetrics(recentWorkouts) {
  const acuteLoad = sumVolume(last7Days);
  const chronicLoad = avgVolume(last28Days);
  const fatigueRatio = acuteLoad / chronicLoad;

  // Ratios from sports science literature
  if (fatigueRatio > 1.5) return { status: 'HIGH_FATIGUE', recommendation: 'Consider deload' };
  if (fatigueRatio < 0.8) return { status: 'DETRAINING', recommendation: 'Increase volume' };
  return { status: 'OPTIMAL', recommendation: 'Continue current training' };
}
```

**Context-Aware Plateau Detection:**

```typescript
function detectPlateauWithContext(exerciseHistory, user) {
  const mannKendall = performMannKendallTest(exerciseHistory, 28); // 4 weeks
  const isStatisticalPlateau = mannKendall.slope < 0.5 && mannKendall.pValue > 0.05;

  // Context matters: stable in cut = success, not plateau
  if (isStatisticalPlateau && user.nutrition_phase === 'cut') {
    return { isPlateau: false, message: 'Maintaining strength during cut - excellent!' };
  }

  if (isStatisticalPlateau && user.nutrition_phase === 'bulk') {
    return { isPlateau: true, message: 'True plateau detected. Consider variation or deload.' };
  }

  return { isPlateau: isStatisticalPlateau };
}
```

**Progressive Overload Metrics:**

- Weight progression (increase kg/lbs)
- Volume progression (sets × reps × weight)
- Intensity progression (RPE/RIR improvement, better performance at same RIR)
- Density progression (reduce rest time while maintaining performance)

### Features to Avoid (Over-Engineering)

| ❌ Avoid                   | Why                          | ✅ Alternative                                            |
| -------------------------- | ---------------------------- | --------------------------------------------------------- |
| "Energy Readiness Score"   | Needs wearables (HRV, sleep) | Fatigue ratio from load management                        |
| "AI/ML Recommendations"    | No training data at launch   | Science-based rules (RIR, load ratios, nutrition context) |
| "Automatic Program Design" | Too complex for MVP          | Template system + suggestions                             |

**Core Features (Science-Based, Not AI):**

- **Personalized 1RM** (RIR-adjusted formulas)
- **Load management** (acute/chronic ratios)
- **Context-aware plateau detection** (Mann-Kendall + nutrition phase)
- **Workout Reports** (performance score, fatigue estimate, recommendations)
- **Weekly Summaries** (volume trends, consistency, deload suggestions)
- **Progressive overload suggestions** (based on RIR, fatigue, nutrition phase)

---

## 💰 Business Model & Monetization Strategy

**Current:** All features free (MVP focus on product-market fit)

### Future Freemium Model (Post-MVP)

| Tier     | Price        | Features                                                                   |
| -------- | ------------ | -------------------------------------------------------------------------- |
| **Free** | $0           | Unlimited logging, 30-day history, basic analytics, ExerciseDB library     |
| **Pro**  | **$6.99/mo** | Unlimited history, plateau detection, volume analytics, templates, ad-free |

**Competitive Positioning:**

| App            | Price        | Positioning                              |
| -------------- | ------------ | ---------------------------------------- |
| Strong         | $5.99/mo     | Established leader                       |
| Hevy           | $8.99/mo     | AI features                              |
| JEFIT          | $12.99/mo    | Feature-rich                             |
| **Halterofit** | **$6.99/mo** | **Offline-first + scientific analytics** |

**Implementation:**

- RevenueCat (iOS/Android/Web subscriptions)
- Schema ready: `users.subscription_tier`, `subscription_expires_at`
- Feature flags: `user.subscription_tier === 'pro'`

**Alternative Revenue (Phase 3+):**

- Coaching marketplace (10-15% commission)
- Affiliate marketing (supplements, equipment)
- One-time purchases (workout programs)

---

## 🔐 Security & Monitoring

### Authentication & Data Protection

**Authentication:**

- Supabase Auth (JWT tokens, auto-refresh)
- MMKV encrypted storage (tokens, session)
- Future: Biometric (Face ID/Touch ID)

**Security Layers:**

| Layer        | Implementation                     | Protection                                         |
| ------------ | ---------------------------------- | -------------------------------------------------- |
| **Database** | RLS policies                       | Users see only their data (`auth.uid() = user_id`) |
| **Local**    | MMKV encrypted, SQLCipher optional | Tokens never plain text                            |
| **Network**  | HTTPS (TLS 1.3)                    | Future: Certificate pinning                        |

**Row Level Security Example:**

```sql
CREATE POLICY "Users see own workouts"
  ON workouts FOR ALL
  USING (auth.uid() = user_id);
```

**Best Practices:**

- Environment variables for API keys (`.env` not committed)
- Client + server input validation
- No passwords/PII in logs

---

### Error Monitoring & Performance Tracking

**Sentry Setup (Production-Only):**

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !__DEV__,
  tracesSampleRate: 1.0, // 100% performance monitoring
  beforeSend: (event) => ({
    ...event,
    user: { id: user.id }, // No PII
  }),
});
```

**Monitoring Thresholds:**

| Metric        | Threshold | Action            |
| ------------- | --------- | ----------------- |
| Crash rate    | >0.5%     | Hotfix            |
| ANR (Android) | >1%       | Performance audit |
| API errors    | >5%       | Check Supabase    |
| Slow queries  | >2s       | Add indexes       |
| Cold start    | >3s       | Optimize init     |

**Free Tiers:**

- Sentry: 5,000 errors/month
- PostHog: 1M events/month

---

### Compliance & Privacy

**App Store Requirements (MVP):**

| Requirement      | Implementation                                          |
| ---------------- | ------------------------------------------------------- |
| Privacy Policy   | Data collection disclosure (workouts, email, analytics) |
| Terms of Service | Liability disclaimers (not medical advice)              |
| Data Deletion    | Cascade delete (Supabase → WatermelonDB → MMKV)         |
| Data Export      | JSON export (GDPR compliance)                           |
| Privacy Manifest | iOS 17+ declarations                                    |
| Age Rating       | 4+ (fitness app)                                        |

**Data Deletion Flow:**

```typescript
async function deleteUserAccount() {
  await supabase.auth.admin.deleteUser(userId); // Cascades via foreign keys
  await database.unsafeResetDatabase(); // WatermelonDB
  storage.clearAll(); // MMKV
}
```

**Data Export (GDPR):**

```typescript
// Export all user data as JSON
return JSON.stringify({ user, workouts, exercises, exported_at });
```

---

## ⚡ Performance Guidelines

### Bundle Size

- **Target:** <10MB initial bundle
- Use code splitting for large features
- Lazy load heavy components
- Remove unused dependencies
- **Monitor:** Use `npx react-native-bundle-visualizer` regularly

### Cold Start

- **Target:** <2 seconds
- **Strategy:**
  - WatermelonDB lazy loading (nothing loaded until requested)
  - Defer ExerciseDB initial sync to background
  - Use skeleton screens for workout history
  - MMKV for instant settings/preferences load

### Runtime Performance

#### Lists (Critical)

- **FlashList only** (54% FPS improvement, 82% CPU reduction, prevents OOM crashes)
- Required prop: `estimatedItemSize={80}`

#### Images (500+ GIFs)

- **expo-image** with `cachePolicy="memory-disk"`
- Lazy load + pre-cache favorites

#### Database Queries

- **WatermelonDB:** `.observe()` for reactive queries, `.take(20)` for pagination, batch inserts
- **Supabase:** RLS policies optimized, indexes on `user_id`

#### Animations

- **Target:** 60fps consistently
- Use `react-native-reanimated` (already installed)
- Run animations on UI thread (not JS thread)
- Avoid inline functions in render
- Memoize expensive calculations
- Use `React.memo` for expensive components

#### Specific Performance Targets

| Operation                  | Target Time | Strategy                                   |
| -------------------------- | ----------- | ------------------------------------------ |
| App Launch                 | <2s         | WatermelonDB lazy load, MMKV instant prefs |
| Exercise Search            | <100ms      | FlashList + local indexes                  |
| Workout Save               | <50ms       | WatermelonDB batch insert                  |
| Chart Render (1000 points) | <500ms      | Victory Native + memoization               |
| Image Load                 | <200ms      | expo-image cache + pre-fetch               |

---

## 📋 Coding Standards

**TypeScript:** Strict mode, explicit return types, interfaces > types, no `any`, explicit null checks

**React:** Functional components, TypeScript props interfaces, named exports, <200 lines

**Styling:** StyleSheet.create(), theme values (Colors, Spacing), no inline styles

---

## 🔧 Development Workflow

**Commits:** `<type>(<scope>): <description>` (feat/fix/docs/style/refactor/test/chore)

**Branches:** master (production), feature/_, fix/_, docs/\*

**Review:** TypeScript compiles, no console.log, follows standards, uses theme, proper errors

_→ See [CONTRIBUTING.md](./CONTRIBUTING.md) for complete workflow_

---

## 🚀 Deployment

**Current:** Expo Go (development) | **Future:** EAS Build → TestFlight/Google Play → App Stores

---

## 🎨 UX Best Practices (from Strong, Hevy, JEFIT)

### Core Patterns

| Feature              | Anti-Pattern                      | Best Practice                                               |
| -------------------- | --------------------------------- | ----------------------------------------------------------- |
| **Set Logging**      | 7 taps (modals, confirmations)    | 1-2 taps (auto-fill last, inline edit, quick +/- buttons)   |
| **Plate Calculator** | Manual math                       | Button next to weight → "Add per side: 20kg + 10kg + 2.5kg" |
| **Rest Timer**       | Stops when minimized              | Background + push notification + auto-start from history    |
| **RIR Tracking**     | Prompt after every set (annoying) | End-of-workout summary OR optional inline button            |
| **Exercise Search**  | Search button + pagination        | Real-time filter (FlashList 500+ exercises, 300ms debounce) |
| **Workout Start**    | Empty only                        | MVP: Empty + Repeat Last; Phase 2: Templates + Resume       |

### Mobile-Specific

**Gym Environment:**

- Large tap targets (44x44pt minimum) - gloves, sweaty hands
- High contrast - bright lighting
- Landscape support - phone on bench
- One-handed mode

**Data Reliability:**

- Never show "No internet" errors during workout
- Instant save confirmation (local-first)
- Subtle sync indicator when online
- Conflict resolution: Last write wins

**Error Messages (Contextual):**

```typescript
❌ "Network request failed" → ✅ "Saved locally. Will sync when online."
❌ "Invalid input" → ✅ "Weight must be between 0-500kg"
❌ "Error 500" → ✅ "Couldn't load history. Try again?"
```

---

## 📚 Resources

**Docs:** [Expo](https://docs.expo.dev/) | [React Native](https://reactnative.dev/) | [Supabase](https://supabase.com/docs) | [WatermelonDB](https://nozbe.github.io/WatermelonDB/) | [Zustand](https://docs.pmnd.rs/zustand) | [React Query](https://tanstack.com/query/latest) | [FlashList](https://shopify.github.io/flash-list/) | [Victory Native](https://commerce.nearform.com/open-source/victory-native/)

**APIs:** [ExerciseDB](https://v2.exercisedb.io/docs) | [Sentry](https://docs.sentry.io/platforms/react-native/) | [RevenueCat](https://www.revenuecat.com/docs)

**Tools:** [RN Directory](https://reactnative.directory/) | [Bundle Visualizer](https://www.npmjs.com/package/react-native-bundle-visualizer) | [simple-statistics](https://simplestatistics.org/)

**Inspiration:** Strong, Hevy, JEFIT

---

**Last Updated:** October 2025
