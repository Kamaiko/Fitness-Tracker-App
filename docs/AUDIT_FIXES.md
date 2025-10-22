# 🔧 Corrections Audit Architecture - Development Build

> **Pour**: Patrick (étudiant) + Claude (assistant futur)
> **Date**: 2025-01-11
> **Phase**: 0.5 Bis - Corrections avant Phase 1
> **Temps estimé**: 1 jour de corrections

---

## 📑 Table of Contents

- [⚡ TL;DR - Quick Summary](#tldr---quick-summary)
- [📍 Où en sommes-nous?](#où-en-sommes-nous)
- [Correction #1: User ID Persistence 🔴](#correction-1-user-id-persistence-)
- [Correction #2: Zustand Persist 🔴](#correction-2-zustand-persist-)
- [Correction #3: Error Handling ⚠️](#correction-3-error-handling-️)
- [Amélioration #4: Chart Abstraction 📘](#amélioration-4-chart-abstraction-)
- [🎯 Checklist Finale](#checklist-finale)
- [📝 Pour Claude (Session Future)](#pour-claude-session-future)

---

## ⚡ TL;DR - Quick Summary

**4 corrections à faire APRÈS migration Development Build:**

| #   | Correction          | Impact si non fait                       | Temps | Priorité  |
| --- | ------------------- | ---------------------------------------- | ----- | --------- |
| 1   | User ID Persistence | 🔴 Data loss, RGPD violation             | 2.5h  | CRITICAL  |
| 2   | Zustand Persist     | 🔴 Workout lost on crash                 | 2.5h  | CRITICAL  |
| 3   | Error Handling      | ⚠️ Poor UX, difficult debugging          | 3h    | IMPORTANT |
| 4   | Chart Abstraction   | 📘 3h refactor if changing chart library | 3h    | OPTIONAL  |

**Total Critical:** 8h | **Recommended:** 11h | **Optimal:** 11h

**Corrections #4-#8 de l'audit original sont OBSOLÈTES** - WatermelonDB les résout nativement (Repository pattern, sync conflicts, indexes, domain types).

**→ START HERE:** [Correction #1: User ID Persistence](#correction-1-user-id-persistence-)

---

## 📍 Où en sommes-nous?

### ✅ Ce qui fonctionne bien

- Architecture modulaire claire (bien organisée)
- TypeScript strict (pas d'erreurs)
- Documentation complète (README, TECHNICAL, DATABASE, ARCHITECTURE)
- Migration vers Development Build planifiée
- Barrel exports (imports propres)

### ❌ Ce qui doit être corrigé

**4 problèmes identifiés** par l'audit technique:

- 🔴 **2 CRITIQUES** (doivent être corrigés MAINTENANT)
- ⚠️ **1 IMPORTANTE** (doit être corrigée avant Phase 2)
- 📘 **1 AMÉLIORATION** (peut attendre Phase 3)

**Note**: Les corrections #4, #5, #6, #8 de l'audit original sont **obsolètes** car WatermelonDB résout ces problèmes nativement (Repository pattern, sync conflicts, indexes, domain types).

---

# 🚨 PARTIE 1: CORRECTIONS CRITIQUES

> ⏱️ **Temps total**: 6 heures
> 🎯 **À faire**: Après migration Development Build

---

## Correction #1: User ID Persistence 🔴

### ❌ Le problème (en termes simples)

**Situation actuelle**:

```typescript
// authStore.ts - L'utilisateur est stocké EN MÉMOIRE seulement
const useAuthStore = create<AuthState>((set) => ({
  user: null, // ❌ Perdu quand l'app se ferme!
}));
```

**Analogie**: Imagine que tu écris ton nom sur un tableau blanc. Quand tu fermes l'app, quelqu'un efface le tableau. Au prochain démarrage, l'app ne sait plus qui tu es.

### 💥 Que se passe-t-il si non corrigé?

**Scénario 1: Workout orphelin**

```
1. User se connecte → user_id = "abc123"
2. User log un workout → saved avec user_id "abc123"
3. App redémarre → user = null (oublié!)
4. App essaie de charger workouts → WHERE user_id = null ❌
5. Résultat: Workout perdu, invisible
```

**Scénario 2: Data mélangée (GRAVE)**

```
1. User A login → workout logged
2. App restart → user oublié
3. User B login sur même device
4. Sync se déclenche → workout de User A sync sous compte User B! ❌
5. Résultat: Data corruption, violation RGPD
```

### ✅ Solution (avec MMKV)

**Concept**: On doit sauvegarder le `user_id` dans un endroit **permanent** (MMKV), pas juste en mémoire (Zustand).

#### Étape 1: Créer service de persistence auth (1h)

**Fichier**: `src/services/auth/authPersistence.ts`

```typescript
/**
 * Auth Persistence Service
 *
 * Sauvegarde le user_id dans MMKV (encrypted) pour qu'il survive
 * aux redémarrages de l'app.
 *
 * POURQUOI: Zustand seul = mémoire temporaire
 * QUAND UTILISÉ: À chaque login/logout
 */

import { mmkvStorage } from '@/services/storage';

// Clés de stockage (préfixe pour éviter conflits)
const STORAGE_KEYS = {
  USER_ID: 'auth:user_id',
  USER_EMAIL: 'auth:user_email',
} as const;

/**
 * Sauvegarder l'utilisateur connecté
 * Appelé après login réussi
 */
export function persistUser(userId: string, email: string): void {
  mmkvStorage.set(STORAGE_KEYS.USER_ID, userId);
  mmkvStorage.set(STORAGE_KEYS.USER_EMAIL, email);
}

/**
 * Récupérer l'utilisateur sauvegardé
 * Appelé au démarrage de l'app
 */
export function getPersistedUserId(): string | null {
  return mmkvStorage.get(STORAGE_KEYS.USER_ID);
}

export function getPersistedUserEmail(): string | null {
  return mmkvStorage.get(STORAGE_KEYS.USER_EMAIL);
}

/**
 * Supprimer l'utilisateur sauvegardé
 * Appelé au logout
 */
export function clearPersistedUser(): void {
  mmkvStorage.delete(STORAGE_KEYS.USER_ID);
  mmkvStorage.delete(STORAGE_KEYS.USER_EMAIL);
}
```

**Fichier**: `src/services/auth/index.ts`

```typescript
/**
 * Auth Service - Main Export
 */

export { persistUser, getPersistedUserId, getPersistedUserEmail, clearPersistedUser } from './authPersistence';
```

#### Étape 2: Modifier authStore pour utiliser persistence (1h)

**Fichier**: `src/stores/auth/authStore.ts`

```typescript
/**
 * Authentication Store
 *
 * CHANGEMENT: Maintenant synchronisé avec MMKV
 */

import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import { persistUser, clearPersistedUser } from '@/services/auth';

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
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  // NOUVEAU: Initialiser depuis MMKV
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => {
    // NOUVEAU: Sauvegarder dans MMKV
    if (user) {
      persistUser(user.id, user.email);
    } else {
      clearPersistedUser();
    }

    set({
      user,
      isAuthenticated: user !== null,
      isLoading: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  signOut: async () => {
    await supabase.auth.signOut();
    clearPersistedUser(); // NOUVEAU
    set({ user: null, isAuthenticated: false });
  },

  // NOUVEAU: Charger user depuis MMKV au démarrage
  initializeAuth: () => {
    const { getPersistedUserId, getPersistedUserEmail } = require('@/services/auth');
    const userId = getPersistedUserId();
    const email = getPersistedUserEmail();

    if (userId && email) {
      set({
        user: { id: userId, email },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },
}));
```

#### Étape 3: Appeler initializeAuth au démarrage (30min)

**Fichier**: `src/app/_layout.tsx`

```typescript
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants';
import { database } from '@/services/database/watermelon';
import { useAuthStore } from '@/stores';
import '../../global.css';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialiser DB et Auth en parallèle
    Promise.all([
      database.adapter.setUpSchema(), // WatermelonDB setup
      Promise.resolve(initializeAuth()), // NOUVEAU: Charger user depuis MMKV
    ])
      .then(() => {
        console.log('✅ Database and Auth initialized');
        setDbReady(true);
        setAuthReady(true);
      })
      .catch((error) => {
        console.error('❌ Initialization failed:', error);
        setDbReady(true);
        setAuthReady(true);
      });
  }, [initializeAuth]);

  // Attendre que DB ET Auth soient prêts
  if (!dbReady || !authReady) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background.DEFAULT },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
```

### 🧪 Tests de validation

**À faire après implémentation**:

```typescript
// Test 1: Vérifier persistence user
// Dans console Metro (npm start):

import { persistUser, getPersistedUserId } from './src/services/auth';

// Sauvegarder un user
persistUser('test-123', 'test@example.com');

// Vérifier qu'il est récupéré
const userId = getPersistedUserId();
console.log('User ID:', userId); // Doit afficher: test-123

// Redémarrer l'app (shake device → Reload)
// Revérifier
const userId2 = getPersistedUserId();
console.log('User ID après reload:', userId2); // Doit TOUJOURS afficher: test-123 ✅
```

**Comportements attendus**:

- ✅ User ID survit au redémarrage app
- ✅ User ID est encrypté dans MMKV
- ✅ Performance: lecture <1ms (vs 20-50ms avec AsyncStorage)

---

## Correction #2: Zustand Persist 🔴

### ❌ Le problème

**Situation actuelle**:

```typescript
// workoutStore.ts
isWorkoutActive: boolean; // ❌ Perdu si app crash
workoutStartTime: Date | null; // ❌ Perdu si app ferme
```

**Analogie**: Tu commences un workout, tu log 3 sets, ton téléphone meurt (batterie). Tu le recharges, ouvres l'app → ton workout en cours a disparu. Frustrant!

### 💥 Scénario concret

```
14h00: User démarre workout "Push Day A"
14h05: Log bench press 3 sets
14h10: App crash (bug, mémoire, peu importe)
14h11: User relance app
14h12: isWorkoutActive = false (perdu!)
       currentWorkoutId = null (perdu!)
       User pense n'avoir rien commencé → re-log les mêmes sets → doublons ❌
```

### ✅ Solution (avec MMKV storage)

**Concept**: Zustand peut sauvegarder automatiquement certaines données dans MMKV avec le middleware `persist`.

#### Étape 1: Créer MMKV storage adapter pour Zustand (30min)

**Fichier**: `src/services/storage/zustandStorage.ts`

```typescript
/**
 * MMKV Storage Adapter pour Zustand
 *
 * Permet à Zustand d'utiliser MMKV au lieu d'AsyncStorage
 */

import { StateStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkvStorage';

export const zustandMMKVStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = mmkvStorage.get(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    mmkvStorage.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkvStorage.delete(name);
  },
};
```

**Fichier**: `src/services/storage/index.ts`

```typescript
export { mmkvStorage } from './mmkvStorage';
export { zustandMMKVStorage } from './zustandStorage';
```

#### Étape 2: Ajouter persist à workoutStore (1h)

**Fichier**: `src/stores/workout/workoutStore.ts`

```typescript
/**
 * Workout Store
 *
 * CHANGEMENT: Maintenant persisté dans MMKV
 * Survit aux redémarrages/crashes
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '@/services/storage';

export interface WorkoutState {
  isWorkoutActive: boolean;
  workoutStartTime: Date | null;
  currentWorkoutId: string | null; // NOUVEAU: ID du workout en cours

  // Actions
  startWorkout: (workoutId: string) => void; // MODIFIÉ: Prend workoutId
  endWorkout: () => void;
}

export const useWorkoutStore = create(
  persist<WorkoutState>(
    (set) => ({
      isWorkoutActive: false,
      workoutStartTime: null,
      currentWorkoutId: null,

      startWorkout: (workoutId) =>
        set({
          isWorkoutActive: true,
          workoutStartTime: new Date(),
          currentWorkoutId: workoutId,
        }),

      endWorkout: () =>
        set({
          isWorkoutActive: false,
          workoutStartTime: null,
          currentWorkoutId: null,
        }),
    }),
    {
      name: 'workout-storage', // Nom unique dans MMKV
      storage: createJSONStorage(() => zustandMMKVStorage),

      // IMPORTANT: Ne persister QUE ce dont on a besoin
      partialize: (state) => ({
        isWorkoutActive: state.isWorkoutActive,
        currentWorkoutId: state.currentWorkoutId,
        workoutStartTime: state.workoutStartTime,
      }),
    }
  )
);
```

#### Étape 3: Faire pareil pour authStore (1h)

**Fichier**: `src/stores/auth/authStore.ts` (version complète)

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '@/services/storage';
import { supabase } from '@/services/supabase';
import { persistUser, clearPersistedUser, getPersistedUserId, getPersistedUserEmail } from '@/services/auth';

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => {
        if (user) {
          persistUser(user.id, user.email);
        } else {
          clearPersistedUser();
        }

        set({
          user,
          isAuthenticated: user !== null,
          isLoading: false,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      signOut: async () => {
        await supabase.auth.signOut();
        clearPersistedUser();
        set({ user: null, isAuthenticated: false });
      },

      initializeAuth: () => {
        const userId = getPersistedUserId();
        const email = getPersistedUserEmail();

        if (userId && email) {
          set({
            user: { id: userId, email },
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### 🧪 Tests de validation

```typescript
// Test: Vérifier persistence workout

// 1. Démarrer un workout
const { startWorkout } = useWorkoutStore.getState();
startWorkout('workout-test-123');

// 2. Vérifier état
console.log(useWorkoutStore.getState().isWorkoutActive); // true
console.log(useWorkoutStore.getState().currentWorkoutId); // workout-test-123

// 3. Redémarrer app (shake device → Reload)

// 4. Vérifier que l'état est TOUJOURS là
console.log(useWorkoutStore.getState().isWorkoutActive); // Doit être true ✅
console.log(useWorkoutStore.getState().currentWorkoutId); // Doit être workout-test-123 ✅
```

---

## Correction #3: Error Handling ⚠️

### ❌ Le problème

**Code actuel**:

```typescript
// database/watermelon/workouts.ts
export async function createWorkout(data: CreateWorkout): Promise<Workout> {
  const workout = await database.write(...); // ❌ Pas de try/catch
  return workout; // ❌ Peut throw sans warning!
}
```

**Analogie**: C'est comme conduire sans ceinture de sécurité. 99% du temps ça va, mais le 1% où ça crash, c'est catastrophique.

### 💥 Scénarios problématiques

**Scénario 1: Erreur silencieuse**

```
User clique "Log Set"
→ Database write fails (erreur WatermelonDB)
→ Promise rejette
→ App freeze ou crash
→ User ne sait pas ce qui s'est passé ❌
```

**Scénario 2: Null non géré**

```typescript
const workout = await getWorkoutById(id); // Retourne undefined
workout.exercises.observe(); // ❌ Cannot read property 'exercises' of undefined
→ App crash
```

### ✅ Solution

**Concept**: On va créer des **custom errors** (erreurs personnalisées) et **wrapper** tous les services avec try/catch propres.

#### Étape 1: Créer custom errors (30min)

**Fichier**: `src/utils/errors.ts`

```typescript
/**
 * Custom Error Classes
 *
 * Pourquoi custom errors?
 * - Messages clairs pour debugging
 * - Codes d'erreur pour analytics
 * - Possibilité de traiter différemment selon type
 */

/**
 * Erreur liée à la base de données
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Erreur d'authentification
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Erreur de validation (données invalides)
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Erreur réseau/sync
 */
export class SyncError extends Error {
  constructor(
    message: string,
    public code: string,
    public isOnline: boolean
  ) {
    super(message);
    this.name = 'SyncError';
  }
}
```

**Fichier**: `src/utils/index.ts` (ajouter export)

```typescript
// ... exports existants ...

// Errors
export * from './errors';
```

#### Étape 2: Wrapper database operations (1h)

**Fichier**: `src/services/database/watermelon/workouts.ts` (exemple avec createWorkout)

```typescript
import { DatabaseError, AuthError } from '@/utils/errors';
import { getPersistedUserId } from '@/services/auth';
import { database } from './index';
import { Workout } from '@/models';

/**
 * Créer un nouveau workout
 *
 * @throws {AuthError} Si user pas connecté
 * @throws {DatabaseError} Si erreur WatermelonDB
 */
export async function createWorkout(data: { started_at: number; title?: string }): Promise<Workout> {
  // 1. Valider auth
  const userId = getPersistedUserId();
  if (!userId) {
    throw new AuthError('User must be authenticated to create workout', 'AUTH_REQUIRED');
  }

  // 2. Créer workout avec error handling
  try {
    const workout = await database.write(async () => {
      return await database.collections.get<Workout>('workouts').create((workout) => {
        workout.userId = userId;
        workout.startedAt = new Date(data.started_at * 1000);
        if (data.title) {
          workout.title = data.title;
        }
      });
    });

    return workout;
  } catch (error) {
    throw new DatabaseError(
      `Failed to create workout: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'DB_INSERT_FAILED',
      error
    );
  }
}

/**
 * Récupérer workout par ID
 *
 * @throws {DatabaseError} Si erreur WatermelonDB
 * @returns {Workout | undefined} undefined si workout n'existe pas (pas une erreur)
 */
export async function getWorkoutById(id: string): Promise<Workout | undefined> {
  try {
    const workout = await database.collections.get<Workout>('workouts').find(id);
    return workout;
  } catch (error) {
    // WatermelonDB throw si record n'existe pas
    if (error instanceof Error && error.message.includes('not found')) {
      return undefined;
    }
    throw new DatabaseError(
      `Failed to get workout: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'DB_QUERY_FAILED',
      error
    );
  }
}
```

#### Étape 3: Créer hook d'error handling UI (1h)

**Fichier**: `src/hooks/ui/useErrorHandler.ts`

```typescript
/**
 * Hook pour gérer les erreurs dans les composants UI
 *
 * Usage:
 * const { handleError, error, clearError } = useErrorHandler();
 *
 * try {
 *   await createWorkout(data);
 * } catch (err) {
 *   handleError(err);
 * }
 */

import { useState, useCallback } from 'react';
import { AuthError, DatabaseError, ValidationError, SyncError } from '@/utils/errors';

export interface ErrorState {
  message: string;
  code?: string;
  type: 'auth' | 'database' | 'validation' | 'sync' | 'unknown';
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = useCallback((err: unknown) => {
    console.error('Error caught:', err);

    if (err instanceof AuthError) {
      setError({
        message: err.message,
        code: err.code,
        type: 'auth',
      });
    } else if (err instanceof DatabaseError) {
      setError({
        message: 'Erreur de base de données. Veuillez réessayer.',
        code: err.code,
        type: 'database',
      });
    } else if (err instanceof ValidationError) {
      setError({
        message: err.message,
        type: 'validation',
      });
    } else if (err instanceof SyncError) {
      setError({
        message: err.isOnline ? 'Erreur de synchronisation.' : 'Pas de connexion internet.',
        code: err.code,
        type: 'sync',
      });
    } else {
      setError({
        message: "Une erreur inattendue s'est produite.",
        type: 'unknown',
      });
    }

    // TODO Phase 2: Envoyer à Sentry pour analytics
    // Sentry.captureException(err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}
```

**Fichier**: `src/hooks/ui/index.ts`

```typescript
export * from './useErrorHandler';
```

#### Étape 4: Exemple d'utilisation dans component (30min)

**Exemple**: `src/app/(tabs)/workout.tsx` (futur)

```typescript
import { useErrorHandler } from '@/hooks/ui';
import { createWorkout } from '@/services';

export default function WorkoutScreen() {
  const { error, handleError, clearError } = useErrorHandler();

  const handleStartWorkout = async () => {
    try {
      const workout = await createWorkout({
        started_at: Math.floor(Date.now() / 1000),
        title: 'Push Day A',
      });
      console.log('Workout created:', workout.id);
    } catch (err) {
      handleError(err); // Gère l'erreur proprement
    }
  };

  return (
    <View>
      {error && (
        <View className="bg-danger p-4 rounded">
          <Text className="text-white">{error.message}</Text>
          <Button onPress={clearError}>Fermer</Button>
        </View>
      )}

      <Button onPress={handleStartWorkout}>
        Démarrer Workout
      </Button>
    </View>
  );
}
```

### 🧪 Tests de validation

```typescript
// Test: Vérifier que les erreurs sont bien catchées

// Test 1: Auth required error
try {
  // Déconnecter user d'abord
  useAuthStore.getState().signOut();

  // Essayer créer workout sans être connecté
  await createWorkout({ started_at: Date.now() / 1000 });
} catch (error) {
  console.log(error instanceof AuthError); // Doit être true ✅
  console.log(error.code); // Doit être 'AUTH_REQUIRED' ✅
}

// Test 2: Database error
try {
  // ID invalide
  await getWorkoutById('this-id-does-not-exist');
  // Devrait retourner undefined (pas throw)
  console.log("OK, pas d'erreur pour ID inexistant ✅");
} catch (error) {
  console.log('❌ Ne devrait pas throw pour ID inexistant');
}
```

---

# 📘 PARTIE 2: AMÉLIORATION

> ⏱️ **Temps total**: 3 heures
> 🎯 **À faire**: Optionnel, peut attendre Phase 2-3

---

## Amélioration #4: Chart Abstraction 📘

### ❌ Le problème

**Situation**: On utilisera `Victory Native` dans le Development Build. Pour faciliter les futurs changements, on crée une abstraction.

**Code futur sans abstraction**:

```typescript
import { VictoryLine } from 'victory-native';

<VictoryLine
  data={data}
  // Props spécifiques Victory Native partout
/>
```

**Problème**: Si on change de lib, on doit modifier tous les endroits qui l'utilisent.

### ✅ Solution simple: Wrapper component

**Concept**: On crée NOTRE propre composant `LineChart` qui utilise `Victory Native` en interne. Plus tard, si on change de lib, on change juste l'implémentation interne.

#### Étape 1: Créer abstraction LineChart (2h)

**Fichier**: `src/components/charts/LineChart.tsx`

```typescript
/**
 * Line Chart Component
 *
 * Abstraction pour les line charts avec Victory Native.
 * Interface simple et réutilisable.
 */

import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native';
import { View, Text } from 'react-native';
import { Colors } from '@/constants';

/**
 * Props AGNOSTIQUES de la lib utilisée
 */
interface LineChartProps {
  /** Données à afficher */
  data: number[];

  /** Labels pour l'axe X */
  labels: string[];

  /** Titre optionnel */
  title?: string;

  /** Largeur (défaut: 350) */
  width?: number;

  /** Hauteur (défaut: 220) */
  height?: number;

  /** Courbe lissée (défaut: true) */
  smoothCurve?: boolean;
}

export function LineChart({
  data,
  labels,
  title,
  width = 350,
  height = 220,
  smoothCurve = true,
}: LineChartProps) {
  // Transformer data pour Victory
  const chartData = data.map((y, i) => ({
    x: labels[i],
    y,
  }));

  return (
    <View className="items-center">
      {title && (
        <Text className="text-lg font-semibold text-foreground mb-2">
          {title}
        </Text>
      )}

      <VictoryChart
        width={width}
        height={height}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          style={{
            axis: { stroke: Colors.border.DEFAULT },
            tickLabels: { fill: Colors.foreground.muted },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: Colors.border.DEFAULT },
            tickLabels: { fill: Colors.foreground.muted },
            grid: { stroke: Colors.border.DEFAULT, strokeDasharray: '5,5' },
          }}
        />
        <VictoryLine
          data={chartData}
          interpolation={smoothCurve ? 'natural' : 'linear'}
          style={{
            data: {
              stroke: Colors.primary.DEFAULT,
              strokeWidth: 2,
            },
          }}
        />
      </VictoryChart>
    </View>
  );
}
```

**Fichier**: `src/components/charts/index.ts`

```typescript
export { LineChart } from './LineChart';
// Ajouter BarChart, PieChart, etc. plus tard
```

#### Étape 3: Usage dans l'app (1h)

**Exemple**: `src/app/(tabs)/stats.tsx`

```typescript
import { LineChart } from '@/components/charts';

export default function StatsScreen() {
  // Données mockées pour l'instant
  const weeklyVolume = [12000, 13500, 14200, 13800, 15000, 15500, 16000];
  const weekLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-foreground mb-4">
        Analytics
      </Text>

      {/* Utiliser NOTRE composant, interface simple */}
      <LineChart
        data={weeklyVolume}
        labels={weekLabels}
        title="Volume Hebdomadaire (kg)"
      />
    </View>
  );
}
```

**Bénéfice**: Code simple, réutilisable, maintenable.

---

# 🎯 CHECKLIST FINALE

## 🚨 CRITIQUES (à faire après dev build)

- [ ] **Correction #1**: User ID Persistence (2.5h)
  - [ ] Créer `authPersistence.ts` (MMKV)
  - [ ] Modifier `authStore.ts` avec `initializeAuth()`
  - [ ] Appeler dans `_layout.tsx`
  - [ ] Tests: user survit au restart

- [ ] **Correction #2**: Zustand Persist (2.5h)
  - [ ] Créer `zustandStorage.ts` (MMKV adapter)
  - [ ] Ajouter persist à `workoutStore.ts`
  - [ ] Ajouter persist à `authStore.ts`
  - [ ] Tests: workout actif survit au restart

## ⚠️ IMPORTANTES (avant Phase 2)

- [ ] **Correction #3**: Error Handling (3h)
  - [ ] Créer `utils/errors.ts` (custom errors)
  - [ ] Wrapper `database/watermelon/workouts.ts` avec try/catch
  - [ ] Créer `hooks/ui/useErrorHandler.ts`
  - [ ] Exemple usage dans component
  - [ ] Tests: errors catchées proprement

## 📘 OPTIONNELLES (Phase 2-3)

- [ ] **Amélioration #4**: Chart Abstraction (3h)
  - [ ] Créer `components/charts/LineChart.tsx`
  - [ ] Utiliser dans `stats.tsx`
  - [ ] Tests: chart s'affiche

---

# 📝 POUR CLAUDE (Session Future)

## Corrections obsolètes (WatermelonDB résout)

Les corrections suivantes de l'audit original sont **obsolètes** car WatermelonDB les résout nativement:

- ❌ **Repository Pattern** → WatermelonDB a Models + Collections
- ❌ **Sync Conflict Detection** → WatermelonDB sync protocol inclus
- ❌ **Database Indexes** → Définis dans schema WatermelonDB
- ❌ **Domain vs Database Types** → Models WatermelonDB sont domain types

## Comment utiliser ce document

**Contexte**: Vous êtes Claude (assistant IA) et Patrick vous demande d'implémenter les corrections. Voici comment procéder:

### Commande générique

```
Patrick dit: "Claude, implémente la Correction #X selon AUDIT_FIXES.md"

Vous devez:
1. Lire la section "Correction #X" ci-dessus
2. Suivre les étapes dans l'ordre (Étape 1, 2, 3...)
3. Copier le code EXACTEMENT comme écrit (c'est du code fonctionnel)
4. Après chaque fichier créé/modifié:
   - Dire "✅ Créé [nom_fichier]" ou "✅ Modifié [nom_fichier]"
5. À la fin, lancer les tests de validation
6. Confirmer si tout passe ✅ ou liste des erreurs ❌
```

### Validation après correction

**Après chaque correction**, lancer:

```bash
# Type check
npm run type-check

# Si correction touche DB: tester en console
npm start
# Puis dans console Metro, copier-coller les tests de validation
```

### Ordre recommandé d'implémentation

**Après Dev Build Migration** (6h total):

1. Correction #1 (User Persistence) - 2.5h
2. Correction #2 (Zustand Persist) - 2.5h
3. Correction #3 (Error Handling) - 3h

**Optionnel** (Phase 2-3, 3h): 4. Amélioration #4 (Charts) - 3h

---

## 🎯 Résumé pour Patrick

**Qu'avons-nous identifié?**

- 2 problèmes CRITIQUES qui peuvent causer perte de données
- 1 problème IMPORTANT pour error handling
- 1 amélioration OPTIONNELLE pour code plus propre

**Combien de temps?**

- Minimum vital: 5-6 heures (Corrections 1-2)
- Recommandé: 8-9 heures (Corrections 1-3)
- Parfait: 11-12 heures (tout)

**Changements par rapport à l'audit original?**

- ✅ 4 corrections supprimées (WatermelonDB les résout)
- ✅ Adaptées pour MMKV au lieu de AsyncStorage
- ✅ Simplifiées pour WatermelonDB au lieu de expo-sqlite

**Dois-je vraiment tout faire?**

- **OUI pour Corrections 1-2** (sinon data loss production)
- **OUI pour Correction #3** (sinon debugging difficile)
- **NON pour Amélioration #4** (nice to have, pas bloquant)

**Next step après dev build**:

1. Ouvrir nouvelle session Claude
2. Dire: "Claude, implémente la Correction #1 selon AUDIT_FIXES.md"
3. Laisser Claude travailler
4. Valider que ça marche avec les tests
5. Répéter pour Corrections #2, #3

**Courage!** Ces corrections vont rendre ton architecture ROCK SOLID. 💪
