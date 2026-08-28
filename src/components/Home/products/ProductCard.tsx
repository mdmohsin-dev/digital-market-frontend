// src/components/products/ProductCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, calculateDiscountPercent } from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

const badgeStyles: Record<NonNullable<Product["badge"]>, string> = {
  NEW: "bg-emerald-600 text-white",
  SALE: "bg-[#9D1749] text-white",
  HOT: "bg-orange-600 text-white",
};

export default function ProductCard({ product }: ProductCardProps) {
  // Local UI-only state for now. Swap for real wishlist/cart context
  // or API mutation once the backend exists — the product.id is
  // already threaded through both handlers below.
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercent = calculateDiscountPercent(
    product.regularPrice,
    product.salePrice
  );

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
    // TODO: replace with real wishlist mutation using product.id
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: replace with real add-to-cart action using product.id
    console.log("Add to cart:", product.id);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-neutral-800 transition-all duration-300 hover:ring-[#9D1749]/60"
    >
      {/* Image area */}
      <div className="relative aspect-4/5 w-full overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[product.badge]}`}
          >
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <Heart
            size={16}
            className={isWishlisted ? "fill-[#9D1749] text-[#9D1749]" : ""}
          />
        </button>
      </div>

      {/* Info area */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {product.colors.map((color) => (
              <span
                key={color}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-neutral-700"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        <h3 className="line-clamp-1 text-sm font-medium text-white sm:text-base">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-white sm:text-base">
            {formatPrice(product.salePrice ?? product.regularPrice)}
          </span>
          {product.salePrice && (
            <>
              <span className="text-xs text-neutral-500 line-through sm:text-sm">
                {formatPrice(product.regularPrice)}
              </span>
              {discountPercent !== null && (
                <span className="text-xs font-medium text-emerald-500">
                  -{discountPercent}%
                </span>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-2 w-full rounded-lg bg-[#9D1749] py-2 text-sm font-medium text-white transition-colors hover:bg-[#9D1749]/90"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}