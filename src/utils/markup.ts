const MARKUP_BY_TERM: Record<number, number> = {
  1: 5,
  2: 10,
  3: 15,
  4: 18,
  5: 22,
  6: 25,
  7: 27,
  8: 29,
  9: 31,
  10: 33,
  11: 35,
  12: 37,
  13: 38,
  14: 39,
  15: 40,
  16: 41,
  17: 42,
  18: 43,
  19: 44,
  20: 45,
  21: 46,
  22: 47,
  23: 48,
  24: 50,
};

export const MIN_TERM = 1;
export const MAX_TERM = 24;
export const MIN_MARKUP_PERCENT = 0;
export const MAX_MARKUP_PERCENT = 100;
export const MIN_DOWN_PAYMENT = 0;
export const MAX_DOWN_PAYMENT = 10_000_000;
export const MIN_PRODUCT_COST = 1;
export const MAX_PRODUCT_COST = 10_000_000;

export function getMarkupPercent(termMonths: number): number {
  const clampedTerm = Math.min(MAX_TERM, Math.max(MIN_TERM, Math.round(termMonths)));
  return MARKUP_BY_TERM[clampedTerm] ?? MARKUP_BY_TERM[MAX_TERM];
}
