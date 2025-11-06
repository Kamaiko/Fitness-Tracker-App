/**
 * Integration Test: Schema Validation
 *
 * Validates Supabase RPC payloads and WatermelonDB sync protocol format.
 * Uses Zod schemas to ensure type safety for sync operations.
 *
 * WHAT THIS VALIDATES:
 * - pull_changes response matches WatermelonDB sync protocol
 * - push_changes request matches expected format
 * - Sync metadata (_changed, _status, id) is present and valid
 * - Timestamps are valid (positive, not too far in future)
 *
 * @module integration/database/schema-validation
 */

import { z } from 'zod';
import { http, HttpResponse } from 'msw';
import { mockSupabaseServer } from '@test-helpers/network/mock-supabase';
import {
  generateChangeSet,
  generatePullResponse,
  fixtures,
} from '@test-helpers/network/sync-fixtures';

// ============================================================================
// Zod Schemas (WatermelonDB Sync Protocol)
// ============================================================================

/**
 * Timestamp schema (non-negative number, not too far in future)
 * Allows epoch (0) as valid timestamp
 */
const TimestampSchema = z
  .number()
  .nonnegative() // Allow 0 (epoch) as valid
  .max(Date.now() + 60000, 'Timestamp too far in future (>1 min)');

/**
 * Sync metadata schema (_changed, _status)
 */
const SyncMetadataSchema = z.object({
  _changed: TimestampSchema,
  _status: z.enum(['synced', 'created', 'updated', 'deleted']),
});

/**
 * Base record schema (id + timestamps)
 */
const BaseRecordSchema = z.object({
  id: z.string().uuid(),
  created_at: TimestampSchema.optional(),
  updated_at: TimestampSchema.optional(),
});

/**
 * Workout record schema
 */
