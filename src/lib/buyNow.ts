import type { CartItem } from "@/types/cart";

const BUY_NOW_KEY = "buy-now";

export const setBuyNowItem = (item: CartItem) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(BUY_NOW_KEY, JSON.stringify(item));
};

export const getBuyNowItem = (): CartItem | null => {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(BUY_NOW_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as CartItem;
  } catch {
    return null;
  }
};

export const clearBuyNowItem = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(BUY_NOW_KEY);
};