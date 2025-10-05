# 🏗️ Technical Documentation

**Last Updated:** October 2025
**Version:** 0.2.0 (Architecture Planning Complete)
**Document Status:** ✅ Production-Ready

> **Note:** This document reflects architectural decisions and planning from deep analysis session (October 2025). All critical decisions (offline-first strategy, database schema, performance libraries, external services) have been documented with rationale and industry best practices.

---

## 🎯 Architecture Overview

### Philosophy
- **Mobile-First:** Optimized for mobile experience
- **Offline-First:** Works without internet connection
- **Performance-First:** <2s cold start, 60fps animations
- **Type-Safe:** TypeScript strict mode throughout
- **Simple & Pragmatic:** Choose simplicity over complexity

---

## 📦 Technology Stack

### Frontend
```typescript
{
  framework: "React Native 0.81.4",
  runtime: "Expo SDK 54.0.12",
  language: "TypeScript 5.9 (strict mode)",
  navigation: "Expo Router 6.0.10",
  stateManagement: {
    global: "Zustand 5.0.8",
    server: "React Query 5.90.2"
  },
  styling: "React Native StyleSheet (native)",
  storage: {
    database: "WatermelonDB (offline-first SQLite)",
    keyValue: "MMKV 3.3.3 (encrypted)",
    usage: "Hybrid strategy - see ADR-009"
  },
  ui: {
    lists: "FlashList (10x faster than FlatList)",
    images: "expo-image (aggressive caching)",
    charts: "Victory Native (under evaluation)"
  }
}
```

### Backend
```typescript
{
  platform: "Supabase",
  database: "PostgreSQL (Supabase-managed)",
  auth: "Supabase Auth (JWT + RLS)",
  storage: "Supabase Storage",
  realtime: "Supabase Realtime (WebSockets)",
  sync: "WatermelonDB ↔ Supabase bidirectional sync"
}
```

### External Services
```typescript
{
  exercises: "ExerciseDB API (1,300+ exercises with images/GIFs)",
  monitoring: "Sentry (error tracking & performance)",
  monetization: "RevenueCat (future - in-app subscriptions)"
}
```

### Development Tools
```typescript
{
  bundler: "Metro (Expo-optimized)",
  linting: "None (removed for MVP)",
  testing: "None (MVP - will add later)",
  cicd: "None (MVP - will add later)"
}
```

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

### ADR-004: MMKV for Key-Value Storage
**Decision:** MMKV for auth tokens, preferences, settings

**Rationale:** 30x faster than AsyncStorage, synchronous API, built-in encryption

**Trade-offs:** iOS-style API (different from AsyncStorage pattern)

**Status:** ✅ Implemented

---

### ADR-005: Native StyleSheet for MVP
**Decision:** React Native StyleSheet (defer NativeWind/Tailwind)

**Rationale:** Zero configuration, TypeScript type-safe, sufficient for MVP

**Future:** May add NativeWind post-MVP if team grows

**Status:** ✅ Implemented

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

### ADR-009: WatermelonDB + Hybrid Storage Strategy
**Decision:** WatermelonDB (SQLite) with Supabase sync + MMKV + Zustand hybrid

**Context:** Gyms have poor WiFi; workout data loss unacceptable; Supabase alone not truly offline-first

**Architecture:**

| Layer | Purpose | Examples | Performance |
|-------|---------|----------|-------------|
| **WatermelonDB** | Relational data (syncs to Supabase) | Workouts, exercises, sets | 20x > AsyncStorage |
| **MMKV** | Local-only key-value | Auth tokens, preferences | 30x > AsyncStorage |
| **Zustand** | Temporary UI state | `isWorkoutActive`, forms | In-memory (instant) |

**Data Flow:**
```
User Input → Zustand → WatermelonDB → Supabase (when online)
                ↓
              MMKV (persist selected Zustand slices)
```

**Benefits:**
- True offline-first with reactive UI
- Automatic conflict resolution
- Each tool optimized for specific use case

**Trade-offs:**
- 3 storage layers (complexity)
- 4-6 hour setup
- Learning curve for sync protocol

**Implementation:** Phase 0.5 (Week 3)

**Status:** 📋 Planned

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

