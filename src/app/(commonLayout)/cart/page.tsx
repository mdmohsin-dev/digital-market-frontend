"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
    ArrowLeft,
    ArrowRight,
    Minus,
    Plus,
    ShieldCheck,
    ShoppingCart,
    Trash2,
} from "lucide-react";

import {
    CART_UPDATED_EVENT,
    getCart,
    removeFromCart,
    updateCartItemQuantity,
    type CartItem,
} from "@/lib/cart";

import { products } from "@/Data/products";

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);

    // LOAD CART

    const loadCart = (): void => {
        setCart(getCart());
    };

    useEffect(() => {
        loadCart();

        const handleCartUpdate = (): void => {
            loadCart();
        };

        window.addEventListener(
            CART_UPDATED_EVENT,
            handleCartUpdate,
        );

        window.addEventListener(
            "storage",
            handleCartUpdate,
        );

        return () => {
            window.removeEventListener(
                CART_UPDATED_EVENT,
                handleCartUpdate,
            );

            window.removeEventListener(
                "storage",
                handleCartUpdate,
            );
        };
    }, []);

    // QUANTITY

    const handleQuantityChange = (
        item: CartItem,
        quantity: number,
    ): void => {
        if (quantity < 1) return;

        updateCartItemQuantity(
            item.productId,
            item.size,
            item.color,
            quantity,
        );

        loadCart();
    };

    // =========================================================
    // REMOVE
    // =========================================================

    const handleRemove = (item: CartItem): void => {
        removeFromCart(
            item.productId,
            item.size,
            item.color,
        );

        loadCart();
    };

    // =========================================================
    // CART CALCULATIONS
    // =========================================================

    const itemCount: number = cart.reduce<number>(
        (total: number, item: CartItem): number => {
            return total + item.quantity;
        },
        0,
    );

    const subtotal: number = cart.reduce<number>(
        (total: number, item: CartItem): number => {
            return total + item.price * item.quantity;
        },
        0,
    );

    // Keep this ready for future backend/discount integration.
    const discount: number = 0;

    const total: number = subtotal - discount;

    // =========================================================
    // RECOMMENDED PRODUCTS
    // =========================================================

    const recommendedProducts = useMemo(() => {
        const cartProductIds = new Set<string>(
            cart.map(
                (item: CartItem) => item.productId,
            ),
        );

        return products
            .filter(
                (product) =>
                    !cartProductIds.has(product.id),
            )
            .slice(0, 4);
    }, [cart]);

    // =========================================================
    // EMPTY CART
    // =========================================================

    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* BACK TO SHOP */}

                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-primary"
                    >
                        <ArrowLeft size={17} />
                        Continue Shopping
                    </Link>

                    {/* EMPTY CART */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.35,
                            ease: "easeOut",
                        }}
                        className="flex min-h-[65vh] items-center justify-center"
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            transition={{
                                duration: 0.35,
                                delay: 0.05,
                            }}
                            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm"
                        >
                            <motion.div
                                initial={{
                                    scale: 0.7,
                                    opacity: 0,
                                }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.1,
                                    type: "spring",
                                    stiffness: 180,
                                    damping: 15,
                                }}
                                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100"
                            >
                                <ShoppingCart
                                    size={34}
                                    className="text-gray-400"
                                />
                            </motion.div>

                            <h1 className="text-2xl font-bold text-gray-900">
                                Your cart is empty
                            </h1>

                            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                                Looks like you haven't added
                                anything to your cart yet.
                                Start shopping and add some
                                products to your cart.
                            </p>

                            <Link
                                href="/shop"
                                className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-7 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                Start Shopping

                                <ArrowRight
                                    size={17}
                                    className="ml-2"
                                />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        );
    }

    // =========================================================
    // CART PAGE
    // =========================================================

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* =================================================
                    BACK TO SHOP
                ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        x: -10,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                >
                    <Link
                        href="/shop"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-primary"
                    >
                        <ArrowLeft size={17} />
                        Continue Shopping
                    </Link>
                </motion.div>

                {/* =================================================
                    HEADING
                ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.35,
                        delay: 0.05,
                    }}
                    className="mb-7"
                >
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Your Cart
                    </h1>

                    <motion.p
                        key={itemCount}
                        initial={{
                            opacity: 0,
                            y: -5,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="mt-2 text-sm text-gray-500 sm:text-base"
                    >
                        You have {itemCount}{" "}
                        {itemCount === 1
                            ? "item"
                            : "items"}{" "}
                        in your cart
                    </motion.p>
                </motion.div>

                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-7">
                    {/* =================================================
                        CART ITEMS
                    ================================================= */}

                    <motion.section
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            delay: 0.1,
                        }}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                    >
                        {/* DESKTOP HEADER */}

                        <div className="hidden border-b border-gray-200 px-5 py-4 md:grid md:grid-cols-[minmax(0,1fr)_90px_140px_90px_35px] md:items-center md:gap-4">
                            <span className="text-sm font-semibold text-gray-500">
                                Product
                            </span>

                            <span className="text-center text-sm font-semibold text-gray-500">
                                Price
                            </span>

                            <span className="text-center text-sm font-semibold text-gray-500">
                                Quantity
                            </span>

                            <span className="text-center text-sm font-semibold text-gray-500">
                                Total
                            </span>

                            <span />
                        </div>

                        {/* =================================================
                            PRODUCTS
                        ================================================= */}

                        <div className="px-4 md:px-5">
                            <AnimatePresence
                                initial={false}
                                mode="popLayout"
                            >
                                {cart.map(
                                    (
                                        item: CartItem,
                                        index: number,
                                    ) => {
                                        const itemTotal: number =
                                            item.price *
                                            item.quantity;

                                        const itemKey = `${item.productId}-${item.size}-${item.color}`;

                                        return (
                                            <motion.div
                                                key={itemKey}
                                                layout
                                                initial={{
                                                    opacity: 0,
                                                    y: 15,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    x: -45,
                                                    scale: 0.96,
                                                }}
                                                transition={{
                                                    layout: {
                                                        duration: 0.35,
                                                        ease: "easeInOut",
                                                    },
                                                    opacity: {
                                                        duration: 0.25,
                                                    },
                                                    x: {
                                                        duration: 0.3,
                                                        ease: "easeInOut",
                                                    },
                                                    scale: {
                                                        duration: 0.3,
                                                    },
                                                }}
                                                className={`py-5 ${
                                                    index !== 0
                                                        ? "border-t border-gray-100"
                                                        : ""
                                                }`}
                                            >
                                                {/* =================================================
                                                    DESKTOP PRODUCT
                                                ================================================= */}

                                                <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_90px_140px_90px_35px] md:items-center md:gap-4">
                                                    {/* PRODUCT */}

                                                    <div className="flex min-w-0 gap-4">
                                                        <motion.div
                                                            layout
                                                            className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100"
                                                        >
                                                            <img
                                                                src={
                                                                    item.image
                                                                }
                                                                alt={
                                                                    item.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </motion.div>

                                                        <div className="min-w-0 py-1">
                                                            <h2 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                                                {
                                                                    item.name
                                                                }
                                                            </h2>

                                                            {/* SIZE / COLOR */}

                                                            <div className="mt-2 space-y-1 text-xs text-gray-500">
                                                                {item.size && (
                                                                    <p>
                                                                        Size:{" "}
                                                                        <span className="font-medium text-gray-700">
                                                                            {
                                                                                item.size
                                                                            }
                                                                        </span>
                                                                    </p>
                                                                )}

                                                                {item.color && (
                                                                    <p>
                                                                        Color:{" "}
                                                                        <span className="font-medium text-gray-700">
                                                                            {
                                                                                item.color
                                                                            }
                                                                        </span>
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* STOCK */}

                                                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                                In Stock
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* PRICE */}

                                                    <div className="text-center text-sm font-medium text-gray-900">
                                                        ৳
                                                        {item.price.toLocaleString()}
                                                    </div>

                                                    {/* QUANTITY */}

                                                    <div className="flex justify-center">
                                                        <QuantityControl
                                                            quantity={
                                                                item.quantity
                                                            }
                                                            onDecrease={() =>
                                                                handleQuantityChange(
                                                                    item,
                                                                    item.quantity -
                                                                        1,
                                                                )
                                                            }
                                                            onIncrease={() =>
                                                                handleQuantityChange(
                                                                    item,
                                                                    item.quantity +
                                                                        1,
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {/* TOTAL */}

                                                    <motion.div
                                                        key={`${itemKey}-${itemTotal}`}
                                                        initial={{
                                                            opacity: 0.5,
                                                            scale: 0.9,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            scale: 1,
                                                        }}
                                                        className="text-center text-sm font-bold text-gray-900"
                                                    >
                                                        ৳
                                                        {itemTotal.toLocaleString()}
                                                    </motion.div>

                                                    {/* REMOVE */}

                                                    <RemoveButton
                                                        item={item}
                                                        onRemove={
                                                            handleRemove
                                                        }
                                                    />
                                                </div>

                                                {/* =================================================
                                                    MOBILE PRODUCT
                                                ================================================= */}

                                                <div className="flex gap-3 md:hidden">
                                                    {/* IMAGE */}

                                                    <motion.div
                                                        layout
                                                        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100"
                                                    >
                                                        <img
                                                            src={
                                                                item.image
                                                            }
                                                            alt={
                                                                item.name
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </motion.div>

                                                    {/* DETAILS */}

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h2 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                                                {
                                                                    item.name
                                                                }
                                                            </h2>

                                                            <RemoveButton
                                                                item={
                                                                    item
                                                                }
                                                                onRemove={
                                                                    handleRemove
                                                                }
                                                            />
                                                        </div>

                                                        {/* SIZE / COLOR */}

                                                        <div className="mt-1.5 space-y-0.5 text-xs text-gray-500">
                                                            {item.size && (
                                                                <p>
                                                                    Size:{" "}
                                                                    <span className="font-medium text-gray-700">
                                                                        {
                                                                            item.size
                                                                        }
                                                                    </span>
                                                                </p>
                                                            )}

                                                            {item.color && (
                                                                <p>
                                                                    Color:{" "}
                                                                    <span className="font-medium text-gray-700">
                                                                        {
                                                                            item.color
                                                                        }
                                                                    </span>
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* PRICE */}

                                                        <motion.p
                                                            key={`${itemKey}-${item.price}`}
                                                            initial={{
                                                                opacity: 0,
                                                                y: -4,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            className="mt-2 text-sm font-semibold text-gray-900"
                                                        >
                                                            ৳
                                                            {item.price.toLocaleString()}
                                                        </motion.p>

                                                        {/* QUANTITY / TOTAL */}

                                                        <div className="mt-3 flex items-center justify-between">
                                                            <QuantityControl
                                                                quantity={
                                                                    item.quantity
                                                                }
                                                                onDecrease={() =>
                                                                    handleQuantityChange(
                                                                        item,
                                                                        item.quantity -
                                                                            1,
                                                                    )
                                                                }
                                                                onIncrease={() =>
                                                                    handleQuantityChange(
                                                                        item,
                                                                        item.quantity +
                                                                            1,
                                                                    )
                                                                }
                                                            />

                                                            <div className="text-right">
                                                                <p className="text-[11px] text-gray-400">
                                                                    Total
                                                                </p>

                                                                <motion.p
                                                                    key={`${itemKey}-mobile-${itemTotal}`}
                                                                    initial={{
                                                                        opacity: 0.5,
                                                                        scale: 0.9,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        scale: 1,
                                                                    }}
                                                                    className="text-sm font-bold text-gray-900"
                                                                >
                                                                    ৳
                                                                    {itemTotal.toLocaleString()}
                                                                </motion.p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    },
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.section>

                    {/* =================================================
                        ORDER SUMMARY
                    ================================================= */}

                    <motion.aside
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            delay: 0.15,
                        }}
                        className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24"
                    >
                        <h2 className="text-xl font-bold text-gray-900">
                            Order Summary
                        </h2>

                        {/* SUMMARY */}

                        <div className="mt-6 space-y-4">
                            {/* SUBTOTAL */}

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    Subtotal ({itemCount}{" "}
                                    {itemCount === 1
                                        ? "item"
                                        : "items"})
                                </span>

                                <motion.span
                                    key={subtotal}
                                    initial={{
                                        opacity: 0.5,
                                        y: -4,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    className="font-semibold text-gray-900"
                                >
                                    ৳
                                    {subtotal.toLocaleString()}
                                </motion.span>
                            </div>

                            {/* DISCOUNT */}

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    Discount
                                </span>

                                <span className="font-semibold text-green-600">
                                    {discount > 0
                                        ? `- ৳${discount.toLocaleString()}`
                                        : "—"}
                                </span>
                            </div>

                            {/* DIVIDER */}

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold text-gray-900">
                                        Total
                                    </span>

                                    <motion.span
                                        key={total}
                                        initial={{
                                            opacity: 0.5,
                                            scale: 0.95,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                        }}
                                        className="text-2xl font-bold text-gray-900"
                                    >
                                        ৳
                                        {total.toLocaleString()}
                                    </motion.span>
                                </div>
                            </div>
                        </div>

                        {/* CHECKOUT */}

                        <Link
                            href="/checkout"
                            className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                            Proceed to Checkout

                            <ArrowRight
                                size={18}
                                className="ml-2"
                            />
                        </Link>

                        {/* SECURE CHECKOUT */}

                        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <ShieldCheck size={16} />

                            <span>
                                Secure and safe checkout
                            </span>
                        </div>
                    </motion.aside>
                </div>

                {/* =================================================
                    RECOMMENDED PRODUCTS
                ================================================= */}

                {recommendedProducts.length > 0 && (
                    <motion.section
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            delay: 0.2,
                        }}
                        className="mt-10"
                    >
                        <h2 className="text-xl font-bold text-gray-900">
                            You May Also Like
                        </h2>

                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {recommendedProducts.map(
                                (product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{
                                            opacity: 0,
                                            y: 15,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            delay:
                                                0.25 +
                                                index * 0.06,
                                        }}
                                        whileHover={{
                                            y: -4,
                                        }}
                                        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                                    >
                                        <Link
                                            href={`/shop/${product.slug}`}
                                        >
                                            <div className="aspect-square overflow-hidden bg-gray-100">
                                                <Image
                                                    src={
                                                        product.images[0]
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    width={500}
                                                    height={500}
                                                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                                />
                                            </div>

                                            <div className="p-3">
                                                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                                    {
                                                        product.name
                                                    }
                                                </h3>

                                                <p className="mt-2 text-sm font-bold text-gray-900">
                                                    ৳
                                                    {(
                                                        product.salePrice ??
                                                        product.regularPrice
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ),
                            )}
                        </div>
                    </motion.section>
                )}
            </div>
        </main>
    );
}

// =============================================================
// REMOVE BUTTON
// =============================================================

interface RemoveButtonProps {
    item: CartItem;
    onRemove: (item: CartItem) => void;
}

function RemoveButton({
    item,
    onRemove,
}: RemoveButtonProps) {
    return (
        <motion.button
            type="button"
            onClick={() => onRemove(item)}
            aria-label={`Remove ${item.name}`}
            whileHover={{
                scale: 1.08,
            }}
            whileTap={{
                scale: 0.88,
            }}
            transition={{
                duration: 0.15,
            }}
            className="mx-auto flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
        >
            <Trash2 size={17} />
        </motion.button>
    );
}

// =============================================================
// QUANTITY CONTROL
// =============================================================

interface QuantityControlProps {
    quantity: number;
    onDecrease: () => void;
    onIncrease: () => void;
}

function QuantityControl({
    quantity,
    onDecrease,
    onIncrease,
}: QuantityControlProps) {
    return (
        <div className="flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
            <motion.button
                type="button"
                onClick={onDecrease}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                whileTap={{
                    scale: 0.88,
                }}
                className="flex h-full w-9 cursor-pointer items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <Minus size={14} />
            </motion.button>

            <AnimatePresence
                initial={false}
                mode="popLayout"
            >
                <motion.span
                    key={quantity}
                    initial={{
                        opacity: 0,
                        y: -5,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        y: 5,
                    }}
                    transition={{
                        duration: 0.15,
                    }}
                    className="flex h-full min-w-9 items-center justify-center border-x border-gray-200 px-2 text-sm font-semibold text-gray-900"
                >
                    {quantity}
                </motion.span>
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={onIncrease}
                aria-label="Increase quantity"
                whileTap={{
                    scale: 0.88,
                }}
                className="flex h-full w-9 cursor-pointer items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
            >
                <Plus size={14} />
            </motion.button>
        </div>
    );
}