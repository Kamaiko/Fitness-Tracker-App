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

**Current:** All features free (MVP focus on product-market fit)

### Future Freemium Model (Post-MVP)

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Unlimited logging, 30-day history, basic analytics, ExerciseDB library |
| **Pro** | **$6.99/mo** | Unlimited history, plateau detection, volume analytics, templates, ad-free |

**Competitive Positioning:**

| App | Price | Positioning |
|-----|-------|-------------|
| Strong | $5.99/mo | Established leader |
| Hevy | $8.99/mo | AI features |
| JEFIT | $12.99/mo | Feature-rich |
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

| Layer | Implementation | Protection |
|-------|---------------|------------|
| **Database** | RLS policies | Users see only their data (`auth.uid() = user_id`) |
| **Local** | MMKV encrypted, SQLCipher optional | Tokens never plain text |
| **Network** | HTTPS (TLS 1.3) | Future: Certificate pinning |

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
    user: { id: user.id } // No PII
  })
});
```

**Monitoring Thresholds:**

| Metric | Threshold | Action |
|--------|-----------|--------|
| Crash rate | >0.5% | Hotfix |
| ANR (Android) | >1% | Performance audit |
| API errors | >5% | Check Supabase |
| Slow queries | >2s | Add indexes |
| Cold start | >3s | Optimize init |

**Free Tiers:**
- Sentry: 5,000 errors/month
- PostHog: 1M events/month

---

### Compliance & Privacy

**App Store Requirements (MVP):**

| Requirement | Implementation |
|-------------|---------------|
| Privacy Policy | Data collection disclosure (workouts, email, analytics) |
| Terms of Service | Liability disclaimers (not medical advice) |
| Data Deletion | Cascade delete (Supabase → WatermelonDB → MMKV) |
| Data Export | JSON export (GDPR compliance) |
| Privacy Manifest | iOS 17+ declarations |
| Age Rating | 4+ (fitness app) |

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
return JSON.stringify({ user, workouts, exercises, exported_at })
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

## 🎨 UX Best Practices (from Strong, Hevy, JEFIT)

### Core Patterns

| Feature | Anti-Pattern | Best Practice |
|---------|-------------|---------------|
| **Set Logging** | 7 taps (modals, confirmations) | 1-2 taps (auto-fill last, inline edit, quick +/- buttons) |
| **Plate Calculator** | Manual math | Button next to weight → "Add per side: 20kg + 10kg + 2.5kg" |
| **Rest Timer** | Stops when minimized | Background + push notification + auto-start from history |
| **RIR Tracking** | Prompt after every set (annoying) | End-of-workout summary OR optional inline button |
| **Exercise Search** | Search button + pagination | Real-time filter (FlashList 500+ exercises, 300ms debounce) |
| **Workout Start** | Empty only | MVP: Empty + Repeat Last; Phase 2: Templates + Resume |

### Mobile-Specific

**Gym Environment:**
- Large tap targets (44x44pt minimum) - gloves, sweaty hands
- High contrast - bright lighting
- Landscape support - phone on bench
- One-handed mode

**Offline UX:**
- Never show "No internet" errors during workout
- Queue sync, show success immediately
- Subtle sync indicator (status bar)
- Conflict resolution: Last write wins

**Error Messages (Contextual):**
```typescript
❌ "Network request failed" → ✅ "Saved locally. Will sync when online."
❌ "Invalid input" → ✅ "Weight must be between 0-500kg"
❌ "Error 500" → ✅ "Couldn't load history. Try again?"
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
