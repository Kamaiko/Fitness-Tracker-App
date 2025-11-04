/**
 * ExerciseDB Import Script (Production-Ready)
 *
 * Imports 1,300+ exercises from ExerciseDB API to Supabase PostgreSQL.
 * Run: npm run import-exercisedb
 * Dry-run: npm run import-exercisedb -- --dry-run
 *
 * Strategy: Option A (Database Seeding at Build Time)
 * - Run ONCE before publishing app
 * - Re-run quarterly (every 3 months) for new exercises
 * - Users sync from Supabase → WatermelonDB on first launch
 *
 * Features:
 * - ✅ Zod validation (detects ExerciseDB schema changes)
 * - ✅ --dry-run mode (test without importing)
 * - ✅ Timeout protection (30s)
 * - ✅ Batch processing (100 exercises/batch)
 * - ✅ Detailed error logging
 * - ✅ Progress indicators
 *
 * @see scripts/README.md for usage instructions
 * @see docs/DATABASE.md for schema reference
 */

/* eslint-disable no-console, no-undef, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// CLI scripts need console output and Node.js globals (fetch)

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { z } from 'zod';

// Load .env
dotenv.config();

// Parse command-line arguments
const IS_DRY_RUN = process.argv.includes('--dry-run');

// Validate environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY; // New API key format (sb_secret_...)
const EXERCISEDB_API_KEY = process.env.EXERCISEDB_API_KEY;
const EXERCISEDB_API_HOST = process.env.EXERCISEDB_API_HOST;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Missing Supabase credentials in .env');
  console.error('   Required: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY');
  console.error('   Get keys from: https://supabase.com/dashboard/project/_/settings/api');
  console.error('   Use "API Keys" tab (NOT "Legacy API Keys")');
  console.error('   Format: SUPABASE_SECRET_KEY=sb_secret_...');
  process.exit(1);
}

if (!EXERCISEDB_API_KEY || !EXERCISEDB_API_HOST) {
  console.error('❌ Missing ExerciseDB API credentials in .env');
  console.error('   Required: EXERCISEDB_API_KEY, EXERCISEDB_API_HOST');
  process.exit(1);
}

// Initialize Supabase client with secret key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

// ============================================================================
// VALIDATION SCHEMAS (Zod)
// ============================================================================

/**
 * ExerciseDB API response schema (runtime validation)
 * Detects breaking changes in ExerciseDB API
 *
 * NOTE: Field names match ExerciseDB API v2 actual structure (tested 2025-02)
 * - API returns STRINGS (not arrays): bodyPart, target, equipment
 * - API field "id" maps to Halterofit "exercisedb_id"
 * - API field "gifUrl" maps to Halterofit "image_url"
 * - Arrays converted in transformExercise()
 */
const ExerciseDBSchema = z.object({
  id: z.string().min(1, 'id required'), // ExerciseDB unique ID
  name: z.string().min(1, 'name required'),
  bodyPart: z.string().default(''), // Anatomical region (single string, e.g., "chest")
  target: z.string().default(''), // Primary muscle (single string, e.g., "pectorals")
  secondaryMuscles: z.array(z.string()).default([]), // Supporting muscles (array)
  equipment: z.string().default(''), // Required equipment (single string, e.g., "barbell")
  instructions: z.array(z.string()).default([]), // Step-by-step guide
  gifUrl: z.string().url().optional().default(''), // Exercise image URL
  // Optional fields (may not be present in all API responses)
  exerciseType: z.string().optional().default('weight_reps'),
  exerciseTips: z.array(z.string()).optional().default([]),
  variations: z.array(z.string()).optional().default([]),
  overview: z.string().optional().default(''),
  videoUrl: z.string().url().optional().default(''),
  keywords: z.array(z.string()).optional().default([]),
});

type ExerciseDBExercise = z.infer<typeof ExerciseDBSchema>;

/**
 * Halterofit database exercise schema
 */
