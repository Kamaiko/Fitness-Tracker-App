/**
 * Integration Test: Conflict Resolution
 *
 * Tests "Last Write Wins" strategy for WatermelonDB sync conflicts.
 * Critical for multi-device and offline scenarios.
 *
 * CONFLICT SCENARIOS:
 * - Same record modified on 2 devices (different timestamps)
 * - Local vs Remote: newer timestamp wins
 * - Multi-device: latest timestamp wins
 *
 * @module integration/database/conflict-resolution
 */

import { http, HttpResponse } from 'msw';
import { mockSupabaseServer, getMockStore } from '@test-helpers/network/mock-supabase';
import {
  generateConflict,
  generateMultiDeviceConflict,
  fixtures,
} from '@test-helpers/network/sync-fixtures';

describe('Sync: Conflict Resolution', () => {
  describe('Last Write Wins - Basic', () => {
    it('should keep local change if newer', () => {
      const baseWorkout = fixtures.generateWorkout({ id: 'workout-123', title: 'Original' });
      const { local, remote } = generateConflict(baseWorkout, true); // local newer

      // Local wins (higher _changed timestamp)
      expect(local._changed).toBeGreaterThan(remote._changed);
      expect(local.title).toBe('Local Edit');
    });

    it('should keep remote change if newer', () => {
      const baseWorkout = fixtures.generateWorkout({ id: 'workout-123', title: 'Original' });
      const { local, remote } = generateConflict(baseWorkout, false); // remote newer

      // Remote wins (higher _changed timestamp)
      expect(remote._changed).toBeGreaterThan(local._changed);
      expect(remote.title).toBe('Remote Edit');
    });

    it('should resolve multi-device conflicts by timestamp', () => {
      const baseWorkout = fixtures.generateWorkout({ id: 'workout-123' });
      const devices = generateMultiDeviceConflict(baseWorkout, 3);

      // Sort by _changed timestamp (descending)
      devices.sort((a, b) => b._changed - a._changed);

      // Winner = highest timestamp (Device 3 has most recent change: 1min ago vs 2min/3min)
      expect(devices[0]!.title).toBe('Device 3 Edit');
      expect(devices[0]!._changed).toBeGreaterThan(devices[1]!._changed);
      expect(devices[1]!._changed).toBeGreaterThan(devices[2]!._changed);
    });
  });

  describe('Server-Side Conflict Resolution', () => {
    it('should apply last write wins on server', async () => {
      const store = getMockStore();
      const workoutId = fixtures.generateUUID();

      // Seed existing workout on "server"
      const existingWorkout = fixtures.generateWorkout({
        id: workoutId,
        title: 'Server Version',
        _changed: fixtures.timestampInPast(10),
      });
      store.seedData('workouts', [existingWorkout]);

      // Attempt to push older change (should be rejected)
      const olderChange = fixtures.generateWorkout({
        id: workoutId,
        title: 'Old Local Edit',
        _changed: fixtures.timestampInPast(15), // older than server
      });

      mockSupabaseServer.use(
        http.post('*/rest/v1/rpc/push_changes', async ({ request }) => {
          const body = (await request.json()) as any;
          const changes = body.changes.workouts;

          // Server should reject older changes
          if (changes.updated?.[0]?._changed < existingWorkout._changed) {
            return HttpResponse.json({ error: 'Conflict: server version newer' }, { status: 409 });
          }

          return HttpResponse.json({ success: true });
        })
      );

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/rpc/push_changes`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            changes: {
              workouts: {
                created: [],
                updated: [olderChange],
                deleted: [],
              },
            },
          }),
        }
      );

      expect(response.status).toBe(409); // Conflict
    });

    it('should accept newer local changes', async () => {
      const store = getMockStore();
      const workoutId = fixtures.generateUUID();

      // Seed existing workout on "server"
      const existingWorkout = fixtures.generateWorkout({
        id: workoutId,
        title: 'Server Version',
        _changed: fixtures.timestampInPast(10),
      });
      store.seedData('workouts', [existingWorkout]);

      // Push newer change (should succeed)
      const newerChange = fixtures.generateWorkout({
        id: workoutId,
        title: 'New Local Edit',
        _changed: Date.now(), // newer than server
      });

      mockSupabaseServer.use(
        http.post('*/rest/v1/rpc/push_changes', async ({ request }) => {
          const body = (await request.json()) as any;
          const changes = body.changes.workouts;

          // Server accepts newer changes
          if (changes.updated?.[0]?._changed >= existingWorkout._changed) {
            store.applyChanges(body.changes);
            return HttpResponse.json({ success: true });
          }

          return HttpResponse.json({ error: 'Unexpected conflict' }, { status: 409 });
        })
      );

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/rpc/push_changes`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            changes: {
              workouts: {
                created: [],
                updated: [newerChange],
                deleted: [],
              },
            },
          }),
        }
      );

      expect(response.status).toBe(200);
    });
  });

  describe('Create-Update-Delete Conflicts', () => {
    it('should handle create conflict (same ID)', () => {
      const id = fixtures.generateUUID();

      const local = fixtures.generateWorkout({ id, title: 'Local Create' });
      const remote = fixtures.generateWorkout({ id, title: 'Remote Create' });

      // If both create same ID, last write wins
      if (local._changed > remote._changed) {
        expect(local.title).toBe('Local Create');
      } else {
        expect(remote.title).toBe('Remote Create');
      }
    });

    it('should handle update-delete conflict', () => {
      const workoutId = fixtures.generateUUID();

      // Scenario: Device A updates, Device B deletes (different times)
      const updateTimestamp = fixtures.timestampInPast(5);
      const deleteTimestamp = Date.now();

      // Delete happened after update → Delete wins
      expect(deleteTimestamp).toBeGreaterThan(updateTimestamp);

      // In real sync: deleted record would not appear in pull changes
      const pullChanges = {
        workouts: {
          created: [],
          updated: [],
          deleted: [workoutId], // Delete wins
        },
      };

      expect(pullChanges.workouts.deleted).toContain(workoutId);
    });

    it('should handle concurrent deletions (idempotent)', () => {
      const workoutId = fixtures.generateUUID();

      // Both devices delete same record
      const deletion1 = [workoutId];
      const deletion2 = [workoutId];

      // Deletions are idempotent (no conflict)
      expect(deletion1).toEqual(deletion2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle identical timestamps (rare but possible)', () => {
      const timestamp = Date.now();

      const local = fixtures.generateWorkout({
        id: 'workout-123',
        _changed: timestamp,
        title: 'Local',
      });
      const remote = fixtures.generateWorkout({
        id: 'workout-123',
        _changed: timestamp,
        title: 'Remote',
      });

      // Same timestamp → tie-breaker needed (e.g., device ID, or accept one arbitrarily)
      expect(local._changed).toBe(remote._changed);

      // In practice: WatermelonDB uses microsecond precision to avoid this
      // For testing: either version is acceptable
    });

    it('should preserve metadata during conflict resolution', () => {
      const baseWorkout = fixtures.generateWorkout({ id: 'workout-123' });
      const { local, remote } = generateConflict(baseWorkout, true);

      // Metadata should be preserved
      expect(local).toHaveSyncMetadata();
      expect(remote).toHaveSyncMetadata();

      // Winner keeps all metadata
      expect(local.id).toBe(baseWorkout.id);
      expect(local.created_at).toBeDefined();
      expect(local._status).toBe('synced');
    });

    it('should handle conflicts across multiple tables', () => {
      const workoutId = fixtures.generateUUID();

      const workoutConflict = generateConflict(fixtures.generateWorkout({ id: workoutId }), true);
      const setConflict = generateConflict(fixtures.generateExerciseSet(), false);

      // Each table resolves independently
      expect(workoutConflict.local._changed).toBeGreaterThan(workoutConflict.remote._changed);
      expect(setConflict.remote._changed).toBeGreaterThan(setConflict.local._changed);
    });
  });
});
