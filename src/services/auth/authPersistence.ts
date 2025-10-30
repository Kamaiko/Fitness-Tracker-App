/**
 * Auth Persistence Service
 *
 * Persists user authentication data in MMKV (encrypted storage) to survive app restarts.
 *
 * Problem solved:
 * - Zustand stores user in memory only → lost on app restart
 * - Without persistence: user appears logged out after restart
 * - With MMKV persistence: user session survives restarts/crashes
 *
 * Security:
 * - User ID and email stored in encrypted MMKV
 * - Auth tokens handled by Supabase SDK (also persisted securely)
 *
 * Usage:
 *   // After successful login
 *   persistUser(user.id, user.email);
 *
 *   // On app startup
 *   const userId = getPersistedUserId();
 *   if (userId) {
 *     // Restore user session
 *   }
 *
 *   // On logout
 *   clearPersistedUser();
 */

import { mmkvStorage } from '../storage/mmkvStorage';

/**
 * Storage keys with auth: prefix to avoid collisions
 */
const STORAGE_KEYS = {
  USER_ID: 'auth:user_id',
  USER_EMAIL: 'auth:user_email',
} as const;

/**
 * Persist user authentication data
 *
 * Called after successful login/registration
 * Stores user ID and email in encrypted MMKV
 *
 * @param userId - Unique user identifier
 * @param email - User email address
 */
export function persistUser(userId: string, email: string): void {
  mmkvStorage.set(STORAGE_KEYS.USER_ID, userId);
  mmkvStorage.set(STORAGE_KEYS.USER_EMAIL, email);
}

/**
 * Get persisted user ID
 *
 * Called on app startup to check if user is logged in
 * Returns null if no user is persisted
 *
 * @returns User ID or null
 */
export function getPersistedUserId(): string | null {
  const userId = mmkvStorage.get(STORAGE_KEYS.USER_ID);
  return userId ?? null;
}

/**
 * Get persisted user email
 *
 * Called on app startup to restore user session
 * Returns null if no email is persisted
 *
 * @returns User email or null
 */
export function getPersistedUserEmail(): string | null {
  const email = mmkvStorage.get(STORAGE_KEYS.USER_EMAIL);
  return email ?? null;
}

/**
 * Clear persisted user data
 *
 * Called on logout to remove all user session data
 * User will need to login again on next app start
 */
export function clearPersistedUser(): void {
  mmkvStorage.delete(STORAGE_KEYS.USER_ID);
  mmkvStorage.delete(STORAGE_KEYS.USER_EMAIL);
}

/**
 * Check if user session is persisted
 *
 * Useful for checking auth status without retrieving data
 *
 * @returns true if user data exists in storage
 */
export function hasPersistedUser(): boolean {
  return mmkvStorage.contains(STORAGE_KEYS.USER_ID);
}
