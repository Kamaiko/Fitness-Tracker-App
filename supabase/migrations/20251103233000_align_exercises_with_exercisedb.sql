-- Migration: Align exercises table with ExerciseDB nomenclature
-- ADR-018: https://github.com/your-repo/docs/ADR-018-Align-Exercise-Schema-ExerciseDB.md
-- Date: 2025-02-03
-- Author: Patrick Patenaude
-- Description: Refactor exercises schema to 1:1 match ExerciseDB API structure

-- =====================================================================
-- STEP 1: Rename existing columns to match ExerciseDB
-- =====================================================================

-- Rename category → movement_pattern (Halterofit-specific analytics field)
ALTER TABLE public.exercises
  RENAME COLUMN category TO movement_pattern;

-- Rename muscle_groups → target_muscles (primary muscles)
ALTER TABLE public.exercises
  RENAME COLUMN muscle_groups TO target_muscles;

-- Rename equipment → equipments (plural to match ExerciseDB)
ALTER TABLE public.exercises
  RENAME COLUMN equipment TO equipments;

-- =====================================================================
-- STEP 2: Add new ExerciseDB fields
-- =====================================================================

-- body_parts: Anatomical regions (e.g., ["Chest", "Shoulders"])
ALTER TABLE public.exercises
  ADD COLUMN body_parts JSONB NOT NULL DEFAULT '[]';

-- secondary_muscles: Supporting muscles (e.g., ["Triceps", "Deltoids"])
ALTER TABLE public.exercises
  ADD COLUMN secondary_muscles JSONB NOT NULL DEFAULT '[]';

-- exercise_tips: Safety and technique recommendations
ALTER TABLE public.exercises
  ADD COLUMN exercise_tips JSONB NOT NULL DEFAULT '[]';

-- variations: Alternative exercise versions
ALTER TABLE public.exercises
  ADD COLUMN variations JSONB NOT NULL DEFAULT '[]';

-- overview: Descriptive summary of the exercise
ALTER TABLE public.exercises
  ADD COLUMN overview TEXT;

-- video_url: Exercise demonstration video
ALTER TABLE public.exercises
  ADD COLUMN video_url TEXT;

-- keywords: Search optimization terms
ALTER TABLE public.exercises
  ADD COLUMN keywords JSONB NOT NULL DEFAULT '[]';

-- =====================================================================
-- STEP 3: Update JSONB column types for consistency
-- =====================================================================

-- Ensure target_muscles is JSONB (was muscle_groups)
ALTER TABLE public.exercises
  ALTER COLUMN target_muscles TYPE JSONB USING target_muscles::jsonb;

-- Ensure equipments is JSONB (was equipment string)
ALTER TABLE public.exercises
  ALTER COLUMN equipments TYPE JSONB USING
    CASE
      WHEN equipments = '' THEN '[]'::jsonb
      ELSE jsonb_build_array(equipments)
    END;

-- Ensure instructions is JSONB array
ALTER TABLE public.exercises
  ALTER COLUMN instructions TYPE JSONB USING
    CASE
      WHEN instructions IS NULL THEN '[]'::jsonb
      WHEN instructions = '' THEN '[]'::jsonb
      ELSE jsonb_build_array(instructions)
    END;

-- =====================================================================
-- STEP 4: Drop removed column
-- =====================================================================

-- primary_muscle is redundant (use target_muscles[0])
ALTER TABLE public.exercises
  DROP COLUMN IF EXISTS primary_muscle;

-- =====================================================================
-- STEP 5: Create GIN indexes for JSONB array queries
-- =====================================================================

-- Index for filtering by body parts
CREATE INDEX IF NOT EXISTS idx_exercises_body_parts
  ON public.exercises USING GIN (body_parts);

-- Index for filtering by target muscles
CREATE INDEX IF NOT EXISTS idx_exercises_target_muscles
  ON public.exercises USING GIN (target_muscles);

-- Index for filtering by equipments
CREATE INDEX IF NOT EXISTS idx_exercises_equipments
  ON public.exercises USING GIN (equipments);

-- Index for search by keywords
CREATE INDEX IF NOT EXISTS idx_exercises_keywords
  ON public.exercises USING GIN (keywords);

-- =====================================================================
-- STEP 6: Add comments for documentation
-- =====================================================================

COMMENT ON COLUMN public.exercises.body_parts IS
  'ExerciseDB: Anatomical regions targeted (e.g., ["Chest", "Shoulders"])';

COMMENT ON COLUMN public.exercises.target_muscles IS
  'ExerciseDB: Primary muscles engaged (e.g., ["Pectoralis Major"])';

COMMENT ON COLUMN public.exercises.secondary_muscles IS
  'ExerciseDB: Supporting muscles involved (e.g., ["Triceps", "Deltoids"])';

COMMENT ON COLUMN public.exercises.equipments IS
  'ExerciseDB: Required equipment (e.g., ["Barbell", "Bench"])';

COMMENT ON COLUMN public.exercises.exercise_type IS
  'ExerciseDB: Exercise format - "weight_reps" | "cardio" | "duration" | "stretching"';

COMMENT ON COLUMN public.exercises.exercise_tips IS
  'ExerciseDB: Safety and technique recommendations (array of strings)';

COMMENT ON COLUMN public.exercises.variations IS
  'ExerciseDB: Alternative exercise versions (array of strings)';

COMMENT ON COLUMN public.exercises.overview IS
  'ExerciseDB: Descriptive summary of exercise benefits and suitability';

COMMENT ON COLUMN public.exercises.video_url IS
  'ExerciseDB: URL to exercise demonstration video';

COMMENT ON COLUMN public.exercises.keywords IS
  'ExerciseDB: Search optimization terms (array of strings)';

COMMENT ON COLUMN public.exercises.movement_pattern IS
  'Halterofit: Movement classification - "compound" | "isolation" (derived from ExerciseDB data for analytics)';

COMMENT ON COLUMN public.exercises.difficulty IS
  'Halterofit: Difficulty level - "beginner" | "intermediate" | "advanced"';

-- =====================================================================
-- STEP 7: Update RLS policies (already read-only, no changes needed)
-- =====================================================================

-- Exercises remain read-only for all authenticated users (policy from 20250203000000_remove_custom_exercises.sql)
-- No changes needed

-- =====================================================================
-- VERIFICATION QUERIES (for manual testing)
-- =====================================================================

-- Check column names match ExerciseDB
-- Expected: exercisedb_id, name, body_parts, target_muscles, secondary_muscles,
--           equipments, exercise_type, instructions, exercise_tips, variations,
--           overview, image_url, video_url, keywords, movement_pattern, difficulty

-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name = 'exercises'
-- ORDER BY ordinal_position;

-- =====================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =====================================================================

-- To rollback this migration:
-- 1. Rename movement_pattern → category
-- 2. Rename target_muscles → muscle_groups
-- 3. Rename equipments → equipment
-- 4. Drop new columns: body_parts, secondary_muscles, exercise_tips, variations, overview, video_url, keywords
-- 5. Re-add primary_muscle column
-- 6. Convert JSONB back to TEXT where applicable
-- 7. Drop GIN indexes

-- NOTE: This should be done BEFORE any ExerciseDB import occurs
