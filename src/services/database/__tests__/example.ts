/**
 * Database Example / Manual Test
 *
 * Run this to test the database setup
 * You can copy-paste these examples into your components
 */

import {
  initDatabase,
  createWorkout,
  addExerciseToWorkout,
  logSet,
  completeWorkout,
  getWorkoutWithDetails,
  getUserWorkouts,
  getDatabaseStats,
  syncToSupabase,
} from '../index';

/**
 * Example: Complete workout flow
 */
export async function exampleWorkoutFlow() {
  console.log('🏋️ Starting example workout flow...\n');

  try {
    // 1. Initialize database
    await initDatabase();
    console.log('✅ Database initialized\n');

    // 2. Create workout
    const workout = await createWorkout({
      user_id: 'test-user-123',
      started_at: Math.floor(Date.now() / 1000),
      title: 'Push Day A',
    });
    console.log('✅ Workout created:', workout.id);
    console.log('   Title:', workout.title);
    console.log('   Started at:', new Date(workout.started_at * 1000).toLocaleString());
    console.log('');

    // 3. Add exercises (you'd normally get these from exercises table)
    const exercise1 = await addExerciseToWorkout(
      workout.id,
      'bench-press-id', // Replace with real exercise ID
      1
    );
    console.log('✅ Exercise added:', exercise1.id);
    console.log('   Order:', exercise1.order_index);
    console.log('');

    // 4. Log sets for first exercise
    console.log('📝 Logging sets...');
    const set1 = await logSet(exercise1.id, 1, {
      weight: 100,
      weight_unit: 'kg',
      reps: 8,
      rir: 2,
    });
    console.log('✅ Set 1:', `${set1.weight}kg × ${set1.reps} reps @ RIR ${set1.rir}`);

    const set2 = await logSet(exercise1.id, 2, {
      weight: 100,
      weight_unit: 'kg',
      reps: 7,
      rir: 1,
    });
    console.log('✅ Set 2:', `${set2.weight}kg × ${set2.reps} reps @ RIR ${set2.rir}`);

    const set3 = await logSet(exercise1.id, 3, {
      weight: 100,
      weight_unit: 'kg',
      reps: 6,
      rir: 0,
      is_warmup: false,
    });
    console.log('✅ Set 3:', `${set3.weight}kg × ${set3.reps} reps @ RIR ${set3.rir}`);
    console.log('');

    // 5. Complete workout
    const completed = await completeWorkout(workout.id);
    console.log('✅ Workout completed!');
    console.log('   Duration:', completed.duration_seconds, 'seconds');
    console.log('');

    // 6. Get full workout with details
    const fullWorkout = await getWorkoutWithDetails(workout.id);
    console.log('📊 Full workout data:');
    console.log('   Exercises:', fullWorkout.exercises.length);
    console.log('   Total sets:', fullWorkout.exercises[0]?.sets.length || 0);
    console.log('');

    // 7. Get user's workouts
    const userWorkouts = await getUserWorkouts('test-user-123', 10);
    console.log('📋 User workouts:', userWorkouts.length);
    console.log('');

    // 8. Database stats
    const stats = await getDatabaseStats();
    console.log('📈 Database stats:');
    console.log('   Workouts:', stats.workouts);
    console.log('   Exercises:', stats.exercises);
    console.log('   Sets:', stats.sets);
    console.log('');

    // 9. Sync to Supabase (optional - needs Supabase configured)
    console.log('🔄 Syncing to Supabase...');
    const syncResult = await syncToSupabase();
    if (syncResult.success) {
      console.log('✅ Sync successful!');
      console.log('   Workouts synced:', syncResult.syncedWorkouts);
      console.log('   Sets synced:', syncResult.syncedSets);
    } else {
      console.log('⚠️ Sync failed (this is normal if Supabase not configured yet)');
      console.log('   Errors:', syncResult.errors);
    }
    console.log('');

    console.log('🎉 Example completed successfully!\n');
    return fullWorkout;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

/**
 * Example: Read last workout (for "Repeat Last Workout" feature)
 */
export async function exampleRepeatLastWorkout() {
  console.log('🔄 Example: Repeat Last Workout\n');

  const { getLastCompletedWorkout, createWorkout, addExerciseToWorkout } = await import('../index');

  // Get last workout
  const lastWorkout = await getLastCompletedWorkout('test-user-123');

  if (!lastWorkout) {
    console.log('⚠️ No previous workouts found');
    return null;
  }

  console.log('📋 Last workout:', lastWorkout.title);
  console.log('   Exercises:', lastWorkout.exercises.length);

  // Create new workout based on last one
  const newWorkout = await createWorkout({
    user_id: 'test-user-123',
    started_at: Math.floor(Date.now() / 1000),
    title: lastWorkout.title, // Same title
  });

  // Add same exercises
  for (const ex of lastWorkout.exercises) {
    await addExerciseToWorkout(
      newWorkout.id,
      ex.exercise_id,
      ex.order_index,
      ex.superset_group ?? undefined
    );
    console.log('✅ Added:', ex.exercise?.name || 'Unknown exercise');
  }

  console.log('\n🎉 New workout created with same exercises!\n');
  return newWorkout;
}

/**
 * You can run these examples like this:
 *
 * import { exampleWorkoutFlow } from '@/services/database/__tests__/example';
 * exampleWorkoutFlow();
 */
