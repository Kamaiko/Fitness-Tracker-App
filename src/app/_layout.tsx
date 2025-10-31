import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants';
import { initSentry, setSentryUser } from '@/utils/sentry';
import { useAuthStore } from '@/stores/auth/authStore';
import '../../global.css';

/**
 * Root Layout
 *
 * Initializes:
 * - Sentry (production-only error monitoring)
 * - WatermelonDB (lazy, on first database access)
 */
export default function RootLayout() {
  // Initialize Sentry on app startup
  useEffect(() => {
    initSentry();
  }, []);

  // Sync Sentry user context with auth state
  useEffect(() => {
    const user = useAuthStore.getState().user;
    setSentryUser(user?.id || null);

    // Subscribe to auth changes
    const unsubscribe = useAuthStore.subscribe((state) => {
      setSentryUser(state.user?.id || null);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background.DEFAULT },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
