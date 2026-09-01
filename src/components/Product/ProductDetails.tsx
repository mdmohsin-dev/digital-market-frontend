"use client";

import {
    Check,
    Heart,
    Minus,
    Plus,
    ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type { Product } from "@/types/product";

import ProductImageGallery from "./ProductImageGallery";
import ProductRating from "./ProductRating";
import ProductTabs from "./ProductTabs";

import {
    isInWishlist,
    toggleWishlist,
} from "@/lib/wishlist";

import { addToCart } from "@/lib/cart";

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({
    product,
}: ProductDetailsProps) {
    const [quantity, setQuantity] =
        useState(1);

    const [selectedColor, setSelectedColor] =
        useState<string | null>(null);

    const [selectedSize, setSelectedSize] =
        useState<string | null>(null);

    const [isWishlisted, setIsWishlisted] =
        useState(false);

    // =========================================================
    // WISHLIST
    // =========================================================

    useEffect(() => {
        setIsWishlisted(
            isInWishlist(product.id),
        );
    }, [product.id]);

    const handleWishlist = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        const updatedWishlist =
            toggleWishlist(product.id);

        setIsWishlisted(
            updatedWishlist.includes(
                product.id,
            ),
        );
    };

    // =========================================================
    // VARIATIONS
    // =========================================================

    const variations =
        product.variations ?? [];

    // =========================================================
    // AVAILABLE COLORS
    // =========================================================

    const colors = useMemo(() => {
        return Array.from(
            new Set(
                variations
                    .map(
                        (variation) =>
                            variation.color,
                    )
                    .filter(
                        (
                            color,
                        ): color is string =>
                            Boolean(color),
                    ),
            ),
        );
    }, [variations]);

    // =========================================================
    // AVAILABLE SIZES
    // =========================================================

    const sizes = useMemo(() => {
        return Array.from(
            new Set(
                variations
                    .map(
                        (variation) =>
                            variation.size,
                    )
                    .filter(
                        (
                            size,
                        ): size is string =>
                            Boolean(size),
                    ),
            ),
        );
    }, [variations]);

    // =========================================================
    // COLOR COMPATIBILITY
    // =========================================================

    const isColorCompatible = (
        color: string,
    ) => {
        if (!selectedSize) {
            return true;
        }

        return variations.some(
            (variation) =>
                variation.size ===
                selectedSize &&
                variation.color === color,
        );
    };

    // =========================================================
    // SIZE COMPATIBILITY
    // =========================================================

    const isSizeCompatible = (
        _size: string,
    ) => {
        return true;
    };

    // =========================================================
    // SELECTED VARIATION
    // =========================================================

    const selectedVariation = useMemo(() => {
        if (
            !selectedSize ||
            !selectedColor
        ) {
            return undefined;
        }

        return variations.find(
            (variation) =>
                variation.size ===
                selectedSize &&
                variation.color ===
                selectedColor,
        );
    }, [
        variations,
        selectedSize,
        selectedColor,
    ]);

    // =========================================================
    // CURRENT PRICE
    // =========================================================

    const currentPrice =
        selectedVariation?.salePrice ??
        selectedVariation?.price ??
        product.salePrice ??
        product.regularPrice;

    // =========================================================
    // CURRENT REGULAR PRICE
    // =========================================================

    const currentRegularPrice =
        selectedVariation?.price ??
        product.regularPrice;

    // =========================================================
    // CURRENT STOCK
    // =========================================================

    const currentStock =
        selectedVariation?.stock ?? 0;

    // =========================================================
    // COLOR CHANGE
    // =========================================================

    const handleColorChange = (
        color: string,
    ) => {
        if (
            selectedSize &&
            !isColorCompatible(color)
        ) {
            return;
        }

        setSelectedColor(color);
        setQuantity(1);
    };

    // =========================================================
    // SIZE CHANGE
    // =========================================================

    const handleSizeChange = (
        size: string,
    ) => {
        setSelectedSize(size);
        setQuantity(1);

        if (
            selectedColor &&
            !variations.some(
                (variation) =>
                    variation.size ===
                    size &&
                    variation.color ===
                    selectedColor,
            )
        ) {
            setSelectedColor(null);
        }
    };

    // =========================================================
    // QUANTITY
    // =========================================================

    const increaseQuantity = () => {
        if (
            selectedVariation &&
            quantity < currentStock
        ) {
            setQuantity(
                (previous) =>
                    previous + 1,
            );
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(
                (previous) =>
                    previous - 1,
            );
        }
    };

    // =========================================================
    // VALIDATE ADD TO CART
    // =========================================================

    const validateAddToCartSelection =
        () => {
            // No variation product
            if (variations.length === 0) {
                return true;
            }

            // Size missing
            if (!selectedSize) {
                alert(
                    "Please select a size.",
                );

                return false;
            }

            // Color missing
            if (!selectedColor) {
                alert(
                    "Please select an available color for the selected size.",
                );

                return false;
            }

            // Invalid combination
            if (!selectedVariation) {
                alert(
                    "This size and color combination is unavailable.",
                );

                return false;
            }

            // Out of stock
            if (currentStock <= 0) {
                alert(
                    "This product variation is out of stock.",
                );

                return false;
            }

            return true;
        };

    // =========================================================
    // ADD TO CART
    // =========================================================

    const handleAddToCart = () => {
        if (
            !validateAddToCartSelection()
        ) {
            return;
        }

        // Variation product হলে
        // selectedVariation অবশ্যই থাকতে হবে
        if (
            variations.length > 0 &&
            !selectedVariation
        ) {
            return;
        }

        const cartItem = {
            productId: product.id,
            name: product.name,
            image:
                typeof product.images[0] === "string"
                    ? product.images[0]
                    : product.images[0].src,
            price: currentPrice,
            quantity,
            size: selectedSize!,
            color: selectedColor!,
        };

        addToCart(cartItem);

        alert(
            "Product added to cart.",
        );
    };

    // =========================================================
    // BUY NOW
    // =========================================================

    const handleBuyNow = () => {
        const isValid =
            validateAddToCartSelection();

        if (!isValid) {
            return;
        }

        // এখন Buy Now শুধু validation করবে।
        // Checkout flow পরের step-এ হবে।
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <main className="mx-auto max-w-350 px-4 py-8 sm:px-6 lg:px-8">
            {/* =================================================
                BREADCRUMB
            ================================================= */}

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

            {/* =================================================
                PRODUCT
            ================================================= */}

            <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                {/* GALLERY */}

                <ProductImageGallery
                    product={product}
                />

                {/* DETAILS */}

                <div className="flex flex-col">
                    {/* BADGES */}

                    <div className="mb-4 flex items-center gap-2">
                        {product.newArrival && (
                            <span className="rounded bg-black px-3 py-1 text-xs font-medium text-white">
                                New
                            </span>
                        )}

                        {product.discount !==
                            undefined &&
                            product.discount >
                            0 && (
                                <span className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                                    -
                                    {
                                        product.discount
                                    }
                                    %
                                </span>
                            )}
                    </div>

                    {/* NAME */}

                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        {product.name}
                    </h1>

                    {/* RATING + STOCK */}

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <ProductRating
                            rating={
                                product.rating
                            }
                            reviewCount={
                                product.reviewCount
                            }
                        />

                        <span className="h-4 w-px bg-gray-300" />

                        {variations.length ===
                            0 ? (
                            <span className="flex items-center gap-1.5 text-sm text-green-600">
                                <Check
                                    size={16}
                                />
                                In Stock
                            </span>
                        ) : selectedVariation ? (
                            currentStock > 0 ? (
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
                            )
                        ) : (
                            <span className="text-sm text-gray-500">
                                Select options
                            </span>
                        )}
                    </div>

                    {/* PRICE */}

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

                    {/* DESCRIPTION */}

                    <p className="mt-6 leading-7 text-gray-600">
                        {product.description}
                    </p>

                    <div className="my-7 border-t border-gray-200" />

                    {/* COLOR */}

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

                                        const isCompatible =
                                            isColorCompatible(
                                                color,
                                            );

                                        return (
                                            <button
                                                key={
                                                    color
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleColorChange(
                                                        color,
                                                    )
                                                }
                                                disabled={
                                                    Boolean(
                                                        selectedSize,
                                                    ) &&
                                                    !isCompatible
                                                }
                                                className={`
                                                    rounded-md
                                                    border
                                                    px-5
                                                    py-2.5
                                                    text-sm
                                                    transition
                                                    ${isSelected
                                                        ? "border-black bg-black text-white"
                                                        : isCompatible
                                                            ? "border-gray-300 hover:border-black"
                                                            : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 line-through opacity-50"
                                                    }
                                                `}
                                            >
                                                {
                                                    color
                                                }
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    )}

                    {/* SIZE */}

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

                                        const isCompatible =
                                            isSizeCompatible(
                                                size,
                                            );

                                        return (
                                            <button
                                                key={
                                                    size
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleSizeChange(
                                                        size,
                                                    )
                                                }
                                                disabled={
                                                    !isCompatible
                                                }
                                                className={`
                                                    flex
                                                    h-11
                                                    min-w-11
                                                    items-center
                                                    justify-center
                                                    rounded-md
                                                    border
                                                    px-4
                                                    text-sm
                                                    transition
                                                    ${isSelected
                                                        ? "border-black bg-black text-white"
                                                        : "border-gray-300 hover:border-black"
                                                    }
                                                `}
                                            >
                                                {
                                                    size
                                                }
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    )}

                    {/* SELECTED VARIATION STOCK */}

                    {selectedVariation && (
                        <div className="mt-5">
                            {currentStock > 0 ? (
                                <p className="flex items-center gap-2 text-sm text-green-600">
                                    <Check
                                        size={17}
                                    />

                                    {
                                        currentStock
                                    }{" "}
                                    items
                                    available
                                </p>
                            ) : (
                                <p className="text-sm font-medium text-red-500">
                                    Out of stock
                                </p>
                            )}
                        </div>
                    )}

                    {/* QUANTITY + WISHLIST */}

                    <div className="mt-6">
                        <p className="mb-3 text-sm font-medium">
                            Quantity
                        </p>

                        <div className="flex items-center gap-3">
                            {/* QUANTITY */}

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

                            {/* WISHLIST */}

                            <button
                                type="button"
                                onClick={
                                    handleWishlist
                                }
                                className={`
                                    flex
                                    h-12
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-md
                                    border
                                    px-4
                                    font-medium
                                    transition
                                    ${isWishlisted
                                        ? "border-red-500 bg-red-500 text-white"
                                        : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
                                    }
                                `}
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

                    {/* ADD TO CART + BUY NOW */}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={
                                handleAddToCart
                            }
                            className="flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 font-medium text-white transition hover:opacity-90"
                        >
                            <ShoppingCart
                                size={19}
                            />

                            Add to Cart
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleBuyNow
                            }
                            className="h-12 rounded-md border border-black px-4 font-medium transition hover:bg-black hover:text-white"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </section>

            {/* =================================================
                PRODUCT TABS
            ================================================= */}

            <ProductTabs
                product={product}
            />
        </main>
    );
}