/**
 * Supabase Client Configuration
 *
 * Initializes Supabase client with auth session persistence.
 *
 * **Auth Storage Strategy:**
 * - **Phase 0-2 (Current):** AsyncStorage via our storage abstraction
 * - **Phase 3+:** Will migrate to MMKV for better performance & encryption
 *
 * The storage abstraction (`src/services/storage/storage.ts`) allows seamless
 * migration to MMKV when we create the Dev Client in Phase 3.
 */

import { createClient } from '@supabase/supabase-js';
import { storage } from '@/services/storage/storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key: string) => storage.get(key),
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
