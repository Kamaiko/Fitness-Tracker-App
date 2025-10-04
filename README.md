<div align="center">

# Halterofit

**Intelligent fitness tracking for serious bodybuilders**

[![Expo SDK](https://img.shields.io/badge/Expo-54.0.12-000020?style=flat&logo=expo)](https://expo.dev)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://typescriptlang.org)

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

**Frontend**
- Expo SDK 54 + React 19 + TypeScript 5.9
- Expo Router 6 (file-based navigation)
- Zustand (state management)
- MMKV (encrypted storage)

**Backend**
- Supabase (PostgreSQL + Auth + Real-time)

**Design**
- Dark theme optimized
- 8px grid system
- Custom design tokens

---

## 📁 Project Structure

```
src/
├── app/                    # Expo Router screens (3 files)
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Home screen
│   └── +not-found.tsx      # 404 screen
│
├── services/               # External services (2 files)
│   ├── supabase/client.ts  # Supabase configuration
│   └── storage/mmkv.ts     # MMKV encrypted storage
│
├── stores/                 # Zustand state management (2 files)
│   ├── authStore.ts        # Authentication state
│   └── workoutStore.ts     # Workout session state
│
├── theme/                  # Design system (4 files)
│   ├── colors.ts           # Dark color palette
│   ├── spacing.ts          # 8px grid system
│   ├── typography.ts       # Type scale
│   └── index.ts            # Theme exports
│
└── components/             # UI components (empty - future)
    hooks/                  # Custom hooks (empty - future)
    types/                  # TypeScript types (empty - future)
    utils/                  # Utilities (empty - future)
```

**Total:** 11 working files + structure for future development

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **[TASKS.md](./docs/TASKS.md)** | Development roadmap & checklist (94 tasks) |
| [TECHNICAL.md](./docs/TECHNICAL.md) | Architecture & technical decisions (8 ADRs) |
| [CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Setup & workflow guide |

---

## 🎯 Status

**Version:** 0.1.0 — Initial setup complete
**Progress:** Phase 0 ✅ → Phase 1 (Authentication) 🚧

**Working:**
- ✅ Expo SDK 54 + React 19 + TypeScript strict mode
- ✅ Supabase client configured
- ✅ Dark theme system (colors, spacing, typography)
- ✅ State management (Zustand - auth & workout stores)
- ✅ Encrypted storage (MMKV)
- ✅ File-based routing (Expo Router)

**Next (Phase 1 - Weeks 3-4):**
- 🎯 Authentication screens (login, register)
- 🎯 Database schema + Row Level Security
- 🎯 Tab navigation structure
- 🎯 Core UI components (Button, Input, Card)

---

<div align="center">

Built with precision for serious lifters 🏋️

</div>
