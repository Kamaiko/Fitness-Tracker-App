/**
 * Test Data Factories
 *
 * Provides reusable factory functions for generating test data.
 * Follows DRY principle with sensible defaults and override support.
 *
 * @module factories
 */

import { Database } from '@nozbe/watermelondb';
import User from '../../watermelon/models/User';
import Workout from '../../watermelon/models/Workout';
import Exercise from '../../watermelon/models/Exercise';
import WorkoutExercise from '../../watermelon/models/WorkoutExercise';
import ExerciseSet from '../../watermelon/models/ExerciseSet';

/**
 * Counter for generating unique IDs in tests.
 * Ensures no ID collisions across test runs.
 */
let idCounter = 0;

/**
 * Generates a unique test ID with prefix.
 *
 * @param {string} prefix - Prefix for the ID (e.g., 'user', 'workout')
 * @returns {string} Unique ID (e.g., 'test-user-1', 'test-workout-2')
 */
export function generateTestId(prefix: string): string {
  idCounter += 1;
  return `test-${prefix}-${idCounter}`;
}

/**
 * Resets the ID counter.
 * Call this in beforeEach() to ensure consistent IDs per test.
 *
 * @example
 * ```typescript
 * beforeEach(() => {
 *   resetTestIdCounter();
 * });
 * ```
 */
export function resetTestIdCounter(): void {
  idCounter = 0;
}

// ============================================================================
// User Factories
// ============================================================================

export interface TestUserData {
  id?: string;
  email?: string;
  name?: string;
  avatar_url?: string | null;
}

/**
 * Creates test user data with sensible defaults.
 *
 * @param {Partial<TestUserData>} overrides - Optional field overrides
 * @returns {TestUserData} User data ready for database insertion
 *
 * @example
 * ```typescript
 * const user = createTestUserData();
 * // { id: 'test-user-1', email: 'test-user-1@example.com', ... }
 *
 * const customUser = createTestUserData({ email: 'custom@example.com' });
 * // { id: 'test-user-2', email: 'custom@example.com', ... }
 * ```
 */
export function createTestUserData(overrides: Partial<TestUserData> = {}): TestUserData {
  const id = overrides.id || generateTestId('user');

  return {
    id,
    email: overrides.email || `${id}@example.com`,
    name: overrides.name || `Test User ${idCounter}`,
    avatar_url: overrides.avatar_url !== undefined ? overrides.avatar_url : null,
    ...overrides,
  };
}

/**
 * Creates and persists a test user in the database.
 *
 * @param {Database} database - WatermelonDB instance
 * @param {Partial<TestUserData>} overrides - Optional field overrides
 * @returns {Promise<User>} Created user model
 *
 * @example
 * ```typescript
 * const user = await createTestUser(database);
 * expect(user.email).toBe('test-user-1@example.com');
 * ```
 */
export async function createTestUser(
  database: Database,
  overrides: Partial<TestUserData> = {},
): Promise<User> {
  const userData = createTestUserData(overrides);
  const usersCollection = database.get('users');

  return (await database.write(async () => {
    return await usersCollection.create((user: any) => {
      user._raw.id = userData.id;
      user.email = userData.email!;
      user.name = userData.name!;
      user.avatarUrl = userData.avatar_url;
    });
  })) as User;
}

// ============================================================================
// Workout Factories
// ============================================================================

export interface TestWorkoutData {
  id?: string;
  user_id?: string;
  title?: string;
  notes?: string | null;
  started_at?: string;
  completed_at?: string | null;
  duration_seconds?: number | null;
  nutrition_phase?: string;
}

/**
 * Creates test workout data with sensible defaults.
 *
 * @param {Partial<TestWorkoutData>} overrides - Optional field overrides
 * @returns {TestWorkoutData} Workout data ready for creation
 *
 * @example
 * ```typescript
 * const workoutData = createTestWorkoutData({ title: 'Leg Day' });
 * // { user_id: 'test-user-1', title: 'Leg Day', ... }
 * ```
 */
export function createTestWorkoutData(
  overrides: Partial<TestWorkoutData> = {},
): TestWorkoutData {
  return {
    user_id: overrides.user_id || generateTestId('user'),
    title: overrides.title || `Test Workout ${idCounter}`,
    notes: overrides.notes || null,
    started_at: overrides.started_at || new Date().toISOString(),
    completed_at: overrides.completed_at || null,
    duration_seconds: overrides.duration_seconds || null,
    nutrition_phase: overrides.nutrition_phase || 'maintenance',
    ...overrides,
  };
}

/**
 * Creates and persists a test workout in the database.
 *
 * Note: This uses the workouts service layer for consistency with production code.
 *
 * @param {Database} database - WatermelonDB instance
 * @param {Partial<TestWorkoutData>} overrides - Optional field overrides
 * @returns {Promise<Workout>} Created workout model
 *
 * @example
 * ```typescript
 * const workout = await createTestWorkout(database, {
 *   title: 'Push Day',
 *   status: 'completed'
 * });
 * expect(workout.title).toBe('Push Day');
 * ```
 */
