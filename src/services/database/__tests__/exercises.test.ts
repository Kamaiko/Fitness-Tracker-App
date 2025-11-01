/**
 * Exercise CRUD Operations - Unit Tests
 *
 * Tests exercise CRUD operations with focus on:
 * - Basic CRUD functionality
 * - Sync protocol compliance
 * - Data validation
 *
 * @see {@link src/services/database/watermelon/models/Exercise.ts}
 */

import { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';
import { createTestDatabase, cleanupTestDatabase } from '@test-helpers/database/test-database';
import Exercise from '../watermelon/models/Exercise';
import { createTestExercise, resetTestIdCounter } from '@test-helpers/database/factories';
import { getAllRecords, countRecords } from '@test-helpers/database/queries';
import { wait } from '@test-helpers/database/time';

// NOTE: Sync protocol tests removed - require real SQLite, moved to E2E
// See: __tests__/README.md

describe('Exercise CRUD Operations', () => {
  let database: Database;

  beforeEach(() => {
    database = createTestDatabase();
    resetTestIdCounter();
  });

  afterEach(async () => {
    await cleanupTestDatabase(database);
  });

  // ==========================================================================
  // CREATE Operations
  // ==========================================================================

  describe('createExercise', () => {
    test('creates exercise with required fields', async () => {
      const exercise = await createTestExercise(database, {
        name: 'Bench Press',
        category: 'strength',
        primary_muscle: 'chest',
      });

      expect(exercise.name).toBe('Bench Press');
      expect(exercise.category).toBe('strength');
      expect(exercise.primaryMuscle).toBe('chest');
    });

    test('creates exercise with optional equipment and instructions', async () => {
      const exercise = await createTestExercise(database, {
        name: 'Squat',
        category: 'strength',
        primary_muscle: 'legs',
        equipment: 'barbell',
        instructions: 'Keep chest up, drive through heels',
      });

      expect(exercise.equipment).toBe('barbell');
      expect(exercise.instructions).toBe('Keep chest up, drive through heels');
    });

    // NOTE: Test "creates exercise with sync protocol columns" removed
    // Sync protocol testing requires real SQLite - moved to E2E
  });

  // ==========================================================================
  // READ Operations
  // ==========================================================================

  describe('readExercise', () => {
    test('reads exercise by ID', async () => {
      const exercise = await createTestExercise(database, { name: 'Deadlift' });

      const found = (await database.get('exercises').find(exercise.id)) as Exercise;
      expect(found.name).toBe('Deadlift');
    });

    test('reads exercises by muscle group', async () => {
      await createTestExercise(database, { name: 'Bench Press', primary_muscle: 'chest' });
      await createTestExercise(database, { name: 'Incline Press', primary_muscle: 'chest' });
      await createTestExercise(database, { name: 'Squat', primary_muscle: 'legs' });

      const chestExercises = await database
        .get('exercises')
        .query(Q.where('primary_muscle', 'chest'))
        .fetch();

      expect(chestExercises).toHaveLength(2);
    });

    test('reads exercises by category', async () => {
      await createTestExercise(database, { name: 'Bench Press', category: 'strength' });
      await createTestExercise(database, { name: 'Running', category: 'cardio' });

      const strengthExercises = (await database
        .get('exercises')
        .query(Q.where('category', 'strength'))
        .fetch()) as Exercise[];

      expect(strengthExercises).toHaveLength(1);
      expect(strengthExercises[0]?.name).toBe('Bench Press');
    });
  });

  // ==========================================================================
  // UPDATE Operations
  // ==========================================================================

  describe('updateExercise', () => {
    test('updates exercise name', async () => {
      const exercise = await createTestExercise(database, { name: 'Old Name' });

      await database.write(async () => {
        await exercise.update((e: any) => {
          e.name = 'New Name';
        });
      });

      const updated = (await database.get('exercises').find(exercise.id)) as Exercise;
      expect(updated.name).toBe('New Name');
    });

    // NOTE: Test "updates _changed timestamp on modification" removed
    // Sync protocol testing requires real SQLite - moved to E2E
  });

  // ==========================================================================
  // DELETE Operations
  // ==========================================================================

  // NOTE: Delete operations (soft delete, _status checks) removed
  // Sync protocol testing requires real SQLite - moved to E2E
  // See: __tests__/README.md
});
