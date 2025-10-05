<div align="center">

# Halterofit

**Offline-first fitness tracking for serious bodybuilders**

[![Expo SDK](https://img.shields.io/badge/Expo-54.0.12-000020?style=flat&logo=expo)](https://expo.dev)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://typescriptlang.org)
[![WatermelonDB](https://img.shields.io/badge/WatermelonDB-Offline--First-00A36C?style=flat)](https://nozbe.github.io/WatermelonDB/)

<br/>

<img src="./docs/images/home-placeholder.jpeg" alt="Home Screen Placeholder" width="300"/>

_⚠️ Temporary placeholder UI for testing navigation structure_

</div>

---

## 🚀 Quick Start

```bash
npm install          # Install dependencies
cp .env.example .env # Setup environment variables (add Supabase credentials)
npm start            # Start development server
```

**Testing on device:**
1. Install [Expo Go](https://expo.dev/client)
2. Scan QR code from terminal
3. Ensure same WiFi network

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Expo SDK 54 + React 19 + TypeScript 5.9 (strict mode)
- **Navigation:** Expo Router 6 (file-based routing)
- **State Management:**
  - Zustand 5.0 (global state)
  - React Query 5.90 (server state)
- **Storage:**
  - **WatermelonDB** (offline-first SQLite database)
  - **MMKV** (encrypted key-value storage)
- **UI Performance:**
  - **FlashList** (10x faster than FlatList)
  - **expo-image** (aggressive caching)
  - Victory Native (charts - under evaluation)

### Backend
- **Supabase:** PostgreSQL + Auth (JWT + RLS) + Real-time + Storage
- **Sync:** WatermelonDB ↔ Supabase bidirectional sync

### External Services
- **ExerciseDB API:** 1,300+ exercises with GIFs (saves 100-200h of manual work)
- **Sentry:** Error monitoring & performance tracking
- **RevenueCat:** In-app subscriptions (future)

### Design
- Dark theme optimized for gym environment
- 8px grid system (consistent spacing)
- Custom design tokens (colors, typography)
- High contrast (bright gym lighting)

---

## 🎯 Current Status

**Version:** 0.2.0 — Architecture Planning Complete
**Progress:** ![](https://img.shields.io/badge/Progress-12%25-yellow)

**Phase 0:** ✅ Complete
**Phase 0.5:** 🚧 In Progress (WatermelonDB setup, DB schema)
**Phase 1:** 📋 Planned (Authentication & Foundation)

### ✅ What's Working
- Expo SDK 54 + React 19 + TypeScript strict mode
- Supabase client configured
- Dark theme system (colors, spacing, typography)
- State management (Zustand - auth & workout stores)
- Encrypted storage (MMKV)
- File-based routing (Expo Router)
- **Comprehensive architecture documentation (12 ADRs)**
- **Revised database schema (supports supersets, RIR, multiple exercise types)**

### 🎯 What's Next (Critical Path)

**Phase 0.5 (Week 3) - Architecture Setup:**
- WatermelonDB + Supabase sync implementation
- Revised database schema (5 core tables with proper relationships)
- FlashList installation
- expo-image setup
- Sentry error monitoring
- Analytics libraries (simple-statistics for plateau detection)

**Phase 1 (Weeks 4-5) - Authentication & Foundation:**
- Auth screens (login, register, password reset)
- Core UI components (Button, Input, Card)
- Tab navigation structure
- TypeScript types definitions

---

## 📁 Project Structure

### Current (v0.2.0)

```
src/
├── app/                    # Expo Router screens (8 files)
│   ├── _layout.tsx         # Root layout + Sentry
│   ├── index.tsx           # Redirect to tabs
│   ├── +not-found.tsx      # 404 screen
│   └── (tabs)/             # Tab navigation (placeholder)
│       ├── _layout.tsx     # Tabs layout
│       ├── index.tsx       # Home/Workout tab
│       ├── stats.tsx       # Analytics tab
│       └── settings.tsx    # Profile tab
│
├── services/               # External services
│   ├── supabase/
│   │   └── client.ts       # Supabase configuration
│   ├── storage/
│   │   └── mmkv.ts         # MMKV encrypted storage
│   └── database/           # 🚧 Next: WatermelonDB setup
│
├── stores/                 # Zustand state (2 files)
│   ├── authStore.ts        # Authentication state
│   └── workoutStore.ts     # Workout session state
│
├── theme/                  # Design system (4 files)
│   ├── colors.ts           # Dark color palette
│   ├── spacing.ts          # 8px grid system
│   ├── typography.ts       # Modular type scale
│   └── index.ts            # Theme exports
│
└── components/             # 🚧 Future: UI components
    hooks/                  # 🚧 Future: Custom hooks
    types/                  # 🚧 Future: TypeScript types
    utils/                  # 🚧 Future: Utilities
    lib/                    # 🚧 Future: Analytics algorithms
```

**Total:** 11 working files + planning for 98 tasks across 5 phases

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **[TASKS.md](./docs/TASKS.md)** | 98 tasks, 14-week timeline, implementation details |
| **[TECHNICAL.md](./docs/TECHNICAL.md)** | 12 ADRs, database schema, algorithms, best practices |
| [CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Setup guide, commit conventions, workflow |

---

## 🏗️ Architecture Highlights

**Offline-First (WatermelonDB + MMKV + Zustand):**
- Works without WiFi (critical for gyms)
- 20-30x faster than AsyncStorage
- Automatic Supabase sync when online

**Database:**
- 5 tables (users, exercises, workouts, workout_exercises, exercise_sets)
- Supports supersets, RIR tracking, multiple exercise types
- 1,300+ exercises from ExerciseDB API (saves 190 hours)

**Performance:**
- FlashList (54% FPS improvement vs FlatList)
- expo-image (aggressive caching for 1,300 GIFs)
- Victory Native charts (large datasets)

_→ See [TECHNICAL.md](./docs/TECHNICAL.md) for 12 ADRs, schemas, algorithms_

---

## 🎨 Core Features

**Workout Logging:**
- Quick set logging (1-2 taps), auto-fill last workout
- Plate calculator, rest timer (background notifications)
- RPE/RIR tracking, superset support
- Offline-first

**Exercise Library:**
- 1,300+ exercises (ExerciseDB) + custom exercises
- Search, filters, GIFs, favorites

**Analytics:**
- Volume/strength progression, 1RM calculations (Epley, Brzycki, Lombardi)
- Plateau detection (Mann-Kendall statistical test, not AI)
- Personal records, body part distribution

_→ See [TASKS.md](./docs/TASKS.md) for 98 detailed tasks_

---

## 💰 Business Model

**Current:** All features free (MVP focus)
**Future:** Freemium ($6.99/mo) - unlimited history, advanced analytics, templates

_→ See [TECHNICAL.md](./docs/TECHNICAL.md) for monetization strategy, security & GDPR compliance_

---

## 📊 Development Timeline

**Target:** 14 weeks | **Progress:** 12% (10/98 tasks)

```
Phase 0: Setup ✅ | Phase 0.5: Architecture 🚧 | Phases 1-5: Planned
```

_→ See [TASKS.md](./docs/TASKS.md) for detailed progress tracking_

---

## 🤝 Contributing

```bash
# Commit convention
<type>(<scope>): <description>
# Example: feat(workout): add RPE tracking to set logger
```

_→ See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for setup, workflow, conventions_

---

## 📝 Credits

**Data:** ExerciseDB (1,300+ exercises) | **Charts:** Victory Native | **Inspiration:** Strong, Hevy, JEFIT

---

<div align="center">

**Built with precision for serious lifters** 🏋️

_Offline-first • Science-based • Performance-optimized_

</div>