const WorkoutRecordSchema = BaseRecordSchema.merge(SyncMetadataSchema).extend({
  user_id: z.string().uuid(),
  started_at: TimestampSchema,
  ended_at: TimestampSchema.optional().nullable(),
  title: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

/**
 * Exercise record schema (GitHub ExerciseDB dataset structure)
 */
const ExerciseRecordSchema = BaseRecordSchema.merge(SyncMetadataSchema).extend({
  exercisedb_id: z.string(),
  name: z.string(),
  body_parts: z.string(), // JSON array
  target_muscles: z.string(), // JSON array
  secondary_muscles: z.string(), // JSON array
  equipments: z.string(), // JSON array
  instructions: z.string(), // JSON array
  gif_url: z.string().optional().nullable(),
});

/**
 * Exercise set record schema
 */
const ExerciseSetRecordSchema = BaseRecordSchema.merge(SyncMetadataSchema).extend({
  workout_exercise_id: z.string().uuid(),
  set_number: z.number().int().positive(),
  weight: z.number().positive().optional().nullable(),
  weight_unit: z.string().optional().nullable(),
  reps: z.number().int().positive().optional().nullable(),
  duration_seconds: z.number().positive().optional().nullable(),
  distance_meters: z.number().positive().optional().nullable(),
  rpe: z.number().int().min(1).max(10).optional().nullable(), // Rate of Perceived Exertion
  rir: z.number().int().min(0).max(5).optional().nullable(), // Reps in Reserve (0-5 per schema)
  rest_time_seconds: z.number().positive().optional().nullable(),
  completed_at: TimestampSchema.optional().nullable(),
  notes: z.string().optional().nullable(),
  is_warmup: z.boolean(),
  is_failure: z.boolean(),
});

/**
 * Table changes schema (created/updated/deleted)
 */
const TableChangesSchema = z.object({
  created: z.array(z.any()).optional(), // Any record type
  updated: z.array(z.any()).optional(),
  deleted: z.array(z.string().uuid()).optional(),
});

/**
 * Pull changes response schema (WatermelonDB sync protocol)
 */
const PullChangesResponseSchema = z.object({
  changes: z.record(z.string(), TableChangesSchema), // { workouts: {...}, exercises: {...} }
  timestamp: TimestampSchema,
});

/**
 * Push changes request schema (WatermelonDB sync protocol)
 */
const PushChangesRequestSchema = z.object({
  changes: z.record(z.string(), TableChangesSchema),
  lastPulledAt: TimestampSchema.optional(),
});

// ============================================================================
// Tests
// ============================================================================

describe('Sync: Schema Validation', () => {
  describe('Pull Changes Response', () => {
    it('should match WatermelonDB sync protocol schema', async () => {
      const mockChanges = generateChangeSet(['workouts']);

      mockSupabaseServer.use(
        http.post('*/rest/v1/rpc/pull_changes', () => {
          return HttpResponse.json(generatePullResponse(mockChanges));
        })
      );

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/rpc/pull_changes`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lastPulledAt: 0 }),
        }
      );

      const data = await response.json();

      // Validate schema
      const result = PullChangesResponseSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (!result.success) {
        console.error('Schema validation errors:', result.error.issues);
      }
    });

    it('should validate timestamp is within acceptable range', async () => {
      const mockChanges = generateChangeSet(['workouts']);

      mockSupabaseServer.use(
        http.post('*/rest/v1/rpc/pull_changes', () => {
          return HttpResponse.json(generatePullResponse(mockChanges));
        })
      );

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/rpc/pull_changes`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lastPulledAt: 0 }),
        }
      );

      const data = await response.json();

      // Validate timestamp
      expect(data.timestamp).toBeValidTimestamp();
    });

    it('should validate all workouts have sync metadata', async () => {
      const mockChanges = generateChangeSet(['workouts']);

      mockSupabaseServer.use(
        http.post('*/rest/v1/rpc/pull_changes', () => {
          return HttpResponse.json(generatePullResponse(mockChanges));
        })
      );

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/rpc/pull_changes`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lastPulledAt: 0 }),
        }
      );

      const data = await response.json();

      // Validate each created workout
      data.changes.workouts?.created?.forEach((workout: any) => {
        expect(workout).toHaveSyncMetadata();

        // Validate with Zod
        const result = SyncMetadataSchema.safeParse(workout);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid timestamps in response', () => {
      const invalidTimestamps = [
        -1, // Negative
        0, // Epoch (technically valid but suspicious for pull response)
        Date.now() + 100000000, // Too far in future
      ];

      invalidTimestamps.forEach((timestamp) => {
        const result = TimestampSchema.safeParse(timestamp);

        if (timestamp === 0) {
          // Epoch is valid by our schema (positive)
          expect(result.success).toBe(true);
        } else {
          // Negative and too far future should fail
          expect(result.success).toBe(false);
        }
      });
    });
  });

  describe('Push Changes Request', () => {
    it('should validate push request matches expected schema', async () => {
      const localChanges = generateChangeSet(['workouts', 'exercises']);
      const pushPayload = {
        changes: localChanges,
        lastPulledAt: Date.now(),
      };

      // Validate with Zod
      const result = PushChangesRequestSchema.safeParse(pushPayload);

      expect(result.success).toBe(true);
      if (!result.success) {
        console.error('Schema validation errors:', result.error.issues);
      }
    });

    it('should validate deleted IDs are UUIDs', async () => {
      const validUUID = fixtures.generateUUID();
      const invalidUUID = 'not-a-uuid';

      // Valid deletion
      const validDeletion = {
        changes: {
          workouts: {
            created: [],
            updated: [],
            deleted: [validUUID],
          },
        },
      };

      const validResult = PushChangesRequestSchema.safeParse(validDeletion);
      expect(validResult.success).toBe(true);

      // Invalid deletion
      const invalidDeletion = {
        changes: {
          workouts: {
            created: [],
            updated: [],
            deleted: [invalidUUID], // Invalid UUID
          },
        },
      };

      const invalidResult = PushChangesRequestSchema.safeParse(invalidDeletion);
      expect(invalidResult.success).toBe(false);
    });

    it('should handle empty push requests', () => {
      const emptyPush = {
        changes: {},
      };

      const result = PushChangesRequestSchema.safeParse(emptyPush);
      expect(result.success).toBe(true);
    });
  });

  describe('Record Schemas', () => {
    it('should validate workout records', () => {
      const validWorkout = fixtures.generateWorkout();

      const result = WorkoutRecordSchema.safeParse(validWorkout);

      expect(result.success).toBe(true);
      if (!result.success) {
        console.error('Workout validation errors:', result.error.issues);
      }
    });

    it('should validate exercise records', () => {
      const validExercise = fixtures.generateExercise();

      const result = ExerciseRecordSchema.safeParse(validExercise);

      expect(result.success).toBe(true);
      if (!result.success) {
        console.error('Exercise validation errors:', result.error.issues);
      }
    });

    it('should validate exercise set records', () => {
      const validSet = fixtures.generateExerciseSet();

      const result = ExerciseSetRecordSchema.safeParse(validSet);

      expect(result.success).toBe(true);
      if (!result.success) {
        console.error('Exercise set validation errors:', result.error.issues);
      }
    });

    it('should reject workout with invalid UUID', () => {
      const invalidWorkout = {
        id: 'not-a-uuid',
        user_id: fixtures.generateUUID(),
        started_at: Date.now(),
        _changed: Date.now(),
        _status: 'synced',
      };

      const result = WorkoutRecordSchema.safeParse(invalidWorkout);
      expect(result.success).toBe(false);
    });

    it('should reject exercise set with invalid RIR', () => {
      const invalidSet = fixtures.generateExerciseSet({
        rir: 10, // RIR must be 0-5 (per WatermelonDB schema)
      });

      const result = ExerciseSetRecordSchema.safeParse(invalidSet);
      expect(result.success).toBe(false);
    });

    it('should allow optional fields to be null', () => {
      const workoutWithNulls = fixtures.generateWorkout({
        title: null,
        notes: null,
        ended_at: null,
      });

      const result = WorkoutRecordSchema.safeParse(workoutWithNulls);
      expect(result.success).toBe(true);
    });
  });

  describe('Sync Metadata Validation', () => {
    it('should validate _status enum values', () => {
      const validStatuses = ['synced', 'created', 'updated', 'deleted'];

      validStatuses.forEach((status) => {
        const record = {
          _changed: Date.now(),
          _status: status,
        };

        const result = SyncMetadataSchema.safeParse(record);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid _status values', () => {
      const invalidStatuses = ['pending', 'error', 'unknown', ''];

      invalidStatuses.forEach((status) => {
        const record = {
          _changed: Date.now(),
          _status: status,
        };

        const result = SyncMetadataSchema.safeParse(record);
        expect(result.success).toBe(false);
      });
    });

    it('should require _changed timestamp', () => {
      const recordWithoutChanged = {
        _status: 'synced',
      };

      const result = SyncMetadataSchema.safeParse(recordWithoutChanged);
      expect(result.success).toBe(false);
    });
  });
});
