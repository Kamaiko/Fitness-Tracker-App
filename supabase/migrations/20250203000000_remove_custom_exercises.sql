--------------------------------------------------------------------------------
-- MIGRATION: Remove Custom Exercises (ADR-017)
-- Description: Simplify exercises table to read-only ExerciseDB library
-- Date: 2025-02-03
-- Author: Halterofit Team
-- References: docs/ADR-017-No-Custom-Exercises-MVP.md
--------------------------------------------------------------------------------

-- ============================================================================
-- SECTION 1: DROP EXISTING POLICIES (Custom Exercise Policies)
-- ============================================================================

-- Drop old custom exercise policies
DROP POLICY IF EXISTS "Anyone can view exercises" ON public.exercises;
DROP POLICY IF EXISTS "Users can create custom exercises" ON public.exercises;
DROP POLICY IF EXISTS "Users can update own custom exercises" ON public.exercises;
DROP POLICY IF EXISTS "Users can delete own custom exercises" ON public.exercises;

-- ============================================================================
-- SECTION 2: REMOVE CUSTOM EXERCISE COLUMNS
-- ============================================================================

-- Remove is_custom column (no longer needed)
ALTER TABLE public.exercises
  DROP COLUMN IF EXISTS is_custom;

-- Remove created_by column (no longer needed)
ALTER TABLE public.exercises
  DROP COLUMN IF EXISTS created_by;

-- ============================================================================
-- SECTION 3: ENFORCE EXERCISEDB_ID CONSTRAINT
-- ============================================================================

-- Make exercisedb_id NOT NULL (all exercises from ExerciseDB)
-- First, ensure no NULL values exist (should be empty table at this stage)
UPDATE public.exercises SET exercisedb_id = 'TEMP_' || id::TEXT WHERE exercisedb_id IS NULL;

ALTER TABLE public.exercises
  ALTER COLUMN exercisedb_id SET NOT NULL;

-- ============================================================================
-- SECTION 4: SIMPLIFY RLS POLICIES (Read-Only)
-- ============================================================================

-- All exercises are public read-only
CREATE POLICY "Anyone can view exercises"
  ON public.exercises FOR SELECT
  TO authenticated
  USING (true);

-- NO INSERT/UPDATE/DELETE policies (read-only table)
-- Exercises are populated via seed script only

-- ============================================================================
-- SECTION 5: UPDATE SYNC FUNCTION (Remove Exercises from Sync)
-- ============================================================================

-- Update pull_changes() to EXCLUDE exercises entirely
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

      -- ❌ EXERCISES REMOVED FROM SYNC
      -- Exercises are seeded locally from bundle (assets/data/exercises-seed.json)
      -- NOT synced via WatermelonDB sync protocol

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

-- ============================================================================
-- SECTION 6: ADD FUTURE-PROOFING COMMENT
-- ============================================================================

COMMENT ON TABLE public.exercises IS
'Exercise library from ExerciseDB API (1,300+ exercises).
READ-ONLY for MVP.
Custom exercises MAY be added in Phase 3+ based on beta user feedback.
See docs/ADR-017-No-Custom-Exercises-MVP.md for details.';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Migration successfully:
-- ✅ Removed is_custom and created_by columns
-- ✅ Enforced exercisedb_id NOT NULL (all from ExerciseDB)
-- ✅ Simplified RLS policies (read-only)
-- ✅ Updated pull_changes() to exclude exercises from sync
-- ✅ Added future-proofing documentation
