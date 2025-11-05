-- Schema v6-v7: Align with GitHub ExerciseDB Dataset
-- Date: 2025-11-06
--
-- Changes:
-- v6: Remove description, difficulty, category (not in GitHub dataset)
-- v7: Add gif_url (GitHub ExerciseDB provides animated GIFs)

-- Drop obsolete fields (v6)
ALTER TABLE public.exercises DROP COLUMN IF EXISTS description;
ALTER TABLE public.exercises DROP COLUMN IF EXISTS difficulty;
ALTER TABLE public.exercises DROP COLUMN IF EXISTS category;

-- Add gif_url field (v7)
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS gif_url TEXT;
