--------------------------------------------------------------------------------
-- MIGRATION: Initial Schema with WatermelonDB Sync Protocol
-- Description: Creates all tables with sync tracking columns (_changed, _status)
-- Date: 2025-01-31
-- Author: Halterofit Team
-- References: docs/DATABASE.md, WatermelonDB Sync Protocol
--------------------------------------------------------------------------------

-- ============================================================================
-- SECTION 1: ENABLE REQUIRED EXTENSIONS
-- ============================================================================

-- Enable UUID generation for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SECTION 2: CREATE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: users
-- Purpose: Store user profiles and preferences
-- Relations: One-to-many with workouts, exercises (custom)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  -- Primary Key
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,

  -- User Data
  email TEXT NOT NULL,
  preferred_unit TEXT NOT NULL DEFAULT 'kg' CHECK (preferred_unit IN ('kg', 'lbs')),
  nutrition_phase TEXT NOT NULL DEFAULT 'maintenance'
    CHECK (nutrition_phase IN ('bulk', 'cut', 'maintenance')),

  -- Timestamps (milliseconds since epoch for WatermelonDB compatibility)
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,

  -- Sync Protocol Columns (WatermelonDB)
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _status TEXT DEFAULT NULL CHECK (_status IS NULL OR _status = 'deleted')
);

-- ----------------------------------------------------------------------------
-- Table: exercises
-- Purpose: Exercise library (1,300+ from ExerciseDB + custom)
-- Relations: Many-to-many with workouts via workout_exercises
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercises (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Exercise Data
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('compound', 'isolation', 'cardio', 'stretching')),
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('strength', 'cardio', 'timed', 'bodyweight')),
  muscle_groups JSONB NOT NULL DEFAULT '[]'::JSONB, -- Array of muscle names
  primary_muscle TEXT NOT NULL,
  equipment TEXT CHECK (equipment IN ('barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'other')),
  instructions TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  image_url TEXT,

  -- Ownership (null = system exercise, UUID = custom user exercise)
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Timestamps
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,

  -- Sync Protocol
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _status TEXT DEFAULT NULL CHECK (_status IS NULL OR _status = 'deleted')
);

-- ----------------------------------------------------------------------------
-- Table: workouts
-- Purpose: Workout sessions with metadata
-- Relations: Belongs to user, has many workout_exercises
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workouts (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Foreign Keys
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Workout Data
  started_at BIGINT NOT NULL, -- Milliseconds since epoch
  completed_at BIGINT, -- NULL = in progress
  duration_seconds INTEGER,
  title TEXT,
  notes TEXT,
  nutrition_phase TEXT NOT NULL DEFAULT 'maintenance'
    CHECK (nutrition_phase IN ('bulk', 'cut', 'maintenance')),

  -- Timestamps
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,

  -- Sync Protocol
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _status TEXT DEFAULT NULL CHECK (_status IS NULL OR _status = 'deleted')
);

-- ----------------------------------------------------------------------------
-- Table: workout_exercises
-- Purpose: Junction table - exercises within a workout (with ordering)
-- Relations: Belongs to workout and exercise
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Foreign Keys
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,

  -- Ordering & Grouping
  order_index INTEGER NOT NULL, -- Exercise order in workout
  superset_group TEXT, -- Group ID for supersets (e.g., 'A', 'B')

  -- Exercise-specific notes and targets
  notes TEXT,
  target_sets INTEGER,
  target_reps INTEGER,

  -- Timestamps
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,

  -- Sync Protocol
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _status TEXT DEFAULT NULL CHECK (_status IS NULL OR _status = 'deleted')
);

