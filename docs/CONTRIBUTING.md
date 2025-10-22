# 🤝 Contributing Guide

Welcome to Halterofit! This guide will help you set up the project and start contributing.

---

## 📑 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🛠️ Development Workflow](#️-development-workflow)
- [📋 Pre-Commit Checklist](#-pre-commit-checklist)
- [📚 Documentation](#-documentation)
- [🎨 Coding Standards](#-coding-standards)
- [🐛 Common Issues](#-common-issues)
- [📝 Commands](#-commands)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Expo account** (free tier) - [Sign up here](https://expo.dev/signup)
- **Supabase account** (free tier) - [Sign up here](https://supabase.com/dashboard/sign-up)
- **EAS CLI** for building development builds
- **Git** ([Download](https://git-scm.com/))

### Setup (First Time - ~15-20 minutes)

1. **Clone and install**

   ```bash
   git clone https://github.com/Kamaiko/Fitness-Tracker-App.git
   cd Fitness-Tracker-App
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase credentials:
   # EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   # EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Install EAS CLI and login**

   ```bash
   npm install -g eas-cli
   eas login
   ```

4. **Build Development Build (one-time, ~15-20 minutes)**

   ```bash
   # For Android
   eas build --profile development --platform android

   # For iOS (requires macOS)
   eas build --profile development --platform ios

   # Wait for build to complete and scan QR code to install on your device
   ```

5. **Start development server**
   ```bash
   npm start
   # Scan QR code with your installed development build app
   ```

**Note**: We use Development Build (not Expo Go) because the project requires native modules (WatermelonDB, MMKV, Victory Native).

---

## 🛠️ Development Workflow

### Daily Development (after initial setup)

**Good news**: Once you have the dev build installed, daily development is the same as Expo Go!

```bash
npm start
# Scan QR code with your dev build app
# Hot reload works normally ✅
```

**When do you need to rebuild?**

- Only when adding a new native module (rare, ~1-2x/week max)
- To rebuild: `eas build --profile development --platform [android|ios]`

### 1. Pick a Task

- Check [TASKS.md](TASKS.md) for the next priority
- Start with "Current Focus" tasks
- Pick tasks from Phase 1 if you're new

### 2. Create a Branch

```bash
git checkout -b feature/task-description
# or
git checkout -b fix/bug-description
```

### 3. Make Changes

- Follow [ARCHITECTURE.md](ARCHITECTURE.md) folder structure
- Follow [TECHNICAL.md](TECHNICAL.md) coding standards
- Test on a real device
- Use theme values (colors, spacing, typography)

### 4. Commit

Follow the convention from `.claude/CLAUDE.md`:

```bash
# Format: <type>(<scope>): <description>
git commit -m "feat(auth): add login screen UI"
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**

```bash
feat(workout): add RPE tracking to set logger
fix(analytics): correct volume calculation for compound exercises
docs(readme): update installation instructions
style(components): format workout card component
refactor(lib): extract 1RM calculations to separate module
test(workout): add unit tests for set validation
chore(deps): update React Native to 0.82.0
```

### 5. Push and PR

```bash
git push origin feature/task-description
```

---

## 📋 Pre-Commit Checklist

- [ ] App builds without errors (`npm start`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] No console.log statements (use proper logging)
- [ ] Uses theme values (no hardcoded colors/spacing)
- [ ] Tested on real device (Android or iOS)
- [ ] Commit message follows convention
- [ ] No sensitive data in code (API keys, credentials)

---

## 📚 Documentation

See [README.md § Documentation](../README.md#-documentation) for complete documentation index.

---

## 🎨 Coding Standards

**See [TECHNICAL.md](TECHNICAL.md) for complete coding standards.**

### Key Rules

- ✅ TypeScript strict mode (no `any`)
- ✅ Use absolute imports (`@/components` instead of `../../../components`)
- ✅ Barrel exports (`index.ts`) for clean imports
- ✅ Use NativeWind (Tailwind CSS) for styling
- ✅ Functional components only
- ✅ WatermelonDB for database operations
- ✅ MMKV for encrypted storage
- ❌ No hardcoded colors/spacing (use theme)
- ❌ No inline styles (use NativeWind classes)
- ❌ No `console.log` in production code

### Folder Structure

```
src/
├── app/              # Expo Router screens & navigation
├── components/       # Reusable UI components (feature-organized)
├── hooks/            # Custom React hooks
├── services/         # Business logic & external services
│   ├── database/     # WatermelonDB setup & operations
│   ├── storage/      # MMKV storage wrapper
│   └── supabase/     # Supabase client
├── stores/           # Zustand global state
├── types/            # Shared TypeScript types
├── utils/            # Pure utility functions
└── constants/        # App-wide constants
```

**See [ARCHITECTURE.md](ARCHITECTURE.md) for complete structure.**

---

## 🐛 Common Issues

### Development Build Issues

**"Cannot install development build"**

- Check that build completed successfully in EAS dashboard
- Re-download build from EAS dashboard
- Uninstall existing version first

**"Native module not found"**

- You need to rebuild dev build: `eas build --profile development --platform [android|ios]`
- Wait for build and install new version

**"Cannot find module"**

```bash
npm install
npm start -- --clear
```

**TypeScript errors**

```bash
npm run type-check
```

**App crashes**

- Check console for errors
- Clear cache: `npm start -- --clear`
- Restart development build app
- Check if native modules are properly linked (may need rebuild)

**QR code not working**

- Ensure same WiFi network
- Check firewall settings
- Use manual connection in dev build app

**Database errors (WatermelonDB)**

- Check [DATABASE.md](DATABASE.md) for schema
- Verify models are properly decorated
- Check that database is initialized in `_layout.tsx`

**Storage errors (MMKV)**

- MMKV requires Development Build (not Expo Go)
- Verify `mmkvStorage.ts` wrapper is properly imported
- Check encryption key is set

---

## 📝 Commands

### Daily Development

```bash
npm start              # Start dev server
npm start -- --clear   # Clear cache & start
npm run type-check     # TypeScript validation
```

### Building (only when adding native modules)

```bash
# Development Build
eas build --profile development --platform android
eas build --profile development --platform ios

# Preview Build (for testing)
eas build --profile preview --platform android

# Production Build (for release)
eas build --profile production --platform android
eas build --profile production --platform ios
```

### Database & Testing

```bash
# Check database schema
npm start
# Then in Metro console:
# import { database } from './src/services/database/watermelon';
# await database.adapter.getLocal('schema_version');
```

---

**Happy Coding! 🚀**

**Tech Stack & Architecture**: See [README.md](../README.md#️-tech-stack) for complete stack details.
