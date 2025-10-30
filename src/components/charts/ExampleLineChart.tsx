/**
 * ExampleLineChart - Simple line chart example
 *
 * Migrated from react-native-chart-kit to Victory Native (Development Build).
 * Uses our LineChart abstraction layer for easy future migrations.
 *
 * This component serves as a mockup for analytics charts during MVP development.
 */

import { LineChart } from './LineChart';

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
  return <LineChart data={data} labels={labels} title={title} smoothCurve={true} />;
}