-- ----------------------------------------------------------------------------
-- Table: exercise_sets
-- Purpose: Individual set performance data
-- Relations: Belongs to workout_exercise
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercise_sets (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Foreign Key
  workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,

  -- Set Data
  set_number INTEGER NOT NULL,
  weight NUMERIC(6, 2), -- e.g., 225.50 kg
  weight_unit TEXT CHECK (weight_unit IN ('kg', 'lbs')),
  reps INTEGER,
  duration_seconds INTEGER, -- For cardio/timed exercises
  distance_meters NUMERIC(10, 2), -- For cardio

  -- Performance Metrics
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10), -- Rate of Perceived Exertion
  rir INTEGER CHECK (rir BETWEEN 0 AND 5), -- Reps in Reserve
  rest_time_seconds INTEGER,

  -- Set Metadata
  completed_at BIGINT, -- When set was completed
  notes TEXT,
  is_warmup BOOLEAN NOT NULL DEFAULT false,
  is_failure BOOLEAN NOT NULL DEFAULT false,

  -- Timestamps
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,

  -- Sync Protocol
  _changed BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  _status TEXT DEFAULT NULL CHECK (_status IS NULL OR _status = 'deleted')
);

-- ============================================================================
-- SECTION 3: CREATE INDEXES (Performance Optimization)
-- ============================================================================

-- Users
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_changed ON public.users(_changed) WHERE _status IS NULL;

-- Exercises
CREATE INDEX idx_exercises_name ON public.exercises(name);
CREATE INDEX idx_exercises_category ON public.exercises(category);
CREATE INDEX idx_exercises_equipment ON public.exercises(equipment);
CREATE INDEX idx_exercises_custom ON public.exercises(is_custom, created_by);
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

-- ============================================================================
-- SECTION 4: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 5: CREATE RLS POLICIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Policies: users
-- Rule: Users can only access their own profile
-- ----------------------------------------------------------------------------

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- ----------------------------------------------------------------------------
-- Policies: exercises
-- Rule: All authenticated users can read exercises
--       Users can only modify their custom exercises
-- ----------------------------------------------------------------------------

CREATE POLICY "Anyone can view exercises"
  ON public.exercises FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create custom exercises"
  ON public.exercises FOR INSERT
  TO authenticated
  WITH CHECK (
    is_custom = true
    AND (SELECT auth.uid()) = created_by
  );

CREATE POLICY "Users can update own custom exercises"
  ON public.exercises FOR UPDATE
  TO authenticated
  USING (
    is_custom = true
    AND (SELECT auth.uid()) = created_by
  )
  WITH CHECK (
    is_custom = true
    AND (SELECT auth.uid()) = created_by
  );

CREATE POLICY "Users can delete own custom exercises"
  ON public.exercises FOR DELETE
  TO authenticated
  USING (
    is_custom = true
    AND (SELECT auth.uid()) = created_by
  );

-- ----------------------------------------------------------------------------
-- Policies: workouts
-- Rule: Users can only access their own workouts
-- ----------------------------------------------------------------------------

CREATE POLICY "Users can view own workouts"
  ON public.workouts FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create own workouts"
  ON public.workouts FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own workouts"
  ON public.workouts FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own workouts"
  ON public.workouts FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ----------------------------------------------------------------------------
-- Policies: workout_exercises
-- Rule: Users can access workout_exercises for their workouts only
-- Note: Uses subquery to check ownership via workouts table
-- ----------------------------------------------------------------------------