### ADR-011: Victory Native for Analytics Charts
**Decision:** Victory Native (evaluating) over react-native-chart-kit

**Rationale:**
- Better for large datasets (500+ data points for 6-12 month progression)
- Actively maintained (Formidable Labs, 160k weekly downloads)
- Gesture support (zoom, pan), extensive customization

**Chart Requirements:**
- Line: Weight progression over time
- Bar: Weekly volume tracking
- Multi-line: Compare multiple exercises

**Trade-offs:** +100KB bundle, steeper learning curve

**Alternative:** react-native-gifted-charts (3D effects, lighter)

**Status:** 🔄 Under Evaluation (may defer to chart-kit for MVP)

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

### Color Palette (Dark Theme)
```typescript
{
  // Backgrounds
  background: '#0A0A0A',        // Deep black
  surface: '#1A1A1A',           // Cards
  surfaceElevated: '#2A2A2A',   // Elevated cards

  // Brand
  primary: '#4299e1',           // Brand blue
  primaryDark: '#2b6cb0',       // Pressed state
  primaryLight: '#63b3ed',      // Highlights

  // Status
  success: '#38a169',           // Green
  warning: '#d69e2e',           // Amber
  danger: '#e53e3e',            // Red
  info: '#3182ce',              // Blue

  // Text
  text: '#e2e8f0',              // Primary text
  textSecondary: '#a0aec0',     // Secondary text
  textTertiary: '#718096'       // Tertiary text
}
```

### Spacing System (8px Grid)
```typescript
{
  xs: 4,    // 0.5 units
  sm: 8,    // 1 unit
  md: 16,   // 2 units
  lg: 24,   // 3 units
  xl: 32,   // 4 units
  xxl: 48,  // 6 units
  xxxl: 64  // 8 units
}
```

### Typography Scale (1.25 Modular Scale)
```typescript
{
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xxxxl: 36
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  }
}
```

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

  -- Future: Subscription tracking
  subscription_tier TEXT DEFAULT 'free', -- 'free' or 'pro'
  subscription_expires_at TIMESTAMP,

  -- Profile data (flexible JSONB for non-critical fields)
  profile_data JSONB -- { name, age, experience_level, goals, etc. }
);
```

**Design Notes:**
- `preferred_unit` eliminates need to convert stored weights
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
| Strength      | ✅     | ✅   | ❌       | ❌       |
| Bodyweight    | ❌     | ✅   | ❌       | ❌       |
| Timed         | ❌     | ❌   | ✅       | ❌       |
| Cardio        | ❌     | ❌   | ✅       | ✅       |

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

### Scientific Formulas (Use Established Standards)

**Critical Principle:** Do NOT reinvent fitness formulas. Use scientifically validated calculations to maintain credibility.

#### 1RM (One-Rep Max) Estimation
```typescript
// Multiple validated formulas - offer user choice
export const calculate1RM = {
  epley: (weight: number, reps: number): number =>
    weight * (1 + reps / 30),

  brzycki: (weight: number, reps: number): number =>
    weight * (36 / (37 - reps)),

  lombardi: (weight: number, reps: number): number =>
    weight * Math.pow(reps, 0.10),

  // Most accurate for reps 1-10
  mayhew: (weight: number, reps: number): number =>
    (100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps))
};

// Recommended: Average of multiple formulas for accuracy
export function estimate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps > 10) return calculate1RM.epley(weight, reps); // Epley better for high reps

  const formulas = [
    calculate1RM.epley,
    calculate1RM.brzycki,
    calculate1RM.lombardi
  ];

  const estimates = formulas.map(f => f(weight, reps));
  return estimates.reduce((sum, val) => sum + val, 0) / estimates.length;
}
```

#### Volume Calculation
```typescript
export function calculateVolume(sets: ExerciseSet[]): number {
  return sets.reduce((total, set) => {
    // Basic volume: Sets × Reps × Weight
    const baseVolume = (set.reps || 0) * (set.weight || 0);

    // Optional: Weight by intensity (RPE/RIR)
    // Higher RPE = more effective volume
    const intensityMultiplier = set.rpe ? set.rpe / 10 : 1;

    return total + (baseVolume * intensityMultiplier);
  }, 0);
}

