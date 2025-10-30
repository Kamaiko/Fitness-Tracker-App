/**
 * Workout Model
 *
 * Represents a single workout session.
 * Related to user, contains multiple workout_exercises.
 */

import { Model, Q } from '@nozbe/watermelondb';
import { field, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import type User from './User';
import type WorkoutExercise from './WorkoutExercise';

export default class Workout extends Model {
  static table = 'workouts';

  static associations = {
    users: { type: 'belongs_to' as const, key: 'user_id' },
    workout_exercises: { type: 'has_many' as const, foreignKey: 'workout_id' },
  };

  @field('user_id') userId!: string;
  @relation('users', 'user_id') user!: User;
  @children('workout_exercises') workoutExercises!: WorkoutExercise[];

  @date('started_at') startedAt!: Date;
  @date('completed_at') completedAt?: Date;
  @field('duration_seconds') durationSeconds?: number;
  @field('title') title?: string;
  @field('notes') notes?: string;
  @field('nutrition_phase') nutritionPhase!: string; // 'bulk' | 'cut' | 'maintenance'
  @field('synced') synced!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // Computed property: workout is active if not completed
  get isActive(): boolean {
    return !this.completedAt;
  }

  // Computed property: format duration as HH:MM:SS
  get durationFormatted(): string {
    if (!this.durationSeconds) return '00:00';
    const hours = Math.floor(this.durationSeconds / 3600);
    const minutes = Math.floor((this.durationSeconds % 3600) / 60);
    const seconds = this.durationSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
