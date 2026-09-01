"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getWishlistIds,
  isInWishlist,
  toggleWishlist,
} from "@/lib/wishlist";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Sync wishlist from localStorage
   */
  const syncWishlist = useCallback(() => {
    setWishlist(getWishlistIds());
  }, []);

  /**
   * Initial load + realtime synchronization
   */
  useEffect(() => {
    // Initial wishlist load
    syncWishlist();
    setIsLoaded(true);

    /**
     * Same-tab wishlist updates
     */
    const handleWishlistUpdate = () => {
      syncWishlist();
    };

    /**
     * Cross-tab / cross-window localStorage updates
     */
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "wishlist") {
        syncWishlist();
      }
    };

    window.addEventListener(
      "wishlist-updated",
      handleWishlistUpdate
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "wishlist-updated",
        handleWishlistUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [syncWishlist]);

  /**
   * Add / remove product from wishlist
   */
  const toggle = useCallback(
    (productId: string) => {
      const updatedWishlist = toggleWishlist(productId);

      setWishlist(updatedWishlist);
    },
    []
  );

  /**
   * Check whether a product is in wishlist
   */
  const checkWishlist = useCallback(
    (productId: string) => {
      return wishlist.includes(productId);
    },
    [wishlist]
  );

  /**
   * Remove all wishlist products
   */
  const clear = useCallback(() => {
    localStorage.removeItem("wishlist");

    setWishlist([]);

    window.dispatchEvent(
      new Event("wishlist-updated")
    );
  }, []);

  return {
    wishlist,

    wishlistCount: wishlist.length,

    isInWishlist: checkWishlist,

    toggleWishlist: toggle,

    clearWishlist: clear,

    isLoaded,
  };
}