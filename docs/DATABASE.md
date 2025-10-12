# 📦 Database Guide - Halterofit

**Solution:** expo-sqlite + Supabase sync (Expo Go compatible)
**Migration:** WatermelonDB when 1000+ users OR performance issues

---

## 📂 Database Service Files

```
src/services/database/
├── db.ts              # SQLite initialization + schema
├── types.ts           # TypeScript types (match SQL schema)
├── workouts.ts        # CRUD operations (Create, Read, Update, Delete)
├── sync.ts            # Supabase sync (~200 lines)
├── index.ts           # Centralized exports
└── __tests__/example.ts  # Usage examples
```

---

## 🔄 Comment Ça Marche

### 1. **Local First** (Instant)
```typescript
// User log un set → Sauvegarde locale immédiate
const set = await logSet(workoutExerciseId, 1, {
  weight: 100,
  reps: 8,
  rir: 2
});
// ✅ Instant, pas d'attente réseau
```

### 2. **Sync Background** (Automatique)
```typescript
// Après workout completé
await completeWorkout(workoutId);
autoSync(); // Non-blocking, sync en arrière-plan
```

### 3. **Offline-First**
```typescript
// Même sans internet
await logSet(...); // ✅ Marche
await completeWorkout(...); // ✅ Marche

// Quand internet revient
await syncToSupabase(); // Sync tout ce qui est pending
```

---

## 💡 Exemples d'Utilisation

### Initialiser la DB (au démarrage app)

```typescript
// src/app/_layout.tsx
import { initDatabase } from '@/services/database';

export default function RootLayout() {
  useEffect(() => {
    initDatabase().then(() => {
      console.log('Database ready');
    });
  }, []);

  return <Stack />;
}
```

### Créer et Logger un Workout

```typescript
import {
  createWorkout,
  addExerciseToWorkout,
  logSet,
  completeWorkout,
  autoSync,
} from '@/services/database';

// 1. Start workout
const workout = await createWorkout({
  user_id: 'user-123',
  started_at: Math.floor(Date.now() / 1000),
  title: 'Push Day A',
});

// 2. Add exercise
const workoutExercise = await addExerciseToWorkout(
  workout.id,
  'exercise-bench-press-id',
  1 // order_index
);

// 3. Log sets
await logSet(workoutExercise.id, 1, { weight: 100, reps: 8, rir: 2 });
await logSet(workoutExercise.id, 2, { weight: 100, reps: 7, rir: 1 });
await logSet(workoutExercise.id, 3, { weight: 100, reps: 6, rir: 0 });

// 4. Complete workout
await completeWorkout(workout.id);

// 5. Sync (background)
autoSync(); // Non-blocking
```

### Lire les Workouts

```typescript
import { getUserWorkouts, getWorkoutWithDetails } from '@/services/database';

// Get last 20 workouts
const workouts = await getUserWorkouts('user-123', 20, 0);

// Get full details (with exercises + sets)
const fullWorkout = await getWorkoutWithDetails(workouts[0].id);

console.log(fullWorkout);
// {
//   id: '...',
//   title: 'Push Day A',
//   exercises: [
//     {
//       exercise: { name: 'Bench Press', ... },
//       sets: [
//         { weight: 100, reps: 8, rir: 2 },
//         { weight: 100, reps: 7, rir: 1 },
//       ]
//     }
//   ]
// }
```

### Repeat Last Workout

```typescript
import { getLastCompletedWorkout, createWorkout, addExerciseToWorkout } from '@/services/database';

// Get last workout
const last = await getLastCompletedWorkout('user-123');

if (last) {
  // Create new workout
  const newWorkout = await createWorkout({
    user_id: 'user-123',
    started_at: Math.floor(Date.now() / 1000),
    title: last.title, // Same title
  });

  // Add same exercises
  for (const ex of last.exercises) {
    await addExerciseToWorkout(
      newWorkout.id,
      ex.exercise_id,
      ex.order_index,
      ex.superset_group
    );
  }
}
```

### Check Sync Status

```typescript
import { getSyncStatus, syncToSupabase } from '@/services/database';

const status = await getSyncStatus();
console.log(status);
// {
//   isOnline: true,
//   pendingWorkouts: 3,
//   pendingSets: 45
// }

if (status.pendingWorkouts > 0) {
  const result = await syncToSupabase();
  console.log(`Synced ${result.syncedWorkouts} workouts`);
}
```

---

## 🔧 Schéma SQLite

### Tables

