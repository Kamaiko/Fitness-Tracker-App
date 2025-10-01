import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Halterofit',
  slug: 'halterofit',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  scheme: 'halterofit',
  backgroundColor: '#0A0A0A',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.halterofit.app',
  },
  android: {
    package: 'com.halterofit.app',
  },
  web: {
    bundler: 'metro',
    output: 'static',
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  extra: {
    router: {
      origin: false,
    },
  },
});
