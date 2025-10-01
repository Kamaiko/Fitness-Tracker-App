# Halterofit

**Intelligent fitness tracking for serious bodybuilders**

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
- **TypeScript** - Type safety
- **Expo Router** - File-based routing
- **Supabase** - Backend (PostgreSQL + Auth)
- **Zustand** - State management
- **React Query** - Server state
- **MMKV** - Fast local storage

## 📂 Project Structure

```
src/
├── app/              # Expo Router screens
├── components/       # Reusable components
├── hooks/            # Custom React hooks
├── services/         # API & storage services
├── stores/           # Zustand stores
├── theme/            # Colors, spacing, typography
├── types/            # TypeScript types
├── utils/            # Helper functions
└── constants/        # App constants
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

---

Built with ❤️ for serious lifters