// Differentiate compound vs isolation
export function calculateEffectiveVolume(
  sets: ExerciseSet[],
  exerciseType: 'compound' | 'isolation'
): number {
  const rawVolume = calculateVolume(sets);
  // Compound exercises = higher systemic fatigue, count more
  return exerciseType === 'compound' ? rawVolume * 1.5 : rawVolume;
}
```

#### Plateau Detection
**Use statistical methods, not arbitrary rules**

```typescript
import { linearRegression, mannKendallTest } from 'simple-statistics';

export function detectPlateau(
  performances: Array<{ date: Date; value: number }>,
  windowWeeks: number = 4
): {
  isPlateau: boolean;
  trend: 'increasing' | 'decreasing' | 'flat';
  confidence: number;
} {
  const recent = performances.slice(-windowWeeks * 2); // 2 workouts/week avg

  // Mann-Kendall trend test (robust to outliers)
  const values = recent.map(p => p.value);
  const { trend, pValue } = mannKendallTest(values);

  // Linear regression for trend slope
  const dataPoints = recent.map((p, i) => [i, p.value]);
  const { m: slope } = linearRegression(dataPoints);

  return {
    isPlateau: Math.abs(slope) < 0.5 && pValue > 0.05, // No significant trend
    trend: slope > 0.5 ? 'increasing' : slope < -0.5 ? 'decreasing' : 'flat',
    confidence: 1 - pValue
  };
}
```

**Library:** Use `simple-statistics` npm package for statistical functions.

#### Progressive Overload Tracking
```typescript
export type ProgressionMetric =
  | 'weight'      // Increase weight
  | 'volume'      // More sets × reps × weight
  | 'intensity'   // Higher RPE/closer to failure
  | 'density'     // Less rest time
  | 'range';      // Better range of motion

export function analyzeProgression(
  current: WorkoutSession,
  previous: WorkoutSession
): {
  metric: ProgressionMetric;
  improvement: number;
  percentage: number;
}[] {
  // Compare multiple metrics, return what improved
  // Implementation details...
}
```

### Analytics Features to Avoid (Over-Engineering)

❌ **"Energy Readiness Score"** without wearables
- Apps like Whoop have PhD teams + years of R&D
- Without HRV/sleep data from wearables, it's just guesswork
- ✅ **Alternative:** Simple subjective rating (1-10) from user

❌ **"AI Recommendations"** for MVP
- Requires massive datasets to train ML models
- At launch, you won't have enough user data
- ✅ **Alternative:** Rule-based suggestions
  ```typescript
  // Example: Suggest weight increase
  if (allSetsCompletedWithRIR0) {
    return { suggestion: 'increase_weight', amount: '2.5kg' };
  }
  ```

✅ **Keep These "Smart" Features:**
- **Plateau Detection** (statistical algorithms, not AI)
- **Auto-fill last weights/reps** (simple data lookup)
- **Rest timer with history-based suggestions** (average previous rest times)

---

## 💰 Business Model & Monetization Strategy

### Current Status
**All features free for MVP/Beta** - Focus on product-market fit first

### Future Monetization (Post-MVP)

#### Freemium Model (Recommended)
Based on successful fitness apps (Strong, Hevy, JEFIT):

**Free Tier:**
- Unlimited workout logging
- Basic exercise library (all ExerciseDB exercises)
- Workout history (last 30 days)
- Basic analytics (volume, PR tracking)
- Export data (CSV)

**Pro Tier ($5-10/month or $50-80/year):**
- Unlimited workout history
- Advanced analytics:
  - Plateau detection
  - Volume distribution by muscle group
  - Progression charts (6-12 months)
  - Body part frequency heatmaps
- Unlimited workout templates
- Cloud backup (unlimited)
- Custom exercise creation (unlimited)
- Ad-free experience
- Early access to new features

**Implementation via RevenueCat:**
```typescript
// Already prepared in schema (users.subscription_tier)
// RevenueCat handles:
- iOS App Store subscriptions (30% Apple cut)
- Google Play subscriptions (30% Google cut)
- Web subscriptions via Stripe (lower fees)
- Unified API across platforms
- Subscription status sync
- Family sharing support
```

#### Why Architecture Supports This Now
Even though features are free currently, the database is ready:

```sql
-- users table already has:
subscription_tier TEXT DEFAULT 'free'
subscription_expires_at TIMESTAMP

