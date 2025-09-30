/**
 * RPE (Rate of Perceived Exertion) calculations and utilities
 * Based on the 1-10 RPE scale for strength training
 */

/**
 * RPE to percentage 1RM conversion (approximate)
 * Based on research from Mike Tuchscherer and others
 */
export const RPE_TO_PERCENTAGE: Record<number, number> = {
  10: 100, // Max effort
  9.5: 97,
  9: 92,
  8.5: 89,
  8: 86,
  7.5: 83,
  7: 80,
  6.5: 77,
  6: 74,
  5: 70,
  4: 65,
  3: 60,
  2: 55,
  1: 50,
};

/**
 * Convert RPE to estimated percentage of 1RM
 */
export function rpeToPercentage(rpe: number): number {
  // Round to nearest 0.5
  const rounded = Math.round(rpe * 2) / 2;
  return RPE_TO_PERCENTAGE[rounded] || 70; // Default fallback
}

/**
 * Calculate estimated 1RM from weight, reps, and RPE
 */
export function calculateOneRepMaxFromRPE(weight: number, reps: number, rpe: number): number {
  const percentage = rpeToPercentage(rpe) / 100;

  // Adjust for reps using Epley formula principle
  const adjustedPercentage = percentage * (1 - (reps - 1) * 0.025);

  return weight / adjustedPercentage;
}

/**
 * Get RPE description for user interface
 */
export function getRPEDescription(rpe: number): string {
  if (rpe >= 9.5) return "Max effort";
  if (rpe >= 9) return "Could do 1 more rep";
  if (rpe >= 8) return "Could do 2-3 more reps";
  if (rpe >= 7) return "Could do 3-4 more reps";
  if (rpe >= 6) return "Moderate effort";
  if (rpe >= 5) return "Light effort";
  return "Very light";
}

/**
 * Suggest if RPE indicates need for rest or deload
 */
export function analyzeRPEPattern(recentRPEs: number[]): {
  status: 'good' | 'caution' | 'rest';
  message: string;
} {
  if (recentRPEs.length === 0) {
    return { status: 'good', message: 'No recent data' };
  }

  const avgRPE = recentRPEs.reduce((sum, rpe) => sum + rpe, 0) / recentRPEs.length;
  const lastThree = recentRPEs.slice(-3);
  const highRPECount = lastThree.filter(rpe => rpe >= 9).length;

  if (avgRPE >= 8.5 && highRPECount >= 2) {
    return {
      status: 'rest',
      message: 'High RPE pattern detected. Consider rest or deload.',
    };
  }

  if (avgRPE >= 8 || highRPECount >= 2) {
    return {
      status: 'caution',
      message: 'Elevated RPE. Monitor fatigue levels.',
    };
  }

  return {
    status: 'good',
    message: 'RPE levels look good for continued training.',
  };
}