/**
 * Exercise Model
 *
 * Represents exercises from GitHub ExerciseDB dataset (1,500+).
 * 1:1 mapping with GitHub dataset structure (8 fields).
 * READ-ONLY in MVP - custom exercises deferred to Phase 3+ (ADR-017).
 * Indexed for fast search by name, body_parts, equipments.
 * Animated GIFs (gifUrl) provided by GitHub ExerciseDB dataset.
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, json } from '@nozbe/watermelondb/decorators';

/**
 * Sanitize string array from any input (handles arrays, JSON strings, or invalid data)
 */
const sanitizeStringArray = (raw: unknown): string[] => {
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

  // ===== ExerciseDB V1 API fields =====
  @field('exercisedb_id') exercisedbId!: string; // Original ExerciseDB ID (e.g., "0001")
  @field('name') name!: string;

  @json('body_parts', sanitizeStringArray) bodyParts!: string[]; // ["chest"] (single region)
  @json('target_muscles', sanitizeStringArray) targetMuscles!: string[]; // ["pectorals"] (single muscle)
  @json('secondary_muscles', sanitizeStringArray) secondaryMuscles!: string[]; // ["triceps", "deltoids"]
  @json('equipments', sanitizeStringArray) equipments!: string[]; // ["barbell"] (single equipment)

  @json('instructions', sanitizeStringArray) instructions!: string[]; // Step-by-step array
  @field('gif_url') gifUrl?: string; // Animated exercise demonstration (optional)

  // NOTE: description, difficulty, category removed - not in GitHub ExerciseDB dataset

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

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