-- Can add feature flags in code:
const canAccessAdvancedAnalytics = user.subscription_tier === 'pro';
```

**Adding paywall later without this = painful migration**

### Alternative Revenue Streams (Phase 3+)

1. **Coaching Marketplace** (10-15% commission)
   - Connect users with certified trainers
   - In-app coaching messaging
   - Workout plan purchases

2. **Affiliate Marketing**
   - Supplement recommendations (examine.com integration)
   - Equipment links (Amazon affiliate)
   - Gym membership referrals

3. **One-Time Purchases**
   - Premium workout programs from coaches
   - Specialized training guides
   - Video form analysis credits

### Pricing Research
Competitive analysis (2025):

| App | Model | Price | Key Features |
|-----|-------|-------|--------------|
| Strong | Freemium | $5.99/mo | Analytics, unlimited history |
| Hevy | Freemium | $8.99/mo | AI features, templates |
| JEFIT | Freemium | $12.99/mo | Exercise videos, advanced stats |
| **Halterofit** | **TBD** | **$6.99/mo?** | **Plateau detection, offline-first** |

**Recommendation:** $6.99/month or $59.99/year (save 30%)

---

## 🔐 Security & Monitoring

### Authentication & Data Protection

**Authentication Flow:**
- JWT tokens managed by Supabase Auth
- Tokens stored in MMKV (encrypted at rest)
- Auto-refresh handled by Supabase client
- Session persistence across app restarts
- Biometric authentication (Face ID/Touch ID) - future enhancement

**Data Protection Layers:**

1. **Database Level (Supabase):**
   ```sql
   -- Row Level Security (RLS) on all user tables
   ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

   -- Users see only their own data
   CREATE POLICY "Users see own workouts"
     ON workouts FOR ALL
     USING (auth.uid() = user_id);

   -- Exercises are public (from ExerciseDB)
   CREATE POLICY "Exercises are public"
     ON exercises FOR SELECT
     TO authenticated
     USING (true);

   -- Users can only create/update their own custom exercises
   CREATE POLICY "Users manage own custom exercises"
     ON exercises FOR INSERT
     USING (auth.uid() = created_by AND is_custom = TRUE);
   ```

2. **Local Storage (WatermelonDB + MMKV):**
   - WatermelonDB: SQLite database (encrypted via SQLCipher if needed)
   - MMKV: Encrypted by default
   - Auth tokens never persisted in plain text

3. **Network (Supabase ↔ App):**
   - All API calls over HTTPS (TLS 1.3)
   - Certificate pinning (future enhancement for production)

**Security Best Practices:**
- ✅ Never store passwords locally (Supabase handles auth)
- ✅ Use environment variables for API keys (.env not committed)
- ✅ Validate all user inputs (client + server side)
- ✅ Sanitize data before database insertion (prevent SQL injection)
- ✅ No sensitive data in console.log (remove in production builds)

---

### Error Monitoring & Performance Tracking

**Sentry Integration (Critical for Production)**

```typescript
// Setup Sentry for React Native
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  enabled: !__DEV__, // Only in production

  // Performance monitoring
  tracesSampleRate: 1.0, // 100% of transactions
  profilesSampleRate: 0.2, // 20% of transactions for profiling

  // Ignore common React Native errors
  ignoreErrors: [
    'Network request failed',
    'Aborted', // User cancelled
  ],

  // Add context
  beforeSend(event, hint) {
    // Add user context (no PII)
    if (user) {
      event.user = {
        id: user.id, // UUID, not email
        subscription_tier: user.subscription_tier,
      };
    }
    return event;
  }
});
```

**What to Monitor:**

| Metric | Tool | Threshold | Action |
|--------|------|-----------|--------|
| **Crash Rate** | Sentry | >0.5% | Hotfix immediately |
| **ANR (Android)** | Sentry | >1% | Investigate performance |
| **API Errors** | Sentry | >5% | Check Supabase status |
| **Slow Queries** | Sentry Performance | >2s | Add DB indexes |
| **Bundle Size** | bundle-visualizer | >10MB | Code splitting |
| **Cold Start** | Sentry Performance | >3s | Optimize init |

**Implementation Priority:**
1. ✅ **Phase 1:** Setup Sentry (2 hours)
2. ✅ **Phase 2:** Add performance monitoring
3. ✅ **Phase 3:** User analytics (PostHog or Mixpanel)

**Free Tiers Available:**
- Sentry: 5,000 errors/month free
- PostHog: 1M events/month free
- Mixpanel: 100k events/month free

---

### Compliance & Privacy

**GDPR/CCPA Requirements:**

Even though MVP is free, need basic compliance for App Store approval:

1. **Privacy Policy** (required)
   - What data is collected (workouts, email, performance)
   - How it's used (analytics, app functionality)
   - Third parties (Supabase, Sentry, ExerciseDB)
   - User rights (access, deletion, export)

2. **Terms of Service** (required)
   - Liability disclaimers (not medical advice)
   - User-generated content policy
   - Account termination conditions

3. **Data Deletion Flow** (required)
   ```typescript
   // Implement in app settings
   async function deleteUserAccount() {
     // 1. Delete from Supabase (cascades to all user data via foreign keys)
     await supabase.auth.admin.deleteUser(userId);

     // 2. Clear local WatermelonDB
     await database.write(async () => {
       await database.unsafeResetDatabase();
     });

     // 3. Clear MMKV
     storage.clearAll();

     // 4. Sign out
     await signOut();
   }
   ```

4. **Data Export** (GDPR right to data portability)
   ```typescript
   async function exportUserData() {
     const workouts = await database.collections.get('workouts').query().fetch();
     const exercises = await database.collections.get('exercises').query().fetch();

     const exportData = {
       user: { id, email, preferences },
       workouts: workouts.map(serializeWorkout),
       exercises: exercises.map(serializeExercise),
       exported_at: new Date().toISOString()
     };

     // Generate JSON file
     return JSON.stringify(exportData, null, 2);
   }
   ```

**App Store Requirements:**
- Privacy manifest (iOS 17+)
- Required reason API declarations
- Data collection transparency
- Age rating (4+ suitable for fitness app)

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

#### Lists (Critical for Exercise Library & History)
- **ALWAYS use FlashList** (never FlatList) - see ADR-010
- **Estimated performance gains:**
  - 54% FPS improvement
  - 82% CPU reduction
  - Prevents out-of-memory crashes on Android low-end
- **Implementation:**
  ```typescript
  <FlashList
    data={exercises}
    estimatedItemSize={80} // Required prop
    renderItem={renderExercise}
  />
  ```

#### Images (500+ Exercise GIFs)
- **Use expo-image** (not react-native-image or Image)
- Aggressive caching strategy
- Lazy load images as user scrolls
- Pre-cache favorited exercises
- **Configuration:**
  ```typescript
  <Image
    source={{ uri: exerciseGif }}
    cachePolicy="memory-disk" // Cache aggressively
    contentFit="cover"
    transition={200}
  />
  ```

#### Database Queries
- **WatermelonDB best practices:**
  - Use `.observe()` for reactive queries (auto-updates UI)
  - Limit queries with `.take(20)` for pagination
  - Use indexes on frequently queried fields
  - Batch inserts for bulk operations
  - **Example:**
    ```typescript
    // ✅ Good - Reactive and paginated
    const workouts = useObservable(
      database.collections
        .get('workouts')
        .query(Q.sortBy('started_at', Q.desc), Q.take(20))
    );

    // ❌ Bad - Loads all workouts into memory
    const allWorkouts = await database.collections.get('workouts').query().fetch();
    ```

- **Supabase RLS optimization:**
  - RLS policies can slow queries if complex
  - Use `EXPLAIN ANALYZE` on Supabase dashboard
  - Add indexes on `user_id` columns (already in schema)

#### Animations
- **Target:** 60fps consistently
- Use `react-native-reanimated` (already installed)
- Run animations on UI thread (not JS thread)
- Avoid inline functions in render
- Memoize expensive calculations
- Use `React.memo` for expensive components

#### Specific Performance Targets
| Operation | Target Time | Strategy |
|-----------|-------------|----------|
| App Launch | <2s | WatermelonDB lazy load, MMKV instant prefs |
| Exercise Search | <100ms | FlashList + local indexes |
| Workout Save | <50ms | WatermelonDB batch insert |
| Chart Render (1000 points) | <500ms | Victory Native + memoization |
| Image Load | <200ms | expo-image cache + pre-fetch |

---

## 📋 Coding Standards

### TypeScript
- **Always** use strict mode
- **Always** define return types for functions
- **Prefer** interfaces over types
- **Avoid** `any` type
- **Use** explicit null checks

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
}

function getUser(id: string): User | null {
  // ...
}

// ❌ Bad
function getUser(id: any) {
  // ...
}
```

