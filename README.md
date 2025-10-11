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

```bash
npm install
cp .env.example .env  # Add Supabase credentials
npm start
```

**Device:** Install [Expo Go](https://expo.dev/client), scan QR code

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
| | Storage | AsyncStorage (→ WatermelonDB + MMKV in Phase 3) |
| | UI | FlashList + expo-image + react-native-chart-kit |
| | Charts | react-native-chart-kit (→ Victory Native Phase 3) |
| **Backend** | Platform | Supabase (PostgreSQL + Auth + Storage + Real-time) |
| **External** | Services | ExerciseDB API (1,300+ exercises), Sentry, RevenueCat |
| **Analytics** | Libraries | simple-statistics (Mann-Kendall, regressions) |

**Current Phase:** 0.5 - Expo Go compatible (no native modules)

---

## 🎯 Current Status

**Version:** 0.2.0 | **Progress:** 12% (Phase 0.5 in progress)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[PRD.md](./docs/PRD.md)** | Product requirements, user personas, success metrics |
| **[TECHNICAL.md](./docs/TECHNICAL.md)** | Architecture (12 ADRs), database schema, algorithms |
| **[TASKS.md](./docs/TASKS.md)** | 98 tasks, 14-week timeline, progress tracking |
| **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** | Setup, commit conventions, workflow |
