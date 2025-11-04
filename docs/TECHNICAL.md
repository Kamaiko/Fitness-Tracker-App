# Technical Documentation

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
  - [Philosophy](#philosophy)
  - [Key Decision: WatermelonDB + Supabase Sync](#key-decision-watermelondb--supabase-sync)
  - [Storage Stack](#storage-stack)
  - [Data Flow: Logging a Set](#data-flow-logging-a-set)
- [Technology Stack](#technology-stack)
- [Architecture Decisions (ADRs)](#architecture-decisions-adrs)
  - [ADR-001: Expo SDK 54 Managed Workflow](#adr-001-expo-sdk-54-managed-workflow)
  - [ADR-002: Zustand for State Management](#adr-002-zustand-for-state-management)
  - [ADR-003: React Query for Server State](#adr-003-react-query-for-server-state)
  - [ADR-004: WatermelonDB for Offline-First Storage](#adr-004-watermelondb-for-offline-first-storage-phase-05)
  - [ADR-005: NativeWind (Tailwind CSS) for Styling](#adr-005-nativewind-tailwind-css-for-styling)
  - [ADR-006: Relative Imports (No Path Aliases)](#adr-006-relative-imports-no-path-aliases)
  - [ADR-007: Three-Tier Testing Strategy](#adr-007-three-tier-testing-strategy)
  - [ADR-008: Supabase Backend](#adr-008-supabase-backend)
  - [ADR-009: MMKV for Encrypted Storage](#adr-009-mmkv-for-encrypted-storage-phase-05)
  - [ADR-010: Performance Libraries](#adr-010-performance-libraries)
    - [ADR-010a: FlashList for High-Performance Lists](#adr-010a-flashlist-for-high-performance-lists)
    - [ADR-010b: expo-image for Optimized Image Caching](#adr-010b-expo-image-for-optimized-image-caching)
  - [ADR-011: Charts Strategy - Victory Native](#adr-011-charts-strategy---victory-native)
  - [ADR-012: Development Build Strategy](#adr-012-development-build-strategy)
  - [ADR-013: ExerciseDB API Integration](#adr-013-exercisedb-api-integration)
  - [ADR-014: React Native Reusables for UI Components](#adr-014-react-native-reusables-for-ui-components)
  - [ADR-015: Single Dark Mode Design](#adr-015-single-dark-mode-design)
  - [ADR-016: React Native Vector Icons](#adr-016-react-native-vector-icons)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Database Schema](#database-schema)
- [Analytics & Algorithms](#analytics--algorithms)
  - [Core Calculations](#core-calculations)
  - [Advanced Analytics Implementation](#advanced-analytics-implementation)
  - [Features to Avoid (Over-Engineering)](#features-to-avoid-over-engineering)
- [Security & Monitoring](#security--monitoring)
  - [Authentication & Data Protection](#authentication--data-protection)
  - [Error Monitoring & Performance Tracking](#error-monitoring--performance-tracking)
  - [Compliance & Privacy](#compliance--privacy)
- [Performance Guidelines](#performance-guidelines)
  - [Bundle Size](#bundle-size)
  - [Cold Start](#cold-start)
  - [Runtime Performance](#runtime-performance)
  - [Specific Performance Targets](#specific-performance-targets)
- [Coding Standards](#coding-standards)
- [Runtime Validation & Type Safety](#runtime-validation--type-safety)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [UX Best Practices](#ux-best-practices-from-strong-hevy-jefit)
  - [Core Patterns](#core-patterns)
  - [Mobile-Specific](#mobile-specific)
- [Resources](#resources)

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

**Current Production Stack (Development Build):**

| Category             | Technology                | Version | Purpose                                      |
| -------------------- | ------------------------- | ------- | -------------------------------------------- |
| **Framework**        | Expo SDK                  | 54.0.21 | React Native framework with managed workflow |
| **Language**         | TypeScript                | 5.9     | Type-safe development                        |
| **UI Library**       | React Native              | 0.81.5  | Mobile UI framework                          |
| **Styling**          | NativeWind                | v4      | Tailwind CSS for React Native                |
| **UI Components**    | React Native Reusables    | Latest  | shadcn/ui for React Native                   |
| **Icons**            | React Native Vector Icons | Latest  | 10,000+ icons (Material, Ionicons, FA)       |
| **Database**         | WatermelonDB              | 0.28.0  | Offline-first reactive database              |
| **Storage**          | MMKV                      | 4.0.0   | Encrypted key-value storage                  |
| **State Management** | Zustand                   | 5.0.8   | Lightweight global state                     |
| **Server State**     | React Query (TanStack)    | 5.90.5  | Installed, not yet used                      |
| **Backend**          | Supabase                  | 2.78.0  | PostgreSQL + Auth + Storage                  |
| **Charts**           | Victory Native            | 41.20.1 | Data visualization (Skia-based)              |
| **Lists**            | FlashList                 | 2.2.0   | High-performance lists                       |
| **Images**           | expo-image                | 3.0.10  | Optimized image loading with caching ✅      |
| **Navigation**       | Expo Router               | 6.0.14  | File-based routing                           |
| **Error Monitoring** | Sentry                    | 7.4.0   | Crash reporting and monitoring               |
| **Build**            | EAS Build                 | Latest  | Cloud-based native builds                    |
| **Testing**          | Jest + Testing Library    | Latest  | Unit and integration testing                 |
| **Linting**          | ESLint + Prettier         | Latest  | Code quality and formatting                  |

**Migration Status:** All native modules (WatermelonDB, MMKV, Victory Native) migrated in Phase 0.5.B (Tasks 0.5.20-0.5.26).

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
- ✅ No future migration needed (production-ready from day 1)
- ✅ Better architecture for MVP scale
- ✅ Early migration avoided 40-60% code rewrite later

**Status:** ✅ **COMPLETED** (Phase 0.5.B - Tasks 0.5.22-0.5.26)

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

**ROI:** 2-3h investment vs 10-20h saved over 12-13 weeks

**Status:** ✅ Implemented (Phase 0.5)

---

### ADR-006: Relative Imports (No Path Aliases)

**Decision:** Relative imports for MVP

**Rationale:** Avoid babel-plugin-module-resolver complexity

**Future:** Add `@/` aliases when codebase exceeds 50 files

**Status:** ✅ Implemented

---

### ADR-007: Three-Tier Testing Strategy

**Decision:** Jest (Unit) + Manual E2E (Phase 1) + Maestro (Phase 3+)

**Rationale:**

- **Jest + LokiJS:** Fast unit tests for CRUD/queries (36 tests, 60-65% coverage)
- **Manual E2E:** Validate sync protocol (LokiJS limitation) before automation
- **Maestro:** Automate critical flows after manual validation (Phase 3+)

**Key Limitation:** WatermelonDB sync protocol (`_changed`, `_status`) requires real SQLite - cannot be tested in Jest

**Status:** ✅ **IMPLEMENTED** (Phase 0.5.28)

**References:**

- [Testing Guide](./TESTING.md) - Complete strategy and navigation
- [Test Infrastructure](../tests/README.md) - Helpers, fixtures, mocks

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

**Status:** ✅ **COMPLETED** (Phase 0.5.B - Task 0.5.25)

---

### ADR-010: Performance Libraries

Performance-critical libraries for smooth UX on low-end devices.

---

#### ADR-010a: FlashList for High-Performance Lists

**Decision:** FlashList for all lists (exercise library, workout history)

**Rationale:**

- 54% FPS improvement (36.9 → 56.9 FPS), 82% CPU reduction
- Cell recycling (10x faster than FlatList virtualization)
- Critical for 500+ exercise library on Android low-end devices

**Implementation:**

```typescript
// src/components/lists/WorkoutList.tsx
<FlashList
  data={workouts}
  renderItem={renderItem}
  estimatedItemSize={88}
  keyExtractor={keyExtractor}
/>
```

**Trade-offs:** +50KB bundle, requires manual item height estimation

**Status:** ✅ **COMPLETED** (Phase 0.5.3)

---

#### ADR-010b: expo-image for Optimized Image Caching

**Decision:** CachedImage wrapper around expo-image for all remote images

**Rationale:**

- **PRD Requirement:** Exercise GIFs must load from cache in <200ms
- 1,300+ exercise images from ExerciseDB require aggressive caching
- Built-in memory + disk cache (no custom implementation needed)
- Better performance than React Native Image (10-30x faster)

**Implementation:**

```typescript
// src/components/ui/CachedImage.tsx
import { CachedImage } from '@/components/ui';

<CachedImage
  source={{ uri: exercise.imageUrl }}
  cachePolicy="memory-disk" // Default: fastest retrieval
  placeholder={require('@/assets/exercise-placeholder.png')}
  fallback={require('@/assets/error-image.png')}
  priority="high" // Preload critical images
/>
```

**Features:**

- Default `cachePolicy="memory-disk"` (PRD <200ms requirement)
- Skeleton placeholder support (better perceived performance)
- Error handling with fallback images
- Smooth fade-in transitions (300ms default)
- Preload priority for above-fold images
- Pre-built styles for common use cases (avatar, thumbnail, banner)

**Configuration:**

- **Component:** `src/components/ui/CachedImage.tsx`
- **Documentation:** `src/components/ui/README.md`
- **Export:** `import { CachedImage } from '@/components/ui'`

**Use Cases:**

- Exercise GIFs (Phase 2.7.1, 3.11.2) - 1,300+ images
- User avatars (Phase 1.4)
- Workout template thumbnails (Phase 5)

**Trade-offs:**

- ✅ Production-ready caching (no custom implementation)
- ✅ Meets PRD performance requirements (<200ms)
- ⚠️ +100KB bundle size vs React Native Image
- ✅ Saves ~40h of custom cache implementation

## **Status:** ✅ **COMPLETED** (Phase 0.5.4)

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

**Status:** ✅ **COMPLETED** (Phase 0.5.B - Task 0.5.26)

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

**Status:** ✅ **COMPLETED** (Phase 0.5.B - Tasks 0.5.20-0.5.26)

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

**Status:** 🚧 In Progress (Phase 0.6.8 - Next Priority)

---

### ADR-014: React Native Reusables for UI Components

**Decision:** Use React Native Reusables (shadcn/ui port) as base component library

**Context:** Phase 1 requires authentication UI (Login, Register screens). Need decision on component library vs custom components.

**Rationale:**

- Pre-built accessible components (Button, Input, Card, Form, Alert, Toast, etc.)
- Built with NativeWind v4 (already in stack)
- Source code installed in project (full customization control)
- Class Variance Authority for type-safe variant management
- Active maintenance and community support

**Alternatives Considered:**

- Custom components only: 20-30h additional development time
- NativeBase: Material Design aesthetic not ideal for fitness app
- Tamagui: Excellent but adds complexity with new styling system

**Trade-offs:**

- Additional ~50KB bundle size
- Learning curve for shadcn/ui patterns
- Some components may need fitness-specific customization

**Status:** Phase 0.6 (Tasks 0.6.1, 0.6.4, 0.6.5)

---

### ADR-015: Single Dark Mode Design

**Decision:** Implement single dark mode only (no light mode toggle)

**Context:** Fitness apps are primarily used in gyms with low lighting. Need to decide on theming strategy.

**Rationale:**

- 95%+ of gym usage occurs in low-light environments
- Simplifies implementation (no theme switching logic)
- Reduces bundle size (single theme CSS)
- Faster development (one design system to maintain)
- Better battery life on OLED screens

**Design Tokens:**

- Background: #0A0A0A (near black)
- Surface: #1A1A1A (cards, elevated elements)
- Primary: #00E5FF (electric cyan - energy/motivation)
- Success: #00FF88 (neon green)
- Text: #FFFFFF with opacity variations

**Trade-offs:**

- No light mode for users who prefer it
- Cannot leverage system theme preferences

**Status:** Phase 0.6 (Task 0.6.3)

---

### ADR-016: Expo Vector Icons

**Decision:** Use @expo/vector-icons for iconography

**Context:** Need comprehensive icon library for fitness app UI. With Development Build strategy, need to choose between @expo/vector-icons and react-native-vector-icons.

**Rationale:**

- 10,000+ icons across 10+ icon packs (Material, Ionicons, FontAwesome, etc.)
- Excellent fitness-specific icons (dumbbell, timer, trending-up, etc.)
- Native font rendering (better performance than SVG)
- Modular loading (only include needed packs)
- **Included by default in Expo SDK** (zero setup required)
- **Wrapper around react-native-vector-icons** (same API, Expo-optimized asset system)
- Works seamlessly with Development Build
- Better compatibility with Expo ecosystem (tested with each Expo release)

**Primary Icon Packs:**

- MaterialIcons (primary): Modern, comprehensive
- Ionicons (secondary): Beautiful iOS/Android styles
- FontAwesome (accents): Unique specialty icons

**Alternatives Considered:**

- react-native-vector-icons: Same library under the hood, but requires manual native linking
- Lucide React Native: Limited icon count (~1,400), fewer fitness icons
- Custom SVG icons: Requires design work, less performant

**Trade-offs:**

- ✅ No native linking required (already included in Expo)
- ✅ Zero installation friction (built into expo package)
- Slightly larger app size (~500KB for all packs, can optimize)

**Status:** Phase 0.6 (Task 0.6.2)

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

## Analytics & Algorithms (Post-MVP - Phase 6)

**Status:** 🔮 Post-MVP - All analytics features deferred to Phase 6

**Principle:** Use scientifically validated formulas (no reinventing). Science-based, context-aware analytics. Avoid AI/ML complexity.

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

## Runtime Validation & Type Safety

### Zod for Runtime Validation

**When to Use Zod:**

| Scenario                        | Use Zod?    | Why                                                      |
| ------------------------------- | ----------- | -------------------------------------------------------- |
| **External API responses**      | ✅ YES      | Detects breaking changes, prevents malformed data        |
| **User form input**             | ✅ YES      | Type-safe validation with React Hook Form                |
| **Database queries (Supabase)** | ⚠️ Optional | TypeScript usually sufficient, but Zod adds extra safety |
| **Internal TypeScript types**   | ❌ NO       | TypeScript compile-time checking is enough               |
| **Props validation**            | ❌ NO       | TypeScript interfaces are sufficient                     |

**Rule of Thumb:** Use Zod when data crosses trust boundaries (external APIs, user input). Use TypeScript for internal type safety.

---

### Form Validation with React Hook Form + Zod

**Standard Pattern:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema with Zod
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Use in component
function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    // data is type-safe AND runtime-validated
    supabase.auth.signInWithPassword(data);
  };

  return (
    <Controller
      control={control}
      name="email"
      render={({ field }) => (
        <Input {...field} error={errors.email?.message} />
      )}
    />
  );
}
```

**Benefits:**

- ✅ Single source of truth (schema defines both types AND validation)
- ✅ Runtime validation (catches invalid data before submission)
- ✅ Type-safe error messages
- ✅ Automatic type inference with `z.infer<>`

---

### Supabase Query Validation

**When to validate Supabase responses:**

✅ **Use Zod:**

- Complex queries with joins/aggregations
- Dynamic queries (user-generated filters)
- Critical data (user profile, payment info)

❌ **Skip Zod:**

- Simple SELECT queries with known schema
- TypeScript interfaces are sufficient

**Example: Validate User Profile Query**

```typescript
import { z } from 'zod';
import { supabase } from '@/services/supabase';

// Define expected schema
const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  preferred_unit: z.enum(['kg', 'lbs']),
  created_at: z.number(),
});

type UserProfile = z.infer<typeof UserProfileSchema>;

async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, preferred_unit, created_at')
    .eq('id', userId)
    .single();

  if (error) throw error;

  // Validate response at runtime
  const result = UserProfileSchema.safeParse(data);

  if (!result.success) {
    console.error('Invalid user profile schema:', result.error);
    throw new Error('Schema mismatch: User profile');
  }

  return result.data; // Type-safe + runtime-validated
}
```

**Benefits:**

- ✅ Catches schema drift (e.g., column renamed in Supabase)
- ✅ Type-safe + runtime-safe
- ✅ Graceful error handling

---

### External API Validation

**Example: ExerciseDB API Import**

See [scripts/import-exercisedb.ts](../scripts/import-exercisedb.ts) for production example.

```typescript
import { z } from 'zod';

// Define expected API schema
const ExerciseDBSchema = z.object({
  exerciseId: z.string().min(1, 'exerciseId required'),
  name: z.string().min(1, 'name required'),
  bodyParts: z.array(z.string()).default([]),
  targetMuscles: z.array(z.string()).default([]),
  // ...
});

// Validate API response
function validateExercises(rawData: unknown[]) {
  const validated = [];
  const errors = [];

  rawData.forEach((item, index) => {
    const result = ExerciseDBSchema.safeParse(item);

    if (result.success) {
      validated.push(result.data);
    } else {
      errors.push({ index, error: result.error.errors[0].message });
    }
  });

  return { validated, errors };
}
```

**Why This Pattern:**

- ✅ Graceful degradation (skip invalid items, don't crash)
- ✅ Detailed error logging (know exactly what failed)
- ✅ Future-proof (API changes don't break app)

---

### TypeScript vs Zod Decision Tree

```
Need validation for...?
│
├─ External API (fetch/GraphQL)
│   └─ ✅ Use Zod (runtime safety)
│
├─ User form input
│   └─ ✅ Use Zod + React Hook Form
│
├─ Database schema (Supabase SELECT)
│   ├─ Simple query → TypeScript interface
│   └─ Complex/dynamic → Consider Zod
│
└─ Internal functions/components
    └─ ❌ TypeScript only (compile-time is enough)
```

---

### Standards Summary

| Context                | Tool                  | Example                  |
| ---------------------- | --------------------- | ------------------------ |
| **API responses**      | Zod schema            | ExerciseDB import script |
| **Form validation**    | Zod + React Hook Form | Login, Register, Profile |
| **Database types**     | TypeScript interfaces | WatermelonDB models      |
| **Component props**    | TypeScript interfaces | Button, Input, Card      |
| **Internal functions** | TypeScript types      | Utility functions        |

**Install:** `npm install zod @hookform/resolvers`

**Documentation:**

- [Zod Official](https://zod.dev)
- [React Hook Form + Zod](https://react-hook-form.com/get-started#SchemaValidation)

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

**Last Updated:** February 2025 (MVP scope refinement: 65 tasks, Post-MVP Phase 6 analytics)