### React Components
- **Use** functional components
- **Use** TypeScript props interfaces
- **Prefer** named exports
- **Keep** components small (<200 lines)

```typescript
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  // ...
}

// ❌ Bad
export default function Button(props: any) {
  // ...
}
```

### Styling
- **Use** StyleSheet.create()
- **Keep** styles close to component
- **Use** theme values (from src/theme)
- **Avoid** inline styles

```typescript
// ✅ Good
import { Colors, Spacing } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
});

// ❌ Bad
<View style={{ backgroundColor: '#000', padding: 16 }}>
```

---

## 🔧 Development Workflow

### Git Commit Conventions
Follow conventions in `.claude/CLAUDE.md`:
```
<type>(<scope>): <description>

Examples:
feat(workout): add RPE tracking to set logger
fix(analytics): correct volume calculation
docs(readme): update installation instructions
```

### Branch Strategy
- `master` - production-ready code
- `feature/*` - new features
- `fix/*` - bug fixes
- `docs/*` - documentation

### Code Review Checklist
- [ ] TypeScript compiles without errors
- [ ] No console.log statements
- [ ] Follows coding standards
- [ ] Uses theme values
- [ ] Proper error handling
- [ ] Commit message follows convention

---

## 🚀 Deployment

### Current
- **Development:** Expo Go app (scan QR code)
- **Build:** None (using Expo Go for development)

