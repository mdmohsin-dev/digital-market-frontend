"use client";

import {
    Heart,
    Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    useEffect,
    useState,
} from "react";

import {
    isInWishlist,
    toggleWishlist,
} from "@/lib/wishlist";

import { Product } from "@/types/product";

interface ProductListCardProps {
    product: Product;
}

export default function ProductListCard({
    product,
}: ProductListCardProps) {
    const displayPrice =
        product.salePrice ??
        product.regularPrice;

    const {
        id,
        images,
        name,
        rating,
        reviewCount,
        slug,
        regularPrice,
        salePrice,
    } = product;

    const [isWishlisted, setIsWishlisted] =
        useState(false);

    useEffect(() => {
        setIsWishlisted(
            isInWishlist(id)
        );
    }, [id]);

    const handleWishlist = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        const updatedWishlist =
            toggleWishlist(id);

        setIsWishlisted(
            updatedWishlist.includes(id)
        );
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row">
                {/* Product Image */}
                <div className="relative h-64 w-full shrink-0 bg-gray-200 p-4 sm:h-56 sm:w-56 md:h-64 md:w-64">
                    <Image
                        src={images[0]}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 100vw, 256px"
                        className="object-contain p-5"
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

                {/* Product Information */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                        {/* Product Name */}
                        <h3 className="text-lg font-medium leading-7 text-gray-900 md:text-xl">
                            {name}
                        </h3>

                        {/* Rating */}
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center">
                                {Array.from({
                                    length: 5,
                                }).map((_, i) => {
                                    const fillPercent =
                                        Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                (rating - i) *
                                                    100
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
                                })}
                            </div>

                            <span className="text-sm text-gray-500">
                                {rating} ({reviewCount} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-lg font-semibold text-red-500">
                                ৳{displayPrice.toLocaleString()}
                            </span>

                            {salePrice !== undefined &&
                                salePrice <
                                    regularPrice && (
                                    <span className="text-sm text-gray-400 line-through">
                                        ৳
                                        {regularPrice.toLocaleString()}
                                    </span>
                                )}
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-6 flex items-center">
                        <Link
                            href={`/shop/${slug}`}
                            className="flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition duration-500 hover:bg-neutral-900"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}