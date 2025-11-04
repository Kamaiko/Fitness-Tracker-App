--------------------------------------------------------------------------------
-- MIGRATION: Fix search_path Security Vulnerability (CVE-2018-1058)
-- Description: Secure update_changed_timestamp() function against search_path hijacking
-- Date: 2025-11-04
-- Priority: CRITICAL (Security)
-- References: https://wiki.postgresql.org/wiki/A_Guide_to_CVE-2018-1058
--------------------------------------------------------------------------------

-- =====================================================================
-- CONTEXT: CVE-2018-1058 Vulnerability
-- =====================================================================

-- **Problem:**
-- Functions without explicit search_path can be hijacked by malicious users
-- who create their own versions of built-in functions (like NOW()).
--
-- **Attack Vector:**
-- 1. Attacker creates: CREATE FUNCTION attacker.now() [malicious code]
-- 2. Attacker sets: SET search_path = attacker, public;
-- 3. Our trigger calls NOW() → Executes attacker.now() instead of pg_catalog.now()
--
-- **Impact:**
-- - Arbitrary code execution
-- - Data exfiltration
-- - Privilege escalation
--
-- **Solution:**
-- 1. Use fully-qualified function names (pg_catalog.now)
-- 2. SET search_path = '' (empty) on SECURITY DEFINER functions

-- =====================================================================
-- STEP 1: Drop existing function and triggers (CASCADE)
-- =====================================================================

-- Drop function (CASCADE removes all dependent triggers)
DROP FUNCTION IF EXISTS update_changed_timestamp() CASCADE;

-- =====================================================================
-- STEP 2: Recreate function with security hardening
-- =====================================================================

CREATE OR REPLACE FUNCTION update_changed_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- ✅ SECURE: Use fully-qualified pg_catalog.now() (not NOW())
  NEW._changed := (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT;
  NEW.updated_at := (EXTRACT(EPOCH FROM pg_catalog.now()) * 1000)::BIGINT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER -- Execute with function owner's privileges
SET search_path = ''; -- ✅ CRITICAL: Force empty search_path (prevents hijacking)

-- =====================================================================
-- STEP 3: Recreate triggers (CASCADE dropped them in STEP 1)
-- =====================================================================

-- Users table trigger
CREATE TRIGGER users_changed
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_changed_timestamp();

-- Exercises table trigger
CREATE TRIGGER exercises_changed
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_changed_timestamp();

-- Workouts table trigger
CREATE TRIGGER workouts_changed
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_changed_timestamp();

-- Workout Exercises table trigger
CREATE TRIGGER workout_exercises_changed
  BEFORE UPDATE ON public.workout_exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_changed_timestamp();

-- Exercise Sets table trigger
CREATE TRIGGER exercise_sets_changed
  BEFORE UPDATE ON public.exercise_sets
  FOR EACH ROW
  EXECUTE FUNCTION update_changed_timestamp();

-- =====================================================================
-- STEP 4: Add documentation
-- =====================================================================

COMMENT ON FUNCTION update_changed_timestamp() IS
  'Auto-updates _changed and updated_at columns on row modification.
   Security: Uses pg_catalog.now() and SET search_path = '''' to prevent CVE-2018-1058 hijacking.
   Reference: https://wiki.postgresql.org/wiki/A_Guide_to_CVE-2018-1058';

-- =====================================================================
-- VERIFICATION QUERIES (for manual testing)
-- =====================================================================

-- Verify function has correct security settings
-- Expected: search_path = {""} (empty array)
-- SELECT proname, prosecdef, proconfig
-- FROM pg_proc
-- WHERE proname = 'update_changed_timestamp';

-- Verify triggers were recreated
-- Expected: 5 rows (users, exercises, workouts, workout_exercises, exercise_sets)
-- SELECT tgname, tgrelid::regclass, tgfoid::regproc
-- FROM pg_trigger
-- WHERE tgfoid::regproc::text = 'update_changed_timestamp';

-- Test trigger works correctly
-- UPDATE exercises SET name = name WHERE exercisedb_id = '0001'; -- Should auto-update _changed
-- SELECT name, _changed, updated_at FROM exercises WHERE exercisedb_id = '0001';

-- =====================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =====================================================================

-- To rollback (restore original vulnerable version):
-- DROP FUNCTION update_changed_timestamp() CASCADE;
-- -- Then re-run the original migration: 20250131120000_initial_schema_with_sync_protocol.sql

-- =====================================================================
-- MIGRATION COMPLETE
-- =====================================================================

-- Migration successfully:
-- ✅ Fixed CVE-2018-1058 search_path vulnerability
-- ✅ Updated function to use pg_catalog.now() (fully-qualified)
-- ✅ Added SET search_path = '' (security hardening)
-- ✅ Recreated all 5 triggers (users, exercises, workouts, workout_exercises, exercise_sets)
-- ✅ Supabase Security Advisor warning should disappear
