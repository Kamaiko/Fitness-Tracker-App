import { View, Text } from 'react-native';

export default function WorkoutScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <Text className="text-3xl font-bold text-foreground mb-2">Workout</Text>
      <Text className="text-base text-foreground-secondary">
        Start your training session
      </Text>
    </View>
  );
}
