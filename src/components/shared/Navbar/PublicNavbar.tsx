"use client";

import {
    Heart,
    Menu,
    Search,
    ShoppingCart,
    Tag,
    User,
    X,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useWishlist } from "@/hooks/useWishlist";

import brandLogo from "@/assets/Images/brandLogo.png";
import Image from "next/image";

import {
    getCartCount,
    CART_UPDATED_EVENT,
} from "@/lib/cart";
import CartSidebar from "../CartSidebar";


const navItems = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/shop" },
    { label: "Flash Sale", href: "/flash-sale" },
    { label: "Contact Us", href: "/contact" },
];

function SearchBar({
    className = "",
}: {
    className?: string;
}) {
    return (
        <form
            className={`flex h-11 items-center rounded-md border border-gray-300 bg-background focus-within:border-brand ${className}`}
            role="search"
        >
            <Search
                size={18}
                className="ml-3 shrink-0 text-muted-foreground"
            />

            <input
                type="search"
                placeholder="Search for products..."
                aria-label="Search for products"
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            <button
                type="submit"
                className="m-1 inline-flex h-9 shrink-0 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
                Search
            </button>
        </form>
    );
}

export default function PublicNavbar() {
    const [open, setOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cartOpen, setCartOpen] = useState(false);

    const {
        wishlistCount,
        isLoaded,
    } = useWishlist();

    // =========================================================
    // CART COUNT
    // =========================================================

    useEffect(() => {
        const updateCartCount = () => {
            setCartCount(getCartCount());
        };

        updateCartCount();

        window.addEventListener(
            CART_UPDATED_EVENT,
            updateCartCount,
        );

        window.addEventListener(
            "storage",
            updateCartCount,
        );

        return () => {
            window.removeEventListener(
                CART_UPDATED_EVENT,
                updateCartCount,
            );

            window.removeEventListener(
                "storage",
                updateCartCount,
            );
        };
    }, []);

    return (
        <>
            <header className="relative isolate z-30 mt-8 w-full bg-white">
                {/* =================================================
                    TOP BAR
                ================================================= */}

                <div className="mx-auto grid max-w-350 grid-cols-[auto_minmax(0,1fr)] items-center gap-4 px-4 py-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-24 lg:py-4">

                    {/* LOGO */}

                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-2"
                    >
                        <Image
                            width={160}
                            height={160}
                            alt="kalni"
                            src={brandLogo}
                        />
                    </Link>

                    {/* SEARCH - DESKTOP */}

                    <SearchBar className="hidden lg:flex" />

                    {/* ACTIONS */}

                    <div className="flex min-w-0 items-center justify-end gap-4 sm:gap-6">

                        {/* LOGIN */}

                        <Link
                            href="/login"
                            className="hidden shrink-0 flex-col items-center gap-1 sm:flex"
                        >
                            <User
                                size={22}
                                className="text-muted-foreground"
                            />

                            <span className="text-xs font-semibold text-foreground">
                                Login
                            </span>
                        </Link>

                        {/* WISHLIST */}
                        <div className="hidden shrink-0 items-center gap-6 sm:flex">
                            <Link
                                href="/wishlist"
                                className="relative flex flex-col items-center gap-1"
                            >
                                <Heart className="h-5 w-5" />

                                {isLoaded &&
                                    wishlistCount > 0 && (
                                        <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">
                                            {wishlistCount > 99
                                                ? "99+"
                                                : wishlistCount}
                                        </span>
                                    )}

                                <span className="text-xs font-semibold text-foreground">
                                    Wishlist
                                </span>
                            </Link>
                        </div>

                        {/* =================================================
                            CART DRAWER
                        ================================================= */}

                        <CartSidebar
                            open={cartOpen}
                            onOpenChange={setCartOpen}
                            cartCount={cartCount}
                        />

                        {/* MOBILE MENU */}

                        <button
                            type="button"
                            onClick={() =>
                                setOpen((v) => !v)
                            }
                            aria-label="Toggle menu"
                            aria-expanded={open}
                            className="shrink-0 text-foreground lg:hidden"
                        >
                            {open ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {/* SEARCH - MOBILE */}

                <div className="mx-auto max-w-350 px-4 pb-3 lg:hidden">
                    <SearchBar className="w-full" />
                </div>

                {/* =================================================
                    BOTTOM NAV - DESKTOP
                ================================================= */}

                <div className="sticky top-10">
                    <div className="relative z-20 hidden border-t border-gray-300 lg:block">
                        <nav className="mx-auto flex max-w-350 items-center gap-16 px-4 py-3">
                            <ul className="flex w-full items-center justify-between">
                                {navItems.map((item) => (
                                    <li
                                        key={item.label}
                                        className="relative z-0"
                                    >
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-foreground transition-colors hover:text-brand"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-foreground">
                                <Tag
                                    size={16}
                                    className="text-badge"
                                />
                                $20 Off Your First Order
                            </div>
                        </nav>
                    </div>
                </div>

                {/* =================================================
                    MOBILE MENU
                ================================================= */}

                {open && (
                    <div className="relative z-20 border-t border-border lg:hidden">
                        <nav className="mx-auto max-w-350 px-4 py-3">

                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-semibold text-foreground">
                                    Menu
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(false)
                                    }
                                    aria-label="Close menu"
                                    className="text-muted-foreground"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <ul>
                                {navItems.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            onClick={() =>
                                                setOpen(false)
                                            }
                                            className="flex items-center justify-between py-3 text-sm font-medium text-foreground"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/login"
                                onClick={() =>
                                    setOpen(false)
                                }
                                className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground sm:hidden"
                            >
                                <User
                                    size={18}
                                    className="text-muted-foreground"
                                />

                                Login / Account
                            </Link>

                            {/* MOBILE CART */}

                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    setCartOpen(true);
                                }}
                                className="mt-4 flex w-full items-center gap-2 text-left text-sm font-medium text-foreground"
                            >
                                <ShoppingCart
                                    size={18}
                                    className="text-muted-foreground"
                                />

                                Cart

                                {cartCount > 0 && (
                                    <span className="rounded-full bg-badge px-2 py-0.5 text-[10px] font-semibold text-badge-foreground">
                                        {cartCount > 99
                                            ? "99+"
                                            : cartCount}
                                    </span>
                                )}
                            </button>

                            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                                <Tag
                                    size={16}
                                    className="text-badge"
                                />

                                $20 Off Your First Order
                            </div>
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}