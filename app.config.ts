import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Halterofit',
  slug: 'halterofit',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'dark',
  scheme: 'halterofit',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0A0A0A',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.halterofit.app',
    buildNumber: '1',
    requireFullScreen: true,
    infoPlist: {
      NSCameraUsageDescription:
        'Halterofit uses camera to track your progress photos.',
      NSPhotoLibraryUsageDescription:
        'Halterofit needs access to your photo library to save progress photos.',
      NSHealthShareUsageDescription:
        'Halterofit can integrate with HealthKit to track your workouts.',
      NSHealthUpdateUsageDescription:
        'Halterofit can save workout data to HealthKit.',
      NSMicrophoneUsageDescription:
        'Halterofit uses microphone for voice commands during workouts.',
      UIBackgroundModes: ['background-audio', 'background-processing'],
    },
    associatedDomains: ['applinks:halterofit.com'],
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#0A0A0A',
    },
    package: 'com.halterofit.app',
    versionCode: 1,
    permissions: [
      'CAMERA',
      'WRITE_EXTERNAL_STORAGE',
      'READ_EXTERNAL_STORAGE',
      'RECORD_AUDIO',
      'WAKE_LOCK',
      'VIBRATE',
      'RECEIVE_BOOT_COMPLETED',
    ],
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'halterofit.com',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0A0A0A',
        image: './assets/images/splash.png',
        dark: {
          backgroundColor: '#0A0A0A',
          image: './assets/images/splash.png',
        },
        imageWidth: 200,
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/notification-icon.png',
        color: '#FF3B30',
        sounds: ['./assets/sounds/notification.wav'],
      },
    ],
    [
      'expo-tracking-transparency',
      {
        userTrackingPermission:
          'This identifier will be used to deliver personalized workout recommendations.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'your-project-id',
    },
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    appEnv: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  },
  owner: 'halterofit-team',
});