/**
 * Storage Service
 *
 * Unified storage abstraction using AsyncStorage.
 * This provides a simple key-value storage interface that can be
 * easily swapped for other implementations (MMKV, etc.) later.
 *
 * Usage:
 *   import { storage } from '@/services/storage/storage';
 *
 *   await storage.set('user', JSON.stringify(userData));
 *   const user = await storage.get('user');
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  /**
   * Set a value in storage
   */
  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Storage.set error for key "${key}":`, error);
      throw error;
    }
  },

  /**
   * Get a value from storage
   */
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Storage.get error for key "${key}":`, error);
      return null;
    }
  },

  /**
   * Delete a value from storage
   */
  async delete(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage.delete error for key "${key}":`, error);
      throw error;
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage.clear error:', error);
      throw error;
    }
  },

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Storage.getAllKeys error:', error);
      return [];
    }
  },
};

/**
 * Helper functions for JSON storage
 */
export const storageHelpers = {
  /**
   * Set a JSON object in storage
   */
  async setJSON<T>(key: string, value: T): Promise<void> {
    await storage.set(key, JSON.stringify(value));
  },

  /**
   * Get a JSON object from storage
   */
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await storage.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
};
