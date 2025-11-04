--------------------------------------------------------------------------------
-- MIGRATION: Cleanup Duplicate exercisedb_id Indexes
-- Description: Remove redundant manual index (UNIQUE constraint already creates one)
-- Date: 2025-11-04
-- Priority: MEDIUM (Performance optimization)
-- Issue: Supabase Performance Advisor - Identical indexes
--------------------------------------------------------------------------------

-- =====================================================================
-- CONTEXT: Why Duplicate Indexes?
-- =====================================================================

-- **Problem:**
-- When adding a UNIQUE constraint, PostgreSQL automatically creates an index.
-- Our migration also created a manual index (idx_exercises_exercisedb_id).
-- Result: Two identical indexes on the same column = wasted space + slower writes.
--
-- **Indexes Created:**
-- 1. exercises_exercisedb_id_unique (from UNIQUE constraint) ✅ Keep this
-- 2. idx_exercises_exercisedb_id (manual CREATE INDEX)      ❌ Remove this
--
-- **Impact:**
-- - Wastes ~10-20 MB disk space
-- - Slows INSERT/UPDATE operations (maintains 2 indexes instead of 1)
-- - No benefit for SELECT queries (1 index is sufficient)

-- =====================================================================
-- STEP 1: Verify existing indexes (for audit trail)
-- =====================================================================

-- List all indexes on exercises.exercisedb_id
-- Expected: 2-3 indexes before cleanup
DO $$
DECLARE
  index_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE tablename = 'exercises'
    AND indexdef LIKE '%exercisedb_id%';

  RAISE NOTICE 'Found % indexes on exercises.exercisedb_id before cleanup', index_count;
END $$;

-- =====================================================================
-- STEP 2: Remove redundant manual indexes
-- =====================================================================

-- Drop manual index (if exists)
DROP INDEX IF EXISTS public.idx_exercises_exercisedb_id;

-- Drop any other duplicate indexes (in case of multiple migration runs)
DROP INDEX IF EXISTS public.exercises_exercisedb_id_key;

-- =====================================================================
-- STEP 3: Verify cleanup (should have exactly 1 index remaining)
-- =====================================================================

DO $$
DECLARE
  index_count INTEGER;
  remaining_index TEXT;
BEGIN
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE tablename = 'exercises'
    AND indexdef LIKE '%exercisedb_id%';

  SELECT indexname INTO remaining_index
  FROM pg_indexes
  WHERE tablename = 'exercises'
    AND indexdef LIKE '%exercisedb_id%'
  LIMIT 1;

  IF index_count = 1 THEN
    RAISE NOTICE '✅ Cleanup successful: 1 index remaining (%)', remaining_index;
  ELSE
    RAISE WARNING '⚠️ Expected 1 index, found %. Manual verification required.', index_count;
  END IF;
END $$;

-- =====================================================================
-- STEP 4: Add comment for documentation
-- =====================================================================

COMMENT ON CONSTRAINT exercises_exercisedb_id_unique ON public.exercises IS
  'UNIQUE constraint on exercisedb_id (ExerciseDB API identifier).
   Automatically creates an index - no manual index needed.
   Used for upsert logic in import script.';

-- =====================================================================
-- VERIFICATION QUERIES (for manual testing)
-- =====================================================================

-- Verify exactly 1 index remains on exercisedb_id
-- Expected: 1 row (exercises_exercisedb_id_unique)
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'exercises'
--   AND indexname LIKE '%exercisedb_id%';

-- Verify UNIQUE constraint still works
-- Expected: Error "duplicate key value violates unique constraint"
-- INSERT INTO exercises (exercisedb_id, name) VALUES ('0001', 'Test');
-- INSERT INTO exercises (exercisedb_id, name) VALUES ('0001', 'Duplicate'); -- Should fail

-- =====================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =====================================================================

-- To rollback (recreate manual index):
-- CREATE INDEX idx_exercises_exercisedb_id ON public.exercises(exercisedb_id);
-- Note: This would recreate the duplicate index (not recommended)

-- =====================================================================
-- MIGRATION COMPLETE
-- =====================================================================

-- Migration successfully:
-- ✅ Removed redundant manual index (idx_exercises_exercisedb_id)
-- ✅ Kept UNIQUE constraint index (exercises_exercisedb_id_unique)
-- ✅ Supabase Performance Advisor warning should disappear
-- ✅ Saved ~10-20 MB disk space
-- ✅ Improved INSERT/UPDATE performance
