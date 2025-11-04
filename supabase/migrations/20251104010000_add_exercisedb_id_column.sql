--------------------------------------------------------------------------------
-- MIGRATION: Add exercisedb_id column to exercises table
-- Description: Critical fix for ExerciseDB import - adds unique identifier
-- Date: 2025-11-04
-- References: scripts/import-exercisedb.ts, docs/DATABASE.md
--------------------------------------------------------------------------------

-- =====================================================================
-- CONTEXT
-- =====================================================================

-- This column stores the original ExerciseDB API ID (e.g., "0001", "0002")
-- Used for:
-- 1. Upsert logic during imports (prevents duplicates)
-- 2. Quarterly updates (map new API data to existing records)
-- 3. Audit trail (track which exercises come from ExerciseDB)

-- =====================================================================
-- STEP 1: Add exercisedb_id column
-- =====================================================================

-- Add column (nullable initially for existing rows, if any)
ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS exercisedb_id TEXT;

-- =====================================================================
-- STEP 2: Backfill existing rows (if any)
-- =====================================================================

-- Backfill with UUID as placeholder (unlikely to have rows in fresh DB)
UPDATE public.exercises
  SET exercisedb_id = id::TEXT
  WHERE exercisedb_id IS NULL;

-- =====================================================================
-- STEP 3: Add constraints
-- =====================================================================

-- Make NOT NULL after backfill
ALTER TABLE public.exercises
  ALTER COLUMN exercisedb_id SET NOT NULL;

-- Add UNIQUE constraint (critical for upsert logic in import script)
ALTER TABLE public.exercises
  ADD CONSTRAINT exercises_exercisedb_id_unique UNIQUE (exercisedb_id);

-- =====================================================================
-- STEP 4: Create index for performance
-- =====================================================================

-- Index for fast lookups during import (used by import script line 141)
CREATE INDEX IF NOT EXISTS idx_exercises_exercisedb_id
  ON public.exercises(exercisedb_id);

-- =====================================================================
-- STEP 5: Add documentation
-- =====================================================================

COMMENT ON COLUMN public.exercises.exercisedb_id IS
  'ExerciseDB API unique identifier (e.g., "0001", "0002"). Used for import upsert logic and quarterly updates.';

-- =====================================================================
-- VERIFICATION QUERIES (for manual testing)
-- =====================================================================

-- Verify column exists with correct constraints
-- Expected: exercisedb_id | text | NO (not null) | exercises_exercisedb_id_unique

-- SELECT
--   column_name,
--   data_type,
--   is_nullable,
--   (SELECT constraint_name
--    FROM information_schema.constraint_column_usage ccu
--    JOIN information_schema.table_constraints tc ON ccu.constraint_name = tc.constraint_name
--    WHERE ccu.column_name = 'exercisedb_id'
--      AND ccu.table_name = 'exercises'
--      AND tc.constraint_type = 'UNIQUE') as unique_constraint
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name = 'exercises'
--   AND column_name = 'exercisedb_id';

-- =====================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =====================================================================

-- To rollback this migration:
-- ALTER TABLE public.exercises DROP COLUMN IF EXISTS exercisedb_id CASCADE;
-- This will also drop the index and constraint automatically.

-- =====================================================================
-- MIGRATION COMPLETE
-- =====================================================================

-- Migration successfully:
-- ✅ Added exercisedb_id column (TEXT, NOT NULL, UNIQUE)
-- ✅ Created index for fast lookups
-- ✅ Added documentation comments
-- ✅ Import script can now use upsert with onConflict: 'exercisedb_id'
