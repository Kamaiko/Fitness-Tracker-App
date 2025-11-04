/**
 * ExerciseDB Rollback Script
 *
 * Deletes ALL exercises from Supabase database.
 * Use case: Rollback after failed import or testing
 *
 * ⚠️  WARNING: This is DESTRUCTIVE and IRREVERSIBLE
 *
 * Run: npm run rollback-exercisedb
 *
 * @see scripts/README.md for usage instructions
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load .env
dotenv.config();

// Validate environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Missing Supabase credentials in .env');
  console.error('   Required: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY');
  process.exit(1);
}

// Initialize Supabase client with secret key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

/**
 * Sleep utility for countdown
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Display countdown before destructive operation
 */
async function countdown(seconds: number): Promise<void> {
  for (let i = seconds; i > 0; i--) {
    process.stdout.write(`\r   Proceeding in ${i} seconds... (Press Ctrl+C to cancel)`);
    await sleep(1000);
  }
  process.stdout.write('\r\n');
}

/**
 * Delete all exercises from Supabase
 */
async function rollbackExercises(): Promise<void> {
  console.log('🗑️  Rollback: Delete All Exercises from Supabase\n');

  // Get current count
  const { count: beforeCount } = await supabase
    .from('exercises')
    .select('*', { count: 'exact', head: true });

  if (beforeCount === 0) {
    console.log('ℹ️  No exercises found in database. Nothing to rollback.');
    return;
  }

  console.log(`   Found ${beforeCount} exercises in database`);
  console.log('\n⚠️  WARNING: This will DELETE ALL exercises!');
  console.log('   This operation is IRREVERSIBLE.');
  console.log('   You will need to re-run import-exercisedb to restore data.\n');

  // Countdown before destructive operation
  await countdown(5);

  console.log('🗑️  Deleting exercises...');

  try {
    // Delete all exercises (WHERE id != '...' ensures we delete all rows)
    // Using a condition that's always true to bypass Supabase client safety checks
    const { error } = await supabase
      .from('exercises')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy UUID that doesn't exist

    if (error) {
      console.error('❌ Rollback failed:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`Supabase delete error: ${error.message}`);
    }

    // Verify deletion
    const { count: afterCount } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true });

    console.log(`\n✅ Rollback complete`);
    console.log(`   Deleted: ${beforeCount} exercises`);
    console.log(`   Remaining: ${afterCount} exercises`);

    if (afterCount !== 0) {
      console.warn('\n⚠️  Warning: Some exercises remain in database');
      console.warn('   Manual cleanup may be required');
    }

    console.log('\n📝 Next steps:');
    console.log('   1. Re-run import: npm run import-exercisedb');
    console.log('   2. Or test with dry-run first: npm run import-exercisedb -- --dry-run');
  } catch (error) {
    console.error('\n❌ Rollback failed:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await rollbackExercises();
    process.exit(0);
  } catch (error: unknown) {
    console.error('\n❌ Rollback failed:');

    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      if (error.stack) {
        console.error(`\n   Stack trace:\n${error.stack}`);
      }
    } else {
      console.error('   Unknown error:', error);
    }

    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check .env credentials (SUPABASE_SECRET_KEY)');
    console.error('   2. Verify Supabase project is running');
    console.error('   3. Check network connection');

    process.exit(1);
  }
}

main();
