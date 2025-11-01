/**
 * FlashList Test Screen
 *
 * Debug screen to validate FlashList performance with 100+ workout items.
 * Accessible via: /debug/flashlist-test
 *
 * Purpose:
 * - Test scroll performance with large dataset
 * - Validate estimatedItemSize accuracy
 * - Verify WorkoutList component behavior
 * - Benchmark FPS (optional)
 *
 * Usage:
 * 1. Run app: npm start
 * 2. Navigate: Type "/debug/flashlist-test" in URL bar
 * 3. Scroll through 100+ items - should be smooth at 60 FPS
 *
 * Cleanup:
 * - Can be deleted after Phase 0.5 validation
 * - Or kept as dev tool for performance testing
 */

import { useState, useMemo } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import type { Workout } from '@/services/database/types';
import { WorkoutList } from '@/components/lists';
import workoutFixtures from '@tests/fixtures/database/workouts.json';

/**
 * Generate mock workouts for testing
 * Creates realistic variations based on fixtures
 */
function generateMockWorkouts(count: number): Workout[] {
  const simpleWorkouts = workoutFixtures.simpleWorkouts;
  const templates = Object.values(simpleWorkouts);
  const workouts: Workout[] = [];

  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    // Cycle through templates
    const template = templates[i % templates.length];

    // Skip if template is undefined (shouldn't happen, but TypeScript safety)
    if (!template) continue;

    // Generate unique ID
    const id = `mock-workout-${i}`;

    // Generate date (going back in time)
    const daysAgo = Math.floor(i / 2); // 2 workouts per day (realistic for power users)
    const startedAt = now - daysAgo * dayInMs;

    // Vary completion status (80% completed, 20% in progress)
    const isCompleted = Math.random() > 0.2;
    const completedAt = isCompleted ? startedAt + template.duration_seconds * 1000 : undefined;

    // Vary duration slightly (±10%)
    const durationVariation = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    const durationSeconds = isCompleted
      ? Math.floor(template.duration_seconds * durationVariation)
      : undefined;

    workouts.push({
      id,
      user_id: 'test-user-id',
      started_at: startedAt,
      completed_at: completedAt,
      duration_seconds: durationSeconds,
      title: template.title,
      notes: 'notes' in template ? template.notes : undefined,
      nutrition_phase: template.nutrition_phase as 'bulk' | 'cut' | 'maintenance',
      created_at: startedAt,
      updated_at: completedAt || startedAt,
    });
  }

  return workouts;
}

/**
 * FlashList Test Screen
 */
export default function FlashListTestScreen() {
  // Generate 120 mock workouts (enough to test scrolling performance)
  const mockWorkouts = useMemo(() => generateMockWorkouts(120), []);

  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const handleWorkoutPress = (workout: Workout) => {
    setSelectedWorkout(workout);
    console.log('Workout pressed:', workout.title, workout.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-background-surface border-b border-background-elevated p-4">
        <Text className="text-2xl font-bold text-foreground">FlashList Test</Text>
        <Text className="text-sm text-foreground-secondary mt-1">
          {mockWorkouts.length} workouts • Scroll to test performance
        </Text>
        {selectedWorkout && (
          <View className="mt-3 p-3 bg-background-elevated rounded-lg">
            <Text className="text-xs text-foreground-tertiary mb-1">Last selected:</Text>
            <Text className="text-sm font-medium text-primary">{selectedWorkout.title}</Text>
          </View>
        )}
      </View>

      {/* WorkoutList - Testing FlashList performance */}
      <WorkoutList workouts={mockWorkouts} onWorkoutPress={handleWorkoutPress} />

      {/* Footer Stats */}
      <View className="bg-background-surface border-t border-background-elevated p-3">
        <Text className="text-xs text-foreground-tertiary text-center">
          FlashList v2.2.0 • estimatedItemSize: 88px • {mockWorkouts.length} items
        </Text>
      </View>
    </SafeAreaView>
  );
}
