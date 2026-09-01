"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    ArrowLeft,
    Heart,
    ShoppingBag,
    Trash2,
} from "lucide-react";

import { products } from "@/Data/products";

import {
    clearWishlist,
    getWishlistIds,
} from "@/lib/wishlist";
import { Product } from "@/types/product";
import { WishlistProductCard } from "./Home/WishlistProductCard";

const WISHLIST_EVENT = "wishlist-updated";

export default function WishlistPageContent() {
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    /**
     * Load wishlist IDs from localStorage
     */
    const loadWishlist = useCallback(() => {
        setWishlistIds(getWishlistIds());
        setIsLoaded(true);
    }, []);

    /**
     * Initial load
     */
    useEffect(() => {
        loadWishlist();
    }, [loadWishlist]);

    /**
     * Realtime wishlist update
     *
     * Works for:
     * - Product Card
     * - Product Details
     * - Navbar
     * - Wishlist page
     */
    useEffect(() => {
        const handleWishlistUpdate = () => {
            loadWishlist();
        };

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "wishlist") {
                loadWishlist();
            }
        };

        window.addEventListener(
            WISHLIST_EVENT,
            handleWishlistUpdate
        );

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                WISHLIST_EVENT,
                handleWishlistUpdate
            );

            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, [loadWishlist]);

    /**
     * Convert wishlist IDs into actual products
     */
    const wishlistProducts = useMemo(() => {
        return wishlistIds
            .map((id) =>
                products.find((product) => product.id === id)
            )
            .filter(
                (product): product is Product =>
                    product !== undefined
            );
    }, [wishlistIds]);

    /**
     * Remove single product
     *
     * Uses the same toggleWishlist function
     * used by ProductCard and ProductDetails.
     */
  

    /**
     * Clear entire wishlist
     */
    const handleClearAll = useCallback(() => {
        clearWishlist();

        setWishlistIds([]);
    }, []);

    /**
     * Loading state
     */
    if (!isLoaded) {
        return (
            <main className="min-h-[60vh]">
                <div className="mx-auto max-w-350 px-4 py-12 sm:px-6 lg:px-8">
                    <div className="h-8 w-40 animate-pulse rounded bg-muted" />

                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="overflow-hidden rounded-lg border border-border"
                                >
                                    <div className="aspect-square animate-pulse bg-muted" />

                                    <div className="space-y-3 p-4">
                                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                                        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
        );
    }

    /**
     * Empty wishlist
     */
    if (wishlistProducts.length === 0) {
        return (
            <main className="min-h-[70vh]">
                <div className="mx-auto flex max-w-350 items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
                    <div className="flex max-w-md flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <Heart
                                className="h-9 w-9 text-primary"
                                strokeWidth={1.5}
                            />
                        </div>

                        <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                            Your Wishlist is Empty
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Save your favorite products here and
                            come back whenever you&apos;re ready to
                            shop.
                        </p>

                        <Link
                            href="/shop"
                            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    /**
     * Wishlist page
     */
    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-350 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                {/* Header */}
                <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                    {/* Title */}
                    <div>
                        <Link
                            href="/shop"
                            className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Continue Shopping
                        </Link>

                        <div className="flex items-center gap-3">
                            <Heart
                                className="h-8 w-8 text-red-500"
                                fill="currentColor"
                            />

                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                My Wishlist
                            </h1>
                        </div>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {wishlistProducts.length}{" "}
                            {wishlistProducts.length === 1
                                ? "product"
                                : "products"}{" "}
                            saved
                        </p>
                    </div>

                    {/* Clear All */}
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear All
                    </button>
                </div>

                {/* Products */}
                <div className="mt-8">
                    <div>
                        {wishlistProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group relative"
                            >
                                {/* Product Card */}
                                <WishlistProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
