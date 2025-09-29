/**
 * App configuration constants
 * Environment-specific and feature flag configurations
 */

import Constants from 'expo-constants';

// Get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  return Constants.expoConfig?.extra?.[key] || process.env[key] || fallback;
};

export const Config = {
  // App information
  app: {
    name: 'Halterofit',
    version: Constants.expoConfig?.version || '0.1.0',
    environment: getEnvVar('appEnv', 'development') as 'development' | 'staging' | 'production',
    isDevelopment: getEnvVar('appEnv') === 'development',
    isProduction: getEnvVar('appEnv') === 'production',
  },

  // API Configuration
  api: {
    supabaseUrl: getEnvVar('supabaseUrl'),
    supabaseAnonKey: getEnvVar('supabaseAnonKey'),
    baseUrl: getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'https://api.halterofit.com'),
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
  },

  // Analytics & Monitoring
  analytics: {
    sentryDsn: getEnvVar('sentryDsn'),
    posthogKey: getEnvVar('posthogKey'),
    enableCrashReporting: getEnvVar('appEnv') !== 'development',
    enablePerformanceMonitoring: true,
    sampleRate: getEnvVar('appEnv') === 'production' ? 0.1 : 1.0,
  },

  // Feature Flags
  features: {
    // MVP Features
    workoutLogging: true,
    exerciseLibrary: true,
    basicAnalytics: true,
    rpeTracking: true,
    restTimer: true,
    plateauDetection: true,
    readinessScore: true,

    // Phase 2 Features
    voiceCommands: getEnvVar('EXPO_PUBLIC_ENABLE_VOICE_COMMANDS') === 'true',
    socialFeatures: getEnvVar('EXPO_PUBLIC_ENABLE_SOCIAL_FEATURES') === 'true',
    bodyComposition: false,
    programBuilder: false,

    // Phase 3 Features (Enhanced)
    enhancedFeatures: getEnvVar('EXPO_PUBLIC_ENABLE_ENHANCED_FEATURES') === 'true',
    cycleTracking: false,
    aiRecommendations: false,
    coachingMarketplace: false,

    // Development/Beta Features
    debugMode: getEnvVar('appEnv') === 'development',
    betaFeatures: false,
    experimentalUI: false,
  },

  // App behavior
  behavior: {
    // Offline functionality
    enableOfflineMode: true,
    maxOfflineStorage: 100, // MB
    syncRetryInterval: 30000, // 30 seconds

    // User experience
    splashScreenMinDuration: 1000, // 1 second minimum
    autoSaveInterval: 10000, // 10 seconds
    sessionTimeout: 3600000, // 1 hour

    // Workout specific
    defaultRestTime: 120, // 2 minutes
    maxSetsPerExercise: 20,
    maxRPE: 10,
    autoTimerStart: true,

    // Data limits
    maxWorkoutsPerDay: 5,
    maxExercisesPerWorkout: 20,
    workoutHistoryLimit: 1000,
  },

  // Storage keys
  storage: {
    userToken: 'user_token',
    userProfile: 'user_profile',
    workoutDraft: 'workout_draft',
    settings: 'app_settings',
    exerciseFavorites: 'exercise_favorites',
    onboardingCompleted: 'onboarding_completed',
    lastSync: 'last_sync',
  },

  // URLs
  urls: {
    website: 'https://halterofit.com',
    support: 'https://halterofit.com/support',
    privacy: 'https://halterofit.com/privacy',
    terms: 'https://halterofit.com/terms',
    appStore: 'https://apps.apple.com/app/halterofit',
    playStore: 'https://play.google.com/store/apps/details?id=com.halterofit.app',
  },

  // External integrations
  integrations: {
    // Future integrations
    healthKit: false,
    googleFit: false,
    myFitnessPal: false,
    spotify: false,
  },

  // Development configuration
  development: {
    showDevMenu: getEnvVar('appEnv') === 'development',
    enableFlipper: getEnvVar('appEnv') === 'development',
    mockAPI: false,
    skipOnboarding: false,
    autoLogin: false,
  },

  // Subscription tiers
  subscription: {
    free: {
      maxWorkouts: -1, // Unlimited
      maxExerciseLibrary: 500,
      analyticsHistory: 90, // days
      features: ['basic_logging', 'basic_analytics', 'exercise_library'],
    },
    pro: {
      price: 9.99,
      maxWorkouts: -1,
      maxExerciseLibrary: -1,
      analyticsHistory: -1,
      features: ['advanced_analytics', 'plateau_detection', 'export_data', 'custom_programs'],
    },
    elite: {
      price: 19.99,
      maxWorkouts: -1,
      maxExerciseLibrary: -1,
      analyticsHistory: -1,
      features: ['enhanced_tracking', 'ai_recommendations', 'coaching_access', 'priority_support'],
    },
  },
} as const;

export type ConfigKeys = keyof typeof Config;