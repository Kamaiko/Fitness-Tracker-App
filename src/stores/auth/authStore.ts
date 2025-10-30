/**
 * Authentication Store
 *
 * Manages user authentication state with MMKV persistence.
 * Connected to Supabase auth.
 *
 * Persistence Strategy:
 * - Uses Zustand persist middleware with MMKV backend
 * - Persists: user, isAuthenticated (session state)
 * - Ephemeral: isLoading (always recalculate on rehydration)
 * - Error handling via onRehydrateStorage hook
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/services/supabase';
import { zustandMMKVStorage } from '@/services/storage';

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: user !== null,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // MMKV key
      storage: createJSONStorage(() => zustandMMKVStorage),
      // Only persist session state, not loading state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Handle rehydration errors gracefully
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Auth rehydration failed:', error);
          // Reset to safe initial state on error
          return {
            user: null,
            isLoading: false,
            isAuthenticated: false,
          };
        }
        // Successfully rehydrated - set loading to false
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
