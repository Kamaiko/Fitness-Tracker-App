import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#4299e1' : '#2b6cb0',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#a0aec0' : '#718096',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a202c' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#2d3748' : '#e2e8f0',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a202c' : '#ffffff',
        },
        headerTintColor: colorScheme === 'dark' ? '#e2e8f0' : '#2d3748',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            // You'll replace this with proper icons later
            <></>
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, size }) => (
            <></>
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          tabBarIcon: ({ color, size }) => (
            <></>
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <></>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <></>
          ),
        }}
      />
    </Tabs>
  );
}