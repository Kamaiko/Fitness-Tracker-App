<div align="center">

# Halterofit

**Intelligent fitness tracking for serious bodybuilders**

[![Expo SDK](https://img.shields.io/badge/Expo-54.0.12-000020?style=flat&logo=expo)](https://expo.dev)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://typescriptlang.org)

</div>

---

## 🚀 Quick Start

```bash
npm install          # Install dependencies
cp .env.example .env # Setup environment variables
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
├── app/              # Screens (Expo Router)
├── services/         # Supabase & storage
├── stores/           # Zustand state
└── theme/            # Design system
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **[TASKS.md](./docs/TASKS.md)** | Development roadmap & checklist |
| [TECHNICAL.md](./docs/TECHNICAL.md) | Architecture & technical decisions |
| [CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Setup & workflow guide |

---

## 🎯 Status

**Version:** 0.1.0 — Initial setup complete
**Progress:** Phase 0 ✅ → Phase 1 (Authentication) 🚧

**Working:**
- ✅ Expo SDK 54 + React 19
- ✅ Supabase client configured
- ✅ Dark theme system
- ✅ State management (Zustand)
- ✅ Encrypted storage (MMKV)

**Next:**
- 🎯 Authentication screens
- 🎯 Workout logging
- 🎯 Exercise library
- 🎯 Analytics dashboard

---

<div align="center">

Built with precision for serious lifters 🏋️

</div>
