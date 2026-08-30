"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Check,
    Heart,
    Minus,
    Plus,
    ShoppingCart,
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

    const [selectedColor, setSelectedColor] =
        useState<string | null>(null);

    const [selectedSize, setSelectedSize] =
        useState<string | null>(null);

    const [isWishlisted, setIsWishlisted] =
        useState(false);

    const [selectionError, setSelectionError] =
        useState("");

    // =========================
    // AVAILABLE COLORS
    // =========================

    const colors = useMemo(() => {
        return Array.from(
            new Set(
                (product.variations ?? [])
                    .map(
                        (variation) =>
                            variation.color
                    )
                    .filter(
                        (
                            color
                        ): color is string =>
                            Boolean(color)
                    )
            )
        );
    }, [product.variations]);

    // =========================
    // AVAILABLE SIZES
    // =========================

    const sizes = useMemo(() => {
        return Array.from(
            new Set(
                (product.variations ?? [])
                    .map(
                        (variation) =>
                            variation.size
                    )
                    .filter(
                        (
                            size
                        ): size is string =>
                            Boolean(size)
                    )
            )
        );
    }, [product.variations]);

    // =========================
    // SELECTED VARIATION
    // =========================

    const selectedVariation = useMemo(() => {
        if (
            !selectedColor ||
            !selectedSize
        ) {
            return undefined;
        }

        return product.variations?.find(
            (variation) =>
                variation.color ===
                    selectedColor &&
                variation.size ===
                    selectedSize
        );
    }, [
        product.variations,
        selectedColor,
        selectedSize,
    ]);

    // =========================
    // CURRENT PRICE
    // =========================

    const currentPrice =
        selectedVariation?.salePrice ??
        selectedVariation?.price ??
        product.salePrice ??
        product.regularPrice;

    // =========================
    // CURRENT REGULAR PRICE
    // =========================

    const currentRegularPrice =
        selectedVariation?.price ??
        product.regularPrice;

    // =========================
    // CURRENT STOCK
    // =========================

    const currentStock =
        selectedVariation?.stock ??
        product.stock;

    // =========================
    // COLOR SELECT
    // =========================

    const handleColorChange = (
        color: string
    ) => {
        setSelectedColor(color);
        setSelectionError("");
        setQuantity(1);
    };

    // =========================
    // SIZE SELECT
    // =========================

    const handleSizeChange = (
        size: string
    ) => {
        setSelectedSize(size);
        setSelectionError("");
        setQuantity(1);
    };

    // =========================
    // QUANTITY
    // =========================

    const increaseQuantity = () => {
        if (quantity < currentStock) {
            setQuantity(
                (previous) => previous + 1
            );
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(
                (previous) => previous - 1
            );
        }
    };

    // =========================
    // VALIDATE VARIATION
    // =========================

    const validateSelection = () => {
        if (!selectedColor && !selectedSize) {
            setSelectionError(
                "Please select a color and size."
            );

            return false;
        }

        if (!selectedColor) {
            setSelectionError(
                "Please select a color."
            );

            return false;
        }

        if (!selectedSize) {
            setSelectionError(
                "Please select a size."
            );

            return false;
        }

        if (!selectedVariation) {
            setSelectionError(
                "This color and size combination is unavailable."
            );

            return false;
        }

        if (currentStock <= 0) {
            setSelectionError(
                "This variation is out of stock."
            );

            return false;
        }

        setSelectionError("");

        return true;
    };

    // =========================
    // ADD TO CART
    // =========================

    const handleAddToCart = () => {
        if (!validateSelection()) {
            return;
        }

        if (!selectedVariation) {
            return;
        }

        const cartItem = {
            productId: product.id,
            variationId: selectedVariation.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0],
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
                    item.variationId ===
                        cartItem.variationId
            );

        if (existingItemIndex !== -1) {
            existingCart[
                existingItemIndex
            ].quantity += quantity;
        } else {
            existingCart.push(cartItem);
        }

        localStorage.setItem(
            "cart",
            JSON.stringify(existingCart)
        );
    };

    // =========================
    // BUY NOW
    // =========================

    const handleBuyNow = () => {
        if (!validateSelection()) {
            return;
        }

        handleAddToCart();

        window.location.href = "/cart";
    };

    // =========================
    // WISHLIST
    // =========================

    const handleWishlist = () => {
        setIsWishlisted(
            (previous) => !previous
        );
    };

    return (
        <main className="mx-auto max-w-350 px-4 py-8 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
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

            {/* Product */}
            <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                {/* Gallery */}
                <ProductImageGallery
                    product={product}
                />

                {/* Details */}
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
                                    -
                                    {
                                        product.discount
                                    }
                                    %
                                </span>
                            )}
                    </div>

                    {/* Name */}
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        {product.name}
                    </h1>

                    {/* Rating */}
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
                                <Check
                                    size={16}
                                />
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

                        {currentRegularPrice >
                            currentPrice && (
                            <span className="text-lg text-gray-400 line-through">
                                ৳
                                {currentRegularPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="mt-6 leading-7 text-gray-600">
                        {product.description}
                    </p>

                    <div className="my-7 border-t border-gray-200" />

                    {/* =========================
                        COLOR
                    ========================== */}

                    {colors.length > 0 && (
                        <div>
                            <p className="mb-3 text-sm font-medium">
                                Color
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {colors.map(
                                    (color) => {
                                        const isSelected =
                                            selectedColor ===
                                            color;

                                        return (
                                            <button
                                                key={
                                                    color
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleColorChange(
                                                        color
                                                    )
                                                }
                                                className={`rounded-md border px-5 py-2.5 text-sm transition ${
                                                    isSelected
                                                        ? "border-black bg-black text-white"
                                                        : "border-gray-300 hover:border-black"
                                                }`}
                                            >
                                                {
                                                    color
                                                }
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )}

                    {/* =========================
                        SIZE
                    ========================== */}

                    {sizes.length > 0 && (
                        <div className="mt-6">
                            <p className="mb-3 text-sm font-medium">
                                Size
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {sizes.map(
                                    (size) => {
                                        const isSelected =
                                            selectedSize ===
                                            size;

                                        return (
                                            <button
                                                key={
                                                    size
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleSizeChange(
                                                        size
                                                    )
                                                }
                                                className={`flex h-11 min-w-11 items-center justify-center rounded-md border px-4 text-sm transition ${
                                                    isSelected
                                                        ? "border-black bg-black text-white"
                                                        : "border-gray-300 hover:border-black"
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )}

                    {/* Selection Error */}
                    {selectionError && (
                        <p className="mt-4 text-sm font-medium text-red-500">
                            {selectionError}
                        </p>
                    )}

                    {/* Selected Variation Stock */}
                    {selectedVariation && (
                        <div className="mt-5">
                            {currentStock > 0 ? (
                                <p className="flex items-center gap-2 text-sm text-green-600">
                                    <Check
                                        size={17}
                                    />

                                    {currentStock}{" "}
                                    items available
                                </p>
                            ) : (
                                <p className="text-sm font-medium text-red-500">
                                    Out of stock
                                </p>
                            )}
                        </div>
                    )}

                    {/* =========================
                        QUANTITY + WISHLIST
                    ========================== */}

                    <div className="mt-6">
                        <p className="mb-3 text-sm font-medium">
                            Quantity
                        </p>

                        <div className="flex items-center gap-3">
                            {/* Quantity */}
                            <div className="flex h-12 w-32 items-center justify-between rounded-md border border-gray-300">
                                <button
                                    type="button"
                                    onClick={
                                        decreaseQuantity
                                    }
                                    disabled={
                                        quantity <=
                                            1 ||
                                        !selectedVariation
                                    }
                                    className="flex h-full w-10 items-center justify-center text-gray-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Minus
                                        size={17}
                                    />
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
                                        !selectedVariation ||
                                        quantity >=
                                            currentStock
                                    }
                                    className="flex h-full w-10 items-center justify-center text-gray-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Plus
                                        size={17}
                                    />
                                </button>
                            </div>

                            {/* Wishlist */}
                            <button
                                type="button"
                                onClick={
                                    handleWishlist
                                }
                                className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-md border px-4 font-medium transition ${
                                    isWishlisted
                                        ? "border-red-500 bg-red-500 text-white"
                                        : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
                                }`}
                            >
                                <Heart
                                    size={19}
                                    className={
                                        isWishlisted
                                            ? "fill-white"
                                            : ""
                                    }
                                />

                                {isWishlisted
                                    ? "Added to Wishlist"
                                    : "Add to Wishlist"}
                            </button>
                        </div>
                    </div>

                    {/* =========================
                        ADD TO CART + BUY NOW
                    ========================== */}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={
                                handleAddToCart
                            }
                            disabled={
                                selectedVariation
                                    ? currentStock <=
                                      0
                                    : false
                            }
                            className="flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ShoppingCart
                                size={19}
                            />
                            Add to Cart
                        </button>

                        <button
                            type="button"
                            onClick={handleBuyNow}
                            disabled={
                                selectedVariation
                                    ? currentStock <=
                                      0
                                    : false
                            }
                            className="h-12 rounded-md border border-black px-4 font-medium transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Product Tabs */}
            <ProductTabs product={product} />
        </main>
    );
}