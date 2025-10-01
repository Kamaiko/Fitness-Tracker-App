# 🤝 Contributing Guide

Welcome to Halterofit! This guide will help you set up the project and start contributing.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Expo Go** app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
- **Git** ([Download](https://git-scm.com/))

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/Kamaiko/Fitness-Tracker-App.git
   cd Fitness-Tracker-App
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase credentials
   ```

3. **Start the app**
   ```bash
   npm start
   # Scan QR code with Expo Go (Android) or Camera (iOS)
   ```

---

## 🛠️ Development Workflow

### 1. Pick a Task
- Check [TASKS.md](./TASKS.md) for the next priority
- Start with "Current Focus" tasks
- Pick tasks from Phase 1 if you're new

### 2. Create a Branch
```bash
git checkout -b feature/task-description
# or
git checkout -b fix/bug-description
```

### 3. Make Changes
- Follow [TECHNICAL.md](./TECHNICAL.md) coding standards
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
feat(workout): add RPE tracking
fix(analytics): correct volume calculation
docs(readme): update setup instructions
```

### 5. Push and PR
```bash
git push origin feature/task-description
```

---

## 📋 Pre-Commit Checklist

- [ ] App builds without errors
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] No console.log statements
- [ ] Uses theme values (no hardcoded colors/spacing)
- [ ] Tested on Android device
- [ ] Commit message follows convention

---

## 📚 Where to Find What

### Development
- **[TASKS.md](./TASKS.md)** - What to work on next
- **[TECHNICAL.md](./TECHNICAL.md)** - Architecture, standards, ADRs

### Getting Started
- **[README.md](../README.md)** - Project overview
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - This file

---

## 🎨 Quick Standards

### TypeScript
```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
}

function getUser(id: string): User | null { }

// ❌ Bad
function getUser(id: any): any { }
```

### Styling
```typescript
// ✅ Good
import { Colors, Spacing } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
});

// ❌ Bad
<View style={{ backgroundColor: '#000', padding: 16 }}>
```

### Imports
```typescript
// ✅ Good (relative imports for now)
import { Colors } from '../theme/colors';

// ❌ Bad (@ aliases not configured yet)
import { Colors } from '@/theme/colors';
```

---

## 🐛 Common Issues

**"Cannot find module"**
- Run `npm install`
- Clear cache: `npm start -- --clear`

**App crashes**
- Check TypeScript: `npx tsc --noEmit`
- Look for console errors
- Clear cache and restart

**QR code not working**
- Same WiFi network required
- Check firewall settings
- Try manual connection in Expo Go

---

## 📝 Useful Commands

```bash
npm start                # Start dev server
npm start -- --clear     # Start with cache cleared
npm run android          # Run on Android emulator
npm run ios              # Run on iOS simulator
npx tsc --noEmit         # Check TypeScript errors
```

---

## 📚 Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand)

---

**Happy Coding! 🚀**
