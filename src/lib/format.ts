// src/lib/format.ts

/**
 * Formats a price in Taka. Centralized so every product/price
 * display across the site stays consistent.
 */
export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

/**
 * Returns the discount percentage between regular and sale price,
 * rounded to the nearest whole number. Returns null when there's
 * no valid discount to show.
 */
export function calculateDiscountPercent(
  regularPrice: number,
  salePrice?: number
): number | null {
  if (!salePrice || salePrice >= regularPrice) return null;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}