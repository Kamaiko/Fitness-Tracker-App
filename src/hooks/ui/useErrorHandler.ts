/**
 * Error Handler Hook
 *
 * Provides consistent error handling across the app with:
 * - User-friendly Alert messages
 * - Detailed console logging for debugging
 * - Sentry integration ready (task 0.5.5)
 *
 * Usage:
 * const { handleError } = useErrorHandler();
 * try {
 *   await createWorkout(data);
 * } catch (error) {
 *   handleError(error, 'createWorkout');
 * }
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { AppError, isOperationalError } from '@/utils/errors';

/**
 * Hook for consistent error handling
 *
 * @returns handleError function
 */
export function useErrorHandler() {
  /**
   * Handle an error with user-friendly Alert and detailed logging
   *
   * @param error - Error to handle (AppError or unknown)
   * @param context - Optional context string (e.g., function name, component name)
   */
  const handleError = useCallback((error: unknown, context?: string) => {
    const timestamp = new Date().toISOString();

    if (isOperationalError(error)) {
      // Operational error - show user-friendly message
      Alert.alert('Error', error.userMessage);

      // Log detailed information for debugging
      console.error(`[${error.name}] ${context || 'Error occurred'}`, {
        userMessage: error.userMessage,
        developerMessage: error.developerMessage,
        code: error.code,
        statusCode: error.statusCode,
        timestamp,
        stack: error.stack,
      });

      // TODO (Task 0.5.5): Send to Sentry for monitoring
      // if (!__DEV__) {
      //   Sentry.captureException(error, {
      //     extra: error.toJSON(),
      //     tags: { context: context || 'unknown' },
      //   });
      // }
    } else {
      // Unknown/unexpected error - show generic message
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again or contact support if the problem persists.'
      );

      // Log raw error for debugging
      console.error(`[UnknownError] ${context || 'Unexpected error'}`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp,
      });

      // TODO (Task 0.5.5): Send to Sentry
      // if (!__DEV__) {
      //   Sentry.captureException(error, {
      //     tags: { context: context || 'unknown', type: 'unexpected' },
      //   });
      // }
    }
  }, []);

  return { handleError };
}
