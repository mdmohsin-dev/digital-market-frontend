const WISHLIST_KEY = "wishlist";

export function getWishlistIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(WISHLIST_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isInWishlist(productId: string): boolean {
  return getWishlistIds().includes(productId);
}

export function toggleWishlist(productId: string): string[] {
  const currentWishlist = getWishlistIds();

  let updatedWishlist: string[];

  if (currentWishlist.includes(productId)) {
    // Remove from wishlist
    updatedWishlist = currentWishlist.filter(
      (id) => id !== productId
    );
  } else {
    // Add to wishlist
    updatedWishlist = [...currentWishlist, productId];
  }

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(updatedWishlist)
  );

  // Notify other components in the same tab
  window.dispatchEvent(new Event("wishlist-updated"));

  return updatedWishlist;
}

export function clearWishlist(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(WISHLIST_KEY);

  window.dispatchEvent(new Event("wishlist-updated"));
}

export { WISHLIST_KEY };