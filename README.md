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

```bash
# Commit convention
<type>(<scope>): <description>
# Example: feat(workout): add RPE tracking to set logger
```

_→ See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for setup, workflow, conventions_

---

## 📝 Credits

ExerciseDB • Victory Native • Inspired by Strong, Hevy, JEFIT
