/**
 * Spacing Scale
 *
 * 8px grid system for consistent spacing throughout the app.
 * Use these values instead of hard-coded numbers.
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type SpacingKeys = keyof typeof Spacing;
