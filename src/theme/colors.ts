/**
 * Color Palette - Dark Theme
 *
 * Centralized color definitions for the entire app.
 * Dark theme optimized for late-night gym sessions.
 */

export const Colors = {
  // Background colors
  background: '#0A0A0A',        // Deep black
  surface: '#1A1A1A',           // Card backgrounds
  surfaceElevated: '#2A2A2A',   // Elevated cards

  // Brand colors
  primary: '#4299e1',           // Brand blue
  primaryDark: '#2b6cb0',       // Darker blue for pressed states
  primaryLight: '#63b3ed',      // Lighter blue for highlights

  // Semantic colors
  success: '#38a169',           // Progress green
  warning: '#d69e2e',           // Caution amber
  danger: '#e53e3e',            // Critical red
  info: '#3182ce',              // Information blue

  // Text colors
  text: '#e2e8f0',              // Primary text (light)
  textSecondary: '#a0aec0',     // Secondary text (medium gray)
  textTertiary: '#718096',      // Tertiary text (dark gray)
  textInverse: '#1a202c',       // Text on light backgrounds

  // Border colors
  border: '#2d3748',            // Default borders
  borderLight: '#4a5568',       // Lighter borders

  // RPE Colors (Rate of Perceived Exertion)
  rpe: {
    low: '#38a169',             // RPE 1-5 (Easy)
    medium: '#d69e2e',          // RPE 6-7 (Moderate)
    high: '#e53e3e',            // RPE 8-9 (Hard)
    max: '#c53030',             // RPE 10 (Maximum)
  },
} as const;

export type ColorKeys = keyof typeof Colors;
