/**
 * ExampleLineChart - Simple line chart using react-native-chart-kit
 *
 * Phase 0-2: Uses react-native-chart-kit (Expo Go compatible)
 * Phase 3+: Will migrate to Victory Native (requires Dev Client)
 *
 * This component serves as a mockup for analytics charts during MVP development.
 */

import { LineChart } from 'react-native-chart-kit';
import { View, Text, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';

interface ExampleLineChartProps {
  data?: number[];
  labels?: string[];
  title?: string;
}

export function ExampleLineChart({
  data = [65, 68, 70, 72, 75, 78, 80],
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  title = 'Weekly Progress',
}: ExampleLineChartProps) {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View className="items-center">
      {title && <Text className="text-lg font-semibold text-foreground mb-2">{title}</Text>}

      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={screenWidth - 48} // Full width minus padding
        height={220}
        chartConfig={{
          backgroundColor: COLORS.background.surface,
          backgroundGradientFrom: COLORS.background.surface,
          backgroundGradientTo: COLORS.background.elevated,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(66, 153, 225, ${opacity})`, // primary color
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: COLORS.primary.DEFAULT,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}
