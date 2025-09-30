/**
 * Volume calculations for training analysis
 */

export interface Set {
  weight: number;
  reps: number;
  rpe?: number;
}

/**
 * Calculate total volume (sets × reps × weight)
 */
export function calculateVolume(sets: Set[]): number {
  return sets.reduce((total, set) => total + (set.weight * set.reps), 0);
}

/**
 * Calculate total tonnage (same as volume but clearer naming)
 */
export function calculateTonnage(sets: Set[]): number {
  return calculateVolume(sets);
}

/**
 * Calculate average intensity (average weight across all sets)
 */
export function calculateAverageIntensity(sets: Set[]): number {
  if (sets.length === 0) return 0;
  const totalWeight = sets.reduce((sum, set) => sum + set.weight, 0);
  return totalWeight / sets.length;
}

/**
 * Calculate volume load (tonnage × average RPE)
 */
export function calculateVolumeLoad(sets: Set[]): number {
  const tonnage = calculateTonnage(sets);
  const avgRpe = calculateAverageRPE(sets);
  return tonnage * (avgRpe / 10);
}

/**
 * Calculate average RPE across sets
 */
export function calculateAverageRPE(sets: Set[]): number {
  const setsWithRpe = sets.filter(set => set.rpe !== undefined);
  if (setsWithRpe.length === 0) return 0;

  const totalRpe = setsWithRpe.reduce((sum, set) => sum + (set.rpe || 0), 0);
  return totalRpe / setsWithRpe.length;
}