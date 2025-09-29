/**
 * Typography constants for Halterofit app
 * Professional, readable, masculine aesthetic
 */

export const Typography = {
  // Font Families
  fontFamily: {
    primary: 'SF Pro Display', // Headers and emphasis
    body: 'SF Pro Text',       // Body text
    mono: 'SF Mono',          // Numbers, code, data
  },

  // Font Sizes (following modular scale 1.25)
  fontSize: {
    xs: 12,   // Small labels, captions
    sm: 14,   // Body text, secondary
    base: 16, // Default body text
    lg: 18,   // Subheadings
    xl: 20,   // Card titles
    '2xl': 24, // Page headers
    '3xl': 30, // Dashboard metrics
    '4xl': 36, // Hero numbers
    '5xl': 48, // Large display
  },

  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Styles for common use cases
  styles: {
    // Headers
    h1: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: 30,
      fontWeight: '600',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 1.3,
    },

    // Body text
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.3,
    },

    // UI Elements
    button: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: '0.025em',
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: '0.025em',
    },
    input: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      letterSpacing: '0.025em',
    },

    // Numbers and data
    metric: {
      fontSize: 30,
      fontWeight: '700',
      lineHeight: 1.1,
      fontFamily: 'SF Mono',
    },
    metricLarge: {
      fontSize: 48,
      fontWeight: '700',
      lineHeight: 1.0,
      fontFamily: 'SF Mono',
    },
    number: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'SF Mono',
    },

    // Special text
    emphasis: {
      fontWeight: '600',
    },
    strong: {
      fontWeight: '700',
    },
    italic: {
      fontStyle: 'italic',
    },
  },
} as const;

export type TypographyKeys = keyof typeof Typography;