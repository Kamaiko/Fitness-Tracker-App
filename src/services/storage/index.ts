/**
 * Storage Service - Main Export
 *
 * Unified storage abstraction using MMKV (upgraded from AsyncStorage).
 * Available now with Development Build.
 *
 * USAGE:
 * import { storage, storageHelpers } from '@/services/storage';
 * import { mmkvStorage, zustandMMKVStorage } from '@/services/storage';
 */

export { storage, storageHelpers } from './storage';
export { mmkvStorage, mmkvJSONStorage } from './mmkvStorage';
export { zustandMMKVStorage } from './zustandStorage';
