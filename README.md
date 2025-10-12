<div align="center">

# Halterofit

**Science-based fitness tracking with intelligent analytics**

[![Expo SDK](https://img.shields.io/badge/Expo-54.0.12-000020?style=flat&logo=expo)](https://expo.dev)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://react.dev)
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
- **Expo Go** app ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Supabase account** (free tier) - [Sign up here](https://supabase.com/dashboard/sign-up)

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

# 5. Start development server
npm start

# 6. Open Expo Go on your phone
# Scan the QR code displayed in terminal
```

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
| **Frontend**  | Framework    | Expo SDK 54 + React Native 0.81 + TypeScript 5.9      |
|               | Navigation   | Expo Router 6                                         |
|               | Styling      | NativeWind v4 (Tailwind CSS)                          |
|               | State        | Zustand 5.0 + React Query 5.90                        |
|               | **Database** | **expo-sqlite** (offline-first) + Supabase sync       |
|               | Preferences  | AsyncStorage (auth, settings)                         |
|               | UI           | FlashList + expo-image + react-native-chart-kit       |
| **Backend**   | Platform     | Supabase (PostgreSQL + Auth + Storage + Real-time)    |
| **External**  | Services     | ExerciseDB API (1,300+ exercises), Sentry, RevenueCat |
| **Analytics** | Libraries    | simple-statistics (Mann-Kendall, regressions)         |
| **Testing**   | Framework    | Jest + React Native Testing Library                   |

**Current Phase:** 0.5 - **100% Expo Go compatible** (offline-first with expo-sqlite)
**Future optimization:** Consider WatermelonDB + MMKV + Victory Native at 1000+ users if needed

---

## 🎯 Current Status

**Version:** 0.2.0 | **Progress:** 6% (6/96 tasks) | **Phase:** 0.5 - Critical corrections

---

## 🚀 Architecture Notes

### Current Implementation

**Database:** expo-sqlite with Supabase sync (offline-first, fully functional)
**Sync Strategy:** Last-write-wins (timestamp-based) - simple and reliable for single-user MVP
**Storage:** AsyncStorage for preferences and auth tokens
**Performance:** Optimized for 500-1000 workouts without indexes

### Planned Enhancements (Post-MVP)

These optimizations will be implemented **only if production metrics indicate need** (1000+ users):

**Database: expo-sqlite → WatermelonDB**

- **Trigger:** Query performance >200ms at p95 OR sync failures >2%
- **Benefits:** Reactive queries (.observe()), optimized sync protocol, better scalability
- **Requirements:** Development Build (native SQLite optimizations)
- **Effort:** 2-3 days (abstraction layer already exists)

**Storage: AsyncStorage → MMKV**

- **Trigger:** Storage performance bottleneck OR encryption requirements
- **Benefits:** 10-30x faster read/write, synchronous API, built-in encryption
- **Requirements:** Development Build (native C++ module)
- **Effort:** 2-4 hours (simple migration)

**Charts: react-native-chart-kit → Victory Native**

- **Trigger:** User requests for advanced interactions OR multi-line charts (>3 series)
- **Benefits:** Advanced gestures (zoom/pan), smooth animations, Skia rendering
- **Requirements:** Development Build (react-native-skia)
- **Effort:** 3-6 hours (chart abstraction ready)

**Database Indexes:**

- **Trigger:** 500+ workouts per user
- **Benefits:** Faster queries on large datasets
- **Effort:** 2-4 hours

**Migration Strategy:** Conservative, metric-driven approach. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed triggers and decision framework.

---
