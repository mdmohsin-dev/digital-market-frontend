'use client'

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import type { Product } from "@/types/product";

interface FlashSaleCardProps {
    product: Product;
}

export default function FlashSaleCard({
    product,
}: FlashSaleCardProps) {
    const displayPrice =
        product.salePrice ?? product.regularPrice;

    const discount =
        product.discount ??
        (product.salePrice
            ? Math.round(
                  ((product.regularPrice -
                      product.salePrice) /
                      product.regularPrice) *
                      100
              )
            : 0);

    const image = product.images?.[0];

    return (
        <article className="group overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
            {/* Product Image */}
            <Link
                href={`/shop/${product.slug}`}
                className="block"
            >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {discount > 0 && (
                        <span className="absolute left-3 top-3 z-10 rounded-md bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                            -{discount}%
                        </span>
                    )}

                    {image ? (
                        <Image
                            src={image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            No image
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
                <Link
                    href={`/shop/${product.slug}`}
                >
                    <h2 className="line-clamp-1 text-base font-medium transition-colors hover:text-primary">
                        {product.name}
                    </h2>
                </Link>

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-semibold text-red-500">
                        ৳{displayPrice.toLocaleString()}
                    </span>

                    {product.regularPrice >
                        displayPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            ৳
                            {product.regularPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Stock */}
                {/* {product.stock > 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                        {product.stock} left
                    </p>
                )} */}

                {/* Add To Cart */}
                <button
                    type="button"
                    onClick={() =>
                        console.log(
                            "Add to cart:",
                            product.id
                        )
                    }
                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                    <ShoppingCart size={17} />
                    Add to Cart
                </button>
            </div>
        </article>
    );
}