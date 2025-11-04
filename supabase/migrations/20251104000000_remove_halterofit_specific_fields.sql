--------------------------------------------------------------------------------
-- MIGRATION: Remove Halterofit-Specific Fields (Pure ExerciseDB Schema)
-- ADR-019: https://github.com/your-repo/docs/ADR-019-Pure-ExerciseDB-Schema.md
-- Date: 2025-02-04
-- Author: Patrick Patenaude
-- Description: Remove movement_pattern and difficulty columns for 1:1 ExerciseDB mapping
--------------------------------------------------------------------------------

-- =====================================================================
-- CONTEXT
-- =====================================================================

-- This migration removes the "Halterofit-specific" analytics fields:
-- - movement_pattern ('compound' | 'isolation')
-- - difficulty ('beginner' | 'intermediate' | 'advanced')
--
-- Rationale (ADR-019):
-- - YAGNI: Not needed in MVP (Phases 0-3)
-- - Zero custom logic during import (pure 1:1 ExerciseDB mapping)
-- - Analytics can derive these fields at query-time if needed in Phase 4+
-- - Simpler maintenance, fewer bugs, single source of truth

-- =====================================================================
-- STEP 1: Drop Halterofit-Specific Columns
-- =====================================================================

-- Remove movement_pattern column (compound/isolation classification)
ALTER TABLE public.exercises
  DROP COLUMN IF EXISTS movement_pattern;

-- Remove difficulty column (beginner/intermediate/advanced classification)
ALTER TABLE public.exercises
  DROP COLUMN IF EXISTS difficulty;

-- =====================================================================
-- STEP 2: Drop Associated Indexes (if any)
-- =====================================================================

-- Drop movement_pattern index (was created for filtering)
DROP INDEX IF EXISTS public.idx_exercises_movement_pattern;

-- =====================================================================
-- STEP 3: Update Table Comment for Documentation
-- =====================================================================

COMMENT ON TABLE public.exercises IS
'Exercise library from ExerciseDB API (1,300+ exercises).
READ-ONLY for MVP.
Schema: Pure 1:1 mapping with ExerciseDB (14 fields, zero custom additions).
See docs/ADR-019-Pure-ExerciseDB-Schema.md for rationale.';

-- =====================================================================
-- VERIFICATION QUERIES (for manual testing)
-- =====================================================================

-- Verify columns were removed
-- Expected: exercisedb_id, name, body_parts, target_muscles, secondary_muscles,
--           equipments, exercise_type, instructions, exercise_tips, variations,
--           overview, image_url, video_url, keywords
-- NOT expected: movement_pattern, difficulty

-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name = 'exercises'
-- ORDER BY ordinal_position;

-- Expected count: 18 columns (14 ExerciseDB + id, created_at, updated_at, _changed, _status)

-- =====================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =====================================================================

-- To rollback this migration:
-- 1. Re-add movement_pattern column:
--    ALTER TABLE exercises ADD COLUMN movement_pattern TEXT;
--    CREATE INDEX idx_exercises_movement_pattern ON exercises(movement_pattern);
--
-- 2. Re-add difficulty column:
--    ALTER TABLE exercises ADD COLUMN difficulty TEXT;
--
-- 3. Backfill with derivation logic (if data exists):
--    UPDATE exercises SET
--      movement_pattern = CASE
--        WHEN jsonb_array_length(body_parts) > 1 THEN 'compound'
--        ELSE 'isolation'
--      END,
--      difficulty = 'intermediate';
--
-- NOTE: This rollback assumes no ExerciseDB data has been imported yet.
--       If data exists, derivation logic may be imprecise.

-- =====================================================================
-- MIGRATION COMPLETE
-- =====================================================================

-- Migration successfully:
-- ✅ Removed movement_pattern column
-- ✅ Removed difficulty column
-- ✅ Dropped associated indexes
-- ✅ Updated table documentation
-- ✅ Exercises table now contains ONLY 14 ExerciseDB fields (pure 1:1 mapping)
