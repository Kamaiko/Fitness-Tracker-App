/**
 * Storage Service - Main Export
 *
 * Unified storage abstraction using AsyncStorage.
 * Will migrate to MMKV in Phase 3+ when Dev Client is available.
 *
 * USAGE:
 * import { storage, storageHelpers } from '@/services/storage';
 */

export { storage, storageHelpers } from './storage';
