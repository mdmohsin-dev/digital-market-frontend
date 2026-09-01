"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
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
  onAddToCart,
}: ProductCardProps) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const handleRemove = useCallback(
        (productId: string) => {
            const updatedWishlist =
                toggleWishlist(productId);

            setWishlistIds(updatedWishlist);
        },
        []);
  return (
  <div className="flex  mt-8 w-full items-center gap-4 rounded-2xl border border-border bg-card p-4">
    {/* Product image */} <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"> <Image
      src={product.images[0]}
      alt={product.name}
      fill
      sizes="80px"
      className="object-cover"
    /> </div>

    {/* Product info */}
    <div className="min-w-0 flex-1">
      <h3 className="truncate text-base font-semibold text-foreground">
        {product.name}
      </h3>

      <p className="mt-1 text-lg font-bold text-foreground">
        ${product.regularPrice.toFixed(2)}
      </p>
    </div>

    {/* Actions */}
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => onAddToCart?.(product)}
        className="rounded-lg bg-primary text-white bg-card px-5 py-2.5 text-sm font-medium  transition-colors hover:bg-muted"
      >
        Add to Cart
      </button>

      <button
        type="button"
        aria-label={`Remove ${product.name}`}
        onClick={() => handleRemove(product.id)}
        className="rounded-lg border border-red-500 bg-card p-2.5 text-foreground transition-colors hover:bg-muted"
      >
        <Trash2 className="h-4 w-4" color="red" />
      </button>
    </div>
  </div>


  );
}
