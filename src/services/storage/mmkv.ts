/**
 * MMKV Storage Wrapper
 *
 * Fast, encrypted key-value storage for React Native.
 * Much faster than AsyncStorage and supports larger data.
 *
 * Usage:
 *   import { storage } from '@/services/storage/mmkv';
 *   storage.set('user', JSON.stringify(userData));
 *   const user = storage.getString('user');
 */

import { MMKV } from 'react-native-mmkv';

// Create MMKV instance
export const storage = new MMKV({
  id: 'halterofit-storage',
  encryptionKey: 'halterofit-encryption-key', // TODO: Use secure key generation
});

// Helper functions for common operations
export const storageHelpers = {
  // Set JSON object
  setJSON: (key: string, value: unknown) => {
    storage.set(key, JSON.stringify(value));
  },

  // Get JSON object
  getJSON: <T>(key: string): T | null => {
    const value = storage.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  // Clear all data
  clearAll: () => {
    storage.clearAll();
  },

  // Delete specific key
  delete: (key: string) => {
    storage.delete(key);
  },
};
