/**
 * Example Line Chart Component
 *
 * Demonstrates Victory Native usage for progression tracking
 * This will be used for exercise progression, volume tracking, etc.
 */

import { View } from 'react-native';
import { CartesianChart, Line } from 'victory-native';

interface ExampleLineChartProps {
  data?: { week: number; weight: number }[];
}

export function ExampleLineChart({ data }: ExampleLineChartProps) {
  // Mock data for demonstration
  const mockData = data || [
    { week: 1, weight: 100 },
    { week: 2, weight: 102.5 },
    { week: 3, weight: 105 },
    { week: 4, weight: 107.5 },
    { week: 5, weight: 110 },
    { week: 6, weight: 112.5 },
    { week: 7, weight: 115 },
    { week: 8, weight: 117.5 },
  ];

  return (
    <View className="h-60">
      <CartesianChart
        data={mockData}
        xKey="week"
        yKeys={["weight"]}
        domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
      >
        {({ points }) => (
          <Line
            points={points.weight}
            color="#4299e1"
            strokeWidth={3}
            animate={{ type: "timing", duration: 300 }}
          />
        )}
      </CartesianChart>
    </View>
  );
}
