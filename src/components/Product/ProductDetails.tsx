"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Heart,
    Minus,
    Plus,
    ShoppingCart,
    Check,
} from "lucide-react";

import type { Product } from "@/types/product";

import ProductImageGallery from "./ProductImageGallery";
import ProductRating from "./ProductRating";
import ProductTabs from "./ProductTabs";

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({
    product,
}: ProductDetailsProps) {
    const [quantity, setQuantity] = useState(1);

    const [selectedColor, setSelectedColor] = useState<string | null>(
        product.variations?.[0]?.color ?? null
    );

    const [selectedSize, setSelectedSize] = useState<string | null>(
        product.variations?.[0]?.size ?? null
    );

    const [isWishlisted, setIsWishlisted] = useState(false);

    // COLORS

    const colors = useMemo(() => {
        return Array.from(
            new Set(
                product.variations
                    ?.map((variation) => variation.color)
                    .filter(
                        (color): color is string =>
                            Boolean(color)
                    )
            )
        );
    }, [product.variations]);

    // SIZES


    const sizes = useMemo(() => {
        return Array.from(
            new Set(
                product.variations
                    ?.map((variation) => variation.size)
                    .filter(
                        (size): size is string =>
                            Boolean(size)
                    )
            )
        );
    }, [product.variations]);

    // SELECTED VARIATION

    const selectedVariation = useMemo(() => {
        return product.variations?.find((variation) => {
            const colorMatch =
                !selectedColor ||
                variation.color === selectedColor;

            const sizeMatch =
                !selectedSize ||
                variation.size === selectedSize;

            return colorMatch && sizeMatch;
        });
    }, [
        product.variations,
        selectedColor,
        selectedSize,
    ]);

    // CURRENT PRICE

    const currentPrice =
        selectedVariation?.salePrice ??
        selectedVariation?.price ??
        product.salePrice ??
        product.regularPrice;

    // CURRENT STOCK

    const currentStock =
        selectedVariation?.stock ?? product.stock;

    // QUANTITY

    const increaseQuantity = () => {
        if (quantity < currentStock) {
            setQuantity((previous) => previous + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((previous) => previous - 1);
        }
    };

    // ADD TO CART

    const handleAddToCart = () => {
        if (currentStock <= 0) return;

        const cartItem = {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image:
                selectedVariation?.image ??
                product.images[0],
            price: currentPrice,
            quantity,
            color: selectedColor,
            size: selectedSize,
        };

        const existingCart = JSON.parse(
            localStorage.getItem("cart") ?? "[]"
        );

        const existingItemIndex =
            existingCart.findIndex(
                (item: typeof cartItem) =>
                    item.productId ===
                    cartItem.productId &&
                    item.color === cartItem.color &&
                    item.size === cartItem.size
            );

        if (existingItemIndex !== -1) {
            existingCart[existingItemIndex].quantity +=
                quantity;
        } else {
            existingCart.push(cartItem);
        }

        localStorage.setItem(
            "cart",
            JSON.stringify(existingCart)
        );
    };


    // BUY NOW

    const handleBuyNow = () => {
        if (currentStock <= 0) return;

        handleAddToCart();

        window.location.href = "/cart";
    };


    // WISHLIST

    const handleWishlist = () => {
        setIsWishlisted((previous) => !previous);
    };

    return (
        <main className="mx-auto max-w-350 px-4 py-8 sm:px-6 lg:px-8">
            {/* BREADCRUMB */}

            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <Link
                    href="/"
                    className="transition hover:text-black"
                >
                    Home
                </Link>

                <span>/</span>

                <Link
                    href="/shop"
                    className="transition hover:text-black"
                >
                    Shop
                </Link>

                <span>/</span>

                <span className="text-gray-900">
                    {product.name}
                </span>
            </div>

            {/* PRODUCT MAIN SECTION */}

            <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                {/* IMAGE GALLERY */}

                <ProductImageGallery
                    product={product}
                />

                {/* PRODUCT INFORMATION */}

                <div className="flex flex-col">
                    {/* Badges */}

                    <div className="mb-4 flex items-center gap-2">
                        {product.newArrival && (
                            <span className="rounded bg-black px-3 py-1 text-xs font-medium text-white">
                                New
                            </span>
                        )}

                        {product.discount !==
                            undefined &&
                            product.discount > 0 && (
                                <span className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                                    -{product.discount}%
                                </span>
                            )}
                    </div>

                    {/* Product Name */}

                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        {product.name}
                    </h1>

                    {/* Rating + Stock */}

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <ProductRating
                            rating={product.rating}
                            reviewCount={
                                product.reviewCount
                            }
                        />

                        <span className="h-4 w-px bg-gray-300" />

                        {currentStock > 0 ? (
                            <span className="flex items-center gap-1.5 text-sm text-green-600">
                                <Check size={16} />
                                In Stock
                            </span>
                        ) : (
                            <span className="text-sm text-red-500">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Price */}

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <span className="text-3xl font-bold text-red-500">
                            ৳
                            {currentPrice.toLocaleString()}
                        </span>

                        {product.salePrice &&
                            product.salePrice <
                            product.regularPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                    ৳
                                    {product.regularPrice.toLocaleString()}
                                </span>
                            )}
                    </div>

                    {/* Description */}

                    <p className="mt-6 leading-7 text-gray-600">
                        {product.description}
                    </p>

                    <div className="my-7 border-t border-gray-200" />

                    {/* COLOR */}

                    {colors.length > 0 && (
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="font-medium">
                                    Color:
                                </span>

                                <span className="text-gray-600">
                                    {selectedColor}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {colors.map((color) => {
                                    const isSelected =
                                        selectedColor ===
                                        color;

                                    return (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() =>
                                                setSelectedColor(
                                                    color
                                                )
                                            }
                                            className={`rounded-md border px-4 py-2 text-sm transition ${isSelected
                                                ? "border-black bg-black text-white"
                                                : "border-gray-300 hover:border-black"
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* SIZE */}

                    {sizes.length > 0 && (
                        <div className="mt-6">
                            <div className="mb-3 flex items-center gap-2">
                                <span className="font-medium">
                                    Size:
                                </span>

                                <span className="text-gray-600">
                                    {selectedSize}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {sizes.map((size) => {
                                    const isSelected =
                                        selectedSize ===
                                        size;

                                    return (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() =>
                                                setSelectedSize(
                                                    size
                                                )
                                            }
                                            className={`flex h-11 min-w-11 items-center justify-center rounded-md border px-4 text-sm transition ${isSelected
                                                ? "border-black bg-black text-white"
                                                : "border-gray-300 hover:border-black"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* STOCK */}

                    <div className="mt-6">
                        {currentStock > 0 ? (
                            <p className="flex items-center gap-2 text-sm text-green-600">
                                <Check size={17} />

                                {currentStock} items
                                available
                            </p>
                        ) : (
                            <p className="text-sm font-medium text-red-500">
                                Out of stock
                            </p>
                        )}
                    </div>


                    <div className="mt-6 flex flex-col gap-6 sm:flex-row">
                        {/* Quantity */}

                        <div className="flex items-center gap-4">
                            <p className="text-xl font-semibold">Quantity:</p>
                            <div className="flex h-12 w-full items-center justify-between rounded-md border border-gray-300 sm:w-32">
                                <button
                                    type="button"
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1}
                                    className="flex h-full w-10 items-center justify-center text-gray-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Minus size={17} />
                                </button>

                                <span className="text-sm font-medium">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        increaseQuantity
                                    }
                                    disabled={
                                        quantity >=
                                        currentStock
                                    }
                                    className="flex h-full w-10 items-center justify-center text-gray-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Plus size={17} />
                                </button>
                            </div>
                        </div>

                        {/*  WISHLIST */}

                        <button
                            type="button"
                            onClick={handleWishlist}
                            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-md border px-4 font-medium transition ${isWishlisted
                                    ? "border-red-500 bg-red-500 text-white"
                                    : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
                                }`}
                        >
                            <Heart
                                size={19}
                                className={
                                    isWishlisted ? "fill-white" : ""
                                }
                            />

                            {isWishlisted
                                ? "Added to Wishlist"
                                : "Add to Wishlist"}
                        </button>


                    </div>

                    <div className="flex mt-6 items-center gap-4">
                        {/* BUY NOW */}

                        <button
                            type="button"
                            disabled={currentStock <= 0}
                            onClick={handleBuyNow}
                            className="h-12 w-full rounded-md border border-black font-medium transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50" >
                            Buy Now
                        </button>

                        {/* Add to Cart */}

                        <button
                            type="button"
                            disabled={currentStock <= 0}
                            onClick={handleAddToCart}
                            className="flex w-full h-12  items-center justify-center gap-2 rounded-md bg-primary px-6 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" >
                            <ShoppingCart size={19} />
                            Add to Cart
                        </button>
                    </div>

                </div>
            </section>

            {/* PRODUCT TABS*/}

            <ProductTabs product={product} />
        </main>
    );
}