/**
 * Supabase Client Configuration
 *
 * This file initializes the Supabase client with credentials from environment variables.
 * Used throughout the app for all database operations.
 */

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: undefined, // We'll use MMKV for auth storage later
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
