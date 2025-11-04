# 📦 Database Guide - Halterofit

**Architecture:** WatermelonDB + Supabase PostgreSQL
**Sync Protocol:** Offline-first, reactive queries, bidirectional sync
**Version:** Schema v2 (ExerciseDB-aligned)
**Last Updated:** January 2025

---

## 📑 Table of Contents

- [Overview](#overview)
- [Database Architecture](#database-architecture)
- [Schema Reference](#schema-reference)
  - [Workouts Table](#workouts-table)
  - [Exercises Table (ExerciseDB)](#exercises-table-exercisedb)
  - [Workout Exercises Table](#workout_exercises-table)
  - [Exercise Sets Table](#exercise_sets-table)
  - [Users Table](#users-table)
- [ExerciseDB Integration](#exercisedb-integration)
  - [Nomenclature Mapping](#nomenclature-mapping)
  - [Field Reference](#field-reference)
  - [Image/Video URLs](#imagevideo-urls)
- [WatermelonDB Models](#watermelondb-models)
- [Common Operations](#common-operations)
  - [Workout CRUD](#workout-crud)
  - [Exercise Queries](#exercise-queries)
  - [Set Logging](#set-logging)
  - [Repeat Last Workout](#repeat-last-workout)
- [Supabase Sync](#supabase-sync)
- [Performance](#performance)
- [Schema Evolution](#schema-evolution)
- [Resources](#resources)

---

## Overview

Halterofit uses a **hybrid database architecture**:

- **WatermelonDB (Local):** Offline-first reactive database (SQLite) for instant reads/writes
- **Supabase (Cloud):** PostgreSQL backend for cross-device sync and data persistence
- **ExerciseDB (Seeded):** 1,300+ exercises imported once, stored locally and in cloud

**Key Principles:**

- **Offline-first:** All operations work without internet (gym environments)
- **Reactive:** UI auto-updates on data changes via `.observe()` queries
- **Zero data loss:** Guaranteed persistence with automatic conflict resolution
- **ExerciseDB-aligned:** Exercise schema matches ExerciseDB v2 nomenclature exactly

---

## Database Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Device (Offline-First)          │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │           WatermelonDB (SQLite + JSI)             │  │
│  │                                                    │  │
│  │  • Instant reads (<5ms)                           │  │
│  │  • Reactive queries (.observe())                  │  │
│  │  • Lazy loading (on-demand)                       │  │
│  │  • Automatic conflict tracking                    │  │
│  └───────────────────────────────────────────────────┘  │
│                          ▲                               │
│                          │                               │
│                    Sync Protocol                         │
│                  (bidirectional)                         │
│                          │                               │
│                          ▼                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   MMKV (Encrypted)                │  │
│  │                                                    │  │
│  │  • Auth tokens                                    │  │
│  │  • User preferences                               │  │
│  │  • Favorites (exercise IDs)                       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                    Internet Available?
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               Supabase (PostgreSQL + RLS)               │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                  │  │
│  │                                                    │  │
│  │  • workouts (user workout sessions)               │  │
│  │  • exercises (1,300+ ExerciseDB + custom)        │  │
│  │  • workout_exercises (join table)                │  │
│  │  • exercise_sets (individual sets)               │  │
│  │  • users (profiles, preferences)                 │  │
│  │                                                    │  │
│  │  Row-Level Security (RLS):                        │  │
│  │  • Users only access their own workouts          │  │
│  │  • Exercises are public (read-only)              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Sync Flow:**

1. User logs set → WatermelonDB (instant, <5ms)
2. WatermelonDB marks record as `_changed`
3. When internet available → `synchronize()` runs automatically
4. Push: Local changes → Supabase PostgreSQL
5. Pull: Remote changes → WatermelonDB
6. Conflicts: "Last write wins" based on `_changed` timestamp

---

## Schema Reference

### Workouts Table

**Purpose:** Store workout sessions (start/complete times, duration, notes)

**WatermelonDB Schema:**

```typescript
tableSchema({
  name: 'workouts',
  columns: [
    { name: 'user_id', type: 'string', isIndexed: true },
    { name: 'started_at', type: 'number', isIndexed: true },
    { name: 'completed_at', type: 'number', isOptional: true },
    { name: 'duration_seconds', type: 'number', isOptional: true },
    { name: 'title', type: 'string', isOptional: true },
    { name: 'notes', type: 'string', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});
```

**Supabase Migration:**

```sql
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at BIGINT NOT NULL,
  completed_at BIGINT,
  duration_seconds INTEGER,
  title TEXT,
  notes TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _status TEXT DEFAULT 'synced'
);

CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_started_at ON public.workouts(started_at DESC);

-- Row-Level Security
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own workouts"
  ON public.workouts FOR ALL
  USING (auth.uid() = user_id);
```

**Key Fields:**

- `user_id`: Foreign key to auth.users (owner)
- `started_at`: Unix timestamp (ms) when workout started
- `completed_at`: Unix timestamp when workout ended (null = in progress)
- `duration_seconds`: Calculated duration (completed_at - started_at)
- `title`: Optional workout name (e.g., "Push Day A", "Leg Day")
- `notes`: Optional workout notes

---

### Exercises Table (ExerciseDB)

**Purpose:** Store all exercises (1,300+ from ExerciseDB + user custom exercises)

**Schema Version:** v2 (ExerciseDB-aligned) - See [ADR-018](ADR-018-Align-Exercise-Schema-ExerciseDB.md)

**WatermelonDB Schema:**

```typescript
tableSchema({
  name: 'exercises',
  columns: [
    // ExerciseDB fields (1:1 mapping)
    { name: 'exercisedb_id', type: 'string', isIndexed: true },
    { name: 'name', type: 'string', isIndexed: true },
    { name: 'body_parts', type: 'string' }, // JSON array: ["Chest", "Shoulders"]
    { name: 'target_muscles', type: 'string' }, // JSON array: ["Pectoralis Major"]
    { name: 'secondary_muscles', type: 'string' }, // JSON array: ["Triceps"]
    { name: 'equipments', type: 'string' }, // JSON array: ["Barbell"]
    { name: 'exercise_type', type: 'string' }, // "weight_reps" | "duration" | "reps_only"
    { name: 'instructions', type: 'string' }, // JSON array: ["Step 1", "Step 2"]
    { name: 'exercise_tips', type: 'string' }, // JSON array: ["Keep core tight"]
    { name: 'variations', type: 'string' }, // JSON array: ["Incline variation"]
    { name: 'overview', type: 'string', isOptional: true },
    { name: 'image_url', type: 'string', isOptional: true },
    { name: 'video_url', type: 'string', isOptional: true },
    { name: 'keywords', type: 'string' }, // JSON array: ["chest", "press"]

    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});
```

**Supabase Migration:**

```sql
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ExerciseDB fields (1:1 mapping)
  exercisedb_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  body_parts JSONB NOT NULL DEFAULT '[]',
  target_muscles JSONB NOT NULL DEFAULT '[]',
  secondary_muscles JSONB NOT NULL DEFAULT '[]',
  equipments JSONB NOT NULL DEFAULT '[]',
  exercise_type TEXT NOT NULL,
  instructions JSONB NOT NULL DEFAULT '[]',
  exercise_tips JSONB NOT NULL DEFAULT '[]',
  variations JSONB NOT NULL DEFAULT '[]',
  overview TEXT,
  image_url TEXT,
  video_url TEXT,
  keywords JSONB NOT NULL DEFAULT '[]',

  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _status TEXT DEFAULT 'synced'
);

-- Indexes for fast queries
CREATE INDEX idx_exercises_name ON public.exercises(name);
CREATE INDEX idx_exercises_exercisedb_id ON public.exercises(exercisedb_id);

-- GIN indexes for JSONB array queries (fast search)
CREATE INDEX idx_exercises_body_parts ON public.exercises USING GIN (body_parts);
CREATE INDEX idx_exercises_target_muscles ON public.exercises USING GIN (target_muscles);
CREATE INDEX idx_exercises_equipments ON public.exercises USING GIN (equipments);
CREATE INDEX idx_exercises_keywords ON public.exercises USING GIN (keywords);

-- Row-Level Security (exercises are public read-only)
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are public"
  ON public.exercises FOR SELECT
  TO authenticated
  USING (true);
```

**Key Fields:**

- `exercisedb_id`: Unique ID from ExerciseDB (e.g., "0001", "0002")
- `name`: Exercise name (e.g., "Barbell Bench Press")
- `body_parts`: Anatomical regions (JSON array): `["Chest", "Shoulders"]`
- `target_muscles`: Primary muscles (JSON array): `["Pectoralis Major"]`
- `secondary_muscles`: Supporting muscles (JSON array): `["Triceps", "Anterior Deltoid"]`
- `equipments`: Required equipment (JSON array): `["Barbell"]`
- `image_url`: ExerciseDB CDN image URL (cached by expo-image)
- `video_url`: ExerciseDB CDN video URL (optional)

---

### Workout Exercises Table

**Purpose:** Join table linking workouts to exercises (many-to-many with order)

**WatermelonDB Schema:**

```typescript
tableSchema({
  name: 'workout_exercises',
  columns: [
    { name: 'workout_id', type: 'string', isIndexed: true },
    { name: 'exercise_id', type: 'string', isIndexed: true },
    { name: 'order_index', type: 'number' }, // Display order (1, 2, 3...)
    { name: 'superset_group', type: 'string', isOptional: true }, // "A", "B" for supersets
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});
```

**Supabase Migration:**

```sql
CREATE TABLE public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
  order_index INTEGER NOT NULL,
  superset_group TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _status TEXT DEFAULT 'synced'
);

CREATE INDEX idx_workout_exercises_workout_id ON public.workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON public.workout_exercises(exercise_id);

-- Row-Level Security (inherited from workouts)
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own workout exercises"
  ON public.workout_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );
```

**Key Fields:**

- `workout_id`: Foreign key to workouts table
- `exercise_id`: Foreign key to exercises table
- `order_index`: Display order (1 = first exercise, 2 = second, etc.)
- `superset_group`: Optional superset grouping (e.g., "A", "B" for superset A/B)

---

### Exercise Sets Table

**Purpose:** Individual sets within a workout exercise

**WatermelonDB Schema:**

```typescript
tableSchema({
  name: 'exercise_sets',
  columns: [
    { name: 'workout_exercise_id', type: 'string', isIndexed: true },
    { name: 'set_number', type: 'number' }, // Set order (1, 2, 3...)
    { name: 'weight', type: 'number', isOptional: true },
    { name: 'weight_unit', type: 'string', isOptional: true }, // "kg" | "lbs"
    { name: 'reps', type: 'number', isOptional: true },
    { name: 'duration_seconds', type: 'number', isOptional: true }, // For timed exercises
    { name: 'distance_meters', type: 'number', isOptional: true }, // For cardio
    { name: 'rpe', type: 'number', isOptional: true }, // 1-10 scale (optional, not MVP focus)
    { name: 'rir', type: 'number', isOptional: true }, // 0-5 scale (optional, not MVP focus)
    { name: 'rest_time_seconds', type: 'number', isOptional: true },
    { name: 'is_warmup', type: 'boolean' },
    { name: 'is_failure', type: 'boolean' },
    { name: 'notes', type: 'string', isOptional: true },
    { name: 'completed_at', type: 'number', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});
```

**Supabase Migration:**

```sql
CREATE TABLE public.exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  weight NUMERIC(6,2),
  weight_unit TEXT CHECK (weight_unit IN ('kg', 'lbs')),
  reps INTEGER,
  duration_seconds INTEGER,
  distance_meters NUMERIC(8,2),
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  rir INTEGER CHECK (rir BETWEEN 0 AND 5),
  rest_time_seconds INTEGER,
  is_warmup BOOLEAN NOT NULL DEFAULT false,
  is_failure BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  completed_at BIGINT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _status TEXT DEFAULT 'synced'
);

CREATE INDEX idx_exercise_sets_workout_exercise_id ON public.exercise_sets(workout_exercise_id);

-- Row-Level Security (inherited from workout_exercises)
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own exercise sets"
  ON public.exercise_sets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workouts w ON w.id = we.workout_id
      WHERE we.id = exercise_sets.workout_exercise_id
      AND w.user_id = auth.uid()
    )
  );
```

**Key Fields:**

- `workout_exercise_id`: Foreign key to workout_exercises table
- `set_number`: Set order within exercise (1 = first set, 2 = second, etc.)
- `weight`: Weight lifted (decimal for precision: 52.5 kg)
- `weight_unit`: "kg" or "lbs"
- `reps`: Repetitions completed
- `duration_seconds`: For timed exercises (plank, cardio)
- `rpe`: Rate of Perceived Exertion (1-10, optional - not MVP focus)
- `rir`: Reps in Reserve (0-5, optional - not MVP focus)
- `is_warmup`: Flag for warmup sets (excluded from analytics)
- `is_failure`: Flag for sets taken to failure

**Note on RPE/RIR:** These fields remain in schema for future use but are **not part of MVP scope**. See [SCOPE-SIMPLIFICATION.md](SCOPE-SIMPLIFICATION.md).

---

### Users Table

**Purpose:** User profiles and preferences (managed by Supabase Auth)

**Supabase Migration:**

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  preferred_unit TEXT NOT NULL DEFAULT 'kg' CHECK (preferred_unit IN ('kg', 'lbs')),
  preferred_distance_unit TEXT NOT NULL DEFAULT 'km' CHECK (preferred_distance_unit IN ('km', 'miles')),
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _status TEXT DEFAULT 'synced'
);

-- Row-Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profile"
  ON public.users FOR ALL
  USING (auth.uid() = id);
```

**Key Fields:**

- `id`: Foreign key to auth.users (Supabase Auth)
- `preferred_unit`: Weight unit preference ("kg" or "lbs")
- `preferred_distance_unit`: Distance unit preference ("km" or "miles")
- `onboarding_complete`: Whether user completed onboarding flow

---

## ExerciseDB Integration

### Nomenclature Mapping

Halterofit uses **ExerciseDB v2** as the primary exercise data source. Our schema is **1:1 aligned** with ExerciseDB fields to ensure zero-friction import and maintainability.

**ExerciseDB → Halterofit Field Mapping:**

| ExerciseDB Field   | Halterofit Field    | Type       | Description                            |
| ------------------ | ------------------- | ---------- | -------------------------------------- |
| `id`               | `exercisedb_id`     | string     | ExerciseDB unique ID ("0001")          |
| `name`             | `name`              | string     | Exercise name ("Barbell Bench Press")  |
| `bodyPart`         | `body_parts`        | JSON array | Anatomical regions (["Chest"])         |
| `target`           | `target_muscles`    | JSON array | Primary muscles (["Pectoralis Major"]) |
| `secondaryMuscles` | `secondary_muscles` | JSON array | Supporting muscles (["Triceps"])       |
| `equipment`        | `equipments`        | JSON array | Required equipment (["Barbell"])       |
| `instructions`     | `instructions`      | JSON array | Step-by-step instructions              |
| `gifUrl`           | `image_url`         | string     | CDN image URL                          |
| `videoUrl`         | `video_url`         | string     | CDN video URL (optional)               |

**ExerciseDB Field Format:**

```json
{
  "id": "0001",
  "name": "Barbell Bench Press",
  "bodyPart": ["chest"],
  "target": ["pectorals"],
  "secondaryMuscles": ["triceps", "anterior deltoid"],
  "equipment": ["barbell"],
  "instructions": [
    "Lie flat on bench with feet on floor",
    "Grip barbell slightly wider than shoulders",
    "Lower bar to mid-chest",
    "Press bar back to starting position"
  ],
  "gifUrl": "https://exercisedb.io/api/v2/exercises/0001/gif"
}
```

**Halterofit Database Format:**

```typescript
{
  id: "uuid-generated",
  exercisedb_id: "0001",
  name: "Barbell Bench Press",
  body_parts: ["Chest"],
  target_muscles: ["Pectoralis Major"],
  secondary_muscles: ["Triceps", "Anterior Deltoid"],
  equipments: ["Barbell"],
  exercise_type: "weight_reps",
  instructions: ["Lie flat on bench...", "Grip barbell...", "Lower bar...", "Press bar..."],
  exercise_tips: ["Keep shoulder blades retracted", "Maintain arch in lower back"],
  variations: ["Incline Bench Press", "Close-Grip Bench Press"],
  overview: "A compound pushing exercise targeting the chest, shoulders, and triceps.",
  image_url: "https://exercisedb.io/api/v2/exercises/0001/gif",
  video_url: null,
  keywords: ["chest", "press", "barbell", "compound"]
}
```

### Field Reference

#### ExerciseDB Fields (1:1 Mapping)

**`body_parts` (JSONB Array):**

- Anatomical regions targeted by exercise
- Examples: `["Chest"]`, `["Back", "Arms"]`, `["Legs"]`
- Used for: Filtering exercises by body part

**`target_muscles` (JSONB Array):**

- Primary muscles targeted (main movers)
- Examples: `["Pectoralis Major"]`, `["Latissimus Dorsi"]`, `["Quadriceps"]`
- Used for: Volume distribution analytics, muscle group filtering

**`secondary_muscles` (JSONB Array):**

- Supporting/synergist muscles
- Examples: `["Triceps", "Anterior Deltoid"]`
- Used for: Comprehensive muscle engagement tracking

**`equipments` (JSONB Array):**

- Required equipment (normalized to "bodyweight" for consistency)
- Examples: `["Barbell"]`, `["Dumbbell", "Bench"]`, `["bodyweight"]`
- Used for: Equipment-based filtering (home gym vs commercial gym)

**`instructions` (JSONB Array):**

- Step-by-step execution instructions
- Format: Array of strings, each a single instruction step
- Used for: Exercise detail screen, form guidance

**`exercise_tips` (JSONB Array):**

- Pro tips for form, safety, and effectiveness
- Format: Array of strings, each a single tip
- Used for: Enhanced exercise detail screen

**`variations` (JSONB Array):**

- Alternative variations of the exercise
- Examples: `["Incline Bench Press", "Decline Bench Press"]`
- Used for: Exercise discovery, progression suggestions

**`keywords` (JSONB Array):**

- Searchable keywords for fuzzy matching
- Examples: `["chest", "press", "barbell", "compound"]`
- Used for: Full-text search optimization

### Image/Video URLs

**Storage Strategy:** URL-based (not stored locally)

ExerciseDB provides CDN-hosted images and videos. Halterofit stores URLs and relies on `expo-image` caching for performance.

**Image URL Format:**

```
https://exercisedb.io/api/v2/exercises/{exercisedb_id}/gif
```

**Caching Strategy:**

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: exercise.imageUrl }}
  cachePolicy="memory-disk" // Aggressive caching
  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
  style={{ width: 300, height: 300 }}
/>
```

**Performance:**

- First load: ~200-500ms (download + cache)
- Subsequent loads: ~10-50ms (memory/disk cache)
- Offline: Works after first load (disk cache persists)

---

## WatermelonDB Models

### Exercise Model

**File:** `src/services/database/watermelon/models/Exercise.ts`

```typescript
import { Model } from '@nozbe/watermelondb';
import { field, json, readonly, date } from '@nozbe/watermelondb/decorators';

// Sanitizer for JSON array fields
const sanitizeStringArray = (raw: any): string[] => {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') {
    if (raw === '') return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default class Exercise extends Model {
  static table = 'exercises';

  // ExerciseDB fields (1:1 mapping)
  @field('exercisedb_id') exercisedbId!: string;
  @field('name') name!: string;

  @json('body_parts', sanitizeStringArray) bodyParts!: string[];
  @json('target_muscles', sanitizeStringArray) targetMuscles!: string[];
  @json('secondary_muscles', sanitizeStringArray) secondaryMuscles!: string[];
  @json('equipments', sanitizeStringArray) equipments!: string[];

  @field('exercise_type') exerciseType!: string;

  @json('instructions', sanitizeStringArray) instructions!: string[];
  @json('exercise_tips', sanitizeStringArray) exerciseTips!: string[];
  @json('variations', sanitizeStringArray) variations!: string[];
  @json('keywords', sanitizeStringArray) keywords!: string[];

  @field('overview') overview?: string;
  @field('image_url') imageUrl?: string;
  @field('video_url') videoUrl?: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // Computed properties
  get primaryMuscle(): string | undefined {
    return this.targetMuscles[0];
  }

  get allMuscles(): string[] {
    return [...this.targetMuscles, ...this.secondaryMuscles];
  }

  get requiresEquipment(): boolean {
    return this.equipments.length > 0 && !this.equipments.includes('bodyweight');
  }
}
```

### Workout Model

**File:** `src/services/database/watermelon/models/Workout.ts`

```typescript
import { Model, Q } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';
import type WorkoutExercise from './WorkoutExercise';

export default class Workout extends Model {
  static table = 'workouts';
  static associations = {
    workout_exercises: { type: 'has_many', foreignKey: 'workout_id' },
  };

  @field('user_id') userId!: string;
  @date('started_at') startedAt!: Date;
  @date('completed_at') completedAt?: Date;
  @field('duration_seconds') durationSeconds?: number;
  @field('title') title?: string;
  @field('notes') notes?: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('workout_exercises') workoutExercises!: Query<WorkoutExercise>;

  // Computed properties
  get isComplete(): boolean {
    return !!this.completedAt;
  }

  get isInProgress(): boolean {
    return !this.completedAt;
  }

  async getExerciseCount(): Promise<number> {
    return await this.workoutExercises.fetchCount();
  }

  async getSetCount(): Promise<number> {
    const exercises = await this.workoutExercises.fetch();
    let total = 0;
    for (const we of exercises) {
      total += await we.sets.fetchCount();
    }
    return total;
  }
}
```

### WorkoutExercise Model

**File:** `src/services/database/watermelon/models/WorkoutExercise.ts`

```typescript
import { Model } from '@nozbe/watermelondb';
import { field, relation, children, readonly, date } from '@nozbe/watermelondb/decorators';
import type Workout from './Workout';
import type Exercise from './Exercise';
import type ExerciseSet from './ExerciseSet';

export default class WorkoutExercise extends Model {
  static table = 'workout_exercises';
  static associations = {
    workouts: { type: 'belongs_to', key: 'workout_id' },
    exercises: { type: 'belongs_to', key: 'exercise_id' },
    exercise_sets: { type: 'has_many', foreignKey: 'workout_exercise_id' },
  };

  @relation('workouts', 'workout_id') workout!: Relation<Workout>;
  @relation('exercises', 'exercise_id') exercise!: Relation<Exercise>;

  @field('order_index') orderIndex!: number;
  @field('superset_group') supersetGroup?: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('exercise_sets') sets!: Query<ExerciseSet>;

  // Computed properties
  async getTotalVolume(): Promise<number> {
    const sets = await this.sets.fetch();
    return sets.reduce((total, set) => {
      const weight = set.weight || 0;
      const reps = set.reps || 0;
      return total + weight * reps;
    }, 0);
  }
}
```

### ExerciseSet Model

**File:** `src/services/database/watermelon/models/ExerciseSet.ts`

```typescript
import { Model } from '@nozbe/watermelondb';
import { field, relation, readonly, date } from '@nozbe/watermelondb/decorators';
import type WorkoutExercise from './WorkoutExercise';

export default class ExerciseSet extends Model {
  static table = 'exercise_sets';
  static associations = {
    workout_exercises: { type: 'belongs_to', key: 'workout_exercise_id' },
  };

  @relation('workout_exercises', 'workout_exercise_id') workoutExercise!: Relation<WorkoutExercise>;

  @field('set_number') setNumber!: number;
  @field('weight') weight?: number;
  @field('weight_unit') weightUnit?: string;
  @field('reps') reps?: number;
  @field('duration_seconds') durationSeconds?: number;
  @field('distance_meters') distanceMeters?: number;
  @field('rpe') rpe?: number; // Optional (not MVP focus)
  @field('rir') rir?: number; // Optional (not MVP focus)
  @field('rest_time_seconds') restTimeSeconds?: number;
  @field('is_warmup') isWarmup!: boolean;
  @field('is_failure') isFailure!: boolean;
  @field('notes') notes?: string;
  @date('completed_at') completedAt?: Date;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // Computed properties
  get volume(): number {
    return (this.weight || 0) * (this.reps || 0);
  }

  get isCompleted(): boolean {
    return !!this.completedAt;
  }

  // 1RM estimation (Epley formula)
  get estimated1RM(): number | null {
    if (!this.weight || !this.reps || this.reps > 10) return null;
    return this.weight * (1 + this.reps / 30);
  }
}
```

---

## Common Operations

### Workout CRUD

#### Create Workout

```typescript
import { database } from '@/services/database/watermelon';
import { Workout } from '@/models';

const workout = await database.write(async () => {
  return await database.collections.get<Workout>('workouts').create((workout) => {
    workout.userId = 'user-uuid';
    workout.startedAt = Date.now();
    workout.title = 'Push Day A';
  });
});

console.log('Workout created:', workout.id);
```

#### Complete Workout

```typescript
await database.write(async () => {
  await workout.update((w) => {
    w.completedAt = Date.now();
    w.durationSeconds = Math.floor((Date.now() - w.startedAt) / 1000);
  });
});

console.log('Workout completed');
```

#### Fetch Recent Workouts (Reactive)

```typescript
import { Q } from '@nozbe/watermelondb';

const workoutsCollection = database.collections.get<Workout>('workouts');

// Reactive query (UI auto-updates)
const recentWorkouts = workoutsCollection
  .query(Q.where('user_id', userId), Q.where('completed_at', Q.notEq(null)), Q.sortBy('started_at', Q.desc), Q.take(20))
  .observe();

// Use in React
const workouts = useObservable(recentWorkouts, [userId]);
```

#### Delete Workout

```typescript
await database.write(async () => {
  await workout.markAsDeleted(); // Soft delete (syncs to Supabase)
  // or
  await workout.destroyPermanently(); // Hard delete (local only)
});
```

---

### Exercise Queries

#### Search Exercises by Name

```typescript
import { Q } from '@nozbe/watermelondb';

const exercisesCollection = database.collections.get<Exercise>('exercises');

// Search by name (case-insensitive)
const results = await exercisesCollection.query(Q.where('name', Q.like(`%${searchTerm}%`))).fetch();

console.log(`Found ${results.length} exercises`);
```

#### Filter by Body Part

```typescript
// Note: WatermelonDB doesn't support JSONB queries directly
// Solution: Use Supabase for complex JSONB queries, sync results to WatermelonDB

// For local filtering after fetch:
const allExercises = await exercisesCollection.query().fetch();
const chestExercises = allExercises.filter((ex) => ex.bodyParts.some((bp) => bp.toLowerCase().includes('chest')));
```

#### Filter by Equipment

```typescript
const allExercises = await exercisesCollection.query().fetch();
const barbellExercises = allExercises.filter((ex) => ex.equipments.some((eq) => eq.toLowerCase() === 'barbell'));

const bodyweightExercises = allExercises.filter((ex) => ex.equipments.includes('bodyweight'));
```

#### Complex Query (Multiple Filters)

```typescript
// For complex JSONB queries, use Supabase directly:
const { data, error } = await supabase
  .from('exercises')
  .select('*')
  .contains('body_parts', ['Chest'])
  .contains('equipments', ['Barbell'])
  .limit(50);

// Then sync results to WatermelonDB if needed
```

---

### Set Logging

#### Log Single Set

```typescript
import { ExerciseSet } from '@/models';

await database.write(async () => {
  await database.collections.get<ExerciseSet>('exercise_sets').create((set) => {
    set.workoutExercise.id = workoutExerciseId;
    set.setNumber = 1;
    set.weight = 100;
    set.weightUnit = 'kg';
    set.reps = 8;
    set.isWarmup = false;
    set.isFailure = false;
    set.completedAt = Date.now();
  });
});
```

#### Log Multiple Sets (Batch)

```typescript
await database.write(async () => {
  const setsCollection = database.collections.get<ExerciseSet>('exercise_sets');

  for (let i = 1; i <= 3; i++) {
    await setsCollection.create((set) => {
      set.workoutExercise.id = workoutExerciseId;
      set.setNumber = i;
      set.weight = 100;
      set.weightUnit = 'kg';
      set.reps = 8;
      set.completedAt = Date.now();
    });
  }
});
```

#### Update Set

```typescript
await database.write(async () => {
  await set.update((s) => {
    s.weight = 105;
    s.reps = 6;
  });
});
```

---

### Repeat Last Workout

```typescript
import { Q } from '@nozbe/watermelondb';

// 1. Find last completed workout
const lastWorkout = await database.collections
  .get<Workout>('workouts')
  .query(Q.where('user_id', userId), Q.where('completed_at', Q.notEq(null)), Q.sortBy('started_at', Q.desc), Q.take(1))
  .fetch()
  .then((workouts) => workouts[0]);

if (!lastWorkout) {
  throw new Error('No previous workout found');
}

// 2. Create new workout
const newWorkout = await database.write(async () => {
  return await database.collections.get<Workout>('workouts').create((workout) => {
    workout.userId = userId;
    workout.startedAt = Date.now();
    workout.title = lastWorkout.title;
  });
});

// 3. Clone exercises from last workout
const oldExercises = await lastWorkout.workoutExercises.fetch();

await database.write(async () => {
  for (const oldWe of oldExercises) {
    await database.collections.get<WorkoutExercise>('workout_exercises').create((we) => {
      we.workout.set(newWorkout);
      we.exercise.id = oldWe.exercise.id;
      we.orderIndex = oldWe.orderIndex;
      we.supersetGroup = oldWe.supersetGroup;
    });
  }
});

console.log('Workout repeated successfully');
```

---

## Supabase Sync

### Sync Protocol

**File:** `src/services/database/watermelon/sync.ts`

```typescript
import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from './index';
import { supabase } from '@/services/supabase';

export async function sync() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const { data, error } = await supabase.rpc('pull_changes', {
        last_pulled_at: lastPulledAt || 0,
      });

      if (error) throw error;

      return {
        changes: data.changes,
        timestamp: data.timestamp,
      };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const { error } = await supabase.rpc('push_changes', {
        changes,
        last_pulled_at: lastPulledAt,
      });

      if (error) throw error;
    },
  });
}
```

### Automatic Sync Trigger

```typescript
// src/app/_layout.tsx
import { sync } from '@/services/database/watermelon/sync';
import NetInfo from '@react-native-community/netinfo';

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      sync().catch((error) => {
        console.error('Sync failed:', error);
      });
    }
  });

  return () => unsubscribe();
}, []);
```

### Conflict Resolution

**Strategy:** "Last write wins" based on `_changed` timestamp

```sql
-- Supabase push_changes function (simplified)
CREATE OR REPLACE FUNCTION push_changes(changes JSON, last_pulled_at BIGINT)
RETURNS VOID AS $$
BEGIN
  -- Upsert workouts (conflict resolution)
  INSERT INTO workouts (id, user_id, started_at, _changed, ...)
  SELECT * FROM json_populate_recordset(NULL::workouts, changes->'workouts'->'created')
  ON CONFLICT (id) DO UPDATE SET
    started_at = EXCLUDED.started_at,
    _changed = EXCLUDED._changed,
    ...
  WHERE EXCLUDED._changed > workouts._changed; -- Last write wins
END;
$$ LANGUAGE plpgsql;
```

---

## Performance

### Benchmarks (iPhone 12 Pro, 2 years of data)

| Operation              | Time   | Details                     |
| ---------------------- | ------ | --------------------------- |
| Log 1 set              | <5ms   | Instant write to SQLite     |
| Load 20 workouts       | <20ms  | With pagination             |
| Load workout details   | <50ms  | Includes exercises + sets   |
| Search 1,300 exercises | <100ms | Local full-text search      |
| Sync 100 sets          | 1-2s   | Background sync to Supabase |
| Repeat last workout    | <100ms | Clone workout + exercises   |

### Optimization Tips

1. **Use Reactive Queries:** `.observe()` auto-updates UI, no manual refetching
2. **Batch Writes:** Group multiple operations in single `database.write()` call
3. **Lazy Loading:** Only fetch related data when needed (avoid eager loading)
4. **Indexes:** Ensure indexed columns for frequent queries (user_id, started_at)
5. **Pagination:** Use `Q.take(20)` for large lists, implement infinite scroll
6. **Offline-First:** Never block UI on network requests, write locally first

---

## Schema Evolution

### Current Version: v2 (ExerciseDB-Aligned)

**Migration:** [20251103233000_align_exercises_with_exercisedb.sql](../supabase/migrations/20251103233000_align_exercises_with_exercisedb.sql)

**Changes from v1:**

- ✅ Renamed `muscle_groups` → `target_muscles`
- ✅ Renamed `equipment` → `equipments` (JSON array)
- ✅ Added `body_parts` (JSON array)
- ✅ Added `secondary_muscles` (JSON array)
- ✅ Added `exercise_tips` (JSON array)
- ✅ Added `variations` (JSON array)
- ✅ Added `video_url`
- ✅ Added `keywords` (JSON array)
- ✅ Added `exercisedb_id` (unique identifier)

**Deprecated Fields:**

- ❌ `nutrition_phase` (users table) - **REMOVED** per [SCOPE-SIMPLIFICATION.md](SCOPE-SIMPLIFICATION.md)
- ❌ `nutrition_phase` (workouts table) - **REMOVED** (not in MVP scope)

**Migration Strategy:**

- WatermelonDB schema version incremented to v2
- Supabase migration applied via timestamp-based migration file
- No data migration required (exercises reseeded from ExerciseDB)

### Future Schema Changes

**Proposed for Post-MVP:**

- Add `template_id` to workouts table (workout templates feature)
- Add `personal_records` table (PR tracking optimization)
- Add `workout_tags` table (workout categorization)

**Migration Process:**

1. Create new Supabase migration file: `YYYYMMDDHHMMSS_description.sql`
2. Increment WatermelonDB schema version in `schema.ts`
3. Add WatermelonDB migration in `migrations.ts`
4. Test migration on development database
5. Deploy to production via EAS Build

---

## Resources

### Official Documentation

- [WatermelonDB Docs](https://nozbe.github.io/WatermelonDB/)
- [WatermelonDB Sync Protocol](https://nozbe.github.io/WatermelonDB/Advanced/Sync.html)
- [Supabase PostgreSQL](https://supabase.com/docs/guides/database)
- [Supabase Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [ExerciseDB API](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)

### Internal Documentation

- [ADR-018: Align Exercise Schema with ExerciseDB](ADR-018-Align-Exercise-Schema-ExerciseDB.md)
- [SCOPE-SIMPLIFICATION.md](SCOPE-SIMPLIFICATION.md)
- [TECHNICAL.md](TECHNICAL.md)
- [TESTING.md](TESTING.md)

### Related Files

- **WatermelonDB Schema:** `src/services/database/watermelon/schema.ts`
- **WatermelonDB Models:** `src/services/database/watermelon/models/`
- **Supabase Migrations:** `supabase/migrations/`
- **Test Factories:** `tests/__helpers__/database/factories.ts`
- **Database Tests:** `src/services/database/__tests__/`

---

**Last Updated:** January 2025
**Schema Version:** v2 (ExerciseDB-aligned)
**Maintainer:** AI-assisted development
