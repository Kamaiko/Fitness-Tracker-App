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

### 1. Installation

```bash
npm install
cp .env.example .env  # Add your Supabase credentials
```

### 2. Configure Supabase

Create a free account at [supabase.com](https://supabase.com/dashboard) and add your credentials to `.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### 3. Start Development

```bash
npm start  # Start Expo Dev Server
```

Scan the QR code with [Expo Go](https://expo.dev/client) app on your device.

### 4. Key Commands

```bash
# Development
npm start              # Start Expo
npm run android        # Android emulator
npm run ios            # iOS simulator

# Code Quality
npm run type-check     # TypeScript check
npm run lint           # ESLint
npm run format         # Prettier format
```

### 5. Next Steps

- **Database Schema:** See [docs/DATABASE.md](docs/DATABASE.md) for setup
- **Architecture:** Read [docs/TECHNICAL.md](docs/TECHNICAL.md)
- **Tasks:** Check [docs/TASKS.md](docs/TASKS.md) for roadmap
- **Test Database:** Run examples in `src/services/database/__tests__/example.ts`

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

| Layer | Category | Technologies |
|-------|----------|-------------|
| **Frontend** | Framework | Expo SDK 54 + React Native 0.81 + TypeScript 5.9 |
| | Navigation | Expo Router 6 |
| | Styling | NativeWind v4 (Tailwind CSS) |
| | State | Zustand 5.0 + React Query 5.90 |
| | **Database** | **expo-sqlite** (offline-first) + Supabase sync |
| | Preferences | AsyncStorage (auth, settings) |
| | UI | FlashList + expo-image + react-native-chart-kit |
| **Backend** | Platform | Supabase (PostgreSQL + Auth + Storage + Real-time) |
| **External** | Services | ExerciseDB API (1,300+ exercises), Sentry, RevenueCat |
| **Analytics** | Libraries | simple-statistics (Mann-Kendall, regressions) |

**Current Phase:** 0.5 - **100% Expo Go compatible** (offline-first with expo-sqlite)
**Migration Path:** WatermelonDB + MMKV at 1000+ users (Phase 3)

---

## 🎯 Current Status

**Version:** 0.2.0 | **Progress:** 12% (Phase 0.5 in progress)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[DATABASE.md](./docs/DATABASE.md)** | Database setup, CRUD operations, sync guide |
| **[TECHNICAL.md](./docs/TECHNICAL.md)** | Architecture, ADRs, database schema |
| **[TASKS.md](./docs/TASKS.md)** | Development roadmap, 107 tasks, progress tracking |
| **[PRD.md](./docs/PRD.md)** | Product requirements, user personas, success metrics |
| **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** | Setup, commit conventions, workflow |