CREATE POLICY "Users can view own workout exercises"
  ON public.workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can create workout exercises for own workouts"
  ON public.workout_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update own workout exercises"
  ON public.workout_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete own workout exercises"
  ON public.workout_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = (SELECT auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- Policies: exercise_sets
-- Rule: Users can access sets for their workout_exercises only
-- Note: Uses nested subquery via workout_exercises → workouts
-- ----------------------------------------------------------------------------

CREATE POLICY "Users can view own exercise sets"
  ON public.exercise_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workouts.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can create sets for own workouts"
  ON public.exercise_sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workouts.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update own exercise sets"
  ON public.exercise_sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workouts.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workouts.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete own exercise sets"
  ON public.exercise_sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workouts.user_id = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- SECTION 6: CREATE TRIGGERS (Auto-update _changed on modification)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: update_changed_timestamp()
-- Purpose: Automatically updates _changed column on any UPDATE
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_changed_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW._changed := (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;
  NEW.updated_at := (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER users_changed
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_changed_timestamp();

CREATE TRIGGER exercises_changed
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_changed_timestamp();

CREATE TRIGGER workouts_changed
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_changed_timestamp();

CREATE TRIGGER workout_exercises_changed
  BEFORE UPDATE ON public.workout_exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_changed_timestamp();

CREATE TRIGGER exercise_sets_changed
  BEFORE UPDATE ON public.exercise_sets
  FOR EACH ROW
  EXECUTE FUNCTION update_changed_timestamp();

-- ============================================================================
-- SECTION 7: CREATE SYNC FUNCTIONS (WatermelonDB Protocol)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: pull_changes(last_pulled_at)
-- Purpose: Returns all changes since last sync (for client to download)
-- Protocol: WatermelonDB Sync - Returns created/updated/deleted records
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION pull_changes(last_pulled_at BIGINT DEFAULT 0)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  current_user_id UUID;
  result JSON;
BEGIN
  -- Get authenticated user ID
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Build response following WatermelonDB Sync protocol
  SELECT json_build_object(
    'changes', json_build_object(

      -- Users table (only current user)
      'users', json_build_object(
        'created', (
          SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
          FROM (
            SELECT * FROM users
            WHERE id = current_user_id
            AND _changed > last_pulled_at
            AND _status IS NULL
          ) t
        ),
        'updated', (
          SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
          FROM (
            SELECT * FROM users
            WHERE id = current_user_id
            AND _changed > last_pulled_at
            AND _status IS NULL
          ) t
        ),
        'deleted', (
          SELECT COALESCE(json_agg(id), '[]'::json)
          FROM users
          WHERE id = current_user_id
          AND _changed > last_pulled_at
          AND _status = 'deleted'
        )
      ),

      -- Exercises table (all exercises for authenticated users)
      'exercises', json_build_object(
        'created', (
          SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
          FROM (
            SELECT * FROM exercises
            WHERE _changed > last_pulled_at
            AND _status IS NULL
          ) t
        ),
        'updated', (
          SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
          FROM (
            SELECT * FROM exercises
            WHERE _changed > last_pulled_at
            AND _status IS NULL
          ) t
        ),
        'deleted', (
          SELECT COALESCE(json_agg(id), '[]'::json)
          FROM exercises
          WHERE _changed > last_pulled_at
          AND _status = 'deleted'
        )
      ),

      -- Workouts table (only user's workouts)
      'workouts', json_build_object(
        'created', (
          SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
          FROM (
            SELECT * FROM workouts
            WHERE user_id = current_user_id
            AND _changed > last_pulled_at
            AND _status IS NULL
          ) t
        ),
        'updated', (
          SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
          FROM (
            SELECT * FROM workouts
            WHERE user_id = current_user_id
            AND _changed > last_pulled_at
            AND _status IS NULL
          ) t
        ),
        'deleted', (
          SELECT COALESCE(json_agg(id), '[]'::json)
          FROM workouts
          WHERE user_id = current_user_id
          AND _changed > last_pulled_at
          AND _status = 'deleted'
        )
      ),

      -- Workout Exercises (via workouts ownership)
      'workout_exercises', json_build_object(
        'created', (
          SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
          FROM (
            SELECT we.* FROM workout_exercises we
            JOIN workouts w ON w.id = we.workout_id
            WHERE w.user_id = current_user_id
            AND we._changed > last_pulled_at
            AND we._status IS NULL
          ) t
        ),
        'updated', (
          SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
          FROM (
            SELECT we.* FROM workout_exercises we
            JOIN workouts w ON w.id = we.workout_id
            WHERE w.user_id = current_user_id
            AND we._changed > last_pulled_at
            AND we._status IS NULL
          ) t
        ),
        'deleted', (
          SELECT COALESCE(json_agg(we.id), '[]'::json)
          FROM workout_exercises we
          JOIN workouts w ON w.id = we.workout_id
          WHERE w.user_id = current_user_id
          AND we._changed > last_pulled_at
          AND we._status = 'deleted'
        )
      ),

      -- Exercise Sets (via workout_exercises → workouts ownership)
      'exercise_sets', json_build_object(
        'created', (
          SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
          FROM (
            SELECT es.* FROM exercise_sets es
            JOIN workout_exercises we ON we.id = es.workout_exercise_id
            JOIN workouts w ON w.id = we.workout_id
            WHERE w.user_id = current_user_id
            AND es._changed > last_pulled_at
            AND es._status IS NULL
          ) t
        ),
        'updated', (
          SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
          FROM (
            SELECT es.* FROM exercise_sets es
            JOIN workout_exercises we ON we.id = es.workout_exercise_id
            JOIN workouts w ON w.id = we.workout_id
            WHERE w.user_id = current_user_id
            AND es._changed > last_pulled_at
            AND es._status IS NULL
          ) t
        ),
        'deleted', (
          SELECT COALESCE(json_agg(es.id), '[]'::json)
          FROM exercise_sets es
          JOIN workout_exercises we ON we.id = es.workout_exercise_id
          JOIN workouts w ON w.id = we.workout_id
          WHERE w.user_id = current_user_id
          AND es._changed > last_pulled_at
          AND es._status = 'deleted'
        )
      )

    ),
    'timestamp', (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
  ) INTO result;

  RETURN result;
END;
$$;

-- ----------------------------------------------------------------------------
-- Function: push_changes(changes)
-- Purpose: Accepts client changes and applies them to database
-- Protocol: WatermelonDB Sync - Receives created/updated/deleted records
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION push_changes(changes JSON)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  current_user_id UUID;
  table_name TEXT;
  record JSON;
BEGIN
  -- Get authenticated user ID
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Process changes for each table
  FOR table_name IN
    SELECT * FROM json_object_keys(changes)
  LOOP
    -- Process created records
    FOR record IN
      SELECT * FROM json_array_elements(changes->table_name->'created')
    LOOP
      EXECUTE format(
        'INSERT INTO %I SELECT * FROM json_populate_record(NULL::%I, $1)
         ON CONFLICT (id) DO UPDATE SET
         _changed = (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT',
        table_name, table_name
      ) USING record;
    END LOOP;

    -- Process updated records
    FOR record IN
      SELECT * FROM json_array_elements(changes->table_name->'updated')
    LOOP
      EXECUTE format(
        'INSERT INTO %I SELECT * FROM json_populate_record(NULL::%I, $1)
         ON CONFLICT (id) DO UPDATE SET
         _changed = (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT',
        table_name, table_name
      ) USING record;
    END LOOP;

    -- Process deleted records (soft delete)
    FOR record IN
      SELECT * FROM json_array_elements(changes->table_name->'deleted')
    LOOP
      EXECUTE format(
        'UPDATE %I SET
         _status = ''deleted'',
         _changed = (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
         WHERE id = $1',
        table_name
      ) USING record::TEXT;
    END LOOP;
  END LOOP;

  RETURN json_build_object('success', true);
END;
$$;

-- ============================================================================
-- SECTION 8: GRANT PERMISSIONS
-- ============================================================================

-- Grant authenticated users access to tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant access to sync functions
GRANT EXECUTE ON FUNCTION pull_changes(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION push_changes(JSON) TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Migration successfully creates:
-- ✅ 5 tables with sync tracking columns
-- ✅ Comprehensive indexes for performance
-- ✅ Row Level Security policies (users see only their data)
-- ✅ Auto-update triggers for _changed column
-- ✅ Sync functions following WatermelonDB protocol
-- ✅ Proper permissions for authenticated users
