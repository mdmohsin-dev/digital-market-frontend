"use client";

import {
    Minus,
    Plus,
    ShoppingCart,
    X,
} from "lucide-react";

import Link from "next/link";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import {
    getCart,
    removeFromCart,
    updateCartItemQuantity,
    CART_UPDATED_EVENT,
    type CartItem,
} from "@/lib/cart";

import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { BsArrowRight } from "react-icons/bs";

interface CartSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cartCount: number;
}

export default function CartSidebar({
    open,
    onOpenChange,
    cartCount,
}: CartSidebarProps) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const loadCart = () => {
        setCart(getCart());
    };

    useEffect(() => {
        loadCart();

        const handleCartUpdate = () => {
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

    useEffect(() => {
        if (open) {
            loadCart();
        }
    }, [open]);

    const handleQuantityChange = (
        item: CartItem,
        quantity: number,
    ) => {
        updateCartItemQuantity(
            item.productId,
            item.size,
            item.color,
            quantity,
        );

        loadCart();
    };

    const handleRemove = (item: CartItem) => {
        removeFromCart(
            item.productId,
            item.size,
            item.color,
        );

        loadCart();
    };

    const totalPrice = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0,
    );

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            swipeDirection="right"
        >
            {/* =================================================
                CART TRIGGER
            ================================================= */}

            <DrawerTrigger>
                <button
                    type="button"
                    aria-label={`Cart${cartCount > 0
                        ? `, ${cartCount} items`
                        : ""
                        }`}
                    className="relative cursor-pointer flex shrink-0 flex-col items-center gap-1 text-foreground transition-colors hover:text-brand"
                >
                    <div className="relative">
                        <ShoppingCart size={22} />

                        {cartCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-badge px-1 text-[10px] font-semibold text-badge-foreground">
                                {cartCount > 99
                                    ? "99+"
                                    : cartCount}
                            </span>
                        )}
                    </div>

                    <span className="text-xs font-semibold text-foreground">
                        Cart
                    </span>
                </button>
            </DrawerTrigger>

            {/* =================================================
                DRAWER
            ================================================= */}

            <DrawerContent className="h-full w-full max-w-md border-l bg-white">

                {/* HEADER */}

                <DrawerHeader className="border-b py-4">
                    <div className="flex items-center justify-between">
                        <DrawerTitle className="text-lg font-semibold">
                            Your Cart
                        </DrawerTitle>

                        <DrawerClose >
                            <button
                                type="button"
                                aria-label="Close cart"
                                className="rounded-md flex items-center gap-2 text-red-500 cursor-pointer transition">
                                    Close
                                <BsArrowRight size={24} />
                            </button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                {/* =================================================
                    CART ITEMS
                ================================================= */}

                <div className="flex-1 overflow-y-auto px-4 py-4">

                    {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">

                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <ShoppingCart
                                    size={28}
                                    className="text-gray-400"
                                />
                            </div>

                            <h3 className="text-base font-semibold">
                                Your cart is empty
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Add some products to your cart
                                and they will appear here.
                            </p>

                            <DrawerClose >
                                <Link
                                    href="/shop"
                                    className="mt-5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                                >
                                    Continue Shopping
                                </Link>
                            </DrawerClose>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div
                                    key={`${item.productId}-${item.size}-${item.color}`}
                                    className="relative rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                                >
                                    <div className="flex gap-3">

                                        {/* IMAGE */}

                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        {/* DETAILS */}

                                        <div className="min-w-0 flex-1">

                                            <div className="pr-7">
                                                <h3 className="truncate text-sm font-medium text-gray-900">
                                                    {item.name}
                                                </h3>
                                            </div>

                                            <div className="mt-1 text-xs text-gray-500">
                                                Size:{" "}
                                                <span className="font-medium text-gray-700">
                                                    {item.size}
                                                </span>
                                            </div>

                                            <div className="mt-0.5 text-xs text-gray-500">
                                                Color:{" "}
                                                <span className="font-medium text-gray-700">
                                                    {item.color}
                                                </span>
                                            </div>

                                            {/* QUANTITY */}

                                            <div className="mt-3 flex items-center gap-3 font-semibold">

                                                <div className="flex items-center rounded-xl px-3 border gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item,
                                                                item.quantity - 1,
                                                            )
                                                        }
                                                        className="flex items-center justify-center text-gray-600 transition hover:text-black"
                                                    >
                                                        <Minus size={14} />
                                                    </button>

                                                    <span className="flex border-x px-2 justify-center text-sm font-medium">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item,
                                                                item.quantity + 1,
                                                            )
                                                        }
                                                        className="flex items-center justify-center text-black transition hover:text-black"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center">
                                                    <IoIosClose size={25} />
                                                    <p>{item.price}</p>
                                                </div>

                                                <span>
                                                    = ৳
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* REMOVE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemove(item)
                                            }
                                            aria-label={`Remove ${item.name}`}
                                            className="absolute right-3 top-3 text-gray-400 transition hover:text-red-500"
                                        >
                                            <X size={19} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* =================================================
                    FOOTER / CHECKOUT
                ================================================= */}

                {cart.length > 0 && (
                    <DrawerFooter className="border-t bg-white p-4">

                        <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Subtotal
                            </span>

                            <span className="text-lg font-bold text-gray-900">
                                ৳
                                {totalPrice.toLocaleString()}
                            </span>
                        </div>

                        <p className="mb-2 text-xs text-gray-500">
                            Shipping and taxes will be calculated
                            at checkout.
                        </p>

                        <Link
                            href="/checkout"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            className="flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                            Checkout
                        </Link>

                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
}