"use client";

import { useCartCount } from "@/hooks/useCartCount";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, ShoppingBag } from "lucide-react";

export default function DashboardPage() {
    const cartCount = useCartCount();
    const { wishlistCount, isLoaded, } = useWishlist();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Welcome to your account.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-5">
                    <h2 className="mt-2 text-3xl font-semibold">{cartCount}</h2>
                    <p className="text-sm text-muted-foreground">
                        Items in Cart
                    </p>

                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
                        <ShoppingBag size={28} className="text-white" />
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-50 via-rose-50 to-white p-5">
                    <h2 className="mt-2 text-3xl font-semibold">{isLoaded ? wishlistCount : 0}</h2>
                    <p className="text-sm text-muted-foreground">
                        Items in Wishlist
                    </p>

                    {/* Icon badge - top right */}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg">
                        <Heart size={28} className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}