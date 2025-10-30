/**
 * Auth Service - Main Export
 *
 * Centralizes authentication-related functionality
 */

export {
  persistUser,
  getPersistedUserId,
  getPersistedUserEmail,
  clearPersistedUser,
  hasPersistedUser,
} from './authPersistence';