export async function createTestWorkout(
  database: Database,
  overrides: Partial<TestWorkoutData> = {},
): Promise<Workout> {
  const workoutData = createTestWorkoutData(overrides);
  const workoutsCollection = database.get('workouts');

  return (await database.write(async () => {
    return await workoutsCollection.create((workout: any) => {
      if (overrides.id) {
        workout._raw.id = overrides.id;
      }
      workout.userId = workoutData.user_id;
      workout.title = workoutData.title;
      workout.notes = workoutData.notes;
      workout.startedAt = workoutData.started_at ? new Date(workoutData.started_at) : new Date();
      workout.completedAt = workoutData.completed_at
        ? new Date(workoutData.completed_at)
        : null;
      workout.durationSeconds = workoutData.duration_seconds;
      workout.nutritionPhase = workoutData.nutrition_phase;
    });
  })) as Workout;
}

// ============================================================================
// Exercise Factories
// ============================================================================

export interface TestExerciseData {
  id?: string;
  name?: string;
  category?: string;
  primary_muscle?: string;
  muscle_groups?: string;
  equipment?: string | null;
  instructions?: string | null;
}

/**
 * Creates test exercise data with sensible defaults.
 *
 * @param {Partial<TestExerciseData>} overrides - Optional field overrides
 * @returns {TestExerciseData} Exercise data ready for creation
 *
 * @example
 * ```typescript
 * const exerciseData = createTestExerciseData({ name: 'Bench Press' });
 * ```
 */
export function createTestExerciseData(
  overrides: Partial<TestExerciseData> = {},
): TestExerciseData {
  return {
    id: overrides.id || generateTestId('exercise'),
    name: overrides.name || `Test Exercise ${idCounter}`,
    category: overrides.category || 'strength',
    primary_muscle: overrides.primary_muscle || 'chest',
    muscle_groups: overrides.muscle_groups || JSON.stringify(['chest']),
    equipment: overrides.equipment !== undefined ? overrides.equipment : 'barbell',
    instructions: overrides.instructions !== undefined ? overrides.instructions : null,
    ...overrides,
  };
}

/**
 * Creates and persists a test exercise in the database.
 *
 * @param {Database} database - WatermelonDB instance
 * @param {Partial<TestExerciseData>} overrides - Optional field overrides
 * @returns {Promise<Exercise>} Created exercise model
 *
 * @example
 * ```typescript
 * const exercise = await createTestExercise(database, {
 *   name: 'Squat',
 *   muscle_group: 'legs'
 * });
 * ```
 */
export async function createTestExercise(
  database: Database,
  overrides: Partial<TestExerciseData> = {},
): Promise<Exercise> {
  const exerciseData = createTestExerciseData(overrides);
  const exercisesCollection = database.get('exercises');

  return (await database.write(async () => {
    return await exercisesCollection.create((exercise: any) => {
      exercise._raw.id = exerciseData.id;
      exercise.name = exerciseData.name!;
      exercise.category = exerciseData.category!;
      exercise.exerciseType = exerciseData.category || 'strength'; // Use category as type
      exercise.muscleGroups = exerciseData.muscle_groups!;
      exercise.primaryMuscle = exerciseData.primary_muscle!;
      exercise.equipment = exerciseData.equipment || '';
      exercise.instructions = exerciseData.instructions || '';
      exercise.difficulty = 'intermediate'; // Default difficulty
      exercise.isCustom = false; // Default to not custom
    });
  })) as Exercise;
}

// ============================================================================
// WorkoutExercise Factories
// ============================================================================

export interface TestWorkoutExerciseData {
  id?: string;
  workout_id?: string;
  exercise_id?: string;
  order_index?: number;
  notes?: string | null;
  rest_seconds?: number;
}

/**
 * Creates test workout exercise data with sensible defaults.
 *
 * @param {Partial<TestWorkoutExerciseData>} overrides - Optional field overrides
 * @returns {TestWorkoutExerciseData} Workout exercise data ready for creation
 *
 * @example
 * ```typescript
 * const weData = createTestWorkoutExerciseData({
 *   workout_id: 'workout-1',
 *   exercise_id: 'exercise-1'
 * });
 * ```
 */
export function createTestWorkoutExerciseData(
  overrides: Partial<TestWorkoutExerciseData> = {},
): TestWorkoutExerciseData {
  return {
    workout_id: overrides.workout_id || generateTestId('workout'),
    exercise_id: overrides.exercise_id || generateTestId('exercise'),
    order_index: overrides.order_index !== undefined ? overrides.order_index : 0,
    notes: overrides.notes || null,
    rest_seconds: overrides.rest_seconds !== undefined ? overrides.rest_seconds : 90,
    ...overrides,
  };
}

