# 🏗️ Technical Documentation

**Last Updated:** October 2025
**Version:** 0.1.0

---

## 🎯 Architecture Overview

### Philosophy
- **Mobile-First:** Optimized for mobile experience
- **Offline-First:** Works without internet connection
- **Performance-First:** <2s cold start, 60fps animations
- **Type-Safe:** TypeScript strict mode throughout
- **Simple & Pragmatic:** Choose simplicity over complexity

---

## 📦 Technology Stack

### Frontend
```typescript
{
  framework: "React Native 0.81.4",
  runtime: "Expo SDK 54.0.12",
  language: "TypeScript 5.9 (strict mode)",
  navigation: "Expo Router 6.0.10",
  stateManagement: {
    global: "Zustand 5.0.8",
    server: "React Query 5.90.2"
  },
  styling: "React Native StyleSheet (native)",
  storage: "MMKV 3.3.3 (encrypted)",
  charts: "react-native-chart-kit 6.12.0"
}
```

### Backend
```typescript
{
  platform: "Supabase",
  database: "PostgreSQL (Supabase-managed)",
  auth: "Supabase Auth (JWT + RLS)",
  storage: "Supabase Storage",
  realtime: "Supabase Realtime (WebSockets)"
}
```

### Development Tools
```typescript
{
  bundler: "Metro (Expo-optimized)",
  linting: "None (removed for MVP)",
  testing: "None (MVP - will add later)",
  cicd: "None (MVP - will add later)"
}
```

---

## 🏛️ Architecture Decisions (ADRs)

### ADR-001: Expo SDK 54 over Bare React Native
**Decision:** Use Expo managed workflow
**Rationale:**
- Faster development (no native code configuration)
- Built-in tools (Expo Go, EAS Build)
- Easier updates and maintenance
- Perfect for MVP

**Consequences:**
- ✅ Faster iteration
- ✅ Less complexity
- ❌ Limited to Expo-compatible libraries
- ❌ Slightly larger bundle size

**Status:** ✅ Implemented

---

### ADR-002: Zustand over Redux for State Management
**Decision:** Use Zustand for global state
**Rationale:**
- Simpler API (less boilerplate)
- Better TypeScript support out of the box
- Smaller bundle size (~1KB vs ~20KB)
- Sufficient for MVP scope

**Consequences:**
- ✅ Less code to maintain
- ✅ Easier to learn
- ❌ Smaller ecosystem than Redux
- ❌ Less middleware options

**Status:** ✅ Implemented

---

### ADR-003: React Query for Server State
**Decision:** Use React Query (@tanstack/react-query) for server state
**Rationale:**
- Automatic caching and revalidation
- Built-in loading/error states
- Optimistic updates
- Separate server state from client state

**Consequences:**
- ✅ Less manual caching logic
- ✅ Better UX (background refetching)
- ❌ Learning curve
- ❌ Added dependency

**Status:** ✅ Installed (not yet used)

---

### ADR-004: MMKV over AsyncStorage
**Decision:** Use react-native-mmkv instead of AsyncStorage
**Rationale:**
- 10-30x faster than AsyncStorage
- Synchronous API (no await needed)
- Built-in encryption
- Smaller bundle size

**Consequences:**
- ✅ Better performance
- ✅ Simpler code (no async)
- ✅ Secure by default
- ❌ iOS-style API

**Status:** ✅ Implemented

---

### ADR-005: StyleSheet Native over NativeWind
**Decision:** Use React Native StyleSheet for MVP
**Rationale:**
- No additional dependencies
- Simpler setup
- Better IDE support
- Sufficient for MVP

**Consequences:**
- ✅ Zero config
- ✅ Type-safe with TypeScript
- ❌ More verbose than Tailwind
- ❌ No utility classes

**Future:** May add NativeWind post-MVP

**Status:** ✅ Implemented

---

