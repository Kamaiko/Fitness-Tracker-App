/**
 * CachedImage Component
 *
 * Production-ready wrapper around expo-image with optimized caching for performance.
 *
 * **Key Features:**
 * - Aggressive caching (memory + disk) for <200ms load times (PRD requirement)
 * - Skeleton/placeholder support for better perceived performance
 * - Error handling with fallback images
 * - Smooth fade-in transitions
 * - TypeScript strict mode with comprehensive prop types
 *
 * **Use Cases:**
 * - Exercise GIFs (1,300+ from ExerciseDB) - Phase 2.7.1, 3.11.2
 * - User avatars - Phase 1
 * - Workout template thumbnails - Phase 5
 *
 * **Performance:**
 * - Default cachePolicy: 'memory-disk' (fastest retrieval)
 * - Preload priority support for critical images
 * - Automatic cache management by expo-image
 *
 * @example
 * // Basic usage
 * <CachedImage
 *   source={{ uri: exercise.imageUrl }}
 *   contentFit="cover"
 *   className="w-20 h-20 rounded-lg"
 * />
 *
 * @example
 * // With skeleton placeholder and error handling
 * <CachedImage
 *   source={{ uri: exercise.imageUrl }}
 *   placeholder={require('@/assets/exercise-placeholder.png')}
 *   fallback={require('@/assets/error-image.png')}
 *   priority="high"
 *   onError={(error) => console.error('Image load failed:', error)}
 * />
 *
 * @see docs/TECHNICAL.md - ADR-010: Performance Libraries
 * @see components/ui/README.md - Complete usage guide
 */

import { Image, ImageSource, ImageErrorEventData } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, StyleProp, ImageStyle } from 'react-native';

/**
 * Props for CachedImage component
 *
 * Extends expo-image ImageProps with additional conveniences and defaults
 */
export interface CachedImageProps {
  /** Image source (URI or local require()) */
  source: ImageSource;

  /** Style for the image (React Native StyleSheet or inline object) */
  style?: StyleProp<ImageStyle>;

  /** How image should be resized to fit container (default: 'cover') */
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

  /** Placeholder image shown while loading (blur hash, skeleton, or static image) */
  placeholder?: ImageSource;

  /** Fade-in transition duration in milliseconds (default: 300ms, set 0 to disable) */
  transition?: number;

  /** Callback when image fails to load */
  onError?: (event: ImageErrorEventData) => void;

  /** Fallback image shown on error (optional) */
  fallback?: ImageSource;

  /**
   * Cache policy for image storage
   *
   * - 'memory': Fast but cleared on low memory (use for high-res images shown frequently)
   * - 'disk': Persistent but slower (use for rarely accessed images)
   * - 'memory-disk': Fast retrieval with disk fallback (DEFAULT - best for most cases)
   * - 'none': No caching (use for sensitive/temporary images)
   *
   * @default 'memory-disk'
   */
  cachePolicy?: 'memory' | 'disk' | 'memory-disk' | 'none';

  /**
   * Loading priority for image preloading
   *
   * - 'low': Background loading (non-critical images)
   * - 'normal': Standard priority (DEFAULT)
   * - 'high': Preload immediately (above-fold, critical UX images)
   *
   * @default 'normal'
   */
  priority?: 'low' | 'normal' | 'high';

  /** NativeWind (Tailwind) className for styling */
  className?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Test ID for E2E testing (Maestro) */
  testID?: string;
}

/**
 * CachedImage Component
 *
 * Wrapper around expo-image with production-ready defaults and error handling
 */
export function CachedImage({
  source,
  style,
  contentFit = 'cover',
  placeholder,
  transition = 300,
  onError,
  fallback,
  cachePolicy = 'memory-disk',
  priority = 'normal',
  className,
  accessibilityLabel,
  testID,
}: CachedImageProps) {
  const [hasError, setHasError] = useState(false);

  // If image failed and we have a fallback, show fallback
  const imageSource = hasError && fallback ? fallback : source;

  // Handle image load errors
  const handleError = (event: ImageErrorEventData) => {
    setHasError(true);

    // Call user's error handler if provided
    if (onError) {
      onError(event);
    }

    // Log to console in development
    if (__DEV__) {
      console.warn('[CachedImage] Failed to load image:', event.error);
    }
  };

  return (
    <Image
      source={imageSource}
      style={style}
      contentFit={contentFit}
      placeholder={placeholder}
      transition={transition}
      onError={handleError}
      cachePolicy={cachePolicy}
      priority={priority}
      className={className}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
}

/**
 * Common styles for CachedImage usage
 *
 * @example
 * <CachedImage
 *   source={{ uri: url }}
 *   style={CachedImageStyles.avatar}
 * />
 */
export const CachedImageStyles = StyleSheet.create({
  /** Square avatar (80x80) */
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  /** Small thumbnail (60x60) */
  thumbnailSmall: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },

  /** Medium thumbnail (100x100) */
  thumbnailMedium: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },

  /** Exercise preview (120x120) */
  exercisePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },

  /** Full width banner (maintain aspect ratio) */
  banner: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
});
