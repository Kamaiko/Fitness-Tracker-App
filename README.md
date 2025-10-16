<div align="center">

# Halterofit

**Science-based fitness tracking with intelligent analytics**

[![Expo SDK](https://img.shields.io/badge/Expo-54.0.12-000020?style=flat&logo=expo)](https://expo.dev)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)](https://react.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.82.0-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://typescriptlang.org)
[![NativeWind](https://img.shields.io/badge/NativeWind-v4-06B6D4?style=flat&logo=tailwindcss)](https://nativewind.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?style=flat&logo=supabase)](https://supabase.com)
[![Science-Based](https://img.shields.io/badge/Analytics-Science--Based-00A36C?style=flat)](https://github.com)

<br/>

<img src="./docs/images/home-placeholder.jpeg" alt="Home Screen Placeholder" width="300"/>

_⚠️ Placeholder UI_

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Expo account** (free tier) - [Sign up here](https://expo.dev/signup)
- **Supabase account** (free tier) - [Sign up here](https://supabase.com/dashboard/sign-up)
- **EAS CLI** for building development builds

### Installation (5 minutes)

```bash
# 1. Clone and install
git clone https://github.com/yourusername/halterofit.git
cd halterofit
npm install

# 2. Create Supabase project
# Go to https://supabase.com/dashboard
# Create new project → Copy URL and anon key

# 3. Configure environment
cp .env.example .env

# Edit .env and add your credentials:
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 4. Setup database schema
# In Supabase Dashboard → SQL Editor → Run:
# (Copy schema from docs/DATABASE.md or use migration files)

# 5. Install EAS CLI and login
npm install -g eas-cli
eas login

# 6. Build development build (first time only, ~15-20 minutes)
eas build --profile development --platform android
# OR for iOS: eas build --profile development --platform ios

# 7. Install the dev build on your device (scan QR from EAS Build)

# 8. Start development server
npm start

# 9. Scan QR code with your development build app
```

**Note:** Development build is required (not Expo Go) because this project uses native modules (WatermelonDB, MMKV, Victory Native).

### Project Documentation

| Document                                    | Description                                          |
| ------------------------------------------- | ---------------------------------------------------- |
| **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Code organization, patterns, folder structure        |
| **[DATABASE.md](docs/DATABASE.md)**         | Database setup, schema, CRUD operations              |
| **[TASKS.md](docs/TASKS.md)**               | Development roadmap (96 tasks across 6 phases)       |
| **[AUDIT_FIXES.md](docs/AUDIT_FIXES.md)**   | 8 critical corrections blocking Phase 1              |
| **[PRD.md](docs/PRD.md)**                   | Product requirements, user stories, success metrics  |
| **[TECHNICAL.md](docs/TECHNICAL.md)**       | Architecture Decision Records (ADRs), tech decisions |
| **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** | Development workflow, commit conventions, style      |

### Next Steps After Setup

1. **Explore codebase**: Start with `src/app/(tabs)/index.tsx` (Home screen)
2. **Review architecture**: Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. **Check roadmap**: See [docs/TASKS.md](docs/TASKS.md) for current phase
4. **Critical fixes**: Review [docs/AUDIT_FIXES.md](docs/AUDIT_FIXES.md) before Phase 1

---

## 🎯 What Makes Halterofit Different

**Context-aware analytics that understand YOUR training:**

- 📊 **Personalized 1RM** adjusted by RIR (proximity to failure matters)
- 📈 **Load management** (Acute/Chronic ratios, fatigue tracking, overtraining alerts)
- 🎯 **Nutrition phase tracking** (bulk/cut/maintenance - stable in cut = success, not plateau)
- 🧪 **Science-based plateau detection** (Mann-Kendall statistical test + context)
- 📝 **Post-workout reports** (performance score, fatigue estimate, actionable recommendations)
- 📅 **Weekly summaries** (trends, PRs, consistency, deload suggestions)

**Unlike Jefit/Strong/Hevy:** We don't just show numbers - we explain WHY and WHAT TO DO.

---

## 🛠️ Tech Stack

| Layer         | Category     | Technologies                                          |
| ------------- | ------------ | ----------------------------------------------------- |
| **Frontend**  | Framework    | Expo SDK 54 + React Native 0.82 + TypeScript 5.9      |
|               | Navigation   | Expo Router 6                                         |
|               | Styling      | NativeWind v4 (Tailwind CSS 3.4)                      |
|               | State        | Zustand 5.0 + React Query 5.90                        |
|               | **Database** | **WatermelonDB** (offline-first, reactive) + Supabase |
|               | Storage      | **MMKV** (10-30x faster than AsyncStorage, encrypted) |
|               | UI           | FlashList + expo-image + **Victory Native**           |
| **Backend**   | Platform     | Supabase (PostgreSQL + Auth + Storage + Real-time)    |
| **External**  | Services     | ExerciseDB API (1,300+ exercises), Sentry, RevenueCat |
| **Analytics** | Libraries    | simple-statistics (Mann-Kendall, regressions)         |
| **Testing**   | Framework    | Jest + React Native Testing Library                   |
| **Build**     | Tool         | EAS Build (Development Build required)                |

**Current Phase:** 0.5 - **Development Build with native modules** (WatermelonDB, MMKV, Victory Native)
**Migration Status:** In progress - migrating from Expo Go stack to Development Build stack

---

## 🎯 Current Status

**Version:** 0.2.0 | **Progress:** 6% (6/96 tasks) | **Phase:** 0.5 - Critical corrections

---

## 🚀 Architecture Notes

### Current Implementation (MVP Strategy)

**Database:** WatermelonDB (offline-first, reactive queries) with Supabase sync
**Sync Strategy:** WatermelonDB built-in sync protocol (optimized, conflict resolution)
**Storage:** MMKV (10-30x faster than AsyncStorage, native encryption)
**Charts:** Victory Native (advanced gestures, Skia rendering)
**Performance:** Optimized for 2000+ workouts with reactive queries and indexes

### Why Development Build from Day 1?

Instead of migrating later (costly refactor), we're building with production-grade tools from the start:

1. **WatermelonDB** - Better than expo-sqlite for scalability and reactive UI
2. **MMKV** - 10-30x faster storage with encryption (vs AsyncStorage)
3. **Victory Native** - Professional charts with gestures (vs basic charts)
4. **No future migration** - Avoid 1-2 weeks of refactoring later

**Trade-off:** Slower iteration (rebuild for native changes) but better architecture for MVP scale.

**Migration Plan:** See [docs/TASKS.md](docs/TASKS.md) Phase 0.5 Bis for migration steps.

---
