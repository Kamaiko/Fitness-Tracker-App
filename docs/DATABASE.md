# 📦 Database Guide - Halterofit

**Architecture:** WatermelonDB + Supabase PostgreSQL
**Sync Protocol:** Offline-first, reactive queries, bidirectional sync
**Version:** Schema v5 (7 migrations: 5 schema-changing + 2 non-schema)
**Last Updated:** November 2025

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
- [Migration History](#migration-history)
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
- **ExerciseDB-aligned:** Exercise schema matches ExerciseDB V1 API structure (images deferred to post-MVP)

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
│  │  • exercises (1,300+ ExerciseDB - read-only)     │  │
│  │  • workout_exercises (join table)                │  │
│  │  • exercise_sets (individual sets)               │  │
│  │  • users (profiles, preferences)                 │  │
│  │                                                    │  │
│  │  Row-Level Security (RLS):                        │  │
│  │  • Users only access their own workouts          │  │
│  │  • Exercises are public, read-only (ExerciseDB)  │  │
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

**Purpose:** Store all exercises (1,300+ from ExerciseDB V1 API - read-only library)

**Schema Version:** v5 (ExerciseDB V1-aligned) - Images deferred to post-MVP

**WatermelonDB Schema:**

```typescript
tableSchema({
  name: 'exercises',
  columns: [
    // ExerciseDB V1 fields
    { name: 'exercisedb_id', type: 'string', isIndexed: true },
    { name: 'name', type: 'string', isIndexed: true },
    { name: 'body_parts', type: 'string' }, // JSON array: ["waist"]
    { name: 'target_muscles', type: 'string' }, // JSON array: ["abs"]
    { name: 'secondary_muscles', type: 'string' }, // JSON array: ["hip flexors"]
    { name: 'equipments', type: 'string' }, // JSON array: ["body weight"]
    { name: 'instructions', type: 'string' }, // JSON array: ["Step 1", "Step 2"]

    // V1-specific fields
    { name: 'description', type: 'string' }, // Detailed exercise description
    { name: 'difficulty', type: 'string' }, // "beginner" | "intermediate" | "advanced"
    { name: 'category', type: 'string' }, // "strength" | "cardio" | "stretching"

    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});
```

**Supabase Migration:**

```sql
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ExerciseDB V1 fields
  exercisedb_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  body_parts JSONB NOT NULL DEFAULT '[]',
  target_muscles JSONB NOT NULL DEFAULT '[]',
  secondary_muscles JSONB NOT NULL DEFAULT '[]',
  equipments JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',

  -- V1-specific fields
  description TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  category TEXT NOT NULL DEFAULT 'strength',

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

-- Row-Level Security (exercises are public read-only)
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are public"
  ON public.exercises FOR SELECT
  TO authenticated
  USING (true);
```

**Key Fields:**

- `exercisedb_id`: Unique ID from ExerciseDB (e.g., "0001", "0002")
- `name`: Exercise name (e.g., "3/4 sit-up", "Barbell Bench Press")
- `body_parts`: Anatomical regions (JSON array): `["waist"]`, `["chest"]`
- `target_muscles`: Primary muscles (JSON array): `["abs"]`, `["pectorals"]`
- `secondary_muscles`: Supporting muscles (JSON array): `["hip flexors", "lower back"]`
- `equipments`: Required equipment (JSON array): `["body weight"]`, `["barbell"]`
- `instructions`: Step-by-step execution (JSON array): `["Lie flat...", "Engaging abs..."]`
- `description`: Detailed exercise description (V1 field)
- `difficulty`: Difficulty level - "beginner", "intermediate", or "advanced" (V1 field)
- `category`: Exercise category - "strength", "cardio", or "stretching" (V1 field)

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

**Purpose:** User profiles and preferences

**Schema:**

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  preferred_unit TEXT NOT NULL DEFAULT 'kg' CHECK (preferred_unit IN ('kg', 'lbs')),
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  _changed BIGINT NOT NULL,
  _status TEXT
);
```

**Key Fields:**

- `id`: Auth user reference
- `email`: User email
- `preferred_unit`: Weight unit (kg or lbs)

---

## ExerciseDB Integration

### Nomenclature Mapping

Halterofit uses **ExerciseDB V1 API** as the primary exercise data source (1,300+ exercises). Our schema is **aligned** with ExerciseDB V1 structure with conversions for optimal local database performance.

**Current Version:** V1 Dataset (RapidAPI)
**Images:** Deferred to post-MVP (AI-generated or open-source GitHub repos)

**ExerciseDB V1 → Halterofit Field Mapping:**

| ExerciseDB Field   | Halterofit Field    | Type       | Conversion                                   |
| ------------------ | ------------------- | ---------- | -------------------------------------------- |
| `id`               | `exercisedb_id`     | string     | Direct mapping                               |
| `name`             | `name`              | string     | Direct mapping                               |
| `bodyPart`         | `body_parts`        | JSON array | **STRING → ARRAY** ("waist" → ["waist"])     |
| `target`           | `target_muscles`    | JSON array | **STRING → ARRAY** ("abs" → ["abs"])         |
| `secondaryMuscles` | `secondary_muscles` | JSON array | Direct mapping (already array)               |
| `equipment`        | `equipments`        | JSON array | **STRING → ARRAY** ("barbell" → ["barbell"]) |
| `instructions`     | `instructions`      | JSON array | Direct mapping                               |
| `description` ✨   | `description`       | string     | V1: Detailed exercise description            |
| `difficulty` ✨    | `difficulty`        | string     | V1: "beginner"\|"intermediate"\|"advanced"   |
| `category` ✨      | `category`          | string     | V1: "strength"\|"cardio"\|"stretching"       |

**Note:** ✨ = Bonus V1 fields not in original V2 design

**ExerciseDB V1 API Response Format:**

```json
{
  "id": "0001",
  "name": "3/4 sit-up",
  "bodyPart": "waist",
  "target": "abs",
  "secondaryMuscles": ["hip flexors", "lower back"],
  "equipment": "body weight",
  "instructions": [
    "Lie flat on your back with your knees bent and feet flat on the ground.",
    "Place your hands behind your head with your elbows pointing outwards.",
    "Engaging your abs, slowly lift your upper body off the ground.",
    "Pause for a moment at the top, then slowly lower back down.",
    "Repeat for the desired number of repetitions."
  ],
  "description": "The 3/4 sit-up is an abdominal exercise performed with body weight. It involves curling the torso up to a 45-degree angle, engaging the abs, hip flexors, and lower back.",
  "difficulty": "beginner",
  "category": "strength"
}
```

**Halterofit Database Format (WatermelonDB):**

```typescript
{
  id: "uuid-generated",
  exercisedb_id: "0001",
  name: "3/4 sit-up",
  body_parts: ["waist"],           // Converted from string → array
  target_muscles: ["abs"],         // Converted from string → array
  secondary_muscles: ["hip flexors", "lower back"],
  equipments: ["body weight"],     // Converted from string → array
  instructions: ["Lie flat...", "Place hands...", "Engaging abs...", "Pause...", "Repeat..."],
  description: "The 3/4 sit-up is an abdominal exercise...",
  difficulty: "beginner",
  category: "strength",
  created_at: 1234567890,
  updated_at: 1234567890
}
```

**V1 vs V2 Comparison:**

| Feature          | V1 (Current)     | V2 (Future)        |
| ---------------- | ---------------- | ------------------ |
| Exercise Count   | 1,300            | 5,000+             |
| Images           | ❌ Not available | ✅ Included        |
| Videos           | ❌ Not available | ✅ Included        |
| Exercise Tips    | ❌ Not available | ✅ Included        |
| Variations       | ❌ Not available | ✅ Included        |
| Difficulty Level | ✅ Included      | ❌ Not available   |
| Category         | ✅ Included      | ❌ Not available   |
| Description      | ✅ Included      | ❌ (uses overview) |

### Field Reference

#### ExerciseDB V1 Fields

**`body_parts` (JSONB Array):**

- Anatomical regions targeted by exercise
- Examples: `["waist"]`, `["chest"]`, `["back"]`
- Used for: Filtering exercises by body part
- Note: V1 API returns strings, converted to arrays in import script

**`target_muscles` (JSONB Array):**

- Primary muscles targeted (main movers)
- Examples: `["abs"]`, `["pectorals"]`, `["lats"]`
- Used for: Volume distribution analytics, muscle group filtering
- Note: V1 API returns strings, converted to arrays in import script

**`secondary_muscles` (JSONB Array):**

- Supporting/synergist muscles
- Examples: `["hip flexors", "lower back"]`, `["triceps", "anterior deltoid"]`
- Used for: Comprehensive muscle engagement tracking

**`equipments` (JSONB Array):**

- Required equipment
- Examples: `["body weight"]`, `["barbell"]`, `["dumbbell", "bench"]`
- Used for: Equipment-based filtering (home gym vs commercial gym)
- Note: V1 API returns strings, converted to arrays in import script

**`instructions` (JSONB Array):**

- Step-by-step execution instructions
- Format: Array of strings, each a single instruction step
- Used for: Exercise detail screen, form guidance

**`description` (TEXT):**

- Detailed exercise description (V1-specific field)
- Example: "The 3/4 sit-up is an abdominal exercise performed with body weight. It involves curling the torso up to a 45-degree angle..."
- Used for: Exercise overview, search context

**`difficulty` (TEXT):**

- Difficulty level (V1-specific field)
- Values: "beginner", "intermediate", "advanced"
- Used for: Exercise filtering, workout plan generation

**`category` (TEXT):**

- Exercise category (V1-specific field)
- Values: "strength", "cardio", "stretching"
- Used for: Exercise categorization, workout type filtering

---

### ExerciseDB Import Strategy

**Approach:** Database Seeding at Build Time (Option A)

Halterofit uses a **one-time import** strategy aligned with industry best practices (Jefit, Strong):

**Import Process:**

1. **Developer runs import script** (once before publishing app):

   ```bash
   # Test import (dry-run - no data written)
   npm run import-exercisedb -- --dry-run

   # Run actual import
   npm run import-exercisedb
   ```

   - Script calls ExerciseDB API (1,300 exercises)
   - **Zod validation:** Validates API responses to prevent breaking changes
   - Inserts into Supabase PostgreSQL (batch processing: 100/batch)
   - Duration: ~2-3 minutes

   **Zod Validation Context:**
   The import script uses Zod runtime validation to protect against ExerciseDB API schema changes:
   - ✅ Detects field renames/removals (e.g., `bodyPart` → `bodyParts`)
   - ✅ Graceful degradation (skips invalid exercises, doesn't crash)
   - ✅ Detailed error logging (know exactly what failed)
   - Future-proof: API changes won't break app

   **See:** [TECHNICAL.md § Runtime Validation](TECHNICAL.md#runtime-validation--type-safety) for complete Zod patterns

2. **User downloads app** (first launch):
   - WatermelonDB sync() runs automatically
   - Downloads exercises from Supabase → local SQLite
   - Duration: ~30-60 seconds
   - User sees: "Configuring exercise library..."

3. **Offline-first experience**:
   - All 1,300 exercises stored locally
   - Search/filter works 100% offline
   - Zero API calls during runtime

**Update Frequency:** Quarterly (every 3 months)

- ExerciseDB adds ~10-20 exercises/month
- Re-run `npm run import-exercisedb` to fetch new exercises
- Users receive updates via WatermelonDB sync

**Post-MVP:** Automate with Supabase Edge Function (see [TASKS.md § Post-MVP Backlog](TASKS.md#post-mvp-backlog))

**References:**

- Import Script: [scripts/import-exercisedb.ts](../scripts/import-exercisedb.ts)
- Script Docs: [scripts/README.md](../scripts/README.md)
- **Supabase API Keys:** Use new `sb_secret_...` format (June 2025+, see [GitHub discussion](https://github.com/orgs/supabase/discussions/29260))
- [ADR-017: No Custom Exercises in MVP](archives/ADR-017-No-Custom-Exercises-MVP.md)
- [ADR-019: Pure ExerciseDB Schema](archives/ADR-019-Pure-ExerciseDB-Schema.md)

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

  // ExerciseDB V1 fields
  @field('exercisedb_id') exercisedbId!: string;
  @field('name') name!: string;

  @json('body_parts', sanitizeStringArray) bodyParts!: string[];
  @json('target_muscles', sanitizeStringArray) targetMuscles!: string[];
  @json('secondary_muscles', sanitizeStringArray) secondaryMuscles!: string[];
  @json('equipments', sanitizeStringArray) equipments!: string[];

  @json('instructions', sanitizeStringArray) instructions!: string[];

  // V1-specific fields
  @field('description') description!: string;
  @field('difficulty') difficulty!: string;
  @field('category') category!: string;

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
    return this.equipments.length > 0 && !this.equipments.includes('body weight');
  }

  get isBeginner(): boolean {
    return this.difficulty === 'beginner';
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

### Current Version: v5 (ExerciseDB V1-Aligned)

**Migration:** v4→v5 ([migration v5 in migrations.ts](../src/services/database/watermelon/migrations.ts))

**Changes from v4:**

- ❌ **REMOVED** (7 fields): `exercise_type`, `image_url`, `video_url`, `exercise_tips`, `variations`, `overview`, `keywords`
- ✅ **ADDED** (3 V1 fields): `description`, `difficulty`, `category`

**Rationale:**

ExerciseDB V1 API (via RapidAPI) provides text-only data with 1,300 exercises. V2 dataset (with images/videos) exists but is not available for production use. Images deferred to post-MVP backlog.

**Deprecated Fields:**

- ❌ `nutrition_phase` (users table) - **REMOVED** per [SCOPE-SIMPLIFICATION.md](SCOPE-SIMPLIFICATION.md)
- ❌ `nutrition_phase` (workouts table) - **REMOVED** (not in MVP scope)
- ❌ V2-only fields (exercise_type, images, videos, tips, etc.) - **REMOVED** (not in V1 API)

**Migration Strategy:**

- WatermelonDB schema version incremented through v2, v3, v4, v5 (5 schema-changing migrations)
- Supabase migrations applied via timestamp-based files (6 total: 4 schema + 2 non-schema)
- No data migration required (exercises reseeded from ExerciseDB V1)

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

## Migration History

### Consolidated Migration v5 (2025-11-05)

**File:** [`20251105000000_consolidated_schema_v5.sql`](../supabase/migrations/20251105000000_consolidated_schema_v5.sql)

**Purpose:** Single consolidated migration replacing 8 incremental migrations

**Changes:**

- Replaced 8 incremental migrations with single consolidated schema
- Final state: exercises 14 cols (ExerciseDB V1), users 7 cols
- Applied via `supabase db reset` (complete rebuild)

**Schema v5 Final State:**

- **users**: 7 columns (email, preferred_unit + metadata)
- **exercises**: 14 columns (ExerciseDB V1: exercisedb_id, name, body_parts, target_muscles, secondary_muscles, equipments, instructions, description, difficulty, category + metadata)
- **workouts**: 12 columns (user_id, started_at, completed_at, duration_seconds, title, notes + metadata)
- **workout_exercises**: 12 columns (workout_id, exercise_id, order_index, superset_group, notes, target_sets, target_reps + metadata)
- **exercise_sets**: 21 columns (workout_exercise_id, set_number, weight, weight_unit, reps, duration_seconds, distance_meters, rpe, rir, rest_time_seconds, is_warmup, is_failure, notes, completed_at + metadata)

**Rationale:**

- Previous incremental migrations created inconsistent state
- Consolidation provides single source of truth
- Simplified maintenance and future migrations

**Attack Vector (Pre-Fix - CVE-2018-1058):**

```sql
-- Attacker creates malicious function
CREATE FUNCTION public.now() RETURNS TIMESTAMP AS $$
BEGIN
  -- Malicious code here (data exfiltration, privilege escalation)
  RETURN pg_catalog.now();
