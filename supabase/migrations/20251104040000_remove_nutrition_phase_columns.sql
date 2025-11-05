-- Migration: Remove nutrition_phase columns (SCOPE-SIMPLIFICATION.md)
-- Created: 2025-11-04
-- Author: Automated Audit Fix (Task 0.6.9)
-- Issue: WatermelonDB schema v4 removed nutrition_phase but Supabase still has it → sync crashes
-- Impact: CRITICAL - Blocks all sync operations

-- ============================================================================
-- Remove nutrition_phase from users table
-- ============================================================================

ALTER TABLE public.users
DROP COLUMN IF EXISTS nutrition_phase;

COMMENT ON TABLE public.users IS
'User profiles and preferences. Field nutrition_phase removed per scope simplification (Feb 2025).';

-- ============================================================================
-- Remove nutrition_phase from workouts table
-- ============================================================================

ALTER TABLE public.workouts
DROP COLUMN IF EXISTS nutrition_phase;

COMMENT ON TABLE public.workouts IS
'Workout sessions. Field nutrition_phase removed per scope simplification (Feb 2025).';

-- ============================================================================
-- Verification Queries (for manual testing)
-- ============================================================================

-- Verify columns no longer exist:
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name IN ('users', 'workouts') AND column_name = 'nutrition_phase';
-- (Should return 0 rows)

-- Verify table comments updated:
-- SELECT obj_description('public.users'::regclass);
-- SELECT obj_description('public.workouts'::regclass);
