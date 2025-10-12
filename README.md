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

Before you begin, ensure you have:
- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Supabase account** (free tier) at [supabase.com](https://supabase.com/dashboard)

### Quick Start (TL;DR)

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm start
# Scan QR code with Expo Go app
```

---

### Detailed Setup

#### 1. Clone and Install

```bash
git clone <repository-url>
cd halterofit
npm install
```

#### 2. Environment Configuration

Create your environment file:
```bash
cp .env.example .env
```

Get your Supabase credentials:
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project (or use existing)
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon public** key

Edit `.env`:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3. Start Development Server

```bash
npm start
```

This will:
- Initialize the SQLite database
- Start Metro bundler
- Show QR code in terminal

#### 4. Run on Your Device

**Option A: Physical Device (Recommended)**
1. Open **Expo Go** app on your phone
2. Scan the QR code from terminal
3. App will load on your device

**Option B: Emulator/Simulator**
```bash
npm run android  # Android emulator
npm run ios      # iOS simulator (macOS only)
```

#### 5. Verify Setup

Once the app loads, you should see:
- ✅ Home screen with tabs navigation
- ✅ No errors in Metro bundler
- ✅ Database initialized message in logs

---

### Common Commands

```bash
# Development
npm start              # Start Expo Dev Server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator

# Code Quality
npm run type-check     # TypeScript type checking
npm run lint           # ESLint linting
npm run format         # Format code with Prettier

# Maintenance
npm run lint:fix       # Auto-fix ESLint issues
npm run format:check   # Check if code is formatted
```

---

### Troubleshooting

**Common issues?** See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

Quick fixes:
```bash
# Clear Metro cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules && npm install

# Clear Expo cache
npx expo start -c --clear
```

---

### Next Steps

Once setup is complete:

1. **Explore the codebase:**
   - [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Project structure and patterns
   - [docs/DATABASE.md](docs/DATABASE.md) - Database schema and usage
   - [docs/TECHNICAL.md](docs/TECHNICAL.md) - Technical decisions (ADRs)

2. **Check the roadmap:**
   - [docs/TASKS.md](docs/TASKS.md) - Development tasks and progress

3. **Review planned corrections:**
   - [docs/AUDIT_FIXES.md](docs/AUDIT_FIXES.md) - Critical fixes before Phase 1

4. **Test the database:**
   - Run examples in `src/services/database/__tests__/example.ts`

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
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | Architecture modulaire, patterns, data flow |
| **[PRD.md](./docs/PRD.md)** | Product requirements, user personas, success metrics |
| **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** | Setup, commit conventions, workflow |
