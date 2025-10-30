const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// WatermelonDB uses Babel plugins configured in babel.config.js
// No custom metro transformer needed - standard Expo/Metro transformer handles it

module.exports = withNativeWind(config, { input: './global.css' });
