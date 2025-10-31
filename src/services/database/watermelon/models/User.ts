/**
 * User Model
 *
 * Represents authenticated users with preferences and settings.
 * Minimal data stored locally - full profile in Supabase.
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  @field('email') email!: string;
  @field('preferred_unit') preferredUnit!: string; // 'kg' | 'lbs'
  @field('nutrition_phase') nutritionPhase!: string; // 'bulk' | 'cut' | 'maintenance'

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // NOTE: _changed and _status are managed automatically by WatermelonDB
  // Access via: record._raw._changed and record._raw._status (or record.syncStatus)
}
