import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants';
import { initDatabase } from '@/services';
import '../../global.css';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // Initialize database on app start
    initDatabase()
      .then(() => {
        console.log('✅ Database initialized');
        setDbReady(true);
      })
      .catch((error) => {
        console.error('❌ Database init failed:', error);
        // Still set ready to avoid infinite loading
        setDbReady(true);
      });
  }, []);

  // Show loading while database initializes
  if (!dbReady) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
        <Text className="text-foreground-secondary mt-md">Initializing database...</Text>
      </View>
    );
  }

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
