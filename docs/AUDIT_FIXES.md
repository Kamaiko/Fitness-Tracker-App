# 🔧 Corrections Audit Architecture - Guide Complet

> **Pour**: Patrick (étudiant) + Claude (assistant futur)
> **Date**: 2025-01-11
> **Phase**: 0.5 - Corrections avant Phase 1
> **Temps estimé**: 2-3 jours de corrections

---

## 📍 Où en sommes-nous?

### ✅ Ce qui fonctionne bien
- Architecture modulaire claire (bien organisée)
- TypeScript strict (pas d'erreurs)
- Documentation complète (README, TECHNICAL, DATABASE, ARCHITECTURE)
- Base de données SQLite fonctionnelle
- Barrel exports (imports propres)

### ❌ Ce qui doit être corrigé
**8 problèmes identifiés** par l'audit technique:
- 🔴 **3 CRITIQUES** (doivent être corrigés MAINTENANT)
- ⚠️ **3 IMPORTANTES** (doivent être corrigés avant Phase 2)
- 📘 **2 AMÉLIORATIONS** (peuvent attendre Phase 3)

---

# 🚨 PARTIE 1: CORRECTIONS CRITIQUES

> ⏱️ **Temps total**: 9 heures (1 journée)
> 🎯 **À faire**: Demain, avant toute nouvelle feature

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

### ✅ Solution

**Concept**: On doit sauvegarder le `user_id` dans un endroit **permanent** (AsyncStorage), pas juste en mémoire (Zustand).

#### Étape 1: Créer service de persistence auth (1h)

**Fichier**: `src/services/auth/authPersistence.ts`

```typescript
/**
 * Auth Persistence Service
 *
 * Sauvegarde le user_id dans AsyncStorage pour qu'il survive
 * aux redémarrages de l'app.
 *
 * POURQUOI: Zustand seul = mémoire temporaire
 * QUAND UTILISÉ: À chaque login/logout
 */

import { storage } from '@/services/storage';

// Clés de stockage (préfixe pour éviter conflits)
const STORAGE_KEYS = {
  USER_ID: 'auth:user_id',
  USER_EMAIL: 'auth:user_email',
} as const;

/**
 * Sauvegarder l'utilisateur connecté
 * Appelé après login réussi
 */
export async function persistUser(userId: string, email: string): Promise<void> {
  await storage.set(STORAGE_KEYS.USER_ID, userId);
  await storage.set(STORAGE_KEYS.USER_EMAIL, email);
}

/**
 * Récupérer l'utilisateur sauvegardé
 * Appelé au démarrage de l'app
 */
export async function getPersistedUserId(): Promise<string | null> {
  return await storage.get(STORAGE_KEYS.USER_ID);
}

export async function getPersistedUserEmail(): Promise<string | null> {
  return await storage.get(STORAGE_KEYS.USER_EMAIL);
}

/**
 * Supprimer l'utilisateur sauvegardé
 * Appelé au logout
 */
export async function clearPersistedUser(): Promise<void> {
  await storage.delete(STORAGE_KEYS.USER_ID);
  await storage.delete(STORAGE_KEYS.USER_EMAIL);
}
```

**Fichier**: `src/services/auth/index.ts`

```typescript
/**
 * Auth Service - Main Export
 */

export {
  persistUser,
  getPersistedUserId,
  getPersistedUserEmail,
  clearPersistedUser,
} from './authPersistence';
```

#### Étape 2: Modifier authStore pour utiliser persistence (1h)

**Fichier**: `src/stores/auth/authStore.ts`

```typescript
/**
 * Authentication Store
 *
 * CHANGEMENT: Maintenant synchronisé avec AsyncStorage
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
  // NOUVEAU: Initialiser depuis AsyncStorage
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: async (user) => {
    // NOUVEAU: Sauvegarder dans AsyncStorage
    if (user) {
      await persistUser(user.id, user.email);
    } else {
      await clearPersistedUser();
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
    await clearPersistedUser(); // NOUVEAU
    set({ user: null, isAuthenticated: false });
  },

  // NOUVEAU: Charger user depuis AsyncStorage au démarrage
  initializeAuth: async () => {
    const { getPersistedUserId, getPersistedUserEmail } = await import('@/services/auth');
    const userId = await getPersistedUserId();
    const email = await getPersistedUserEmail();

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
import { initDatabase } from '@/services';
import { useAuthStore } from '@/stores'; // NOUVEAU
import '../../global.css';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [authReady, setAuthReady] = useState(false); // NOUVEAU
  const initializeAuth = useAuthStore((state) => state.initializeAuth); // NOUVEAU

  useEffect(() => {
    // Initialiser DB et Auth en parallèle
    Promise.all([
      initDatabase(),
      initializeAuth(), // NOUVEAU: Charger user depuis AsyncStorage
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

#### Étape 4: Valider user_id dans CRUD database (1h)

**Fichier**: `src/services/database/workouts.ts` (modifications)

```typescript
import { getPersistedUserId } from '@/services/auth';

/**
 * Créer un nouveau workout
 *
 * CHANGEMENT: Valide que user est connecté avant de créer
 */
export async function createWorkout(data: Omit<CreateWorkout, 'user_id'>): Promise<Workout> {
  const db = getDatabase();

  // NOUVEAU: Récupérer user_id depuis AsyncStorage (source unique de vérité)
  const userId = await getPersistedUserId();
  if (!userId) {
    throw new Error('User not authenticated. Cannot create workout.');
  }

  const id = generateId();
  const now = Math.floor(Date.now() / 1000);

  await db.runAsync(
    `INSERT INTO workouts (id, user_id, started_at, synced, created_at, updated_at)
     VALUES (?, ?, ?, 0, ?, ?)`,
    [id, userId, data.started_at, now, now] // Utiliser userId validé
  );

  const workout = await getWorkoutById(id);
  if (!workout) {
    throw new Error('Workout created but not found');
  }

  return workout;
}

/**
 * Récupérer les workouts de l'utilisateur connecté
 *
 * CHANGEMENT: Utilise automatiquement le user connecté
 */
export async function getUserWorkouts(
  limit: number = 20,
  offset: number = 0
): Promise<Workout[]> {
  const db = getDatabase();

  // NOUVEAU: Récupérer user_id automatiquement
  const userId = await getPersistedUserId();
  if (!userId) {
    return []; // Pas connecté = pas de workouts
  }

  const result = await db.getAllAsync<Workout>(
    `SELECT * FROM workouts
     WHERE user_id = ?
     ORDER BY started_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  return result;
}
```

#### Étape 5: Ajouter sync_user_id dans schema (30min)

**Fichier**: `src/services/database/db.ts`

```typescript
// Dans createTables(), modifier workouts table:

await db.execAsync(`
  CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    sync_user_id TEXT, -- NOUVEAU: UUID Supabase après premier sync
    started_at INTEGER NOT NULL,
    completed_at INTEGER,
    duration_seconds INTEGER,
    title TEXT,
    notes TEXT,
    synced INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    CONSTRAINT valid_user CHECK (user_id IS NOT NULL)
  );
`);
```

### 🧪 Tests de validation

**À faire après implémentation** (copier-coller ces commandes à Claude):

```typescript
// Test 1: Vérifier persistence user
// Dans console Metro (npm start):

import { persistUser, getPersistedUserId } from './src/services/auth';

// Sauvegarder un user
await persistUser('test-123', 'test@example.com');

// Vérifier qu'il est récupéré
const userId = await getPersistedUserId();
console.log('User ID:', userId); // Doit afficher: test-123

// Redémarrer l'app (shake device → Reload)
// Revérifier
const userId2 = await getPersistedUserId();
console.log('User ID après reload:', userId2); // Doit TOUJOURS afficher: test-123 ✅
```

**Comportements attendus**:
- ✅ User ID survit au redémarrage app
- ✅ createWorkout() rejette si pas de user
- ✅ getUserWorkouts() retourne [] si pas connecté

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

### ✅ Solution

**Concept**: Zustand peut sauvegarder automatiquement certaines données dans AsyncStorage avec le middleware `persist`.

#### Étape 1: Installer zustand persist (5min)

**Commande**:
```bash
# Déjà inclus dans zustand, pas besoin d'installer
```

#### Étape 2: Ajouter persist à workoutStore (1h)

**Fichier**: `src/stores/workout/workoutStore.ts`

```typescript
/**
 * Workout Store
 *
 * CHANGEMENT: Maintenant persisté dans AsyncStorage
 * Survit aux redémarrages/crashes
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      currentWorkoutId: null, // NOUVEAU

      startWorkout: (workoutId) =>
        set({
          isWorkoutActive: true,
          workoutStartTime: new Date(),
          currentWorkoutId: workoutId, // NOUVEAU
        }),

      endWorkout: () =>
        set({
          isWorkoutActive: false,
          workoutStartTime: null,
          currentWorkoutId: null,
        }),
    }),
    {
      name: 'workout-storage', // Nom unique dans AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),

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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: async (user) => {
        if (user) {
          await persistUser(user.id, user.email);
        } else {
          await clearPersistedUser();
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
        await clearPersistedUser();
        set({ user: null, isAuthenticated: false });
      },

      initializeAuth: async () => {
        const userId = await getPersistedUserId();
        const email = await getPersistedUserEmail();

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
      storage: createJSONStorage(() => AsyncStorage),
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
await startWorkout('workout-test-123');

// 2. Vérifier état
console.log(useWorkoutStore.getState().isWorkoutActive); // true
console.log(useWorkoutStore.getState().currentWorkoutId); // workout-test-123

// 3. Redémarrer app (shake device → Reload)

// 4. Vérifier que l'état est TOUJOURS là
console.log(useWorkoutStore.getState().isWorkoutActive); // Doit être true ✅
console.log(useWorkoutStore.getState().currentWorkoutId); // Doit être workout-test-123 ✅
```

---

## Correction #3: Error Handling 🔴

### ❌ Le problème

**Code actuel**:
```typescript
// database/workouts.ts
export async function createWorkout(data: CreateWorkout): Promise<Workout> {
  await db.runAsync(...); // ❌ Pas de try/catch
  return getWorkoutById(id); // ❌ Peut retourner null sans warning!
}
```

**Analogie**: C'est comme conduire sans ceinture de sécurité. 99% du temps ça va, mais le 1% où ça crash, c'est catastrophique.

### 💥 Scénarios problématiques

**Scénario 1: Erreur silencieuse**
```
User clique "Log Set"
→ Database locked (erreur SQLite)
→ Promise rejette
→ App freeze ou crash
→ User ne sait pas ce qui s'est passé ❌
```

**Scénario 2: Null non géré**
```typescript
const workout = await getWorkoutById(id); // Retourne null
workout.exercises.forEach(...); // ❌ Cannot read property 'exercises' of null
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

**Fichier**: `src/services/database/workouts.ts` (exemple avec createWorkout)

```typescript
import { DatabaseError, AuthError } from '@/utils/errors';
import { getPersistedUserId } from '@/services/auth';

/**
 * Créer un nouveau workout
 *
 * @throws {AuthError} Si user pas connecté
 * @throws {DatabaseError} Si erreur SQL
 */
export async function createWorkout(data: Omit<CreateWorkout, 'user_id'>): Promise<Workout> {
  // 1. Valider auth
  const userId = await getPersistedUserId();
  if (!userId) {
    throw new AuthError(
      'User must be authenticated to create workout',
      'AUTH_REQUIRED'
    );
  }

  // 2. Générer ID et timestamp
  const id = generateId();
  const now = Math.floor(Date.now() / 1000);

  // 3. Insérer dans DB avec error handling
  try {
    const db = getDatabase();
    await db.runAsync(
      `INSERT INTO workouts (id, user_id, started_at, synced, created_at, updated_at)
       VALUES (?, ?, ?, 0, ?, ?)`,
      [id, userId, data.started_at, now, now]
    );
  } catch (error) {
    throw new DatabaseError(
      `Failed to create workout: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'DB_INSERT_FAILED',
      error
    );
  }

  // 4. Récupérer le workout créé
  const workout = await getWorkoutById(id);
  if (!workout) {
    throw new DatabaseError(
      'Workout was created but could not be retrieved',
      'DB_NOT_FOUND'
    );
  }

  return workout;
}

/**
 * Récupérer workout par ID
 *
 * @throws {DatabaseError} Si erreur SQL
 * @returns {Workout | null} null si workout n'existe pas (pas une erreur)
 */
export async function getWorkoutById(id: string): Promise<Workout | null> {
  try {
    const db = getDatabase();
    const result = await db.getFirstAsync<Workout>(
      `SELECT * FROM workouts WHERE id = ?`,
      [id]
    );
    return result || null;
  } catch (error) {
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
        message: err.isOnline
          ? 'Erreur de synchronisation.'
          : 'Pas de connexion internet.',
        code: err.code,
        type: 'sync',
      });
    } else {
      setError({
        message: 'Une erreur inattendue s\'est produite.',
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
  await useAuthStore.getState().signOut();

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
  // Ne devrait PAS throw (retourne null)
  console.log('OK, pas d\'erreur pour ID inexistant ✅');
} catch (error) {
  console.log('❌ Ne devrait pas throw pour ID inexistant');
}
```

---

# ⚠️ PARTIE 2: CORRECTIONS IMPORTANTES

> ⏱️ **Temps total**: 18 heures (2 jours)
> 🎯 **À faire**: Avant Phase 2 (Sync)

---

## Correction #4: Repository Pattern ⚠️

### ❌ Le problème

**Situation**: En Phase 3, on va migrer de `expo-sqlite` vers `WatermelonDB`. Problème: **l'API est complètement différente**.

**Code actuel (expo-sqlite)**:
```typescript
const workout = await createWorkout({ ... });
```

**Code WatermelonDB (futur)**:
```typescript
const workout = await database.write(async () => {
  return await workoutsCollection.create(workout => {
    workout.userId = userId;
  });
});
```

**Résultat**: Si on ne prépare pas, on devra **réécrire TOUS les hooks/components** en Phase 3. Estimation: 1 semaine de refactor.

### 💥 Impact si non corrigé

```
Phase 3 arrives:
→ 50+ endroits dans le code appellent createWorkout()
→ Tous doivent changer vers WatermelonDB API
→ Tests cassés
→ Bugs partout
→ 1 semaine de travail ❌
```

### ✅ Solution: Repository Pattern

**Concept simple**: On crée une **interface** (contrat) qui dit "voici les fonctions disponibles". Ensuite, on crée 2 **implémentations**:
- `SQLiteWorkoutRepository` (Phase 0-2)
- `WatermelonWorkoutRepository` (Phase 3+)

Le reste du code utilise l'interface, pas l'implémentation directe. Quand on migrate → on swap juste l'implémentation!

**Analogie**: C'est comme une prise électrique. Tu as un standard (interface), et tu peux brancher différents appareils (implémentations) sans changer la prise.

#### Étape 1: Créer interface Repository (2h)

**Fichier**: `src/services/database/repositories/IWorkoutRepository.ts`

```typescript
/**
 * Workout Repository Interface
 *
 * Contract (contrat) pour les opérations workout.
 * N'importe quelle implémentation (SQLite, WatermelonDB, etc.)
 * doit respecter cette interface.
 *
 * AVANTAGE: Quand on change d'implémentation, le reste du code
 * ne change pas!
 */

import type {
  Workout,
  CreateWorkout,
  UpdateWorkout,
  WorkoutWithDetails,
} from '../types';

export interface IWorkoutRepository {
  /**
   * Créer un nouveau workout
   */
  create(data: Omit<CreateWorkout, 'user_id'>): Promise<Workout>;

  /**
   * Récupérer workout par ID
   */
  getById(id: string): Promise<Workout | null>;

  /**
   * Récupérer workouts de l'utilisateur connecté
   */
  getUserWorkouts(limit?: number, offset?: number): Promise<Workout[]>;

  /**
   * Récupérer le workout actif (non complété)
   */
  getActive(): Promise<Workout | null>;

  /**
   * Récupérer workout avec exercises et sets
   */
  getWithDetails(id: string): Promise<WorkoutWithDetails | null>;

  /**
   * Mettre à jour un workout
   */
  update(id: string, data: UpdateWorkout): Promise<Workout>;

  /**
   * Compléter un workout (set completed_at)
   */
  complete(id: string): Promise<Workout>;

  /**
   * Supprimer un workout
   */
  delete(id: string): Promise<void>;

  /**
   * Récupérer workouts non synchronisés
   */
  getUnsynced(): Promise<Workout[]>;

  /**
   * Marquer workout comme synchronisé
   */
  markSynced(id: string): Promise<void>;
}
```

#### Étape 2: Créer implémentation SQLite (4h)

**Fichier**: `src/services/database/repositories/SQLiteWorkoutRepository.ts`

```typescript
/**
 * SQLite Workout Repository
 *
 * Implémentation de IWorkoutRepository pour expo-sqlite.
 * Utilisé en Phase 0-2 (Expo Go).
 */

import { DatabaseError, AuthError } from '@/utils/errors';
import { getPersistedUserId } from '@/services/auth';
import { getDatabase } from '../db';
import { generateId } from '../utils'; // À créer
import type { IWorkoutRepository } from './IWorkoutRepository';
import type {
  Workout,
  CreateWorkout,
  UpdateWorkout,
  WorkoutWithDetails,
} from '../types';

export class SQLiteWorkoutRepository implements IWorkoutRepository {
  async create(data: Omit<CreateWorkout, 'user_id'>): Promise<Workout> {
    // Valider auth
    const userId = await getPersistedUserId();
    if (!userId) {
      throw new AuthError('User not authenticated', 'AUTH_REQUIRED');
    }

    const id = generateId();
    const now = Math.floor(Date.now() / 1000);

    try {
      const db = getDatabase();
      await db.runAsync(
        `INSERT INTO workouts (id, user_id, started_at, synced, created_at, updated_at)
         VALUES (?, ?, ?, 0, ?, ?)`,
        [id, userId, data.started_at, now, now]
      );
    } catch (error) {
      throw new DatabaseError(
        'Failed to create workout',
        'DB_INSERT_FAILED',
        error
      );
    }

    const workout = await this.getById(id);
    if (!workout) {
      throw new DatabaseError('Workout created but not found', 'DB_NOT_FOUND');
    }

    return workout;
  }

  async getById(id: string): Promise<Workout | null> {
    try {
      const db = getDatabase();
      const result = await db.getFirstAsync<Workout>(
        `SELECT * FROM workouts WHERE id = ?`,
        [id]
      );
      return result || null;
    } catch (error) {
      throw new DatabaseError('Failed to get workout', 'DB_QUERY_FAILED', error);
    }
  }

  async getUserWorkouts(limit = 20, offset = 0): Promise<Workout[]> {
    const userId = await getPersistedUserId();
    if (!userId) return [];

    try {
      const db = getDatabase();
      const result = await db.getAllAsync<Workout>(
        `SELECT * FROM workouts
         WHERE user_id = ?
         ORDER BY started_at DESC
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );
      return result;
    } catch (error) {
      throw new DatabaseError('Failed to get user workouts', 'DB_QUERY_FAILED', error);
    }
  }

  async getActive(): Promise<Workout | null> {
    const userId = await getPersistedUserId();
    if (!userId) return null;

    try {
      const db = getDatabase();
      const result = await db.getFirstAsync<Workout>(
        `SELECT * FROM workouts
         WHERE user_id = ? AND completed_at IS NULL
         ORDER BY started_at DESC
         LIMIT 1`,
        [userId]
      );
      return result || null;
    } catch (error) {
      throw new DatabaseError('Failed to get active workout', 'DB_QUERY_FAILED', error);
    }
  }

  async getWithDetails(id: string): Promise<WorkoutWithDetails | null> {
    // Implémenter avec JOINs (comme code actuel workouts.ts)
    // ... (code long, je simplifie pour l'exemple)
    const workout = await this.getById(id);
    if (!workout) return null;

    // Récupérer exercises + sets
    // ... (logique existante)

    return workout as WorkoutWithDetails;
  }

  async update(id: string, data: UpdateWorkout): Promise<Workout> {
    // Implémenter UPDATE (comme code actuel)
    // ...
    throw new Error('Not implemented yet');
  }

  async complete(id: string): Promise<Workout> {
    // Implémenter complete (comme code actuel)
    // ...
    throw new Error('Not implemented yet');
  }

  async delete(id: string): Promise<void> {
    // Implémenter DELETE
    // ...
    throw new Error('Not implemented yet');
  }

  async getUnsynced(): Promise<Workout[]> {
    const userId = await getPersistedUserId();
    if (!userId) return [];

    try {
      const db = getDatabase();
      const result = await db.getAllAsync<Workout>(
        `SELECT * FROM workouts
         WHERE user_id = ? AND synced = 0`,
        [userId]
      );
      return result;
    } catch (error) {
      throw new DatabaseError('Failed to get unsynced workouts', 'DB_QUERY_FAILED', error);
    }
  }

  async markSynced(id: string): Promise<void> {
    try {
      const db = getDatabase();
      await db.runAsync(
        `UPDATE workouts SET synced = 1 WHERE id = ?`,
        [id]
      );
    } catch (error) {
      throw new DatabaseError('Failed to mark workout as synced', 'DB_UPDATE_FAILED', error);
    }
  }
}
```

#### Étape 3: Créer factory (injection de dépendance) (1h)

**Fichier**: `src/services/database/repositories/index.ts`

```typescript
/**
 * Repository Factory
 *
 * Crée l'instance du repository approprié selon l'environnement.
 *
 * Phase 0-2: SQLiteWorkoutRepository
 * Phase 3+: WatermelonWorkoutRepository (à créer plus tard)
 */

import { SQLiteWorkoutRepository } from './SQLiteWorkoutRepository';
import type { IWorkoutRepository } from './IWorkoutRepository';

// Singleton instance
let workoutRepositoryInstance: IWorkoutRepository | null = null;

/**
 * Récupérer l'instance du workout repository
 *
 * Usage dans le code:
 * const repo = getWorkoutRepository();
 * const workout = await repo.create({ ... });
 */
export function getWorkoutRepository(): IWorkoutRepository {
  if (!workoutRepositoryInstance) {
    // Pour l'instant, toujours SQLite
    // En Phase 3, on ajoutera logique pour choisir WatermelonDB
    workoutRepositoryInstance = new SQLiteWorkoutRepository();
  }
  return workoutRepositoryInstance;
}

// Exports types
export type { IWorkoutRepository };
```

#### Étape 4: Migrer code existant vers Repository (1h)

**Fichier**: `src/services/database/index.ts` (modifier exports)

```typescript
/**
 * Database Service - Main Export
 */

// Core database
export { initDatabase, getDatabase, resetDatabase, getDatabaseStats } from './db';

// Types
export type * from './types';

// Repository (NOUVEAU)
export { getWorkoutRepository } from './repositories';
export type { IWorkoutRepository } from './repositories';

// DEPRECATED: Direct functions (garder pour compatibility)
// TODO: Supprimer après migration complète
export {
  createWorkout,
  addExerciseToWorkout,
  logSet,
  // ...
} from './workouts';

// Sync operations
export { syncToSupabase, getSyncStatus, autoSync } from './sync';
export type { SyncStatus, SyncResult } from './sync';
```

**Usage dans hooks (exemple)**:

```typescript
// hooks/workout/useCreateWorkout.ts
import { getWorkoutRepository } from '@/services';

export function useCreateWorkout() {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const create = async (data: Omit<CreateWorkout, 'user_id'>) => {
    setLoading(true);
    try {
      const repo = getWorkoutRepository();
      const workout = await repo.create(data);
      return workout;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}
```

### 🧪 Tests de validation

```typescript
// Test: Vérifier que repository fonctionne

const repo = getWorkoutRepository();

// Create
const workout = await repo.create({
  started_at: Math.floor(Date.now() / 1000),
  title: 'Test Workout',
});
console.log('Created workout:', workout.id); // ✅

// Get by ID
const retrieved = await repo.getById(workout.id);
console.log('Retrieved:', retrieved?.title); // 'Test Workout' ✅

// Get user workouts
const workouts = await repo.getUserWorkouts(10);
console.log('User workouts:', workouts.length); // >= 1 ✅
```

---

## Correction #5: Sync Conflict Detection ⚠️

### ❌ Le problème

**Code actuel (sync.ts)**:
```typescript
// "Last write wins" - Trop simpliste
await supabase.from('workouts').upsert(workouts);
```

**Explication**: `upsert` = "insert ou update". Si le workout existe déjà sur le serveur, il est écrasé. Problème: on n'a **aucune idée** si les données serveur étaient plus récentes!

### 💥 Scénario Data Loss

```
Lundi 10h00:
- Device A (offline): User log bench press 100kg x 8 reps
  → Sauvegardé localement, pas encore sync

Lundi 10h30:
- Device B (online): User corrige → 105kg x 8 reps
  → Sync immédiatement vers Supabase ✅
  → Serveur a maintenant: 105kg

Lundi 11h00:
- Device A (back online): Sync se déclenche
  → upsert({weight: 100})
  → Serveur overwrite: 105kg → 100kg ❌
  → Data loss! Le 105kg est perdu
```

### ✅ Solution: Version Tracking

**Concept**: Chaque row (ligne) de données a un **numéro de version** et un **timestamp de dernière modification**. Quand on sync:
1. Comparer versions locale vs serveur
2. Si serveur plus récent → prendre serveur (conflict résolu)
3. Si local plus récent → envoyer au serveur
4. Si égal → pas de conflict

**Analogie**: C'est comme Google Docs. Si 2 personnes modifient en même temps, Google détecte et demande quelle version garder.

#### Étape 1: Ajouter version tracking au schema (1h)

**Fichier**: `src/services/database/db.ts` (modifier tables)

```typescript
await db.execAsync(`
  CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    sync_user_id TEXT,
    started_at INTEGER NOT NULL,
    completed_at INTEGER,
    duration_seconds INTEGER,
    title TEXT,
    notes TEXT,

    -- NOUVEAU: Version tracking
    version INTEGER DEFAULT 1,
    last_modified_at INTEGER NOT NULL,
    synced_at INTEGER,

    synced INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

await db.execAsync(`
  CREATE TABLE IF NOT EXISTS exercise_sets (
    id TEXT PRIMARY KEY NOT NULL,
    workout_exercise_id TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    weight REAL,
    weight_unit TEXT DEFAULT 'kg',
    reps INTEGER,
    rpe INTEGER,
    rir INTEGER,
    rest_time_seconds INTEGER,
    is_warmup INTEGER DEFAULT 0,
    is_failure INTEGER DEFAULT 0,
    notes TEXT,

    -- NOUVEAU: Version tracking
    version INTEGER DEFAULT 1,
    last_modified_at INTEGER NOT NULL,
    synced_at INTEGER,

    synced INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises (id)
  );
`);
```

**Fichier**: `src/services/database/types.ts` (ajouter champs)

```typescript
export interface Workout {
  id: string;
  user_id: string;
  sync_user_id?: string;
  started_at: number;
  completed_at?: number;
  duration_seconds?: number;
  title?: string;
  notes?: string;

  // Version tracking
  version: number;
  last_modified_at: number;
  synced_at?: number;

  synced: number;
  created_at: number;
  updated_at: number;
}

// Pareil pour ExerciseSet...
```

#### Étape 2: Modifier CREATE/UPDATE pour incrémenter version (2h)

**Fichier**: `src/services/database/repositories/SQLiteWorkoutRepository.ts`

```typescript
async create(data: Omit<CreateWorkout, 'user_id'>): Promise<Workout> {
  const userId = await getPersistedUserId();
  if (!userId) throw new AuthError('User not authenticated', 'AUTH_REQUIRED');

  const id = generateId();
  const now = Math.floor(Date.now() / 1000);

  try {
    const db = getDatabase();
    await db.runAsync(
      `INSERT INTO workouts (
        id, user_id, started_at,
        version, last_modified_at, -- NOUVEAU
        synced, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        id, userId, data.started_at,
        1, now, // version = 1, last_modified_at = now
        now, now
      ]
    );
  } catch (error) {
    throw new DatabaseError('Failed to create workout', 'DB_INSERT_FAILED', error);
  }

  const workout = await this.getById(id);
  if (!workout) throw new DatabaseError('Workout created but not found', 'DB_NOT_FOUND');

  return workout;
}

async update(id: string, data: UpdateWorkout): Promise<Workout> {
  const now = Math.floor(Date.now() / 1000);

  try {
    const db = getDatabase();

    // NOUVEAU: Incrémenter version + update last_modified_at
    await db.runAsync(
      `UPDATE workouts
       SET
         title = COALESCE(?, title),
         notes = COALESCE(?, notes),
         version = version + 1,
         last_modified_at = ?,
         updated_at = ?,
         synced = 0
       WHERE id = ?`,
      [data.title, data.notes, now, now, id]
    );
  } catch (error) {
    throw new DatabaseError('Failed to update workout', 'DB_UPDATE_FAILED', error);
  }

  const workout = await this.getById(id);
  if (!workout) throw new DatabaseError('Workout not found after update', 'DB_NOT_FOUND');

  return workout;
}
```

#### Étape 3: Implémenter conflict detection dans sync (4h)

**Fichier**: `src/services/database/sync.ts` (remplacer logique)

```typescript
/**
 * Synchroniser un workout avec gestion de conflits
 */
async function syncWorkout(localWorkout: Workout): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Récupérer version serveur
    const { data: serverWorkout, error } = await supabase
      .from('workouts')
      .select('version, last_modified_at, synced_at')
      .eq('id', localWorkout.id)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    // 2. Workout n'existe pas sur serveur → simple insert
    if (!serverWorkout) {
      const { error: insertError } = await supabase
        .from('workouts')
        .insert({
          ...localWorkout,
          synced_at: Math.floor(Date.now() / 1000),
        });

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      // Marquer comme synced localement
      await markWorkoutAsSynced(localWorkout.id);
      return { success: true };
    }

    // 3. Workout existe → détecter conflict
    const hasConflict = serverWorkout.version > localWorkout.version;

    if (hasConflict) {
      console.warn(`⚠️ Conflict detected for workout ${localWorkout.id}`);

      // Stratégie: Last modified wins
      if (serverWorkout.last_modified_at > localWorkout.last_modified_at) {
        // Server plus récent → fetch et update local
        console.log('→ Server wins, updating local');
        const { data: fullServerWorkout } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', localWorkout.id)
          .single();

        if (fullServerWorkout) {
          await updateLocalWorkout(fullServerWorkout);
        }

        return { success: true };
      } else {
        // Local plus récent → force push au serveur
        console.log('→ Local wins, forcing server update');
        const { error: updateError } = await supabase
          .from('workouts')
          .update({
            ...localWorkout,
            version: serverWorkout.version + 1, // Incrémenter version serveur
            synced_at: Math.floor(Date.now() / 1000),
          })
          .eq('id', localWorkout.id);

        if (updateError) {
          return { success: false, error: updateError.message };
        }

        await markWorkoutAsSynced(localWorkout.id);
        return { success: true };
      }
    }

    // 4. Pas de conflict → simple update
    const { error: updateError } = await supabase
      .from('workouts')
      .update({
        ...localWorkout,
        version: localWorkout.version + 1,
        synced_at: Math.floor(Date.now() / 1000),
      })
      .eq('id', localWorkout.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    await markWorkoutAsSynced(localWorkout.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Mettre à jour workout local depuis serveur
 */
async function updateLocalWorkout(serverWorkout: any): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE workouts
     SET
       title = ?,
       notes = ?,
       completed_at = ?,
       duration_seconds = ?,
       version = ?,
       last_modified_at = ?,
       synced_at = ?,
       synced = 1,
       updated_at = ?
     WHERE id = ?`,
    [
      serverWorkout.title,
      serverWorkout.notes,
      serverWorkout.completed_at,
      serverWorkout.duration_seconds,
      serverWorkout.version,
      serverWorkout.last_modified_at,
      serverWorkout.synced_at,
      Math.floor(Date.now() / 1000),
      serverWorkout.id,
    ]
  );
}

/**
 * Marquer workout comme synced localement
 */
async function markWorkoutAsSynced(workoutId: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE workouts
     SET synced = 1, synced_at = ?
     WHERE id = ?`,
    [Math.floor(Date.now() / 1000), workoutId]
  );
}
```

#### Étape 4: Créer migration DB pour workouts existants (30min)

**Fichier**: `src/services/database/migrations/addVersionTracking.ts`

```typescript
/**
 * Migration: Ajouter version tracking aux workouts existants
 *
 * À lancer UNE FOIS après avoir déployé le nouveau schema
 */

import { getDatabase } from '../db';

export async function migrateAddVersionTracking(): Promise<void> {
  const db = getDatabase();

  try {
    console.log('🔄 Starting version tracking migration...');

    // Ajouter colonnes si elles n'existent pas déjà
    await db.execAsync(`
      ALTER TABLE workouts ADD COLUMN version INTEGER DEFAULT 1;
      ALTER TABLE workouts ADD COLUMN last_modified_at INTEGER;
      ALTER TABLE workouts ADD COLUMN synced_at INTEGER;
    `);

    // Initialiser last_modified_at = updated_at pour workouts existants
    await db.execAsync(`
      UPDATE workouts
      SET last_modified_at = updated_at
      WHERE last_modified_at IS NULL;
    `);

    console.log('✅ Version tracking migration complete');
  } catch (error) {
    // Si colonnes existent déjà, SQLite throw error (c'est OK)
    if (error instanceof Error && error.message.includes('duplicate column')) {
      console.log('ℹ️ Version tracking columns already exist');
    } else {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}
```

**Appeler dans** `src/app/_layout.tsx`:

```typescript
useEffect(() => {
  Promise.all([
    initDatabase(),
    initializeAuth(),
  ])
    .then(async () => {
      // NOUVEAU: Lancer migration si nécessaire
      const { migrateAddVersionTracking } = await import('@/services/database/migrations/addVersionTracking');
      await migrateAddVersionTracking();

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
```

### 🧪 Tests de validation

```typescript
// Test: Simuler conflict

// Device A: Créer workout
const workoutA = await repo.create({
  started_at: Date.now() / 1000,
  title: 'Original Title',
});
console.log('Version A:', workoutA.version); // 1

// Simuler Device B: Update sur serveur (manuellement dans Supabase Dashboard)
// title = 'Server Modified', version = 2, last_modified_at = now

// Device A: Update local
await repo.update(workoutA.id, { title: 'Local Modified' });
const updatedA = await repo.getById(workoutA.id);
console.log('Version A après update:', updatedA?.version); // 2

// Device A: Sync
await syncToSupabase();

// Vérifier résultat:
// - Si server last_modified_at plus récent → title = 'Server Modified' ✅
// - Si local last_modified_at plus récent → title = 'Local Modified' ✅
```

---

## Correction #6: Database Indexes ⚠️

### ❌ Le problème

**Situation**: Les queries SQL actuelles sont OK pour 10-50 workouts. Mais à 500+ workouts, ça va devenir **lent**.

**Exemple slow query**:
```sql
SELECT * FROM workouts
WHERE user_id = ?
ORDER BY started_at DESC
LIMIT 20;
```

Sans index sur `(user_id, started_at)`, SQLite doit:
1. Scanner TOUTE la table workouts
2. Filtrer par user_id
3. Trier par started_at
4. Prendre les 20 premiers

Avec 1000 workouts → ~500ms. Avec 5000 → ~2s. Bad UX!

### 💥 Impact futur

```
User a 1000 workouts logged:
→ Ouvrir écran "History" → 2 secondes de loading ❌
→ Scroll → chaque page = 1-2s ❌
→ User frustrated, app feels slow
```

### ✅ Solution: Compound Indexes

**Concept**: Un index SQL = comme un index de livre. Au lieu de lire toutes les pages pour trouver "Chapter 5", tu regardes l'index qui dit "Page 42".

**Compound index**: Index sur PLUSIEURS colonnes à la fois. Exemple: `(user_id, started_at DESC)`.

Avec cet index, la query ci-dessus devient:
1. SQLite regarde l'index
2. Trouve directement les 20 workouts du user triés par date
3. Temps: <10ms ✅

#### Étape 1: Ajouter indexes dans schema (1h)

**Fichier**: `src/services/database/db.ts` (fonction createIndexes)

```typescript
/**
 * Créer les indexes pour optimiser les queries
 *
 * Règle: Index sur colonnes utilisées dans WHERE, ORDER BY, JOIN
 */
async function createIndexes(): Promise<void> {
  const db = getDatabase();

  console.log('Creating indexes...');

  try {
    // Workouts indexes
    await db.execAsync(`
      -- Compound index pour getUserWorkouts()
      -- Query: WHERE user_id = ? ORDER BY started_at DESC
      CREATE INDEX IF NOT EXISTS idx_workouts_user_started
        ON workouts(user_id, started_at DESC);

      -- Partial index pour getActive()
      -- Query: WHERE user_id = ? AND completed_at IS NULL
      CREATE INDEX IF NOT EXISTS idx_workouts_user_active
        ON workouts(user_id, completed_at)
        WHERE completed_at IS NULL;

      -- Partial index pour getUnsynced()
      -- Query: WHERE user_id = ? AND synced = 0
      CREATE INDEX IF NOT EXISTS idx_workouts_user_synced
        ON workouts(user_id, synced)
        WHERE synced = 0;

      -- Index pour queries par date
      CREATE INDEX IF NOT EXISTS idx_workouts_started_at
        ON workouts(started_at DESC);

      -- Exercise sets indexes
      -- Query: Récupérer sets d'un exercise
      CREATE INDEX IF NOT EXISTS idx_sets_workout_exercise
        ON exercise_sets(workout_exercise_id, set_number);

      -- Partial index pour sets non synced
      CREATE INDEX IF NOT EXISTS idx_sets_synced
        ON exercise_sets(synced)
        WHERE synced = 0;

      -- Workout exercises indexes
      -- Query: Récupérer exercises d'un workout
      CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id
        ON workout_exercises(workout_id, order_index);

      -- Exercises indexes
      -- Query: Recherche par nom
      CREATE INDEX IF NOT EXISTS idx_exercises_name
        ON exercises(name COLLATE NOCASE);

      -- Query: Filtrer par category
      CREATE INDEX IF NOT EXISTS idx_exercises_category
        ON exercises(category);
    `);

    console.log('✅ Indexes created successfully');
  } catch (error) {
    console.error('❌ Failed to create indexes:', error);
    throw error;
  }
}

/**
 * Initialiser database avec schema et indexes
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('halterofit.db');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await createTables();
  await createIndexes(); // NOUVEAU

  console.log('✅ Database initialized');
  return db;
}
```

#### Étape 2: Vérifier utilisation indexes (1h)

**Fichier**: `src/services/database/__tests__/benchmark.ts`

```typescript
/**
 * Benchmark queries pour vérifier que les indexes sont utilisés
 *
 * À lancer manuellement pour tester performance
 */

import { getDatabase } from '../db';
import { getWorkoutRepository } from '../repositories';

/**
 * Analyser query plan (voir si index est utilisé)
 */
async function explainQuery(sql: string, params: any[]): Promise<void> {
  const db = getDatabase();

  console.log('\n📊 Query:', sql);
  console.log('📊 Params:', params);

  // EXPLAIN QUERY PLAN montre comment SQLite exécute la query
  const plan = await db.getAllAsync(
    `EXPLAIN QUERY PLAN ${sql}`,
    params
  );

  console.log('📊 Execution plan:');
  plan.forEach((row: any) => {
    console.log(`   ${row.detail}`);

    // Vérifier qu'un index est utilisé
    if (row.detail.includes('USING INDEX')) {
      console.log('   ✅ Index utilisé!');
    } else if (row.detail.includes('SCAN TABLE')) {
      console.log('   ⚠️  Full table scan (lent!)');
    }
  });
}

/**
 * Benchmark performance
 */
async function benchmarkQuery(name: string, fn: () => Promise<any>): Promise<void> {
  console.log(`\n⏱️  Benchmarking: ${name}`);

  const start = performance.now();
  await fn();
  const end = performance.now();

  const duration = Math.round(end - start);
  console.log(`   ⏱️  Duration: ${duration}ms`);

  if (duration < 50) {
    console.log('   ✅ Excellent (<50ms)');
  } else if (duration < 200) {
    console.log('   ⚠️  Acceptable (50-200ms)');
  } else {
    console.log('   ❌ Slow (>200ms)');
  }
}

/**
 * Lancer tous les benchmarks
 */
export async function runBenchmarks(): Promise<void> {
  console.log('🚀 Starting database benchmarks...\n');

  const repo = getWorkoutRepository();

  // Test 1: getUserWorkouts
  await explainQuery(
    `SELECT * FROM workouts WHERE user_id = ? ORDER BY started_at DESC LIMIT 20`,
    ['user-123']
  );

  await benchmarkQuery('getUserWorkouts()', async () => {
    await repo.getUserWorkouts(20);
  });

  // Test 2: getActive
  await explainQuery(
    `SELECT * FROM workouts WHERE user_id = ? AND completed_at IS NULL ORDER BY started_at DESC LIMIT 1`,
    ['user-123']
  );

  await benchmarkQuery('getActive()', async () => {
    await repo.getActive();
  });

  // Test 3: getUnsynced
  await explainQuery(
    `SELECT * FROM workouts WHERE user_id = ? AND synced = 0`,
    ['user-123']
  );

  await benchmarkQuery('getUnsynced()', async () => {
    await repo.getUnsynced();
  });

  console.log('\n✅ Benchmarks complete');
}
```

**Pour lancer les benchmarks**:

```typescript
// Dans console Metro (npm start)
import { runBenchmarks } from './src/services/database/__tests__/benchmark';
await runBenchmarks();
```

### 🧪 Tests de validation

**Comportement attendu**:
```
EXPLAIN QUERY PLAN SELECT * FROM workouts
WHERE user_id = ? ORDER BY started_at DESC LIMIT 20

Execution plan:
  SEARCH workouts USING INDEX idx_workouts_user_started (user_id=?)
  ✅ Index utilisé!

Duration: 8ms
✅ Excellent (<50ms)
```

**Si pas d'index**:
```
Execution plan:
  SCAN TABLE workouts
  ⚠️ Full table scan (lent!)

Duration: 450ms
❌ Slow (>200ms)
```

---

# 📘 PARTIE 3: AMÉLIORATIONS

> ⏱️ **Temps total**: 7 heures
> 🎯 **À faire**: Optionnel, peut attendre Phase 2-3

---

## Amélioration #7: Chart Abstraction 📘

### ❌ Le problème

**Situation**: On utilise `react-native-chart-kit` maintenant (Expo Go compatible). En Phase 3, on migrera vers `victory-native` (meilleur mais Dev Client required).

**Code actuel**:
```typescript
import { LineChart } from 'react-native-chart-kit';

<LineChart
  data={{ labels, datasets: [{ data }] }}
  chartConfig={{ ... }}
/>
```

**Problème**: Si on utilise ce code partout, migration Phase 3 = tout casser.

### ✅ Solution simple: Wrapper component

**Concept**: On crée NOTRE propre composant `LineChart` qui utilise `react-native-chart-kit` en interne. Plus tard, on change juste l'implémentation interne, pas les 50 endroits qui l'utilisent!

#### Étape 1: Créer abstraction LineChart (2h)

**Fichier**: `src/components/charts/LineChart.tsx` (remplacer ExampleLineChart)

```typescript
/**
 * Line Chart Component
 *
 * Abstraction pour les line charts.
 * Phase 0-2: react-native-chart-kit
 * Phase 3+: Victory Native (swap implementation sans casser le code)
 */

import { LineChart as RNChartKitLineChart } from 'react-native-chart-kit';
import { View, Text, Dimensions } from 'react-native';
import { Colors } from '@/constants';

/**
 * Props AGNOSTIQUES de la lib utilisée
 * Ne pas inclure de props spécifiques à react-native-chart-kit!
 */
interface LineChartProps {
  /** Données à afficher */
  data: number[];

  /** Labels pour l'axe X */
  labels: string[];

  /** Titre optionnel */
  title?: string;

  /** Largeur custom (défaut: screen width - padding) */
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
  width,
  height = 220,
  smoothCurve = true,
}: LineChartProps) {
  const screenWidth = width || Dimensions.get('window').width - 48;

  return (
    <View className="items-center">
      {title && (
        <Text className="text-lg font-semibold text-foreground mb-2">
          {title}
        </Text>
      )}

      {/* Phase 0-2: react-native-chart-kit */}
      <RNChartKitLineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={screenWidth}
        height={height}
        chartConfig={{
          backgroundColor: Colors.background.surface,
          backgroundGradientFrom: Colors.background.surface,
          backgroundGradientTo: Colors.background.elevated,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(66, 153, 225, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: Colors.primary.DEFAULT,
          },
        }}
        bezier={smoothCurve}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      {/* Phase 3+: Victory Native (décommenter)
      <VictoryChart width={screenWidth} height={height}>
        <VictoryLine
          data={data.map((y, i) => ({ x: labels[i], y }))}
          style={{ data: { stroke: Colors.primary.DEFAULT } }}
        />
      </VictoryChart>
      */}
    </View>
  );
}
```

**Fichier**: `src/components/charts/index.ts`

```typescript
export { LineChart } from './LineChart';
// Ajouter BarChart, PieChart, etc. plus tard
```

#### Étape 2: Usage dans l'app (1h)

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

      {/* Utiliser NOTRE composant, pas react-native-chart-kit direct */}
      <LineChart
        data={weeklyVolume}
        labels={weekLabels}
        title="Volume Hebdomadaire (kg)"
      />
    </View>
  );
}
```

**Bénéfice**: En Phase 3, on change juste `LineChart.tsx`, pas `stats.tsx`!

---

## Amélioration #8: Domain vs Database Types 📘

### ❌ Le problème

**Situation actuelle**:
```
src/
├── services/database/types.ts    # Types DB (Workout, Exercise, etc.)
├── types/                         # Vide
```

**Confusion future**: Où mettre les types pour features non-DB?

**Exemple Phase 3**:
```typescript
// Feature: Workout templates
export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[]; // ❌ Exercise vient de database/types.ts
  // Mais WorkoutTemplate n'est PAS une table DB!
}
```

### ✅ Solution: Séparer Domain vs Database

**Concept**:
- **Database types** = colonnes SQL exactes (`user_id`, `started_at`, etc.)
- **Domain types** = entités métier pour l'UI (`userId`, `startedAt`, etc.)

**Avantage**: Découplage. L'UI ne dépend pas du schema SQL.

#### Étape 1: Créer domain types (2h)

**Fichier**: `src/types/domain/Workout.ts`

```typescript
/**
 * Domain Workout Type
 *
 * Représentation "business" d'un workout (pour l'UI).
 * Différent du type database (colonnes SQL).
 */

export interface Workout {
  id: string;
  userId: string; // camelCase (pas user_id)
  startedAt: Date; // Date object (pas timestamp)
  completedAt?: Date;
  duration?: number; // milliseconds (pas seconds)
  title?: string;
  notes?: string;
}

export interface WorkoutWithExercises extends Workout {
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  orderIndex: number;
  supersetGroup?: string;
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  id: string;
  setNumber: number;
  weight?: number;
  reps?: number;
  rpe?: number;
  rir?: number;
  isWarmup: boolean;
  isFailure: boolean;
}
```

**Fichier**: `src/types/domain/index.ts`

```typescript
export * from './Workout';
// export * from './Exercise';
// etc.
```

#### Étape 2: Créer mappers DB <-> Domain (2h)

**Fichier**: `src/services/database/mappers.ts`

```typescript
/**
 * Mappers entre Database types et Domain types
 *
 * Pourquoi?
 * - DB types = snake_case, timestamps
 * - Domain types = camelCase, Date objects
 */

import type { Workout as DBWorkout } from './types';
import type { Workout as DomainWorkout } from '@/types/domain';

/**
 * Convertir DB workout → Domain workout
 */
export function toDomainWorkout(dbWorkout: DBWorkout): DomainWorkout {
  return {
    id: dbWorkout.id,
    userId: dbWorkout.user_id,
    startedAt: new Date(dbWorkout.started_at * 1000), // timestamp → Date
    completedAt: dbWorkout.completed_at
      ? new Date(dbWorkout.completed_at * 1000)
      : undefined,
    duration: dbWorkout.duration_seconds
      ? dbWorkout.duration_seconds * 1000 // seconds → ms
      : undefined,
    title: dbWorkout.title,
    notes: dbWorkout.notes,
  };
}

/**
 * Convertir Domain workout → DB workout (pour insert/update)
 */
export function toDBWorkout(domainWorkout: DomainWorkout): Partial<DBWorkout> {
  return {
    id: domainWorkout.id,
    user_id: domainWorkout.userId,
    started_at: Math.floor(domainWorkout.startedAt.getTime() / 1000), // Date → timestamp
    completed_at: domainWorkout.completedAt
      ? Math.floor(domainWorkout.completedAt.getTime() / 1000)
      : undefined,
    duration_seconds: domainWorkout.duration
      ? Math.floor(domainWorkout.duration / 1000) // ms → seconds
      : undefined,
    title: domainWorkout.title,
    notes: domainWorkout.notes,
  };
}
```

#### Étape 3: Utiliser domain types dans Repository (1h)

**Fichier**: `src/services/database/repositories/IWorkoutRepository.ts`

```typescript
// Modifier imports pour utiliser domain types
import type { Workout } from '@/types/domain';

export interface IWorkoutRepository {
  // create/get retournent maintenant domain types
  create(data: Omit<Workout, 'id'>): Promise<Workout>;
  getById(id: string): Promise<Workout | null>;
  // ...
}
```

**Fichier**: `src/services/database/repositories/SQLiteWorkoutRepository.ts`

```typescript
import { toDomainWorkout, toDBWorkout } from '../mappers';
import type { Workout } from '@/types/domain';

export class SQLiteWorkoutRepository implements IWorkoutRepository {
  async getById(id: string): Promise<Workout | null> {
    try {
      const db = getDatabase();
      const dbWorkout = await db.getFirstAsync<DBWorkout>(
        `SELECT * FROM workouts WHERE id = ?`,
        [id]
      );

      if (!dbWorkout) return null;

      // Convertir DB → Domain avant de retourner
      return toDomainWorkout(dbWorkout);
    } catch (error) {
      throw new DatabaseError('Failed to get workout', 'DB_QUERY_FAILED', error);
    }
  }
}
```

**Bénéfice**: L'UI manipule toujours des `Date` et `camelCase`, peu importe comment c'est stocké en DB.

---

# 🎯 CHECKLIST FINALE

## 🚨 CRITIQUES (à faire demain)

- [ ] **Correction #1**: User ID Persistence (4h)
  - [ ] Créer `authPersistence.ts`
  - [ ] Modifier `authStore.ts` avec `initializeAuth()`
  - [ ] Appeler dans `_layout.tsx`
  - [ ] Valider user_id dans `workouts.ts`
  - [ ] Ajouter `sync_user_id` au schema
  - [ ] Tests: user survit au restart

- [ ] **Correction #2**: Zustand Persist (2h)
  - [ ] Ajouter persist à `workoutStore.ts`
  - [ ] Ajouter persist à `authStore.ts`
  - [ ] Tests: workout actif survit au restart

- [ ] **Correction #3**: Error Handling (3h)
  - [ ] Créer `utils/errors.ts` (custom errors)
  - [ ] Wrapper `database/workouts.ts` avec try/catch
  - [ ] Créer `hooks/ui/useErrorHandler.ts`
  - [ ] Exemple usage dans component
  - [ ] Tests: errors catchées proprement

## ⚠️ IMPORTANTES (avant Phase 2)

- [ ] **Correction #4**: Repository Pattern (8h)
  - [ ] Créer `IWorkoutRepository` interface
  - [ ] Créer `SQLiteWorkoutRepository` implémentation
  - [ ] Créer factory + DI
  - [ ] Migrer hooks vers repository
  - [ ] Tests: repository fonctionne

- [ ] **Correction #5**: Sync Conflicts (8h)
  - [ ] Ajouter version tracking au schema
  - [ ] Modifier CREATE/UPDATE pour incrémenter version
  - [ ] Implémenter conflict detection dans `sync.ts`
  - [ ] Créer migration DB
  - [ ] Tests: conflicts détectés + résolus

- [ ] **Correction #6**: Database Indexes (2h)
  - [ ] Ajouter indexes dans `db.ts`
  - [ ] Créer `__tests__/benchmark.ts`
  - [ ] Lancer benchmarks
  - [ ] Tests: queries <50ms

## 📘 OPTIONNELLES (Phase 2-3)

- [ ] **Amélioration #7**: Chart Abstraction (3h)
  - [ ] Créer `components/charts/LineChart.tsx`
  - [ ] Utiliser dans `stats.tsx`
  - [ ] Tests: chart s'affiche

- [ ] **Amélioration #8**: Domain Types (4h)
  - [ ] Créer `types/domain/Workout.ts`
  - [ ] Créer `mappers.ts`
  - [ ] Utiliser dans Repository
  - [ ] Tests: mapping DB <-> Domain

---

# 📝 POUR CLAUDE (Session Future)

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

### En cas d'erreur

**Si erreur TypeScript**:
1. Lire l'erreur complètement
2. Vérifier les imports (`@/services`, `@/types`, etc.)
3. Vérifier que types sont bien exportés (`export interface`)
4. Si blocké, demander à Patrick

**Si erreur runtime**:
1. Vérifier console Metro (`npm start`)
2. Lire le stack trace complet
3. Vérifier que database est initialisée (`initDatabase()`)
4. Si blocké, demander à Patrick

### Ordre recommandé d'implémentation

**Jour 1** (9h):
1. Correction #1 (User Persistence) - 4h
2. Correction #2 (Zustand Persist) - 2h
3. Correction #3 (Error Handling) - 3h

**Jour 2** (10h):
4. Correction #4 (Repository) - 8h (peut déborder)
5. Correction #6 (Indexes) - 2h

**Jour 3** (8h):
6. Correction #5 (Sync Conflicts) - 8h

**Jour 4** (optionnel, 7h):
7. Amélioration #7 (Charts) - 3h
8. Amélioration #8 (Domain Types) - 4h

---

## 🎯 Résumé pour Patrick

**Qu'avons-nous identifié?**
- 3 problèmes CRITIQUES qui peuvent causer perte de données
- 3 problèmes IMPORTANTS qui bloqueront Phase 2-3
- 2 améliorations OPTIONNELLES pour code plus propre

**Combien de temps?**
- Minimum vital: 1 jour (Corrections 1-3)
- Recommandé: 3 jours (Corrections 1-6)
- Parfait: 4 jours (tout)

**Dois-je vraiment tout faire?**
- **OUI pour Corrections 1-3** (sinon data loss production)
- **OUI pour Corrections 4-6** (sinon 2 semaines refactor Phase 3)
- **NON pour Améliorations 7-8** (nice to have, pas bloquant)

**Next step demain**:
1. Ouvrir nouvelle session Claude
2. Dire: "Claude, implémente la Correction #1 selon AUDIT_FIXES.md"
3. Laisser Claude travailler
4. Valider que ça marche avec les tests
5. Répéter pour Corrections #2, #3, etc.

**Courage!** Ces corrections vont rendre ton architecture ROCK SOLID. 💪
