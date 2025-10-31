# Architecture - Halterofit

---

## Table of Contents

- [📐 Overview](#overview)
- [📂 Detailed Structure](#detailed-structure)
  - [1. `/app` - Navigation (Expo Router)](#1-app---navigation-expo-router)
  - [2. `/components` - UI Components](#2-components---ui-components)
  - [3. `/hooks` - Custom React Hooks](#3-hooks---custom-react-hooks)
  - [4. `/services` - Business Logic](#4-services---business-logic)
  - [5. `/stores` - Global State (Zustand)](#5-stores---global-state-zustand)
  - [6. `/types` - TypeScript Definitions](#6-types---typescript-definitions)
  - [7. `/utils` - Pure Utility Functions](#7-utils---pure-utility-functions)
  - [8. `/constants` - App-wide Constants](#8-constants---app-wide-constants)
- [🔄 Data Flow](#data-flow)
- [📦 Import Patterns](#import-patterns)
- [🧪 Testing Strategy (Future)](#testing-strategy-future)
- [🚀 Post-MVP Performance Optimizations](#post-mvp-performance-optimizations)
- [📚 References](#references)
- [✅ Architecture Checklist](#architecture-checklist)

---

## Overview

Halterofit uses a **scalable modular architecture** inspired by React Native/Expo best practices:

```
src/
├── app/              # Navigation & Screens (Expo Router)
├── components/       # UI Components (Feature-organized)
├── hooks/            # Custom React Hooks
├── services/         # Business Logic & External Services
├── stores/           # Global State (Zustand)
├── types/            # TypeScript Definitions
├── utils/            # Pure Utility Functions
└── constants/        # App-wide Constants
```

### Architectural Principles

1. **Separation of Concerns**: Each layer has a clear responsibility
2. **Feature Organization**: Components/hooks organized by feature
3. **Colocation**: Types colocated with their implementation
4. **Barrel Exports**: index.ts for clean imports
5. **Type Safety**: TypeScript strict mode everywhere

---

## Detailed Structure

### 1. `/app` - Navigation (Expo Router)

**Purpose**: File-based routing, screens, layouts

```
app/
├── (tabs)/           # Tab navigation group
│   ├── index.tsx     # Home screen
│   ├── workout.tsx   # Workout screen
│   ├── stats.tsx     # Analytics screen
│   ├── settings.tsx  # Settings screen
│   └── _layout.tsx   # Tab bar configuration
├── index.tsx         # Root redirect
└── _layout.tsx       # Global layout + DB init
```

**Conventions**:

- Screens suffixed with `.tsx`
- Layouts named `_layout.tsx`
- Use `(groups)` for route organization without URL segments
- Keep screens thin, delegate logic to hooks/services

---

### 2. `/components` - UI Components

**Purpose**: Reusable React components organized by feature

```
components/
├── workout/          # Workout-specific components
│   ├── SetLogger.tsx
│   ├── ExerciseCard.tsx
│   └── RestTimer.tsx
├── analytics/        # Charts & stats components
│   └── ProgressChart.tsx
├── ui/               # Generic UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── forms/            # Form components
│   └── LoginForm.tsx
├── navigation/       # Navigation components
│   └── TabBar.tsx
└── shared/           # Shared across features
    └── LoadingSpinner.tsx
```

**Conventions**:

- PascalCase file names
- Export named components: `export function Button() {}`
- Include types in same file for small components
- Create `index.ts` for barrel exports when >3 components
- Use NativeWind (Tailwind) for styling

**Example**:

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onPress, children, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-lg ${variant === 'primary' ? 'bg-primary' : 'bg-secondary'}`}
    >
      <Text className="text-foreground font-semibold">{children}</Text>
    </Pressable>
  );
}
```

---

### 3. `/hooks` - Custom React Hooks

**Purpose**: Reusable stateful logic

```
hooks/
├── workout/
│   ├── useActiveWorkout.ts
│   ├── useSetLogger.ts
│   └── index.ts
├── analytics/
│   ├── useWorkoutStats.ts
│   └── index.ts
├── auth/
│   ├── useAuth.ts
│   └── index.ts
└── ui/
    ├── useTheme.ts
    └── index.ts
```

**Conventions**:

- Prefix with `use`: `useActiveWorkout()`
- Return objects, not arrays: `{ workout, isLoading, error }`
- Encapsulate complex state logic
- Can use stores, services, other hooks

**Example**:

```tsx
// hooks/workout/useActiveWorkout.ts
import { useWorkoutStore } from '@/stores';
import { createWorkout, completeWorkout } from '@/services';

export function useActiveWorkout() {
  const { isWorkoutActive, workoutStartTime } = useWorkoutStore();

  const startWorkout = async () => {
    const workout = await createWorkout({
      user_id: 'user-123',
      started_at: Date.now() / 1000,
    });
    useWorkoutStore.getState().startWorkout();
    return workout;
  };

  return {
    isActive: isWorkoutActive,
    startTime: workoutStartTime,
    startWorkout,
  };
}
```

---

### 4. `/services` - Business Logic Layer

**Purpose**: External services, API calls, database operations

```
services/
├── database/         # WatermelonDB database
│   └── watermelon/   # WatermelonDB setup
│       ├── schema.ts # Database schema
│       ├── sync.ts   # Supabase sync protocol
│       ├── index.ts  # Database instance
│       └── __tests__/# Usage examples
├── supabase/         # Supabase client
│   ├── client.ts
│   └── index.ts
├── storage/          # MMKV encrypted storage
│   ├── mmkvStorage.ts
│   └── index.ts
├── api/              # External APIs (ExerciseDB)
├── analytics/        # Analytics calculations
└── notifications/    # Push notifications
```

**Conventions**:

- Pure functions when possible
- Return Promises for async operations
- Throw descriptive errors
- **Colocation**: Types defined in same module (`database/types.ts`)
- Use `@/services` barrel export for common imports

**Example**:

```typescript
// services/database/watermelon/workouts.ts
import { database } from './index';
import { Workout } from '@/models';
import type { CreateWorkout } from './types';

export async function createWorkout(data: CreateWorkout): Promise<Workout> {
  const workout = await database.write(async () => {
    return await database.collections.get<Workout>('workouts').create((workout) => {
      workout.userId = data.user_id;
      workout.startedAt = data.started_at;
    });
  });

  return workout;
}
```

---

### 5. `/stores` - Global State (Zustand)

**Purpose**: Application-wide state management

```
stores/
├── auth/
│   ├── authStore.ts
│   └── index.ts
├── workout/
│   ├── workoutStore.ts
│   └── index.ts
├── analytics/
│   └── analyticsStore.ts
├── settings/
│   └── settingsStore.ts
└── index.ts          # Barrel exports all stores
```

**Conventions**:

- Use Zustand for global state
- Export both hook and types: `export { useAuthStore } from './authStore'`
- Keep stores focused (single responsibility)
- **Persistence strategy**:
  - ✅ Simple state → Zustand `persist()` middleware (auth session, preferences)
  - ✅ Cross-service validation → Use `useAuthStore.getState().user?.id` directly
  - ❌ Complex/relational data → Use service layer (WatermelonDB operations)

**Example**:

```typescript
// stores/auth/authStore.ts
import { create } from 'zustand';
import { supabase } from '@/services/supabase';

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
      isLoading: false,
    }),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
```

---

### 6. `/types` - TypeScript Types

**Purpose**: Shared type definitions (NOT colocated)

```
types/
├── api/              # External API types
│   └── exerciseDB.ts
├── user/             # User-related types
│   └── profile.ts
├── workout/          # Workout templates, programs
│   └── templates.ts
└── index.ts          # Barrel exports
```

**Convention: Type Colocation vs Shared Types**

✅ **Colocate types** when:

- Types are ONLY used within one module
- Example: `database/types.ts` (only used by database service)

❌ **Shared types folder** when:

- Types used across multiple modules
- Public API contracts
- External service types

---

### 7. `/utils` - Pure Utility Functions

**Purpose**: Pure functions, no side effects

```
utils/
├── calculations/     # 1RM, volume, plate calculator
│   ├── oneRepMax.ts
│   └── index.ts
├── formatters/       # Date, weight, duration formatting
│   ├── weight.ts
│   └── index.ts
├── validators/       # Input validation
│   ├── email.ts
│   └── index.ts
└── index.ts          # Barrel exports
```

**Conventions**:

- Pure functions only (same input = same output)
- No state, no side effects
- Export named functions: `export function formatWeight() {}`
- Include unit tests

**Example**:

```typescript
// utils/calculations/oneRepMax.ts
/**
 * Calculate 1RM using Epley formula
 * 1RM = weight × (1 + reps/30)
 */
export function calculateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}
```

---

### 8. `/constants` - App Constants

**Purpose**: Configuration values, colors, sizes

```
constants/
├── colors.ts         # Color palette (must match Tailwind)
├── sizes.ts          # Spacing, font sizes
└── index.ts          # Barrel exports
```

**Conventions**:

- Use PascalCase for constants: `Colors`, `Sizes`
- Colors MUST match `tailwind.config.js`
- Export as `const` objects

---

## Data Flow

### 1. User Action Flow

```
UI Component → Hook → Service → Database/API
     ↓           ↓        ↓          ↓
   Props    State Logic  CRUD    SQLite/Supabase
```

**Example: Logging a Set**

```typescript
// 1. UI Component
<Button onPress={handleLogSet}>Log Set</Button>

// 2. Hook
const { logSet } = useSetLogger(workoutExerciseId);
const handleLogSet = () => logSet({ weight: 100, reps: 8 });

// 3. Service
async function logSet(data) {
  await database.logSet(workoutExerciseId, setNumber, data);
  autoSync(); // Background sync
}

// 4. Database
INSERT INTO exercise_sets (weight, reps, ...) VALUES (?, ?, ...);
```

---

### 2. State Management Layers

```
┌─────────────────────────────────────────┐
│  UI State (React State)                 │  ← Ephemeral
│  - Form inputs, UI toggles             │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  Global State (Zustand)                 │  ← In-memory
│  - Auth user, active workout           │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  Local Database (WatermelonDB)          │  ← Persistent
│  - Workouts, exercises, sets           │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  Cloud Sync (Supabase)                  │  ← Backup/Sync
│  - Background sync, multi-device       │
└─────────────────────────────────────────┘
```

**When to use each layer:**

- **React State**: Component-specific UI (modals, dropdowns)
- **Zustand**: Cross-component state (auth, active workout)
- **WatermelonDB**: Persisted data (all workouts, exercises)
- **Supabase**: Cloud backup & multi-device sync

---

## Import Patterns

### Barrel Exports (index.ts)

**Why?** Clean, maintainable imports

```typescript
// ❌ BAD: Deep imports, brittle
import { useAuthStore } from '@/stores/auth/authStore';
import { useWorkoutStore } from '@/stores/workout/workoutStore';
import { createWorkout } from '@/services/database/workouts';
import { supabase } from '@/services/supabase/client';

// ✅ GOOD: Barrel exports, clean
import { useAuthStore, useWorkoutStore } from '@/stores';
import { createWorkout, supabase } from '@/services';
```

### Absolute Imports

**Always use `@/` alias** (configured in `tsconfig.json`):

```typescript
// ❌ BAD: Relative imports
import { Colors } from '../../../constants/colors';

// ✅ GOOD: Absolute imports
import { Colors } from '@/constants';
```

---

## Testing Strategy (Future)

```
src/
├── __tests__/        # Integration tests
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Button.test.tsx    # Component tests
└── services/
    └── database/
        └── __tests__/
            └── workouts.test.ts  # Unit tests
```

**Test Layers**:

- **Unit Tests**: `utils/`, `services/` (pure functions)
- **Component Tests**: `components/` (React Testing Library)
- **Integration Tests**: E2E flows (Detox - Post-MVP)

---

## Post-MVP Performance Optimizations

**Planned optimizations** (Phase 5+):

- Code splitting & lazy loading
- Image optimization & caching
- Memoization strategies
- Bundle size analysis

**See:** [TECHNICAL.md § Performance Guidelines](./TECHNICAL.md#-performance-guidelines) for details.
