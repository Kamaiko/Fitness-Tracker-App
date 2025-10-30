# 🏗️ Technical Documentation

---

## 📑 Table of Contents

- [📐 Architecture Overview](#architecture-overview)
- [📦 Technology Stack](#technology-stack)
- [🏛️ Architecture Decisions (ADRs)](#architecture-decisions-adrs)
  - [ADR-001: Expo SDK vs Bare React Native](#adr-001-expo-sdk-vs-bare-react-native)
  - [ADR-002: Supabase vs Firebase vs AWS Amplify](#adr-002-supabase-vs-firebase-vs-aws-amplify)
  - [ADR-003: TypeScript Strict Mode](#adr-003-typescript-strict-mode)
  - [ADR-004: Database Strategy - WatermelonDB](#adr-004-database-strategy---watermelondb)
  - [ADR-005: Navigation with Expo Router](#adr-005-navigation-with-expo-router)
  - [ADR-006: State Management - Zustand + React Query](#adr-006-state-management---zustand--react-query)
  - [ADR-007: Styling with NativeWind](#adr-007-styling-with-nativewind)
  - [ADR-008: Testing Strategy](#adr-008-testing-strategy)
  - [ADR-009: Storage Strategy - MMKV](#adr-009-storage-strategy---mmkv)
  - [ADR-010: Performance Libraries](#adr-010-performance-libraries)
  - [ADR-011: Charts Library - Victory Native](#adr-011-charts-library---victory-native)
  - [ADR-012: Development Build Strategy](#adr-012-development-build-strategy)
- [📁 Project Structure](#project-structure)
- [🎨 Design System](#design-system)
- [🗄️ Database Schema](#database-schema)
- [📊 Analytics & Algorithms](#analytics--algorithms)
- [💰 Business Model & Monetization](#business-model--monetization-strategy)
- [🔐 Security & Monitoring](#security--monitoring)
- [⚡ Performance Guidelines](#performance-guidelines)
- [📋 Coding Standards](#coding-standards)
- [🔧 Development Workflow](#development-workflow)
- [🚀 Deployment](#deployment)
- [🎨 UX Best Practices](#ux-best-practices-from-strong-hevy-jefit)
- [📚 Resources](#resources)

---

## Architecture Overview

### Philosophy

- **Mobile-First:** Optimized for mobile experience
- **Offline-First:** Works without internet connection (CRITICAL)
- **Performance-First:** <2s cold start, 60fps animations
- **Type-Safe:** TypeScript strict mode throughout
- **Simple & Pragmatic:** Choose simplicity over complexity

### Key Decision: WatermelonDB + Supabase Sync

**Why WatermelonDB from Day 1:**

- ✅ **Production-Ready Architecture** - No costly migration later
- ✅ **Offline-First** - CRITICAL priority from PRD
- ✅ **Reactive Queries** - Auto-update UI on data changes
- ✅ **Performance** - Optimized for 2000+ workouts
- ✅ **Built-in Sync** - Robust conflict resolution vs manual sync

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
│    WATERMELONDB (offline-first)         │
│    - Workouts, exercises, sets          │
│    - Reactive queries, instant save     │
│    - Built-in sync protocol             │
└─────────────┬───────────────────────────┘
              │
              ▼ (automatic sync)
┌─────────────────────────────────────────┐
│    SUPABASE (cloud backup)              │
│    - PostgreSQL + Row Level Security    │
│    - Conflict: smart merge resolution   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    MMKV (preferences + tokens)          │
│    - Auth tokens, user settings         │
│    - Encrypted, 10-30x faster           │
└─────────────────────────────────────────┘
```

**Component Rationale:**

| Component        | Role               | Why This Choice                                       |
| ---------------- | ------------------ | ----------------------------------------------------- |
| **WatermelonDB** | Main database      | Reactive queries + Auto sync + Production performance |
| **MMKV**         | Key-value storage  | Encrypted + 10-30x faster than AsyncStorage           |
| **Supabase**     | Cloud sync         | No custom backend + RLS + Realtime                    |
| **Zustand**      | Temporary UI state | Minimal (1KB) + Simple + TypeScript                   |

### Data Flow: Logging a Set

```
1. User taps "Log Set"
   └─> Component: <SetLogger />

2. ZUSTAND update (instant UI)
   └─> workoutStore.addSet({ weight: 100, reps: 8 })

3. WATERMELONDB save (instant, <5ms)
   └─> await exerciseSet.create({ weight: 100, reps: 8 })
   └─> Reactive query auto-updates UI

4. UI shows success ✅ (instant, reactive!)

5. AUTOMATIC SYNC (WatermelonDB built-in)
   └─> synchronize({ pullChanges, pushChanges })
       ├─> Pull remote changes (smart merge)
       ├─> Push local changes (batch upload)
       └─> Resolve conflicts automatically
```

**User Experience:** <5ms (instant), Sync: 1-2s (invisible, automatic)

---

## Technology Stack

See [README.md § Tech Stack](../README.md#️-tech-stack) for complete stack details.

---

## Architecture Decisions (ADRs)

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

### ADR-004: WatermelonDB for Offline-First Storage (Phase 0.5+)

**Decision:** WatermelonDB with Supabase sync from Day 1 (Development Build required)

**Implementation (Phase 0.5+):**

- `src/models/` - WatermelonDB models (Workout, Exercise, WorkoutExercise, ExerciseSet)
- `src/services/database/watermelon/` - Database setup, schema, sync protocol
- Used for: workouts, exercises, sets (offline-first relational data)
- ⚠️ Requires Development Build (native SQLite module)
- ✅ Production-ready performance (optimized for 2000+ workouts)
- ✅ Reactive queries (auto-update UI on data changes)
- ✅ Built-in sync protocol (~20 lines vs 200 lines manual)

**Storage Architecture:**
| Storage | Speed | Use Case | Phase | Dev Build |
| ---------------- | ---------- | ------------------------- | ----- | --------- |
| **WatermelonDB** | Very Fast | Workouts, exercises, sets | 0.5+ | ✅ |
| **MMKV** | Very Fast | Auth tokens, preferences | 0.5+ | ✅ |
| **Zustand** | Instant | Temporary UI state | 0+ | ❌ |

**Why WatermelonDB from Day 1:**

- ✅ Offline-first required (CRITICAL priority in PRD)
- ✅ Production architecture (no migration needed later)
- ✅ Reactive queries (better DX, less boilerplate)
- ✅ Built-in sync (robust conflict resolution)
- ✅ Performance optimized for scale (2000+ workouts)
- ⚠️ Requires Development Build (acceptable trade-off)

**Sync Protocol:**

```typescript
// WatermelonDB sync (~20 lines vs 200 lines manual)
await synchronize({
  database,
  pullChanges: async ({ lastPulledAt }) => {
    const { data } = await supabase.rpc('pull_changes', { lastPulledAt });
    return { changes: data.changes, timestamp: data.timestamp };
  },
  pushChanges: async ({ changes }) => {
    await supabase.rpc('push_changes', { changes });
  },
});
```

**Benefits:**

- Automatic conflict resolution (smart merge)
- Reactive queries (`.observe()` auto-updates UI)
- Lazy loading (only load what's needed)
- Batch operations (optimized performance)

**Trade-offs:**

- ⚠️ Requires Development Build (can't use Expo Go)
- ⚠️ Initial setup complexity (3-4h vs 1h expo-sqlite)
- ✅ No future migration needed (production-ready from day 1)
- ✅ Better architecture for MVP scale

**Status:** 📋 Planned for Phase 0.5 Bis migration

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

### ADR-009: MMKV for Encrypted Storage (Phase 0.5+)

**Decision:** MMKV for key-value storage (auth tokens, user preferences) from Day 1

**Implementation:**

- `src/services/storage/mmkvStorage.ts` - MMKV wrapper with TypeScript safety
- Used for: Auth tokens, user settings, app preferences
- ⚠️ Requires Development Build (native C++ module)
- ✅ 10-30x faster than AsyncStorage
- ✅ Native encryption (secure by default)
- ✅ Synchronous API (instant reads)

**Why MMKV from Day 1:**

- ✅ Security first (encrypted auth tokens)
- ✅ Performance (instant settings load vs AsyncStorage delay)
- ✅ Production-ready (no migration needed)
- ✅ Small API surface (easy to learn)
- ⚠️ Requires Development Build (acceptable trade-off)

**Storage Strategy:**

| Layer            | Purpose                             | Examples                  | Performance        | Native Module |
| ---------------- | ----------------------------------- | ------------------------- | ------------------ | ------------- |
| **WatermelonDB** | Relational data (syncs to Supabase) | Workouts, exercises, sets | 20x > AsyncStorage | ✅ SQLite     |
| **MMKV**         | Key-value data (local only)         | Auth tokens, preferences  | 30x > AsyncStorage | ✅ C++        |
| **Zustand**      | Temporary UI state                  | `isWorkoutActive`, forms  | In-memory          | ❌            |

**Integration with Zustand:**

Zustand stores use MMKV for persistence via `zustandMMKVStorage` adapter:

```typescript
// src/stores/auth/authStore.ts
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '@/services/storage';

export const useAuthStore = create(
  persist((set) => ({ user: null /* ... */ }), {
    name: 'auth-storage',
    storage: createJSONStorage(() => zustandMMKVStorage), // MMKV backend
  })
);
```

**Data Flow:**

```
Auth session, preferences → Zustand persist → MMKV (encrypted, instant)
Workouts, exercises       → WatermelonDB (reactive, synced)
Active workout state      → Zustand in-memory (ephemeral)
```

**Benefits:**

- Encrypted by default (secure auth tokens)
- Synchronous API (instant reads, no async overhead)
- Tiny bundle size (<100KB)
- Cross-platform (iOS, Android, Web support)

**Trade-offs:**

- ⚠️ Requires Development Build
- ⚠️ Key-value only (not for relational data)
- ✅ Better security and performance than AsyncStorage

**Implementation Example:**

```typescript
// src/services/storage/mmkvStorage.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'halterofit-storage',
  encryptionKey: process.env.MMKV_ENCRYPTION_KEY,
});

export const authStorage = {
  getToken: () => storage.getString('authToken'),
  setToken: (token: string) => storage.set('authToken', token),
  clearToken: () => storage.delete('authToken'),
};
```

**Status:** 📋 Planned for Phase 0.5 Bis migration

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

### ADR-011: Charts Strategy - Victory Native

**Decision:** Use Victory Native from Day 1 (Development Build required)

**Implementation:**

- **Library:** Victory Native v41 (Skia-based rendering)
- `src/components/charts/` - Reusable chart components (LineChart, BarChart, ProgressChart)
- Used for: Volume analytics, progression graphs, 1RM tracking
- ⚠️ Requires Development Build (react-native-skia native module)
- ✅ Production-grade performance (1000+ data points, smooth)
- ✅ Advanced gestures (zoom, pan, crosshairs)
- ✅ Fully customizable (theme integration)

**Why Victory Native from Day 1:**

- ✅ Professional UX (smooth gestures, animations)
- ✅ Performance (Skia rendering, 60fps with 1000+ points)
- ✅ Flexible (multi-line charts, custom tooltips)
- ✅ Well-maintained (Formidable Labs)
- ⚠️ Requires Development Build (acceptable trade-off)

**Features Used in MVP:**

- **Line Charts:** Progression tracking (volume over time, 1RM progression)
- **Bar Charts:** Weekly volume comparison
- **Custom Tooltips:** Show exact values on tap
- **Zoom/Pan:** Explore historical data (3 months+)
- **Themeable:** Integrated with dark theme

**Implementation Example:**

```typescript
// src/components/charts/VolumeLineChart.tsx
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';

<VictoryChart theme={darkTheme}>
  <VictoryAxis />
  <VictoryLine
    data={volumeData}
    x="date"
    y="volume"
    interpolation="monotoneX"
    style={{ data: { stroke: theme.colors.primary } }}
  />
</VictoryChart>;
```

**Benefits:**

- Skia rendering (native performance)
- Advanced gestures (zoom, pan, crosshairs)
- Fully themeable (matches app design)
- Multi-line support (compare exercises)
- Animation support (smooth transitions)

**Trade-offs:**

- ⚠️ Requires Development Build
- ⚠️ Larger bundle size (+200KB vs react-native-chart-kit)
- ✅ Production-ready from day 1 (no migration needed)
- ✅ Better UX for analytics-focused app

**Status:** 📋 Planned for Phase 0.5 Bis migration

---

### ADR-012: Development Build Strategy

**Decision:** Use Development Build (EAS Build) from Day 1 instead of Expo Go

**Rationale:**

Instead of starting with Expo Go and migrating later (costly 1-2 week refactor), we're building with production-grade architecture from the start:

**Why Development Build from Day 1:**

- ✅ WatermelonDB (reactive database, better than expo-sqlite)
- ✅ MMKV (10-30x faster + encrypted vs AsyncStorage)
- ✅ Victory Native (professional charts vs basic charts)
- ✅ No future migration (avoid 1-2 weeks refactoring later)
- ✅ Production-ready architecture for MVP scale

**Trade-offs:**

| Aspect             | Expo Go                   | Development Build                            |
| ------------------ | ------------------------- | -------------------------------------------- |
| **Setup Time**     | 5 minutes                 | ~3-4 hours (one-time)                        |
| **Iteration**      | Instant (scan QR)         | ~15-20 min rebuild (only for native changes) |
| **Native Modules** | Limited (Expo SDK only)   | Any module (WatermelonDB, MMKV, Victory)     |
| **Performance**    | Good                      | Production-optimized                         |
| **Future Work**    | 1-2 week migration needed | Already production-ready                     |

**Daily Development Workflow:**

```bash
# ONE-TIME SETUP (3-4 hours)
npm install
eas build --profile development --platform android  # ~15-20 min
# Install dev build on device (scan QR from EAS)

# DAILY DEVELOPMENT (same as Expo Go!)
npm start
# Scan QR with dev build app
# Hot reload works normally ✅

# ONLY rebuild if:
# - Installing new native module (rare, ~1-2x/week max)
# - Changing app.json native config (rare)
```

**Development Build Workflow:**

1. **Create EAS account** (free tier: unlimited dev builds)
2. **Configure eas.json** (development, preview, production profiles)
3. **Build dev client** (iOS + Android, ~15-20 min each)
4. **Install on device** (scan QR code from EAS dashboard)
5. **Develop normally** (npm start, hot reload works)

**Rebuild triggers** (rare, ~1-2x per week):

- ❌ Code changes (JS/TS) → NO rebuild needed (hot reload)
- ❌ Style changes → NO rebuild needed
- ❌ Component changes → NO rebuild needed
- ✅ New native module → YES, rebuild (15-20 min)
- ✅ app.json native config → YES, rebuild

**EAS Build Configuration:**

```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "ios": {
        "simulator": false
      }
    }
  }
}
```

**Cost Analysis:**

| Option                | Upfront Cost | Future Cost | Total     |
| --------------------- | ------------ | ----------- | --------- |
| **Expo Go → Migrate** | 1 hour       | 1-2 weeks   | ~80 hours |
| **Dev Build Day 1**   | 4 hours      | 0 hours     | 4 hours   |

**Savings:** ~76 hours by avoiding future migration

**Status:** 📋 Planned for Phase 0.5 Bis (next session)

---

### ADR-013: ExerciseDB API Integration

**Decision:** Seed exercise library from ExerciseDB API (1,300+ exercises)

**Rationale:**

- **Time savings:** 190 hours (200h manual creation → 10h integration)
- **Quality:** Professional GIFs, instructions, categorization
- **Coverage:** Exceeds 500 exercise target

**Implementation:**

```typescript
// One-time seed: ExerciseDB → Supabase → WatermelonDB
// Runtime: No API calls (local WatermelonDB search/filtering)
```

**Data Ownership:** Seeded to our Supabase (full control), users add custom exercises

**Trade-offs:** Initial API dependency (one-time), license compliance required

**Alternatives:** Wger API (200 exercises), API Ninjas (1,000)

**Status:** 📋 Planned (Phase 3)

---

## Project Structure

See [ARCHITECTURE.md § Structure Détaillée](./ARCHITECTURE.md#-structure-détaillée) for complete folder organization.

---

## Design System

See `tailwind.config.js` for complete theme configuration (colors, spacing, typography).

**Quick reference**: Dark theme, 8px spacing grid, NativeWind v4 (Tailwind CSS 3.4)

---

## Database Schema

See [DATABASE.md](./DATABASE.md) for complete schema documentation (WatermelonDB + Supabase sync).

---

## Analytics & Algorithms

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

## Security & Monitoring

### Authentication & Data Protection

**Authentication:**

- Supabase Auth (JWT tokens, auto-refresh)
- MMKV encrypted storage (tokens, session data)
- Future: Biometric (Face ID/Touch ID)

**Security Layers:**

| Layer        | Implementation                               | Protection                                         |
| ------------ | -------------------------------------------- | -------------------------------------------------- |
| **Database** | RLS policies                                 | Users see only their data (`auth.uid() = user_id`) |
| **Local**    | MMKV encrypted (native), WatermelonDB SQLite | Tokens encrypted, data isolated per user           |
| **Network**  | HTTPS (TLS 1.3)                              | Future: Certificate pinning                        |

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
  await database.write(async () => await database.unsafeResetDatabase()); // WatermelonDB
  storage.clearAll(); // MMKV
}
```

**Data Export (GDPR):**

```typescript
// Export all user data as JSON
return JSON.stringify({ user, workouts, exercises, exported_at });
```

---

## Performance Guidelines

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

## Coding Standards

**TypeScript:** Strict mode, explicit return types, interfaces > types, no `any`, explicit null checks

**React:** Functional components, TypeScript props interfaces, named exports, <200 lines

**Styling:** StyleSheet.create(), theme values (Colors, Spacing), no inline styles

---

## Development Workflow

See [CONTRIBUTING.md](./CONTRIBUTING.md) for complete workflow (commit conventions, branches, review process).

---

## Deployment

**Current:** Expo Go (development) | **Future:** EAS Build → TestFlight/Google Play → App Stores

---

## UX Best Practices (from Strong, Hevy, JEFIT)

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

## Resources

**Docs:** [Expo](https://docs.expo.dev/) | [React Native](https://reactnative.dev/) | [Supabase](https://supabase.com/docs) | [WatermelonDB](https://nozbe.github.io/WatermelonDB/) | [MMKV](https://github.com/mrousavy/react-native-mmkv) | [Zustand](https://docs.pmnd.rs/zustand) | [React Query](https://tanstack.com/query/latest) | [FlashList](https://shopify.github.io/flash-list/) | [Victory Native](https://commerce.nearform.com/open-source/victory-native/)

**APIs:** [ExerciseDB](https://v2.exercisedb.io/docs) | [Sentry](https://docs.sentry.io/platforms/react-native/) | [RevenueCat](https://www.revenuecat.com/docs)

**Tools:** [RN Directory](https://reactnative.directory/) | [Bundle Visualizer](https://www.npmjs.com/package/react-native-bundle-visualizer) | [simple-statistics](https://simplestatistics.org/)

**Inspiration:** Strong, Hevy, JEFIT

---

**Last Updated:** October 2025 (Updated for Development Build strategy)
