/**
 * Local hero image paths under `public/images/` (e.g. `jan1.jpg` … `jan5.jpg`).
 */

/** Filename prefix per month index (matches assets on disk). */
export const HERO_MONTH_PREFIX = [
  "jan",
  "feb",
  "march",
  "apr",
  "may",
  "june",
  "july",
  "aug",
  "sept",
  "oct",
  "nov",
  "dec",
] as const;

const FIVE_VARIANT_MONTHS = new Set([0, 1, 2, 11]);

/**
 * How many hero images exist for a given calendar month.
 *
 * @param monthIndex - `Date#getMonth()` value (0–11).
 * @returns Count of `*.jpg` files for that month in `public/images/`.
 */
export function getHeroImageVariantCount(monthIndex: number): number {
  return FIVE_VARIANT_MONTHS.has(monthIndex) ? 5 : 3;
}

/**
 * Picks a random hero image path for the month of `date`.
 *
 * @param date - Any instant in the target month.
 * @returns Public URL such as `/images/jan3.jpg`.
 *
 * @example
 * ```ts
 * const src = getRandomHeroImage(new Date(2026, 0, 15));
 * ```
 */
export function getRandomHeroImage(date: Date): string {
  const monthIndex = date.getMonth();
  const monthName = HERO_MONTH_PREFIX[monthIndex] ?? HERO_MONTH_PREFIX[0];
  const max = getHeroImageVariantCount(monthIndex);
  const n = Math.floor(Math.random() * max) + 1;
  return `/images/${monthName}${n}.jpg`;
}
