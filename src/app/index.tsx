/**
 * Home Screen
 *
 * Main entry screen of the app.
 * Shows app info and allows starting a workout.
 */

import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Halterofit</Text>
        <Text style={styles.subtitle}>Fitness Tracker MVP</Text>
        <Text style={styles.version}>v0.1.0 • SDK 54</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#a0aec0',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: '#718096',
  },
});
