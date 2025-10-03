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

- [ ] App builds without errors (`npm start`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] No console.log statements
- [ ] Uses theme values (no hardcoded colors/spacing)
- [ ] Tested on real device (Android or iOS)
- [ ] Commit message follows convention

---

## 📚 Documentation

- **[TASKS.md](TASKS.md)** - Development roadmap (94 tasks)
- **[TECHNICAL.md](TECHNICAL.md)** - Architecture & technical decisions
- **[README.md](../README.md)** - Project overview & quick start

---

## 🎨 Coding Standards

**See [TECHNICAL.md](TECHNICAL.md) for complete coding standards.**

### Key Rules
- ✅ TypeScript strict mode (no `any`)
- ✅ Use theme values from `src/theme/`
- ✅ Relative imports (no `@/` aliases yet)
- ✅ Functional components only
- ❌ No hardcoded colors/spacing
- ❌ No inline styles

---

## 🐛 Common Issues

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
- Restart Expo Go

**QR code not working**
- Ensure same WiFi network
- Check firewall settings
- Use manual connection in Expo Go

---

## 📝 Commands

```bash
npm start              # Start dev server
npm start -- --clear   # Clear cache & start
npm run android        # Android emulator
npm run ios            # iOS simulator
npm run type-check     # TypeScript validation
```

---

**Happy Coding! 🚀**
