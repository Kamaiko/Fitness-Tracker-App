/**
 * Workout Store
 *
 * Manages current workout session state.
 * This is where active workout data is stored temporarily.
 */

import { create } from 'zustand';

export interface WorkoutState {
  isWorkoutActive: boolean;
  workoutStartTime: Date | null;

  // Actions
  startWorkout: () => void;
  endWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  isWorkoutActive: false,
  workoutStartTime: null,

  startWorkout: () =>
    set({
      isWorkoutActive: true,
      workoutStartTime: new Date(),
    }),

  endWorkout: () =>
    set({
      isWorkoutActive: false,
      workoutStartTime: null,
    }),
}));
