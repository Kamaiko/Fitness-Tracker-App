/**
 * Home Screen - Dashboard
 *
 * Tech/Futuristic theme with dark background
 * Neumorphism design with violet/cyan accents
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Welcome */}
      <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>Athlete</Text>
      </Animated.View>

      {/* CTA Start Workout */}
      <Animated.View entering={FadeInDown.delay(200).duration(800)}>
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={['#8A2BE2', '#00FFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>START WORKOUT</Text>
            <View style={styles.pulseIndicator} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(800)}
        style={styles.statsSection}
      >
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>💪</Text>
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>🔥</Text>
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Total Sets</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>📈</Text>
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Volume (kg)</Text>
          </View>
        </View>
      </Animated.View>

      {/* Chart Section with Skeleton */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(800)}
        style={styles.chartSection}
      >
        <Text style={styles.sectionTitle}>Weekly Progress</Text>
        <View style={styles.chartContainer}>
          {/* Skeleton Chart */}
          <View style={styles.skeletonChart}>
            <View style={styles.chartYAxis}>
              {[100, 75, 50, 25, 0].map((val, i) => (
                <Text key={i} style={styles.yAxisLabel}>{val}</Text>
              ))}
            </View>
            <View style={styles.chartArea}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <View key={i} style={styles.barColumn}>
                  <View style={[styles.skeletonBar, { height: Math.random() * 60 + 20 }]} />
                  <Text style={styles.xAxisLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.emptyChartOverlay}>
            <Text style={styles.emptyText}>No workout data yet</Text>
            <Text style={styles.emptySubtext}>Start your first workout to see progress</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  welcomeText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '400',
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F0F0F0',
  },
  ctaButton: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FFFF',
    marginLeft: 12,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F0F0',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  chartContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    minHeight: 240,
  },
  skeletonChart: {
    flexDirection: 'row',
    height: 180,
    opacity: 0.3,
  },
  chartYAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666',
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  skeletonBar: {
    width: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    marginBottom: 8,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  emptyChartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0F0F0',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});