### ADR-006: No Path Aliases (@/) for MVP
**Decision:** Use relative imports instead of path aliases
**Rationale:**
- Path aliases require babel-plugin-module-resolver
- Want to keep Babel config minimal
- Relative imports work without configuration

**Consequences:**
- ✅ Simpler Babel config
- ✅ No plugin dependencies
- ❌ Longer import paths
- ❌ Less maintainable

**Future:** Add module-resolver plugin when codebase grows

**Status:** ✅ Implemented

---

### ADR-007: No Testing Infrastructure for MVP
**Decision:** Skip Jest/Detox setup initially
**Rationale:**
- Faster MVP delivery
- Manual testing sufficient for beta
- Can add comprehensive tests later

**Consequences:**
- ✅ Faster iteration
- ✅ Less setup complexity
- ❌ Higher risk of regressions
- ❌ Manual testing burden

**Future:** Add Jest + Detox before production launch

**Status:** ✅ Decided

---

### ADR-008: Supabase over Custom Backend
**Decision:** Use Supabase as BaaS
**Rationale:**
- No backend code to maintain
- Built-in auth, database, storage
- Row Level Security out of the box
- Real-time subscriptions included
- Free tier sufficient for MVP

**Consequences:**
- ✅ Faster development
- ✅ Less code to maintain
- ✅ Built-in features
- ❌ Vendor lock-in
- ❌ Less control

**Status:** ✅ Implemented

---

## 📁 Project Structure

### Current Structure (v0.1.0)

```
src/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout (StatusBar + Stack)
│   ├── index.tsx                 # Home screen (minimal)
│   └── +not-found.tsx            # 404 error screen
│
├── services/                     # External services
│   ├── supabase/
│   │   └── client.ts             # Supabase client
│   └── storage/
│       └── mmkv.ts               # MMKV wrapper
│
├── stores/                       # Zustand stores
│   ├── authStore.ts              # Auth state
│   └── workoutStore.ts           # Workout state
│
└── theme/                        # Design system
    ├── index.ts                  # Re-exports
    ├── colors.ts                 # Dark theme palette
    ├── spacing.ts                # 8px grid
    └── typography.ts             # Modular scale
```

### Future Structure (Post-MVP)
```
src/
├── app/
│   ├── (tabs)/                   # Tab navigation
│   ├── (auth)/                   # Auth screens
│   └── (modals)/                 # Modals
│
├── components/                   # Reusable components
│   ├── ui/                       # Base UI (Button, Input, Card)
│   ├── workout/                  # Workout components
│   └── analytics/                # Analytics components
│
├── hooks/                        # Custom hooks
├── utils/                        # Utilities
└── types/                        # TypeScript types
```

### Naming Conventions
- **Files:** PascalCase for components (`Button.tsx`), camelCase for utilities (`validation.ts`)
- **Components:** PascalCase (`HomeScreen`, `SetLogger`)
- **Functions:** camelCase (`calculateVolume`, `formatWeight`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RPE`, `DEFAULT_TIMER`)
- **Types/Interfaces:** PascalCase (`User`, `WorkoutSession`)

---

## 🎨 Design System

### Color Palette (Dark Theme)
```typescript
{
  // Backgrounds
  background: '#0A0A0A',        // Deep black
  surface: '#1A1A1A',           // Cards
  surfaceElevated: '#2A2A2A',   // Elevated cards

  // Brand
  primary: '#4299e1',           // Brand blue
  primaryDark: '#2b6cb0',       // Pressed state
  primaryLight: '#63b3ed',      // Highlights

  // Status
  success: '#38a169',           // Green
  warning: '#d69e2e',           // Amber
  danger: '#e53e3e',            // Red
  info: '#3182ce',              // Blue

  // Text
  text: '#e2e8f0',              // Primary text
  textSecondary: '#a0aec0',     // Secondary text
  textTertiary: '#718096'       // Tertiary text
}
```

### Spacing System (8px Grid)
```typescript
{
  xs: 4,    // 0.5 units
  sm: 8,    // 1 unit
  md: 16,   // 2 units
  lg: 24,   // 3 units
  xl: 32,   // 4 units
  xxl: 48,  // 6 units
  xxxl: 64  // 8 units
}
```

### Typography Scale (1.25 Modular Scale)
```typescript
{
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xxxxl: 36
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  }
}
```

---

## 🗄️ Database Schema

### Planned Tables (Not Yet Created)

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  profile_data JSONB
);
```

