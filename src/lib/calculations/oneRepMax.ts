/**
 * One Rep Max calculations for strength training
 * Using various formulas for estimating 1RM from reps and weight
 */

/**
 * Calculate 1RM using Epley formula
 * 1RM = weight × (1 + reps/30)
 */
export function calculateOneRepMaxEpley(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/**
 * Calculate 1RM using Brzycki formula
 * 1RM = weight × (36 / (37 - reps))
 */
export function calculateOneRepMaxBrzycki(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps >= 37) return weight; // Formula breaks down at high reps
  return weight * (36 / (37 - reps));
}

/**
 * Get most accurate 1RM estimate based on rep range
 */
export function calculateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps <= 6) return calculateOneRepMaxBrzycki(weight, reps);
  return calculateOneRepMaxEpley(weight, reps);
}