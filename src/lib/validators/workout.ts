/**
 * Validation functions for workout data
 */

export interface WorkoutValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate weight value
 */
export function validateWeight(weight: number): boolean {
  return weight > 0 && weight <= 1000; // Reasonable limits
}

/**
 * Validate reps value
 */
export function validateReps(reps: number): boolean {
  return Number.isInteger(reps) && reps > 0 && reps <= 100;
}

/**
 * Validate RPE value
 */
export function validateRPE(rpe: number): boolean {
  return rpe >= 1 && rpe <= 10;
}

/**
 * Validate exercise name
 */
export function validateExerciseName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * Validate complete workout set
 */
export function validateWorkoutSet(set: {
  weight: number;
  reps: number;
  rpe?: number;
}): WorkoutValidationResult {
  const errors: string[] = [];

  if (!validateWeight(set.weight)) {
    errors.push('Weight must be between 0 and 1000');
  }

  if (!validateReps(set.reps)) {
    errors.push('Reps must be a positive integer up to 100');
  }

  if (set.rpe !== undefined && !validateRPE(set.rpe)) {
    errors.push('RPE must be between 1 and 10');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate workout name
 */
export function validateWorkoutName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 50;
}