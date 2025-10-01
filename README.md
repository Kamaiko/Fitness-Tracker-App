<div align="center">

# Halterofit

**Intelligent fitness tracking for serious bodybuilders**

</div>

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

## 📱 Testing on Your Phone

1. Install **Expo Go** from Play Store/App Store
2. Make sure your phone and computer are on the same WiFi
3. Run `npm start`
4. Scan the QR code with Expo Go (Android) or Camera (iOS)

## 🛠️ Tech Stack

- **Expo SDK 54** - React Native framework
- **React 19.1.0** - Latest React with new architecture
- **TypeScript 5.9** - Type safety with strict mode
- **Expo Router 6** - File-based navigation
- **Supabase** - Backend (PostgreSQL + Auth + Real-time)
- **Zustand** - Lightweight state management
- **MMKV** - Fast encrypted storage
- **React Native SVG** - Vector graphics support

## 📂 Project Structure

```
src/
├── app/              # Expo Router screens
│   ├── _layout.tsx   # Root layout
│   ├── index.tsx     # Home screen
│   └── +not-found.tsx # 404 screen
├── services/         # External services
│   ├── supabase/     # Supabase client
│   └── storage/      # MMKV wrapper
├── stores/           # Zustand stores
│   ├── authStore.ts  # Auth state
│   └── workoutStore.ts # Workout state
└── theme/            # Design system
    ├── colors.ts     # Dark color palette
    ├── spacing.ts    # 8px grid
    └── typography.ts # Type scale
```

See [docs/STRUCTURE.md](./docs/STRUCTURE.md) for complete details.

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=your_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## 📚 Documentation

**→ [Read the full documentation](./docs/README.md)**

Quick links:
- **[TASKS.md](./docs/TASKS.md)** - Development checklist (start here!)
- [CURRENT_STATE.md](./docs/CURRENT_STATE.md) - What's implemented now
- [ROADMAP.md](./docs/ROADMAP.md) - Development phases
- [TECHNICAL.md](./docs/TECHNICAL.md) - Architecture & decisions
- [CONTRIBUTING.md](./docs/CONTRIBUTING.md) - How to contribute

See [docs/](./docs/) for complete documentation.

## 🎯 Current Status

**Version:** 0.1.0 (Initial Setup)
**SDK:** Expo 54.0.12
**React:** 19.1.0
**Status:** ✅ Base setup complete, ready for feature development

### ✅ What's working:
- Expo SDK 54 with React 19
- Dark theme home screen
- Supabase configuration
- MMKV storage setup
- Zustand stores (auth, workout)
- Theme system (colors, spacing, typography)

### 🚧 Next steps:
- Implement authentication screens
- Build workout logging interface
- Add exercise library
- Create analytics dashboard

---

<div align="center">

Built with ❤️ for serious lifters

</div>
