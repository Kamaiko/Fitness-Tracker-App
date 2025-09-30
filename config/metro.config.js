const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add support for more file extensions
config.resolver.assetExts.push(
  // Fonts
  'ttf',
  'otf',
  'woff',
  'woff2',
  // Images
  'svg',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'bmp',
  // Audio/Video
  'mp3',
  'mp4',
  'mov',
  'avi',
  // Data
  'json',
  'csv'
);

// Support for SVG
config.resolver.sourceExts.push('svg');

// Enable symlinks for monorepo support
config.resolver.unstable_enableSymlinks = true;

// Transformer configuration
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

// Modify the resolver to handle SVG files
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// Performance optimizations
config.cacheStores = [
  {
    name: 'FileStore',
    type: 'FileStore',
  },
];

// Enable minification in production
if (process.env.NODE_ENV === 'production') {
  config.transformer.minifierConfig = {
    mangle: {
      keep_fnames: true,
    },
    output: {
      ascii_only: true,
      quote_keys: true,
      wrap_iife: true,
    },
    sourceMap: {
      includeSources: false,
    },
    toplevel: false,
    warnings: false,
  };
}

// NativeWind support
module.exports = withNativeWind(config, { input: './src/styles/global.css' });