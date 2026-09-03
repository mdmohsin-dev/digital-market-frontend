"use client";

import {
    isInWishlist,
    toggleWishlist,
} from "@/lib/wishlist";
import { Product } from "@/types/product";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa6";

import { addToCart } from "@/lib/cart";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const displayPrice =
        product.salePrice ?? product.regularPrice;

    const {
        images,
        name,
        rating,
        reviewCount,
        slug,
    } = product;

const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>,
) => {
    event.preventDefault();
    event.stopPropagation();

    const cartItem = {
    productId: product.id,
    name: product.name,
    image:
        typeof product.images[0] === "string"
            ? product.images[0]
            : product.images[0].src,
    price:
        product.salePrice ??
        product.regularPrice,
    quantity: 1,
    size: "",
    color: "",
};

    addToCart(cartItem);

    alert("Product added to cart.");
};

    const [isWishlisted, setIsWishlisted] =
        useState(false);

    useEffect(() => {
        setIsWishlisted(isInWishlist(product.id));
    }, [product.id]);

    const handleWishlist = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        const updatedWishlist = toggleWishlist(product.id);

        setIsWishlisted(
            updatedWishlist.includes(product.id)
        );
    };

    return (
        <Link
            href={`/shop/${slug}`}
            className="block h-full"
        >
            <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
                {/* Product Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-200 p-4">
                    <Image
                        className="object-contain p-5"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        src={images[0]}
                        alt={name}
                    />

                    {/* Wishlist */}
                    <button
                        type="button"
                        onClick={handleWishlist}
                        aria-label={
                            isWishlisted
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                        }
                        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-gray-100"
                    >
                        <Heart
                            size={20}
                            className={
                                isWishlisted
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-600"
                            }
                        />
                    </button>
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col bg-white p-4">
                    <div className="flex flex-col gap-3">
                        {/* Product Name */}
                        <h3 className="line-clamp-2 min-h-[3rem] text-xl">
                            {name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map(
                                    (_, i) => {
                                        const fillPercent =
                                            Math.max(
                                                0,
                                                Math.min(
                                                    100,
                                                    (rating - i) * 100
                                                )
                                            );

                                        return (
                                            <div
                                                key={i}
                                                className="relative h-4 w-4"
                                            >
                                                {/* Empty Star */}
                                                <Star
                                                    size={16}
                                                    className="absolute inset-0 fill-gray-200 text-gray-200"
                                                />

                                                {/* Filled Star */}
                                                <div
                                                    className="absolute inset-0 overflow-hidden"
                                                    style={{
                                                        width: `${fillPercent}%`,
                                                    }}
                                                >
                                                    <Star
                                                        size={16}
                                                        className="fill-yellow-400 text-yellow-400"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            <span className="text-sm text-gray-500">
                                {rating} ({reviewCount})
                            </span>
                        </div>

                        {/* Price */}
                        <p className="font-semibold text-red-500">
                            Price: {displayPrice}
                        </p>
                    </div>

                    {/* Add To Cart */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-primary p-2 text-white transition-opacity hover:opacity-90"
                    >
                        <FaCartPlus size={24} />
                        Add to cart
                    </button>
                </div>
            </div>
        </Link>
    );
}