```sql
users
├─ id (TEXT PRIMARY KEY)
├─ email
├─ preferred_unit ('kg' | 'lbs')
├─ nutrition_phase ('bulk' | 'cut' | 'maintenance')
└─ timestamps

exercises
├─ id (TEXT PRIMARY KEY)
├─ name
├─ category, exercise_type
├─ muscle_groups (JSON string)
├─ equipment, difficulty
├─ is_custom (0 | 1)
└─ timestamps

workouts
├─ id (TEXT PRIMARY KEY)
├─ user_id (FK → users)
├─ started_at, completed_at
├─ duration_seconds
├─ title, notes
├─ synced (0 | 1) ← Important pour sync!
└─ timestamps

workout_exercises (junction table)
├─ id (TEXT PRIMARY KEY)
├─ workout_id (FK → workouts)
├─ exercise_id (FK → exercises)
├─ order_index (1, 2, 3...)
├─ superset_group ('A', 'B'...)
├─ synced (0 | 1)
└─ timestamps

exercise_sets
├─ id (TEXT PRIMARY KEY)
├─ workout_exercise_id (FK → workout_exercises)
├─ set_number (1, 2, 3...)
├─ weight, weight_unit, reps
├─ rpe (1-10), rir (0-5)
├─ rest_time_seconds
├─ is_warmup, is_failure (0 | 1)
├─ synced (0 | 1)
└─ timestamps
```

### Indexes pour Performance

```sql
-- Optimized queries
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_started_at ON workouts(started_at DESC);
CREATE INDEX idx_workouts_synced ON workouts(synced);

-- Etc. (voir db.ts)
```

---

## 🚀 Migration Future (Phase 3+)

### Quand Migrer ?

✅ **Migrer vers WatermelonDB si** :
- 1000+ users actifs
- Problèmes performance (lag, slow queries)
- Besoins features avancées (reactive queries, etc.)

❌ **PAS besoin de migrer si** :
- <500 users
- Tout marche bien
- Pas de plaintes performance

### Étapes Migration

```
1. Créer Dev Client (1 jour)
   npm install @nozbe/watermelondb
   npx expo prebuild
   npx expo run:ios

2. Créer schema WatermelonDB (2h)
   src/models/Workout.ts
   src/models/Exercise.ts
   etc.

3. Migration données (4h)
   SQLite → WatermelonDB
   Tester avec users existants

4. Remplacer sync (1h)
   Supprimer sync.ts (200 lignes)
   Utiliser WatermelonDB sync (20 lignes)

5. Tests (1 jour)
   Vérifier tout marche

Total: 2-3 jours
```

---

## ⚡ Performance

### Actuel (expo-sqlite)

| Opération | Temps |
|-----------|-------|
| Log 1 set | <10ms |
| Load 20 workouts | <50ms |
| Load workout full details | <100ms |
| Sync 100 sets | 2-3s |

### Limites

- **100-500 workouts** : Excellent ✅
- **500-1000 workouts** : Bon ✅
- **1000-2000 workouts** : OK ⚠️
- **2000+ workouts** : Migrer WatermelonDB 🔄

---

## 🐛 Debugging

### Voir contenu database

```typescript
import { getDatabaseStats } from '@/services/database';

const stats = await getDatabaseStats();
console.log(stats);
// { workouts: 45, exercises: 1300, sets: 892 }
```

### Reset database (testing only)

```typescript
import { resetDatabase } from '@/services/database';

await resetDatabase(); // ⚠️ SUPPRIME TOUT
```

### Voir sync errors

```typescript
import { syncToSupabase } from '@/services/database';

const result = await syncToSupabase();
if (!result.success) {
  console.log('Errors:', result.errors);
}
```

---

## ✅ Avantages Architecture Actuelle

1. ✅ **Simple** : Pas de dépendances complexes
2. ✅ **Rapide** : SQLite natif
3. ✅ **Expo Go** : Pas besoin Dev Client
4. ✅ **Type-safe** : TypeScript partout
5. ✅ **Évolutif** : Migration WatermelonDB facile si besoin

## ⚠️ Limitations Connues

1. ⚠️ **Sync manuel** : 200 lignes code custom (vs auto)
2. ⚠️ **Pas reactive** : Besoin manual refresh (vs .observe())
3. ⚠️ **Conflicts simples** : Last write wins (vs smart resolution)

---

## 📚 Ressources

- [expo-sqlite docs](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [SQLite docs](https://www.sqlite.org/docs.html)
- [WatermelonDB migration guide](https://nozbe.github.io/WatermelonDB/) (future)