END;
$$ LANGUAGE plpgsql;

-- Trigger function calls NOW() → resolves to public.now() instead of pg_catalog.now()
```

**Fix:**

```sql
CREATE OR REPLACE FUNCTION update_changed_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- ✅ SECURE: Fully-qualified function name
  NEW._changed := (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT;
  NEW.updated_at := (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''; -- ✅ CRITICAL: Force empty search_path
```

---

### Applying Migrations

**Via Supabase Dashboard (SQL Editor):**

1. Navigate to: https://supabase.com/dashboard/project/_/sql
2. Click **"+ New query"**
3. Copy-paste migration SQL content
4. Click **"Run"**
5. Verify success: Check schema in Table Editor

**Via Supabase CLI (for local development):**

```bash
# Apply all pending migrations
supabase db push

# Create new migration
supabase migration new my_migration_name
```

**Verification Queries:**

```sql
-- Verify exercisedb_id column exists with correct constraints
SELECT
  column_name,
  data_type,
  is_nullable,
  (SELECT constraint_name
   FROM information_schema.constraint_column_usage ccu
   JOIN information_schema.table_constraints tc ON ccu.constraint_name = tc.constraint_name
   WHERE ccu.column_name = 'exercisedb_id'
     AND ccu.table_name = 'exercises'
     AND tc.constraint_type = 'UNIQUE') as unique_constraint
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'exercises'
  AND column_name = 'exercisedb_id';

-- Verify search_path is empty in trigger function
SELECT proname, proconfig
FROM pg_proc
WHERE proname = 'update_changed_timestamp';
-- Expected: proconfig = {search_path=}

-- Check for duplicate indexes
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'exercises'
  AND indexname LIKE '%exercisedb_id%';
-- Expected: Only "exercises_exercisedb_id_unique"
```

---

### Schema Versioning

**Current Version:** v5 (Consolidated Schema)

**WatermelonDB Schema Version:** Defined in [`src/services/database/watermelon/schema.ts`](../src/services/database/watermelon/schema.ts)

```typescript
export const schema = appSchema({
  version: 5, // ExerciseDB V1 + WatermelonDB Sync
  tables: [
    // ... table definitions
  ],
});
```

**Version:** v5 - Consolidated schema (ExerciseDB V1 + WatermelonDB sync protocol)

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

**Last Updated:** November 2025
**Schema Version:** v5 (ExerciseDB V1-aligned)
**Maintainer:** AI-assisted development
