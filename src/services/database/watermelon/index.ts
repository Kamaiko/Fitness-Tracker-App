/**
 * WatermelonDB Database Instance
 *
 * Configures and exports the WatermelonDB database for offline-first storage.
 * All models, schema, and adapter configuration.
 */

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
import User from './models/User';
import Exercise from './models/Exercise';
import Workout from './models/Workout';
import WorkoutExercise from './models/WorkoutExercise';
import ExerciseSet from './models/ExerciseSet';

// SQLite adapter configuration
const adapter = new SQLiteAdapter({
  schema,
  // Database name
  dbName: 'halterofit',
  // Enable JSI for better performance (React Native New Architecture)
  jsi: true,
  // Development mode - logs SQL queries (disable in production)
  onSetUpError: (error) => {
    console.error('❌ Database setup error:', error);
  },
});

// Create database instance
export const database = new Database({
  adapter,
  modelClasses: [User, Exercise, Workout, WorkoutExercise, ExerciseSet],
});

// Export models for convenient imports
export { User, Exercise, Workout, WorkoutExercise, ExerciseSet };
export { schema };
