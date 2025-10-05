<div align="center">

# Halterofit

**Offline-first fitness tracking**

[![Expo SDK](https://img.shields.io/badge/Expo-54.0.12-000020?style=flat&logo=expo)](https://expo.dev)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://typescriptlang.org)
[![WatermelonDB](https://img.shields.io/badge/WatermelonDB-Offline--First-00A36C?style=flat)](https://nozbe.github.io/WatermelonDB/)

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

## 🛠️ Tech Stack

### Frontend
- **Framework:** Expo SDK 54 + React 19 + TypeScript 5.9
- **Navigation:** Expo Router 6
- **State:** Zustand 5.0 + React Query 5.90
- **Storage:** WatermelonDB (SQLite) + MMKV (encrypted)
- **UI:** FlashList + expo-image + Victory Native

### Backend
- **Supabase:** PostgreSQL + Auth + Storage + Real-time
- **Sync:** WatermelonDB ↔ Supabase

### External Services
- **ExerciseDB API:** 1,300+ exercises
- **Sentry:** Error monitoring
- **RevenueCat:** Subscriptions (future)

---

## 🎯 Current Status

**Version:** 0.2.0 | **Progress:** 12% (Phase 0.5 in progress)

_→ See [TASKS.md](./docs/TASKS.md) for detailed roadmap_

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[PRD.md](./docs/PRD.md)** | Product requirements, user personas, success metrics |
| **[TECHNICAL.md](./docs/TECHNICAL.md)** | Architecture (12 ADRs), database schema, algorithms |
| **[TASKS.md](./docs/TASKS.md)** | 98 tasks, 14-week timeline, progress tracking |
| [CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Setup, commit conventions, workflow |

---

## 🤝 Contributing

**Commits:** `<type>(<scope>): <description>`

_→ See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details_

---

## 📝 Credits

ExerciseDB • Victory Native • Inspired by Strong, Hevy, JEFIT
