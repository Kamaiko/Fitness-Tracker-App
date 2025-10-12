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

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ | **npm** 9+ | **Expo Go** app | **Supabase account** (free)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials:
# EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 3. Start development
npm start
# Scan QR code with Expo Go app
```

### Commands

```bash
npm start              # Start Expo
npm run android        # Android emulator
npm run ios            # iOS simulator
npm run type-check     # TypeScript check
npm run lint           # ESLint
npm test               # Run tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

**Troubleshooting?** See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

**Documentation:**

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Project structure
- [DATABASE.md](docs/DATABASE.md) - Database schema
- [TASKS.md](docs/TASKS.md) - Roadmap
- [AUDIT_FIXES.md](docs/AUDIT_FIXES.md) - Critical fixes

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
**Future optimization:** Consider WatermelonDB + MMKV at 1000+ users if needed

---

## 🎯 Current Status

**Version:** 0.2.0 | **Progress:** 21% (25/119 tasks) | **Phase:** 0.5 - Critical corrections

---

## ⚠️ Known Limitations & Future Work

### Sync Conflicts (Phase 0-2)

**Current:** Simplified timestamp-based ("last write wins")
**Limitation:** Multi-device edits of same workout may lose data
**Upgrade when:** Users report lost changes (>5 reports)
**Solution:** Add version tracking (2-6h work)
**Reference:** Git history `git log --grep="audit"` or tag `phase-0.5-audit`

### Performance

**Database indexes:** Add when >500 workouts (2h work)

### Scalability

**Repository Pattern:** Refactor only if migrating to WatermelonDB (1 week work)

---

## 📚 Documentation

| Document                                      | Description                                          |
| --------------------------------------------- | ---------------------------------------------------- |
| **[DATABASE.md](./docs/DATABASE.md)**         | Database setup, CRUD operations, sync guide          |
| **[TECHNICAL.md](./docs/TECHNICAL.md)**       | Architecture, ADRs, database schema                  |
| **[TASKS.md](./docs/TASKS.md)**               | Development roadmap, 107 tasks, progress tracking    |
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | Architecture modulaire, patterns, data flow          |
| **[PRD.md](./docs/PRD.md)**                   | Product requirements, user personas, success metrics |
| **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** | Setup, commit conventions, workflow                  |
