module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // React Native Reanimated plugin (must be last)
      'react-native-reanimated/plugin',

      // NativeWind support
      'nativewind/babel',

      // Module resolver for absolute imports
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/hooks': './src/hooks',
            '@/services': './src/services',
            '@/stores': './src/stores',
            '@/types': './src/types',
            '@/utils': './src/utils',
            '@/constants': './src/constants',
            '@/assets': './assets',
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.native.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.native.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
        },
      ],

      // Inline dotenv
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
    ],
  };
};