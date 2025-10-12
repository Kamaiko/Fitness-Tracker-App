/**
 * SQLite Database Setup
 *
 * Simple, performant local database for offline-first workout tracking.
 * Migration path: expo-sqlite → WatermelonDB (when 1000+ users)
 */

import * as SQLite from 'expo-sqlite';

// Database instance (singleton)
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize SQLite database
 * Creates tables if they don't exist
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  // Open database (creates if doesn't exist)
  db = await SQLite.openDatabaseAsync('halterofit.db');

  // Enable foreign keys (important for relational integrity)
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Create tables
  await createTables();

  console.log('✅ Database initialized');
  return db;
}

/**
 * Get database instance
 * Throws if not initialized
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Create all tables
 * Matches Supabase schema for easy sync
 */
async function createTables() {
  const database = getDatabase();

  // Users table (minimal - most data in Supabase)
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      preferred_unit TEXT DEFAULT 'kg',
      nutrition_phase TEXT DEFAULT 'maintenance',
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Exercises table (seeded from ExerciseDB + custom)
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      exercise_type TEXT NOT NULL,
      muscle_groups TEXT,
      primary_muscle TEXT,
      equipment TEXT,
      instructions TEXT,
      difficulty TEXT,
      image_url TEXT,
      is_custom INTEGER DEFAULT 0,
      created_by TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
    CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises(equipment);
  `);

  // Workouts table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      completed_at INTEGER,
      duration_seconds INTEGER,
      title TEXT,
      notes TEXT,
      synced INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
    CREATE INDEX IF NOT EXISTS idx_workouts_started_at ON workouts(started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_workouts_synced ON workouts(synced);
  `);

  // Workout exercises (junction table for ordering + supersets)
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_exercises (
      id TEXT PRIMARY KEY,
      workout_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      superset_group TEXT,
      notes TEXT,
      target_sets INTEGER,
      target_reps INTEGER,
      synced INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    );

    CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);
    CREATE INDEX IF NOT EXISTS idx_workout_exercises_synced ON workout_exercises(synced);
  `);

  // Exercise sets
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS exercise_sets (
      id TEXT PRIMARY KEY,
      workout_exercise_id TEXT NOT NULL,
      set_number INTEGER NOT NULL,
      weight REAL,
      weight_unit TEXT,
      reps INTEGER,
      duration_seconds INTEGER,
      distance_meters REAL,
      rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
      rir INTEGER CHECK (rir >= 0 AND rir <= 5),
      rest_time_seconds INTEGER,
      completed_at INTEGER,
      notes TEXT,
      is_warmup INTEGER DEFAULT 0,
      is_failure INTEGER DEFAULT 0,
      synced INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_exercise ON exercise_sets(workout_exercise_id);
    CREATE INDEX IF NOT EXISTS idx_exercise_sets_synced ON exercise_sets(synced);
  `);

  console.log('✅ Tables created');
}

/**
 * Reset database (for testing only)
 * WARNING: Deletes all data
 */
export async function resetDatabase() {
  const database = getDatabase();

  await database.execAsync(`
    DROP TABLE IF EXISTS exercise_sets;
    DROP TABLE IF EXISTS workout_exercises;
    DROP TABLE IF EXISTS workouts;
    DROP TABLE IF EXISTS exercises;
    DROP TABLE IF EXISTS users;
  `);

  await createTables();
  console.log('⚠️ Database reset');
}

/**
 * Get database statistics (for debugging)
 */
export async function getDatabaseStats() {
  const database = getDatabase();

  const workoutsCount = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM workouts'
  );

  const exercisesCount = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercises'
  );

  const setsCount = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercise_sets'
  );

  return {
    workouts: workoutsCount?.count || 0,
    exercises: exercisesCount?.count || 0,
    sets: setsCount?.count || 0,
  };
}
