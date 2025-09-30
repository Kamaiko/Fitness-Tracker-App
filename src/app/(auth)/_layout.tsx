import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a202c' : '#ffffff',
        },
        headerTintColor: colorScheme === 'dark' ? '#e2e8f0' : '#2d3748',
        headerTitle: '',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Sign In' }} />
      <Stack.Screen name="register" options={{ title: 'Sign Up' }} />
    </Stack>
  );
}