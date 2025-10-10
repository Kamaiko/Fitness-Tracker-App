import { View, Text } from 'react-native';

export default function StatsScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <Text className="text-3xl font-bold text-foreground mb-2">Statistics</Text>
      <Text className="text-base text-foreground-secondary">
        Track your progress
      </Text>
    </View>
  );
}