/**
 * Creates and persists a test workout exercise in the database.
 *
 * @param {Database} database - WatermelonDB instance
 * @param {Partial<TestWorkoutExerciseData>} overrides - Optional field overrides
 * @returns {Promise<WorkoutExercise>} Created workout exercise model
 *
 * @example
 * ```typescript
 * const we = await createTestWorkoutExercise(database, {
 *   workout_id: workout.id,
 *   exercise_id: exercise.id,
 *   order_index: 0
 * });
 * ```
 */
export async function createTestWorkoutExercise(
  database: Database,
  overrides: Partial<TestWorkoutExerciseData> = {},
): Promise<WorkoutExercise> {
  const weData = createTestWorkoutExerciseData(overrides);
  const workoutExercisesCollection = database.get('workout_exercises');

  return (await database.write(async () => {
    return await workoutExercisesCollection.create((we: any) => {
      if (overrides.id) {
        we._raw.id = overrides.id;
      }
      we.workoutId = weData.workout_id;
      we.exerciseId = weData.exercise_id;
      we.orderIndex = weData.order_index;
      we.notes = weData.notes;
      we.restSeconds = weData.rest_seconds;
    });
  })) as WorkoutExercise;
}

// ============================================================================
// ExerciseSet Factories
// ============================================================================

export interface TestExerciseSetData {
  id?: string;
  workout_exercise_id?: string;
  set_number?: number;
  weight?: number;
  reps?: number;
  is_warmup?: boolean;
  is_failure?: boolean;
  rir?: number | null;
  rpe?: number | null;
  notes?: string | null;
}

/**
 * Creates test exercise set data with sensible defaults.
 *
 * @param {Partial<TestExerciseSetData>} overrides - Optional field overrides
 * @returns {TestExerciseSetData} Exercise set data ready for creation
 *
 * @example
 * ```typescript
 * const setData = createTestExerciseSetData({
 *   weight: 100,
 *   reps: 10
 * });
 * ```
 */
export function createTestExerciseSetData(
  overrides: Partial<TestExerciseSetData> = {},
): TestExerciseSetData {
  return {
    workout_exercise_id: overrides.workout_exercise_id || generateTestId('workout-exercise'),
    set_number: overrides.set_number !== undefined ? overrides.set_number : 1,
    weight: overrides.weight !== undefined ? overrides.weight : 100,
    reps: overrides.reps !== undefined ? overrides.reps : 10,
    is_warmup: overrides.is_warmup !== undefined ? overrides.is_warmup : false,
    is_failure: overrides.is_failure !== undefined ? overrides.is_failure : false,
    rir: overrides.rir !== undefined ? overrides.rir : null,
    rpe: overrides.rpe !== undefined ? overrides.rpe : null,
    notes: overrides.notes || null,
    ...overrides,
  };
}

/**
 * Creates and persists a test exercise set in the database.
 *
 * @param {Database} database - WatermelonDB instance
 * @param {Partial<TestExerciseSetData>} overrides - Optional field overrides
 * @returns {Promise<ExerciseSet>} Created exercise set model
 *
 * @example
 * ```typescript
 * const set = await createTestExerciseSet(database, {
 *   workout_exercise_id: we.id,
 *   weight: 225,
 *   reps: 5,
 *   rir: 2
 * });
 * ```
 */
export async function createTestExerciseSet(
  database: Database,
  overrides: Partial<TestExerciseSetData> = {},
): Promise<ExerciseSet> {
  const setData = createTestExerciseSetData(overrides);
  const setsCollection = database.get('exercise_sets');

  return (await database.write(async () => {
    return await setsCollection.create((set: any) => {
      if (overrides.id) {
        set._raw.id = overrides.id;
      }
      set.workoutExerciseId = setData.workout_exercise_id;
      set.setNumber = setData.set_number;
      set.weight = setData.weight;
      set.reps = setData.reps;
      set.isWarmup = setData.is_warmup;
      set.isFailure = setData.is_failure;
      set.rir = setData.rir;
      set.rpe = setData.rpe;
      set.notes = setData.notes;
    });
  })) as ExerciseSet;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates multiple records using a factory function.
 * Useful for bulk data generation in tests.
 *
 * @param {Function} factoryFn - Factory function to create each record
 * @param {Database} database - WatermelonDB instance
 * @param {number} count - Number of records to create
 * @param {Function} overridesFn - Optional function to generate overrides for each record (receives index)
 * @returns {Promise<Array>} Array of created records
 *
 * @example
 * ```typescript
 * const workouts = await createMultipleRecords(
 *   createTestWorkout,
 *   database,
 *   10,
 *   (i) => ({ title: `Workout ${i + 1}` })
 * );
 * ```
 */
export async function createMultipleRecords<T>(
  factoryFn: (database: Database, overrides?: any) => Promise<T>,
  database: Database,
  count: number,
  overridesFn?: (index: number) => any,
): Promise<T[]> {
  const records: T[] = [];
  for (let i = 0; i < count; i++) {
    const overrides = overridesFn ? overridesFn(i) : {};
    const record = await factoryFn(database, overrides);
    records.push(record);
  }
  return records;
}