interface HalterofitExercise {
  exercisedb_id: string;
  name: string;
  body_parts: string[];
  target_muscles: string[];
  secondary_muscles: string[];
  equipments: string[];
  exercise_type: string;
  instructions: string[];
  exercise_tips: string[];
  variations: string[];
  overview: string;
  image_url: string;
  video_url: string;
  keywords: string[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Sleep utility for timeout delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validate and parse ExerciseDB API response
 * Returns validated exercises (skips invalid ones)
 */
function validateExercises(rawExercises: unknown[]): ExerciseDBExercise[] {
  const validated: ExerciseDBExercise[] = [];
  const errors: Array<{ index: number; error: string }> = [];

  rawExercises.forEach((raw, index) => {
    const result = ExerciseDBSchema.safeParse(raw);

    if (result.success) {
      validated.push(result.data);
    } else {
      // Zod v3+ uses .issues instead of .errors (breaking change)
      const firstError = result.error.issues[0] ?? {
        path: [],
        message: 'Unknown validation error',
      };
      errors.push({
        index,
        error: `${firstError.path.join('.')}: ${firstError.message}`,
      });
    }
  });

  // Log validation summary
  if (errors.length > 0) {
    console.warn(`⚠️  Validation: ${errors.length}/${rawExercises.length} exercises skipped`);
    console.warn('   First 3 errors:');
    errors.slice(0, 3).forEach((err) => {
      console.warn(`   - Exercise #${err.index}: ${err.error}`);
    });
  }

  console.log(`✅ Validation: ${validated.length}/${rawExercises.length} exercises valid`);

  return validated;
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Fetch exercises from ExerciseDB API (with timeout protection)
 */
async function fetchExercisesFromAPI(): Promise<ExerciseDBExercise[]> {
  console.log('📥 Fetching exercises from ExerciseDB API...');

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
      headers: {
        'X-RapidAPI-Key': EXERCISEDB_API_KEY!,
        'X-RapidAPI-Host': EXERCISEDB_API_HOST!,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      // Check for rate limit error
      if (response.status === 429) {
        throw new Error(
          'ExerciseDB API rate limit exceeded. Wait 1 minute and retry.\n' +
            '   Free tier: 5 requests/second, 500 requests/month'
        );
      }
      throw new Error(`ExerciseDB API error: ${response.status} ${response.statusText}`);
    }

    const rawExercises = await response.json();

    if (!Array.isArray(rawExercises)) {
      throw new Error('ExerciseDB API returned non-array response');
    }

    console.log(`📦 Received ${rawExercises.length} exercises from ExerciseDB`);

    // Validate with Zod schema
    const validatedExercises = validateExercises(rawExercises);

    return validatedExercises;
  } catch (error: any) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      throw new Error(
        'ExerciseDB API request timeout (30s).\n' +
          '   Check your network connection or try again later.'
      );
    }

    throw error;
  }
}

/**
 * Transform ExerciseDB format → Halterofit schema (1:1 mapping per ADR-019)
 *
 * Field Mapping:
 * - id → exercisedb_id
 * - bodyPart (string) → body_parts (array)
 * - target (string) → target_muscles (array)
 * - equipment (string) → equipments (array)
 * - gifUrl → image_url
 *
 * NOTE: API returns single strings for bodyPart/target/equipment, but DB stores arrays
 */
function transformExercise(exercise: ExerciseDBExercise): HalterofitExercise {
  return {
    exercisedb_id: exercise.id, // API: "id" → DB: "exercisedb_id"
    name: exercise.name,
    // Convert single strings to arrays for consistency with DB schema
    body_parts: exercise.bodyPart ? [exercise.bodyPart] : [], // API: "chest" → DB: ["chest"]
    target_muscles: exercise.target ? [exercise.target] : [], // API: "pectorals" → DB: ["pectorals"]
    secondary_muscles: exercise.secondaryMuscles, // Already array
    equipments: exercise.equipment ? [exercise.equipment] : [], // API: "barbell" → DB: ["barbell"]
    exercise_type: exercise.exerciseType, // Default: "weight_reps" if not provided
    instructions: exercise.instructions,
    exercise_tips: exercise.exerciseTips, // Optional, defaults to []
    variations: exercise.variations, // Optional, defaults to []
    overview: exercise.overview, // Optional, defaults to ''
    image_url: exercise.gifUrl, // API: "gifUrl" → DB: "image_url"
    video_url: exercise.videoUrl, // Optional, defaults to ''
    keywords: exercise.keywords, // Optional, defaults to []
  };
}

