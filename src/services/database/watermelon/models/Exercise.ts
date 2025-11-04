/**
 * Exercise Model
 *
 * Represents exercises from ExerciseDB API (1,300+).
 * Pure 1:1 mapping with ExerciseDB (14 fields, zero custom additions) (ADR-019).
 * READ-ONLY in MVP - custom exercises deferred to Phase 3+ (ADR-017).
 * Indexed for fast search by name, body_parts, equipments.
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, json } from '@nozbe/watermelondb/decorators';

/**
 * Sanitize string array from any input (handles arrays, JSON strings, or invalid data)
 */
const sanitizeStringArray = (raw: any): string[] => {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') {
    if (raw === '') return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default class Exercise extends Model {
  static table = 'exercises';

  // ===== ExerciseDB fields (1:1 mapping) =====
  @field('exercisedb_id') exercisedbId!: string; // Original ExerciseDB ID (e.g., "K6NnTv0")
  @field('name') name!: string;

  @json('body_parts', sanitizeStringArray) bodyParts!: string[]; // ["Chest", "Shoulders"]
  @json('target_muscles', sanitizeStringArray) targetMuscles!: string[]; // ["Pectoralis Major"]
  @json('secondary_muscles', sanitizeStringArray) secondaryMuscles!: string[]; // ["Triceps", "Deltoids"]
  @json('equipments', sanitizeStringArray) equipments!: string[]; // ["Barbell", "Bench"]

  @field('exercise_type') exerciseType!: string; // "weight_reps" | "cardio" | "duration" | "stretching"

  @json('instructions', sanitizeStringArray) instructions!: string[]; // Step-by-step array
  @json('exercise_tips', sanitizeStringArray) exerciseTips!: string[]; // Safety/technique tips
  @json('variations', sanitizeStringArray) variations!: string[]; // Alternative versions
  @json('keywords', sanitizeStringArray) keywords!: string[]; // Search terms

  @field('overview') overview?: string; // Descriptive summary
  @field('image_url') imageUrl?: string; // Exercise image URL
  @field('video_url') videoUrl?: string; // Exercise video URL

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // NOTE: _changed and _status are managed automatically by WatermelonDB
  // Access via: record._raw._changed and record._raw._status (or record.syncStatus)

  // ===== Computed properties for convenience =====

  /**
   * Primary muscle (first target muscle)
   * @deprecated Use targetMuscles[0] directly
   */
  get primaryMuscle(): string | undefined {
    return this.targetMuscles[0];
  }

  /**
   * Primary equipment (first equipment)
   */
  get primaryEquipment(): string | undefined {
    return this.equipments[0];
  }

  /**
   * All muscles involved (target + secondary)
   */
  get allMuscles(): string[] {
    return [...this.targetMuscles, ...this.secondaryMuscles];
  }

  // FUTURE: Custom exercises (Phase 3+)
  // If beta users validate need, add:
  // - @field('is_custom') isCustom?: boolean
  // - @field('created_by') createdBy?: string
  // See docs/ADR-017-No-Custom-Exercises-MVP.md
}
