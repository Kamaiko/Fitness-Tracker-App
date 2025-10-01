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
│   ├── _layout.tsx   # Root layout with providers
│   └── index.tsx     # Home screen
├── services/         # External services
│   ├── supabase/     # Supabase client configuration
│   └── storage/      # MMKV storage wrapper
├── stores/           # Zustand state stores
│   ├── authStore.ts  # Authentication state
│   └── workoutStore.ts # Workout session state
├── theme/            # Design system
│   ├── colors.ts     # Color palette (dark theme)
│   ├── spacing.ts    # 8px grid system
│   └── typography.ts # Font sizes & weights
├── lib/              # Business logic & calculations
├── constants/        # App-wide constants
└── types/            # TypeScript type definitions
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=your_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## 📚 Documentation

See [`docs/`](./docs/) folder for detailed documentation:
- [Project Plan](./docs/PROJECT_PLAN.md)
- [MVP Roadmap](./docs/MVP_ROADMAP.md)
- [Architecture](./docs/ARCHITECTURE.md)

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