/**
 * Insert exercises into Supabase (batch processing with progress)
 */
async function importToSupabase(exercises: ExerciseDBExercise[]): Promise<void> {
  console.log(`💾 ${IS_DRY_RUN ? '[DRY RUN] ' : ''}Inserting exercises into Supabase...`);

  const transformed = exercises.map(transformExercise);

  // DRY RUN: Just log what would be imported
  if (IS_DRY_RUN) {
    console.log(`\n🔍 DRY RUN MODE - Would import ${transformed.length} exercises`);
    console.log('\n📋 Sample exercise (first record):');
    console.log(JSON.stringify(transformed[0], null, 2));
    console.log('\n✅ Dry run complete. No data was written to Supabase.');
    console.log('   Remove --dry-run flag to perform actual import.');
    return;
  }

  // ACTUAL IMPORT: Batch processing for better performance and progress tracking
  const BATCH_SIZE = 100;
  const totalBatches = Math.ceil(transformed.length / BATCH_SIZE);
  let successCount = 0;

  console.log(`   Processing ${transformed.length} exercises in ${totalBatches} batches...`);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, transformed.length);
    const batch = transformed.slice(start, end);

    try {
      const { error } = await supabase.from('exercises').upsert(batch, {
        onConflict: 'exercisedb_id',
      });

      if (error) {
        console.error(`\n❌ Batch ${i + 1}/${totalBatches} failed:`, {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw new Error(`Supabase upsert error (batch ${i + 1}): ${error.message}`);
      }

      successCount += batch.length;
      const percentage = Math.round((successCount / transformed.length) * 100);
      console.log(
        `   ✅ Batch ${i + 1}/${totalBatches} (${successCount}/${transformed.length} - ${percentage}%)`
      );
    } catch (error) {
      console.error(`\n❌ Failed to process batch ${i + 1}/${totalBatches}`);
      throw error;
    }
  }

  console.log(`\n✅ Successfully imported ${transformed.length} exercises`);
}

/**
 * Verify import success
 */
async function verifyImport(): Promise<void> {
  if (IS_DRY_RUN) {
    return; // Skip verification in dry-run mode
  }

  console.log('\n🔍 Verifying import...');

  try {
    const { count, error } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Verification error: ${error.message}`);
    }

    console.log(`✅ Verification complete: ${count} exercises in Supabase`);

    // Sanity check: Warn if count seems too low
    if (count !== null && count < 1000) {
      console.warn(`⚠️  Warning: Expected ~1,300 exercises, found ${count}`);
      console.warn('   This might indicate an incomplete import.');
    }
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Main import workflow
 */
async function main() {
  try {
    console.log('🚀 Starting ExerciseDB import...');

    if (IS_DRY_RUN) {
      console.log('🔍 DRY RUN MODE: No data will be written to Supabase\n');
    } else {
      console.log('⚠️  LIVE MODE: Data will be written to Supabase\n');
    }

    const exercises = await fetchExercisesFromAPI();
    await importToSupabase(exercises);
    await verifyImport();

    if (!IS_DRY_RUN) {
      console.log('\n🎉 Import complete!');
      console.log('📝 Next steps:');
      console.log('   1. Verify in Supabase: SELECT COUNT(*) FROM exercises;');
      console.log('   2. Test sync: Clear WatermelonDB, relaunch app');
      console.log('   3. Re-run quarterly (every 3 months) for new exercises');
    }

    process.exit(0);
  } catch (error: unknown) {
    console.error('\n❌ Import failed:');

    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      if (error.stack) {
        console.error(`\n   Stack trace:\n${error.stack}`);
      }
    } else {
      console.error('   Unknown error:', error);
    }

    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check .env credentials (SUPABASE_SECRET_KEY, EXERCISEDB_API_KEY)');
    console.error('   2. Verify network connection');
    console.error('   3. Check Supabase project status: https://status.supabase.com');
    console.error('   4. Check RapidAPI quota: https://rapidapi.com/developer/billing');

    process.exit(1);
  }
}

main();
