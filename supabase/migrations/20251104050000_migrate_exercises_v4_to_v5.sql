/**
 * Migration: Exercise Schema v4 → v5 (ExerciseDB V1 API Alignment)
 *
 * Purpose: Migrate from V2-compatible schema to V1 API structure
 *
 * Changes:
 * - REMOVED (7 fields): exercise_type, exercise_tips, variations, overview,
 *                        image_url, video_url, keywords
 * - ADDED (3 fields): description, difficulty, category
 *
 * Context:
 * - ExerciseDB V2 not available via RapidAPI (tested 2025-11-04)
 * - V1 API provides 1,300 text-only exercises
 * - Images deferred to post-MVP backlog
 *
 * Breaking Change: YES
 * - Existing exercise data will lose V2-specific fields
 * - Recommend re-importing exercises after migration
 *
 * Applied: 2025-11-04
 */

-- =====================================================
-- STEP 1: Remove V2-only columns
-- =====================================================

ALTER TABLE public.exercises
  DROP COLUMN IF EXISTS exercise_type CASCADE,
  DROP COLUMN IF EXISTS exercise_tips CASCADE,
  DROP COLUMN IF EXISTS variations CASCADE,
  DROP COLUMN IF EXISTS overview CASCADE,
  DROP COLUMN IF EXISTS image_url CASCADE,
  DROP COLUMN IF EXISTS video_url CASCADE,
  DROP COLUMN IF EXISTS keywords CASCADE;

-- Remove GIN index for keywords (no longer exists)
DROP INDEX IF EXISTS idx_exercises_keywords;

-- =====================================================
-- STEP 2: Add V1 API columns
-- =====================================================

ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'strength' CHECK (category IN ('strength', 'cardio', 'stretching'));

-- =====================================================
-- STEP 3: Update table metadata
-- =====================================================

COMMENT ON TABLE public.exercises IS 'Exercise library from ExerciseDB V1 API (1,300 text-only exercises). Images deferred to post-MVP.';
COMMENT ON COLUMN public.exercises.description IS 'V1: Detailed exercise description (replaces overview from V2)';
COMMENT ON COLUMN public.exercises.difficulty IS 'V1: Difficulty level (beginner|intermediate|advanced)';
COMMENT ON COLUMN public.exercises.category IS 'V1: Exercise category (strength|cardio|stretching)';

-- =====================================================
-- STEP 4: Data migration note
-- =====================================================

-- NOTE: After applying this migration, re-run import script to populate V1 data:
-- npm run import-exercisedb
--
-- This will upsert all 1,300 exercises with V1 structure.
