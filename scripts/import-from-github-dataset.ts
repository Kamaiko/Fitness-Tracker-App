/**
 * Import Script: GitHub ExerciseDB Dataset (V2 Format)
 *
 * Imports 1,500 exercises from downloaded GitHub dataset to Supabase.
 * Dataset: https://github.com/ExerciseDB/exercisedb-api/blob/main/src/data/exercises.json
 *
 * Run: npm run import-github-dataset
 * Dry-run: npm run import-github-dataset -- --dry-run
 *
 * Why GitHub Dataset vs RapidAPI?
 * - RapidAPI free tier: 10 exercises only
 * - GitHub dataset: 1,500+ exercises, open source (AGPL v3)
 * - One-time download, zero runtime API dependencies
 *
 * Features:
 * - ✅ Format transformation (GitHub V2 → Halterofit V1)
 * - ✅ Zod validation
 * - ✅ Batch processing (100 exercises/batch)
 * - ✅ Detailed logging
 * - ✅ Dry-run mode
 */

/* eslint-disable no-console */
// CLI scripts need console output

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';

// Load .env
dotenv.config();

// Parse command-line arguments
const IS_DRY_RUN = process.argv.includes('--dry-run');
const DATASET_PATH = path.join(__dirname, 'exercisedb-full-dataset.json');

// Validate environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Missing Supabase credentials in .env');
  console.error('   Required: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

// ============================================================================
// SCHEMAS
// ============================================================================

/**
 * GitHub ExerciseDB V2 format
 */
const GitHubExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  name: z.string().min(1),
  gifUrl: z.string().optional(),
  targetMuscles: z.array(z.string()).default([]),
  bodyParts: z.array(z.string()).default([]),
  equipments: z.array(z.string()).default([]),
  secondaryMuscles: z.array(z.string()).default([]),
  instructions: z.array(z.string()).default([]),
});

type GitHubExercise = z.infer<typeof GitHubExerciseSchema>;

/**
 * Halterofit database schema (matches Supabase)
 */
interface HalterofitExercise {
  exercisedb_id: string;
  name: string;
  body_parts: string[];
  target_muscles: string[];
  secondary_muscles: string[];
  equipments: string[];
  instructions: string[];
  gif_url?: string;
}

// ============================================================================
// TRANSFORMATION
// ============================================================================

/**
 * Transform GitHub V2 format → Halterofit format
 */
function transformExercise(github: GitHubExercise): HalterofitExercise {
  return {
    exercisedb_id: github.exerciseId,
    name: github.name,
    body_parts: github.bodyParts,
    target_muscles: github.targetMuscles,
    secondary_muscles: github.secondaryMuscles,
    equipments: github.equipments,
    instructions: github.instructions,
    gif_url: github.gifUrl,
  };
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateExercises(rawExercises: unknown[]): GitHubExercise[] {
  const validated: GitHubExercise[] = [];
  const errors: Array<{ index: number; error: string }> = [];

  rawExercises.forEach((raw, index) => {
    const result = GitHubExerciseSchema.safeParse(raw);
    if (result.success) {
      validated.push(result.data);
    } else {
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
// DATABASE OPERATIONS
// ============================================================================

async function insertExercisesInBatches(exercises: HalterofitExercise[]): Promise<void> {
  const BATCH_SIZE = 100;
  const totalBatches = Math.ceil(exercises.length / BATCH_SIZE);

  console.log(`   Processing ${exercises.length} exercises in ${totalBatches} batches...`);

  for (let i = 0; i < exercises.length; i += BATCH_SIZE) {
    const batch = exercises.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

    const { error } = await supabase.from('exercises').upsert(batch, {
      onConflict: 'exercisedb_id',
      ignoreDuplicates: false,
    });

    if (error) {
      throw new Error(`Batch ${batchNumber}/${totalBatches} failed: ${error.message}`);
    }

    const progress = Math.round(((i + batch.length) / exercises.length) * 100);
    console.log(
      `   ✅ Batch ${batchNumber}/${totalBatches} (${i + batch.length}/${exercises.length} - ${progress}%)`
    );
  }
}

async function verifyImport(): Promise<number> {
  console.log('\n🔍 Verifying import...');

  const { count, error } = await supabase
    .from('exercises')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Verification failed: ${error.message}`);
  }

  console.log(`✅ Verification complete: ${count ?? 0} exercises in Supabase`);
  return count ?? 0;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🚀 Starting GitHub ExerciseDB import...');
  console.log(
    IS_DRY_RUN
      ? '🧪 DRY RUN MODE: No data will be written\n'
      : '⚠️  LIVE MODE: Data will be written to Supabase\n'
  );

  // 1. Load dataset
  console.log('📥 Loading dataset from file...');
  if (!fs.existsSync(DATASET_PATH)) {
    console.error(`❌ Dataset not found: ${DATASET_PATH}`);
    console.error('   Run this first: npm run download-dataset');
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(DATASET_PATH, 'utf-8'));
  if (!Array.isArray(rawData)) {
    console.error('❌ Invalid dataset format (expected array)');
    process.exit(1);
  }

  console.log(`📦 Loaded ${rawData.length} exercises from dataset`);

  // 2. Validate
  const validatedExercises = validateExercises(rawData);

  if (validatedExercises.length === 0) {
    console.error('❌ No valid exercises found');
    process.exit(1);
  }

  // 3. Transform
  const transformedExercises = validatedExercises.map(transformExercise);

  // 4. Insert (if not dry-run)
  if (IS_DRY_RUN) {
    console.log('\n🧪 Dry-run complete!');
    console.log(`   Would insert ${transformedExercises.length} exercises`);
    console.log('\n📊 Sample transformed exercise:');
    console.log(JSON.stringify(transformedExercises[0], null, 2));
    return;
  }

  console.log('💾 Inserting exercises into Supabase...');
  await insertExercisesInBatches(transformedExercises);

  console.log(`\n✅ Successfully imported ${transformedExercises.length} exercises`);

  // 5. Verify
  const finalCount = await verifyImport();

  console.log('\n🎉 Import complete!');
  console.log('📝 Next steps:');
  console.log('   1. Verify in Supabase: SELECT COUNT(*) FROM exercises;');
  console.log('   2. Test sync: Clear WatermelonDB, relaunch app');
  console.log('   3. Update dataset quarterly (every 3 months)');

  if (finalCount < 1000) {
    console.warn(`\n⚠️  Warning: Expected ~1,500 exercises, found ${finalCount}`);
    console.warn('   This might indicate an incomplete import.');
  }
}

// Run
main().catch((error) => {
  console.error('\n❌ Import failed:', error.message);
  process.exit(1);
});
