-- Consolidated Schema v5: ExerciseDB V1 + WatermelonDB Sync
-- Replaces 8 incremental migrations
-- Date: 2025-11-05

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  preferred_unit TEXT NOT NULL DEFAULT 'kg' CHECK (preferred_unit IN ('kg', 'lbs')),

  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  _status TEXT CHECK (_status IS NULL OR _status = 'deleted')
);

-- Exercises: ExerciseDB V1 (1,300 text-only)
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
  description TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL DEFAULT 'strength' CHECK (category IN ('strength', 'cardio', 'stretching')),

  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  _status TEXT CHECK (_status IS NULL OR _status = 'deleted')
);

-- Workouts
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  started_at BIGINT NOT NULL,
  completed_at BIGINT,
  duration_seconds INTEGER,
  title TEXT,
  notes TEXT,

  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  _status TEXT CHECK (_status IS NULL OR _status = 'deleted')
);

-- Workout Exercises
CREATE TABLE public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,

  order_index INTEGER NOT NULL,
  superset_group TEXT,
  notes TEXT,
  target_sets INTEGER,
  target_reps INTEGER,

  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  _status TEXT CHECK (_status IS NULL OR _status = 'deleted')
);

-- Exercise Sets
CREATE TABLE public.exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,

  set_number INTEGER NOT NULL,
  weight NUMERIC(6,2),
  weight_unit TEXT CHECK (weight_unit IN ('kg', 'lbs')),
  reps INTEGER,
  duration_seconds INTEGER,
  distance_meters NUMERIC(10,2),
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  rir INTEGER CHECK (rir BETWEEN 0 AND 5),
  rest_time_seconds INTEGER,
  is_warmup BOOLEAN NOT NULL DEFAULT false,
  is_failure BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  completed_at BIGINT,

  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT,
  _status TEXT CHECK (_status IS NULL OR _status = 'deleted')
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_changed ON public.users(_changed) WHERE _status IS NULL;

-- Exercises (GIN for JSONB)
CREATE INDEX idx_exercises_name ON public.exercises(name);
CREATE INDEX idx_exercises_exercisedb_id ON public.exercises(exercisedb_id);
CREATE INDEX idx_exercises_body_parts ON public.exercises USING GIN (body_parts);
CREATE INDEX idx_exercises_target_muscles ON public.exercises USING GIN (target_muscles);
CREATE INDEX idx_exercises_equipments ON public.exercises USING GIN (equipments);
CREATE INDEX idx_exercises_changed ON public.exercises(_changed) WHERE _status IS NULL;

-- Workouts
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_started_at ON public.workouts(started_at DESC);
CREATE INDEX idx_workouts_user_started ON public.workouts(user_id, started_at DESC);
CREATE INDEX idx_workouts_changed ON public.workouts(user_id, _changed) WHERE _status IS NULL;

-- Workout Exercises
CREATE INDEX idx_workout_exercises_workout_id ON public.workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON public.workout_exercises(exercise_id);
CREATE INDEX idx_workout_exercises_order ON public.workout_exercises(workout_id, order_index);
CREATE INDEX idx_workout_exercises_changed ON public.workout_exercises(_changed) WHERE _status IS NULL;

-- Exercise Sets
CREATE INDEX idx_exercise_sets_workout_exercise_id ON public.exercise_sets(workout_exercise_id);
CREATE INDEX idx_exercise_sets_changed ON public.exercise_sets(_changed) WHERE _status IS NULL;

-- ============================================================
-- TRIGGERS (CVE-2018-1058 secure)
-- ============================================================

CREATE OR REPLACE FUNCTION update_changed_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW._changed := (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT;
  NEW.updated_at := (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';

CREATE TRIGGER users_changed BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_changed_timestamp();

CREATE TRIGGER exercises_changed BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION update_changed_timestamp();

CREATE TRIGGER workouts_changed BEFORE UPDATE ON public.workouts
  FOR EACH ROW EXECUTE FUNCTION update_changed_timestamp();

CREATE TRIGGER workout_exercises_changed BEFORE UPDATE ON public.workout_exercises
  FOR EACH ROW EXECUTE FUNCTION update_changed_timestamp();

CREATE TRIGGER exercise_sets_changed BEFORE UPDATE ON public.exercise_sets
  FOR EACH ROW EXECUTE FUNCTION update_changed_timestamp();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

-- Users: own profile
CREATE POLICY "Users see own profile" ON public.users FOR ALL
  USING (auth.uid() = id);

-- Exercises: read-only
CREATE POLICY "Exercises are public" ON public.exercises FOR SELECT
  TO authenticated USING (true);

-- Workouts: own data
CREATE POLICY "Users see own workouts" ON public.workouts FOR ALL
  USING (auth.uid() = user_id);

-- Workout Exercises: inherited
CREATE POLICY "Users see own workout exercises" ON public.workout_exercises FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

-- Exercise Sets: inherited
CREATE POLICY "Users see own exercise sets" ON public.exercise_sets FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.workout_exercises we
    JOIN public.workouts w ON w.id = we.workout_id
    WHERE we.id = exercise_sets.workout_exercise_id
    AND w.user_id = auth.uid()
  ));
