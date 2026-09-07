"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCallback, useState } from "react";
import { toggleWishlist } from "@/lib/wishlist";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onRemove?: (product: Product) => void;
}

export function WishlistProductCard({
  product,
  onRemove,
}: ProductCardProps) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const handleRemove = useCallback(
    (productId: string) => {
      const updatedWishlist = toggleWishlist(productId);

      setWishlistIds(updatedWishlist);
      onRemove?.(product);
    },
    [onRemove, product]
  );

  return (
    <div className="group relative mt-6 flex w-full overflow-hidden rounded-2xl border border-gray-200 bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 sm:p-4">
      {/* Product Image */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-36 sm:w-36"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 112px, 144px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </Link>

      {/* Product Content */}
      <div className="flex min-w-0 flex-1 flex-col px-4 py-1 sm:px-5">
        {/* Product Info */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>Wishlist</span>
          </div>

          <Link href={`/shop/${product.slug}`}>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors duration-200 hover:text-primary sm:text-base">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            {product.salePrice ? (
              <>
                <span className="text-base font-bold text-foreground sm:text-lg">
                  ${product.salePrice.toFixed(2)}
                </span>

                <span className="text-xs text-muted-foreground line-through sm:text-sm">
                  ${product.regularPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-foreground sm:text-lg">
                ${product.regularPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Discount */}
          {product.discount && product.discount > 0 && (
            <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Actions - Bottom Right */}
        <div className="mt-auto flex items-center justify-end gap-2 pt-4">
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-primary-dark hover:shadow-md sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            View Details
          </Link>

          <button
            type="button"
            aria-label={`Remove ${product.name} from wishlist`}
            onClick={() => handleRemove(product.id)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary bg-background text-primary transition-all duration-300 hover:bg-primary hover:text-white sm:h-10 sm:w-10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        
      </div>

      {/* Wishlist Indicator */}
      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-background/90 shadow-sm backdrop-blur-sm">
        <Heart className="h-4 w-4 fill-primary text-primary" />
      </div>
    </div>
  );
}