### Future
- **Android:** EAS Build → Google Play (internal testing)
- **iOS:** EAS Build → TestFlight
- **Production:** Play Store + App Store

---

## 🎨 UX Best Practices for Fitness Apps

### Critical Patterns from Industry Leaders

Based on Strong, Hevy, JEFIT analysis:

#### 1. **Plate Calculator** (Essential Feature)
**Problem:** Users waste time calculating which plates to add to barbell

**Solution:**
```typescript
interface PlateCalculatorInput {
  targetWeight: number;
  barWeight: number; // 20kg (Olympic) or 15kg (Standard)
  unit: 'kg' | 'lbs';
  availablePlates: number[]; // [20, 15, 10, 5, 2.5, 1.25] for kg
}

// Returns: "Add per side: 20kg + 10kg + 2.5kg"
```

**UX:** Small button next to weight input, shows modal with plate breakdown

---

#### 2. **Quick Set Logging** (Minimize Taps)

**Anti-pattern:**
```
Tap "Add Set" → Enter weight → Tap "Next" → Enter reps → Tap "Next" → Select RPE → Tap "Save"
= 7 taps per set ❌
```

**Best practice:**
```
Auto-fill last weight/reps → Edit if needed → Tap checkmark
= 1-2 taps per set ✅
```

**Implementation:**
- Pre-populate weight/reps from last identical set
- Inline editing (no modals)
- Swipe gestures for navigation between exercises
- Quick buttons for common weight changes (+2.5kg, +5kg, -2.5kg)

---

#### 3. **Rest Timer UX**

