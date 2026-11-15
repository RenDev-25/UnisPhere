// src/ts/utils/format.ts

/**
 * Formats a number using the standard English number format.
 *
 * Example:
 * formatNumber(1000) returns "1,000".
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}