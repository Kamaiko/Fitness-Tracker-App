# 📁 Project Structure - Halterofit

**Last Updated:** October 2025
**Status:** Initial SDK 54 Setup

---

## 📂 Root Directory

### Essential Configuration Files
```
app.config.ts       # Expo configuration (simplified for MVP)
app.json            # Expo app manifest (generated from app.config.ts)
babel.config.js     # Babel configuration (minimal, no plugins)
package.json        # Dependencies and scripts
tsconfig.json       # TypeScript config (strict mode + path aliases)
.env                # Environment variables (gitignored)
.env.example        # Template for environment variables
```

### System Files
```
.gitignore          # Files ignored by Git
.git/               # Git repository
.claude/            # Claude Code configuration
```

### Main Directories
```
src/                # Source code
assets/             # Static resources (images, icons)
docs/               # Technical documentation
node_modules/       # Dependencies (gitignored)
```

---

## 🏗️ Source Directory (`src/`)

### Current Structure (v0.1.0)

```
src/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout (StatusBar + Stack navigation)
│   └── index.tsx                 # Home screen (minimal, no theme imports)
│
├── services/                     # External services
│   ├── supabase/
│   │   └── client.ts             # Supabase client configuration
│   └── storage/
│       └── mmkv.ts               # MMKV storage wrapper with helpers
│
├── stores/                       # Zustand state management
│   ├── authStore.ts              # Authentication state (user, loading, signOut)
│   └── workoutStore.ts           # Workout session state (active, startTime)
│
├── theme/                        # Design system
│   ├── index.ts                  # Re-exports all theme modules
│   ├── colors.ts                 # Dark theme color palette
│   ├── spacing.ts                # 8px grid system (4, 8, 16, 24, 32, 48, 64)
│   └── typography.ts             # Modular scale typography (1.25 ratio)
│
├── lib/                          # Business logic & utilities (from old project)
│   ├── calculations/
│   │   ├── oneRepMax.ts
│   │   ├── volume.ts
│   │   └── rpe.ts
│   └── validators/
│
├── constants/                    # App constants (from old project)
│   └── colors.ts                 # Old color definitions
│
└── types/                        # TypeScript type definitions
    └── index.ts                  # Shared types
```

---

## 📋 File-by-File Breakdown

### App Structure (`src/app/`)

#### `_layout.tsx`
```typescript
// Root layout - entry point for Expo Router
// - StatusBar (light style)
// - Stack navigation
// - Dark background (#0A0A0A)
// - No providers currently (React Query removed for MVP)
```

#### `index.tsx`
```typescript
// Home screen - minimal working version
// - Dark theme background
// - Centered title and version
// - No imports from theme/ or stores/ (hardcoded values)
```

### Services (`src/services/`)

#### `supabase/client.ts`
```typescript
// Supabase client initialization
// - Reads from EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
// - Configured with auth settings (autoRefreshToken, persistSession)
// - Throws error if credentials missing
```

#### `storage/mmkv.ts`
```typescript
// MMKV storage wrapper
// - Encrypted storage instance
// - Helper functions: setJSON, getJSON, clearAll, delete
// - Used for local data persistence
```

### State Management (`src/stores/`)

#### `authStore.ts`
```typescript
// Authentication state (Zustand)
// State: user, isLoading, isAuthenticated
// Actions: setUser, setLoading, signOut
// Connected to Supabase auth
```

#### `workoutStore.ts`
```typescript
// Workout session state (Zustand)
// State: isWorkoutActive, workoutStartTime
// Actions: startWorkout, endWorkout
```

### Theme System (`src/theme/`)

#### `colors.ts`
```typescript
// Dark theme color palette
// - Background colors (#0A0A0A, #1A1A1A, #2A2A2A)
// - Primary blue (#4299e1)
// - Status colors (success, warning, danger, info)
// - Text colors (primary, secondary, tertiary)
// - RPE colors (low, medium, high, max)
```

#### `spacing.ts`
```typescript
// 8px grid system
// xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64
```

#### `typography.ts`
```typescript
// Modular scale (1.25 ratio)
// Sizes: xs (12px) to xxxxl (36px)
// Weights: regular (400), medium (500), semibold (600), bold (700)
// Line heights: tight (1.2), normal (1.5), relaxed (1.75)
```

---

## 🚨 Important Notes

### TypeScript Path Aliases
- **Configured but NOT working:** `@/*` aliases defined in `tsconfig.json`
- **Problem:** Requires `babel-plugin-module-resolver` which we removed
- **Current solution:** Use relative imports (`../services/supabase/client`)
- **Future:** Add module-resolver plugin when needed

### Files Removed During Cleanup
- ❌ `App.tsx` - Expo template default (not used with Expo Router)
- ❌ `index.ts` - Template entry point (not used)
- ❌ `SETUP_PROGRESS.md` - Temporary tracking file
- ❌ `src/app/(tabs)/` - Old navigation structure (5 screens)
- ❌ `src/app/(auth)/` - Old auth screens (login, register)
- ❌ `src/app/(modals)/` - Empty directory

### Configuration Changes
- **babel.config.js:** Removed all plugins (reanimated, nativewind, module-resolver, dotenv)
- **app.config.ts:** Simplified, removed all non-essential plugins and assets
- **tsconfig.json:** Kept strict mode and path aliases (for future use)

---

## 📦 Dependencies

### Production
```json
{
  "@supabase/supabase-js": "^2.58.0",
  "@tanstack/react-query": "^5.90.2",
  "expo": "~54.0.12",
  "expo-image-manipulator": "^14.0.7",
  "expo-linking": "^8.0.8",
  "expo-router": "^6.0.10",
  "expo-status-bar": "~3.0.8",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "react-native-chart-kit": "^6.12.0",
  "react-native-gesture-handler": "^2.28.0",
  "react-native-mmkv": "^3.3.3",
  "react-native-safe-area-context": "^5.6.1",
  "react-native-screens": "^4.16.0",
  "react-native-svg": "^15.13.0",
  "zustand": "^5.0.8"
}
```

### Development
```json
{
  "@types/react": "~19.1.0",
  "babel-preset-expo": "^54.0.3",
  "typescript": "~5.9.2"
}
```

---

## 🎯 Future Structure (Post-MVP)

### Planned Additions
```
src/
├── app/
│   ├── (tabs)/              # Tab navigation (workout, exercises, analytics)
│   ├── (auth)/              # Authentication flow
│   └── (modals)/            # Modal screens
│
├── components/              # Reusable UI components
│   ├── ui/                  # Basic UI elements (Button, Input, Card)
│   ├── workout/             # Workout-specific components
│   └── analytics/           # Chart and stats components
│
├── hooks/                   # Custom React hooks
│   ├── useWorkout.ts
│   ├── useExercises.ts
│   └── useAnalytics.ts
│
└── utils/                   # Utility functions
    ├── date.ts
    ├── format.ts
    └── validation.ts
```

### Not Needed Yet (Postponed)
- Testing infrastructure (Jest, Detox)
- NativeWind/Tailwind setup
- Victory Native charts (using react-native-chart-kit for now)
- Advanced Babel plugins
- EAS Build configuration

---

## 📝 Maintenance Guidelines

1. **Keep it minimal:** Only add files/folders when actually needed
2. **Document changes:** Update this file when structure changes
3. **Relative imports:** Until module-resolver is added, use `../` imports
4. **Theme usage:** Import from `src/theme` when creating new components
5. **Store creation:** Follow existing patterns in `src/stores/`

---

Last updated: October 2025 (SDK 54 migration)
