/**
 * Layout constants for Halterofit app
 * Consistent spacing, dimensions, and layout values
 */

import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Layout = {
  // Screen dimensions
  screen: {
    width: screenWidth,
    height: screenHeight,
  },

  // Spacing scale (8px grid system)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
  },

  // Border radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Common dimensions
  dimensions: {
    // Header heights
    headerHeight: Platform.select({
      ios: 88,
      android: 64,
    }),
    tabBarHeight: Platform.select({
      ios: 83,
      android: 64,
    }),

    // Input components
    inputHeight: 48,
    buttonHeight: 48,
    buttonSmallHeight: 36,

    // Touch targets (accessibility)
    minTouchTarget: 44,
    touchTargetSpacing: 8,

    // Cards and containers
    cardMinHeight: 120,
    modalMaxWidth: Math.min(screenWidth * 0.9, 400),

    // Charts and visualizations
    chartHeight: 200,
    chartHeightLarge: 300,

    // List items
    listItemHeight: 64,
    listItemSmallHeight: 48,
  },

  // Shadows and elevation
  shadow: {
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    xl: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },

  // Animation durations
  animation: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },

  // Z-index values
  zIndex: {
    base: 0,
    dropdown: 100,
    overlay: 200,
    modal: 300,
    toast: 400,
    tooltip: 500,
  },

  // Common layout helpers
  isSmallScreen: screenWidth < 375,
  isTablet: screenWidth >= 768,
  isLandscape: screenWidth > screenHeight,

  // Safe areas (approximations for layout calculations)
  safeArea: {
    top: Platform.select({
      ios: 44, // Status bar + notch area
      android: 24, // Status bar
    }),
    bottom: Platform.select({
      ios: 34, // Home indicator area
      android: 0,
    }),
  },

  // Content areas
  content: {
    maxWidth: 600, // Maximum width for content readability
    horizontalPadding: 16,
    verticalPadding: 24,
  },

  // Form layouts
  form: {
    fieldSpacing: 16,
    sectionSpacing: 32,
    maxInputWidth: 400,
  },

  // Workout specific layouts
  workout: {
    exerciseCardHeight: 120,
    setRowHeight: 48,
    timerSize: 200,
    rpeSliderHeight: 60,
  },
} as const;

export type LayoutKeys = keyof typeof Layout;