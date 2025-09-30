/**
 * Weight formatting and conversion utilities
 */

/**
 * Convert pounds to kilograms
 */
export function lbsToKg(pounds: number): number {
  return pounds * 0.453592;
}

/**
 * Convert kilograms to pounds
 */
export function kgToLbs(kilograms: number): number {
  return kilograms * 2.20462;
}

/**
 * Format weight for display with proper unit
 */
export function formatWeight(weight: number, unit: 'kg' | 'lbs' = 'kg'): string {
  const formatted = weight.toFixed(weight % 1 === 0 ? 0 : 1);
  return `${formatted} ${unit}`;
}

/**
 * Convert weight between units
 */
export function convertWeight(weight: number, fromUnit: 'kg' | 'lbs', toUnit: 'kg' | 'lbs'): number {
  if (fromUnit === toUnit) return weight;

  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return lbsToKg(weight);
  } else {
    return kgToLbs(weight);
  }
}

/**
 * Round weight to nearest standard plate increment
 */
export function roundToPlateIncrement(weight: number, unit: 'kg' | 'lbs' = 'kg'): number {
  const increment = unit === 'kg' ? 2.5 : 5; // Standard plate increments
  return Math.round(weight / increment) * increment;
}

/**
 * Format weight range for display
 */
export function formatWeightRange(min: number, max: number, unit: 'kg' | 'lbs' = 'kg'): string {
  if (min === max) {
    return formatWeight(min, unit);
  }
  return `${formatWeight(min, unit)} - ${formatWeight(max, unit)}`;
}