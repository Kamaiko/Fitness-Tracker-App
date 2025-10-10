/**
 * Color Constants
 *
 * Central source of truth for colors used outside of Tailwind className.
 * These values MUST match tailwind.config.js to ensure consistency.
 *
 * Use cases:
 * - React Native components that don't support className (expo-router tabs, gradients, etc.)
 * - Victory Native charts (color prop)
 * - Any native styling that requires hex values
 *
 * For regular components, prefer Tailwind className:
 * ✅ <View className="bg-primary">
 * ❌ <View style={{ backgroundColor: COLORS.primary }}>
 */

export const COLORS = {
  // Background colors
  background: {
    DEFAULT: '#0A0A0A',   // bg-background
    surface: '#1A1A1A',    // bg-background-surface
    elevated: '#2A2A2A',   // bg-background-elevated
  },

  // Brand colors
  primary: {
    DEFAULT: '#4299e1',    // bg-primary
    dark: '#2b6cb0',       // bg-primary-dark
    light: '#63b3ed',      // bg-primary-light
  },

  // Semantic colors
  success: '#38a169',      // text-success
  warning: '#d69e2e',      // text-warning
  danger: '#e53e3e',       // text-danger
  info: '#3182ce',         // text-info

  // Text colors
  foreground: {
    DEFAULT: '#e2e8f0',    // text-foreground
    secondary: '#a0aec0',  // text-foreground-secondary
    tertiary: '#718096',   // text-foreground-tertiary
    inverse: '#1a202c',    // text-foreground-inverse
  },

  // Border colors
  border: {
    DEFAULT: '#2d3748',    // border-border
    light: '#4a5568',      // border-border-light
  },

  // RPE Colors (Rate of Perceived Exertion)
  rpe: {
    low: '#38a169',        // text-rpe-low
    medium: '#d69e2e',     // text-rpe-medium
    high: '#e53e3e',       // text-rpe-high
    max: '#c53030',        // text-rpe-max
  },
} as const;

/**
 * Type helper for color keys
 */
export type ColorKeys = keyof typeof COLORS;