**Must-haves:**
- Continues in background (don't pause when app minimized)
- Push notification when rest complete (with quick actions)
- Auto-start based on historical average rest time
- Skip/Add time buttons (+15s, -15s)

**Optional but nice:**
- Haptic feedback at 10s, 5s, 0s remaining
- Visual progress ring
- Sound notifications (toggle in settings)

---

#### 4. **Workout Quick Start Patterns**

Standard apps offer multiple entry points:

1. **Start Empty Workout** → Add exercises as you go
2. **Repeat Last [Exercise Name]** → Pre-fill from history
3. **Start from Template** → Pre-defined workout structure
4. **Quick Start** → Resume in-progress workout

**Implementation Priority:**
- MVP: (1) Empty + (2) Repeat Last
- Phase 2: (3) Templates + (4) Resume

---

#### 5. **RIR (Reps in Reserve) Tracking - Non-Intrusive**

**Research findings:**
- ❌ Prompting after every set = annoying, disrupts flow
- ✅ End-of-workout prompt = better compliance
- ✅ Optional toggle per exercise = user control

**Recommended UX:**
```typescript
// Option A: End of workout
"How did your sets feel today?"
[Set 1: Bench Press] → RIR: 0 1 2 3 4 5
[Set 2: Bench Press] → RIR: 0 1 2 3 4 5

// Option B: Optional inline (small button)
Weight: 100kg | Reps: 8 | [+RIR]
                          ↓ (if tapped)
                         RIR: 0 1 2 3 4 5
```

**Settings:**
- [ ] Enable RIR tracking
- [ ] Prompt timing: After each set | End of workout | Manual only

---

#### 6. **Exercise Selection Search**

**Must-have features:**
- Real-time search (no search button needed)
- Filter by: Muscle group, Equipment, Difficulty
- Recently used exercises at top
- Favorites/starred exercises
- Quick add button (no need to go back)

**Performance:**
- FlashList for 500+ exercises
- Local search (WatermelonDB query, no API)
- Debounced search input (300ms)
- Show images/GIFs in list

---

### Mobile-Specific Considerations

#### Gym Environment UX
- **Large tap targets** (minimum 44x44pt) - wearing gloves
- **High contrast text** - bright gym lighting
- **Landscape support** - phone propped on bench
- **One-handed mode** - holding weight plate in other hand

#### Offline UX
- **Never show "No internet" errors** during workout
- Queue sync for later, show success immediately
- Sync indicator in status bar (subtle)
- Conflict resolution: Last write wins (simple, predictable)

#### Error States
```typescript
// Good error messages for fitness context
❌ "Network request failed"
✅ "Saved locally. Will sync when online."

❌ "Invalid input"
✅ "Weight must be between 0-500kg"

❌ "Error 500"
✅ "Couldn't load history. Try again?"
```

---

## 📚 Resources

### Official Documentation
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Supabase Docs](https://supabase.com/docs) | [WatermelonDB + Supabase Guide](https://supabase.com/blog/react-native-offline-first-watermelon-db)
- [WatermelonDB Docs](https://nozbe.github.io/WatermelonDB/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [React Query Docs](https://tanstack.com/query/latest)
- [FlashList Docs](https://shopify.github.io/flash-list/)
- [Victory Native Docs](https://commerce.nearform.com/open-source/victory-native/)

### External APIs & Services
- [ExerciseDB API Docs](https://v2.exercisedb.io/docs) - Exercise database
- [Sentry React Native](https://docs.sentry.io/platforms/react-native/) - Error monitoring
- [RevenueCat Docs](https://www.revenuecat.com/docs/getting-started/installation/reactnative) - In-app purchases

### Useful Tools
- [React Native Directory](https://reactnative.directory/) - Find compatible packages
- [Can I Use React Native](https://caniusenative.com/) - API compatibility
- [Expo Snack](https://snack.expo.dev/) - Online playground
- [Bundle Visualizer](https://www.npmjs.com/package/react-native-bundle-visualizer) - Analyze bundle size
- [simple-statistics](https://simplestatistics.org/) - Statistical calculations

### Design & Inspiration
- **Study these apps for UX patterns:**
  - Strong (iOS/Android) - Industry standard for workout logging
  - Hevy (iOS/Android) - Modern UI, good analytics
  - JEFIT (iOS/Android) - Feature-rich, established

### Learning Resources
- [Supabase + WatermelonDB Tutorial](https://www.themorrow.digital/blog/building-an-offline-first-app-with-expo-supabase-and-watermelondb)
- [React Native Performance Guide](https://reactnative.dev/docs/performance)
- [Fitness App Monetization Strategies](https://www.revenuecat.com/blog/fitness-app-monetization/)

---

**Last Updated:** October 2025
