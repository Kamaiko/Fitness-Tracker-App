/**
 * Color constants for Halterofit app
 * Dark theme focused, alpha masculine aesthetic
 */

export const Colors = {
  // Primary Colors - Alpha/Masculine Theme
  black: {
    primary: '#0A0A0A',   // Main background
    surface: '#1A1A1A',   // Card backgrounds
    elevated: '#2A2A2A',  // Elevated surfaces
  },

  // Text Colors
  white: {
    primary: '#FFFFFF',   // Primary text
    secondary: '#B3B3B3', // Secondary text
    tertiary: '#666666',  // Disabled text
  },

  // Accent Colors
  red: {
    danger: '#FF3B30',    // High RPE, errors, warnings
    dark: '#CC2E25',      // Darker variant
  },

  green: {
    success: '#34C759',   // PRs, success states
    dark: '#2AA347',      // Darker variant
  },

  blue: {
    primary: '#007AFF',   // Links, CTAs, info
    dark: '#0056CC',      // Darker variant
  },

  orange: {
    warning: '#FF9500',   // Medium RPE, cautions
    dark: '#CC7700',      // Darker variant
  },

  // Data Visualization
  chart: {
    primary: '#4299E1',   // Primary data series
    secondary: '#ED8936', // Secondary data series
    tertiary: '#9F7AEA',  // Tertiary data series
    quaternary: '#48BB78', // Fourth data series
  },

  // Semantic Colors
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  border: '#333333',
  divider: '#222222',

  // RPE Scale Colors (1-10)
  rpe: {
    1: '#34C759', // Very easy
    2: '#34C759',
    3: '#32D74B', // Easy
    4: '#30D158',
    5: '#FFCC02', // Moderate
    6: '#FF9500',
    7: '#FF9500', // Hard
    8: '#FF6B35',
    9: '#FF3B30', // Very hard
    10: '#CC2E25', // Maximum effort
  },
} as const;

export type ColorKeys = keyof typeof Colors;