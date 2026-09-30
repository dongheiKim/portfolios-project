export function parsePriceInput(value: string): number | null {
  if (!value.trim()) return null;
  const price = Number(value);
  return Number.isSafeInteger(price) && price >= 0 ? price : null;
}

export function isInvalidPriceRange(
  minPrice: number | null,
  maxPrice: number | null,
): boolean {
  return minPrice !== null && maxPrice !== null && minPrice > maxPrice;
}
