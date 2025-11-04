/**
 * Exercise Model
 *
 * Represents exercises from ExerciseDB API (1,300+).
 * READ-ONLY in MVP - custom exercises deferred to Phase 3+ (ADR-017).
 * Indexed for fast search by name, category, equipment.
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Exercise extends Model {
  static table = 'exercises';

  @field('exercisedb_id') exercisedbId!: string; // Original ExerciseDB ID (e.g., "0002")
  @field('name') name!: string;
  @field('category') category!: string; // e.g., 'strength', 'cardio'
  @field('exercise_type') exerciseType!: string;
  @field('muscle_groups') muscleGroups!: string; // JSON string array
  @field('primary_muscle') primaryMuscle!: string;
  @field('equipment') equipment!: string;
  @field('instructions') instructions!: string;
  @field('difficulty') difficulty!: string; // 'beginner' | 'intermediate' | 'expert'
  @field('image_url') imageUrl?: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // NOTE: _changed and _status are managed automatically by WatermelonDB
  // Access via: record._raw._changed and record._raw._status (or record.syncStatus)

  // Helper to parse muscle groups JSON
  get muscleGroupsArray(): string[] {
    try {
      return JSON.parse(this.muscleGroups);
    } catch {
      return [];
    }
  }

  // FUTURE: Custom exercises (Phase 3+)
  // If beta users validate need, add:
  // - @field('is_custom') isCustom?: boolean
  // - @field('created_by') createdBy?: string
  // See docs/ADR-017-No-Custom-Exercises-MVP.md
}
