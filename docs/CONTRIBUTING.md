# 🤝 Contributing Guide

Welcome to Halterofit! This guide will help you set up the project and start contributing.

---

## 📑 Table of Contents

- [🚀 Quick Start](#quick-start)
- [🛠️ Development Workflow](#development-workflow)
- [📋 Pre-Commit Checklist](#pre-commit-checklist)
- [📚 Documentation](#documentation)
- [🎨 Coding Standards](#coding-standards)
- [🐛 Common Issues](#common-issues)
- [📝 Commands](#commands)
- [🔄 CI/CD Architecture](#cicd-architecture)

---

## Quick Start

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

## Development Workflow

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

## Pre-Commit Checklist

- [ ] App builds without errors (`npm start`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] No console.log statements (use proper logging)
- [ ] Uses theme values (no hardcoded colors/spacing)
- [ ] Tested on real device (Android or iOS)
- [ ] Commit message follows convention
- [ ] No sensitive data in code (API keys, credentials)

---

## Documentation

See [README.md § Documentation](../README.md#-documentation) for complete documentation index.

---

## Coding Standards

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

## Common Issues

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

## Commands

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

### Database Schema Changes

**When modifying the database schema, follow this 6-step checklist:**

This process ensures Supabase (PostgreSQL) and WatermelonDB (SQLite) schemas stay in sync.

**Checklist:**

1. **Create Supabase migration**

   ```bash
   supabase migration new add_my_field
   ```

2. **Edit migration SQL file**
   - File: `supabase/migrations/<timestamp>_add_my_field.sql`
   - Add column, index, constraint, etc.

3. **Apply migration to Supabase**
   - Via SQL Editor: Copy-paste SQL
   - Or via CLI: `supabase db push`

4. **Update WatermelonDB schema**
   - File: `src/services/database/watermelon/schema.ts`
   - Add column to appropriate table
   - Match data types: TEXT → 'string', BIGINT → 'number', JSONB → 'string'

5. **Increment schema version**

   ```typescript
   // schema.ts
   export const schema = appSchema({
     version: 2, // Increment from 1 to 2
     // ...
   });
   ```

   - ⚠️ **Pre-commit hook will block commit if you forget this step!**

6. **Create WatermelonDB migration** (if users have existing data)
   - File: `src/services/database/watermelon/migrations.ts`
   - Use `addColumns()` to add new fields
   - See [WatermelonDB Migrations](https://nozbe.github.io/WatermelonDB/Advanced/Migrations.html)

**Example:**

```typescript
// 1. Supabase migration (SQL)
ALTER TABLE public.exercises ADD COLUMN difficulty TEXT;

// 2. WatermelonDB schema (TypeScript)
tableSchema({
  name: 'exercises',
  columns: [
    // ... existing columns
    { name: 'difficulty', type: 'string', isOptional: true },
  ],
}),

// 3. Increment version
version: 2,

// 4. WatermelonDB migration (if needed)
schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'exercises',
          columns: [{ name: 'difficulty', type: 'string', isOptional: true }],
        }),
      ],
    },
  ],
})
```

**Resources:**

- [DATABASE.md](DATABASE.md) - Complete schema documentation
- [WatermelonDB Migrations Guide](https://nozbe.github.io/WatermelonDB/Advanced/Migrations.html)

---

## CI/CD Architecture

### Overview

Halterofit uses **GitHub Actions** for continuous integration and deployment with a **parallel job architecture** designed for speed and clarity.

**Key Metrics:**

- ⚡ **Build Time**: ~30s (down from ~65s with sequential jobs)
- 🎯 **Parallelization**: 3 jobs run simultaneously
- 💾 **Caching**: TypeScript, ESLint, Jest caches for faster subsequent runs
- 🔒 **Security**: SHA-pinned actions, automated vulnerability scanning

### Workflow Structure

```
.github/workflows/
├── ci.yml              # Main CI pipeline (active)
├── cd-preview.yml      # EAS preview builds (Phase 2+)
└── cd-production.yml   # EAS production builds (Phase 3+)
```

### CI Pipeline (ci.yml)

**Triggered on:**

- Push to `master` branch
- Pull requests to `master`

**4 Jobs (3 parallel + 1 dependent):**

#### Job 1: `code-quality` (⏱️ ~5min, runs in parallel)

- TypeScript type-check
- ESLint linting (with cache)
- Prettier format check
- **Caching**: `.tsbuildinfo`, `.eslintcache`

#### Job 2: `unit-tests` (⏱️ ~5min, runs in parallel)

- Jest tests with coverage
- Upload coverage reports (30-day retention)
- **TODO Phase 1**: Coverage threshold check (40% minimum)
- **Caching**: `.jest-cache`

#### Job 3: `security-scan` (⏱️ ~3min, runs in parallel)

- `npm audit` for HIGH/CRITICAL vulnerabilities
- Fails build if vulnerabilities detected

#### Job 4: `dependabot-auto-merge` (requires: all jobs pass)

- Auto-merges Dependabot PRs after CI passes
- **Auto-merge rules:**
  - ✅ GitHub Actions: All versions
  - ✅ Dev dependencies: Minor/patch only
  - ✅ Runtime dependencies: Patch/minor only
  - ❌ Runtime major: Manual review required

### CD Workflows (Phase 2+)

**cd-preview.yml** - Currently disabled

- **Purpose**: EAS preview builds for QA
- **Trigger**: Manual or PR with "needs-qa" label
- **When**: Phase 2+ (when features are stable)

**cd-production.yml** - Currently disabled

- **Purpose**: EAS production builds for stores
- **Trigger**: Manual or git tags (e.g., `v1.0.0`)
- **When**: Phase 3+ (MVP ready for production)

### Debugging Failed CI

#### Type-Check Failures

```bash
npm run type-check
# Review errors and fix TypeScript issues
```

#### ESLint Failures

```bash
npm run lint        # Check errors
npm run lint:fix    # Auto-fix formatting
```

#### Test Failures

```bash
npm test           # Run all tests
npm run test:watch # Watch mode for TDD
```

#### Security Vulnerabilities

```bash
npm audit           # View vulnerabilities
npm audit fix       # Auto-fix (safe updates)
# Review npm audit output for manual fixes
```

### Caching Strategy

**Why caching?**

- TypeScript cache: -40% type-check time
- ESLint cache: -60% lint time
- Jest cache: -50% test time

**How it works:**

- GitHub Actions `actions/cache@v4` caches files based on content hash
- Cache invalidated when source files change
- Separate caches for TypeScript, ESLint, Jest

**Files cached:**

- `.tsbuildinfo` (TypeScript incremental compilation)
- `.eslintcache` (ESLint results)
- `.jest-cache` (Jest transform cache)

### Performance Monitoring

**View CI performance:**

1. Go to [Actions tab](https://github.com/Kamaiko/HalteroFit/actions)
2. Click on a workflow run
3. Review job timing (should be ~30s total)

**Expected timing:**

- `code-quality`: ~5 minutes
- `unit-tests`: ~5 minutes
- `security-scan`: ~3 minutes
- **Total (parallel)**: ~5 minutes (longest job)

### Coverage Reporting

**Current Phase (0.5):**

- Coverage tracked but no threshold (infrastructure phase)
- Reports uploaded as artifacts (30-day retention)

**Phase 1+:**

- Minimum 40% coverage required
- Fails build if below threshold

**View coverage:**

1. Go to workflow run on GitHub Actions
2. Download `coverage-report` artifact
3. Open `coverage/lcov-report/index.html` in browser

### Adding New CI Checks

If you need to add a new CI check (e.g., E2E tests, bundle size):

1. Add as a new job in `.github/workflows/ci.yml`
2. Use `needs: [job1, job2]` if dependent on other jobs
3. Add to `dependabot-auto-merge` needs array
4. Document in this section

**Example:**

```yaml
e2e-tests:
  name: E2E Tests (Detox)
  runs-on: ubuntu-latest
  needs: [code-quality, unit-tests] # Only run after basic checks pass
  steps:
    # ... Detox setup and tests
```

---

**Happy Coding! 🚀**

**Tech Stack & Architecture**: See [README.md](../README.md#️-tech-stack) for complete stack details.