#### workouts
```sql
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  notes TEXT,
  duration INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### exercise_sets
```sql
CREATE TABLE exercise_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id),
  exercise_id UUID REFERENCES exercises(id),
  weight DECIMAL,
  reps INTEGER,
  rpe INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### exercises
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  muscle_groups TEXT[],
  equipment TEXT,
  instructions TEXT,
  difficulty TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Users can only see their own data
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own workouts"
  ON workouts FOR SELECT
  USING (auth.uid() = user_id);

-- Exercises are public
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercises are public"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);
```

---

## 🔐 Security

### Authentication
- JWT tokens managed by Supabase Auth
- Tokens stored in MMKV (encrypted)
- Auto-refresh handled by Supabase client
- Session persistence across app restarts

### Data Protection
- Row Level Security on all user tables
- MMKV encryption for local storage
- HTTPS for all API calls
- No sensitive data in logs

### Best Practices
- Never store passwords locally
- Use environment variables for secrets
- Validate all user inputs
- Sanitize data before database insertion

---

## ⚡ Performance Guidelines

### Bundle Size
- Target: <10MB initial bundle
- Use code splitting for large features
- Lazy load heavy components
- Remove unused dependencies

### Cold Start
- Target: <2 seconds
- Minimize initial renders
- Defer non-critical operations
- Use skeleton screens

### Runtime
- Target: 60fps animations
- Use FlatList for long lists
- Avoid inline functions in render
- Memoize expensive calculations
- Use React.memo for expensive components

---

## 📋 Coding Standards

### TypeScript
- **Always** use strict mode
- **Always** define return types for functions
- **Prefer** interfaces over types
- **Avoid** `any` type
- **Use** explicit null checks

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
}

function getUser(id: string): User | null {
  // ...
}

// ❌ Bad
function getUser(id: any) {
  // ...
}
```

### React Components
- **Use** functional components
- **Use** TypeScript props interfaces
- **Prefer** named exports
- **Keep** components small (<200 lines)

```typescript
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  // ...
}

// ❌ Bad
export default function Button(props: any) {
  // ...
}
```

### Styling
- **Use** StyleSheet.create()
- **Keep** styles close to component
- **Use** theme values (from src/theme)
- **Avoid** inline styles

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

---

## 🔧 Development Workflow

### Git Commit Conventions
Follow conventions in `.claude/CLAUDE.md`:
```
<type>(<scope>): <description>

Examples:
feat(workout): add RPE tracking to set logger
fix(analytics): correct volume calculation
docs(readme): update installation instructions
```

### Branch Strategy
- `master` - production-ready code
- `feature/*` - new features
- `fix/*` - bug fixes
- `docs/*` - documentation

### Code Review Checklist
- [ ] TypeScript compiles without errors
- [ ] No console.log statements
- [ ] Follows coding standards
- [ ] Uses theme values
- [ ] Proper error handling
- [ ] Commit message follows convention

---

## 🚀 Deployment

### Current
- **Development:** Expo Go app (scan QR code)
- **Build:** None (using Expo Go for development)

### Future
- **Android:** EAS Build → Google Play (internal testing)
- **iOS:** EAS Build → TestFlight
- **Production:** Play Store + App Store

---

## 📚 Resources

### Documentation
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [React Query Docs](https://tanstack.com/query/latest)

### Useful Tools
- [React Native Directory](https://reactnative.directory/)
- [Can I Use React Native](https://caniusenative.com/)
- [Expo Snack](https://snack.expo.dev/)

---

**Last Updated:** October 2025
