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

import { useCartCount } from "@/hooks/useCartCount";
import { useUserSession } from "@/hooks/useUserSession";
import { useWishlist } from "@/hooks/useWishlist";

import brandLogo from "@/assets/Images/brandLogo.png";

import Image from "next/image";

import { LuUserRound } from "react-icons/lu";
import CartSidebar from "../CartSidebar";
import ProductSearch from "../ProductSearch";

const navItems = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "All Products",
        href: "/shop",
    },
    {
        label: "Flash Sale",
        href: "/flash-sale",
    },
    {
        label: "Contact Us",
        href: "/contact",
    },
];

export default function PublicNavbar() {
    const [open, setOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] =
        useState(false);

    // =========================================================
    // CART
    // =========================================================

    const cartCount = useCartCount();

    // =========================================================
    // WISHLIST
    // =========================================================

    const {
        wishlistCount,
        isLoaded,
    } = useWishlist();

    // =========================================================
    // USER SESSION
    // =========================================================

    const {
        isLoggedIn,
        isPending,
    } = useUserSession();

    // =========================================================
    // MOBILE SEARCH BODY SCROLL CONTROL
    // =========================================================

    useEffect(() => {
        if (mobileSearchOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileSearchOpen]);

    // =========================================================
    // MOBILE MENU BODY SCROLL CONTROL
    // =========================================================

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // =========================================================
    // CLOSE MOBILE SEARCH / MENU ON DESKTOP
    // =========================================================

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileSearchOpen(false);
                setOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);

    // =========================================================
    // HELPERS - TOGGLE MENU / SEARCH (MUTUALLY EXCLUSIVE)
    // =========================================================

    const toggleMenu = () => {
        setMobileSearchOpen(false);
        setOpen((value) => !value);
    };

    const openMobileSearch = () => {
        setOpen(false);
        setMobileSearchOpen(true);
    };

    return (
        <>
            {/* =====================================================
                HEADER
            ====================================================== */}

            <header className="relative isolate z-30 mt-8 w-full bg-white">
                {/* =================================================
                    TOP BAR
                ================================================= */}

                <div
                    className="
                        mx-auto grid max-w-350
                        grid-cols-[auto_minmax(0,1fr)_auto]
                        items-center gap-3
                        px-4 py-3
                        sm:gap-4
                        lg:grid-cols-[auto_minmax(0,1fr)_auto]
                        lg:gap-24
                        lg:py-4
                    "
                >
                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-2"
                    >
                        <Image
                            width={110}
                            height={110}
                            alt="kalni"
                            src={brandLogo}
                        />
                    </Link>

                    {/* =================================================
                        SEARCH - TABLET
                    ================================================= */}

                    <ProductSearch
                        className="
                            hidden
                            w-full
                            max-w-75
                            justify-self-center
                            sm:flex
                            lg:hidden
                            md:max-w-100
                        "
                    />

                    {/* =================================================
                        SEARCH - DESKTOP
                    ================================================= */}

                    <ProductSearch
                        className="
                            hidden
                            w-full
                            lg:flex
                        "
                    />

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            justify-end
                            gap-4
                            sm:gap-6
                        "
                    >
                        {/* =================================================
                            LOGIN / MY ACCOUNT
                        ================================================= */}

                        <Link
                            href={
                                isLoggedIn
                                    ? "/dashboard"
                                    : "/login"
                            }
                            className="
                                hidden
                                shrink-0
                                flex-col
                                items-center
                                gap-1
                                sm:flex
                            "
                        >
                            <LuUserRound
                                size={28}
                                className="text-muted-foreground"
                            />

                            <span className="text-xs font-semibold text-foreground">
                                {isPending
                                    ? "Account"
                                    : isLoggedIn
                                        ? "My Account"
                                        : "Login"}
                            </span>
                        </Link>

                        {/* =================================================
                            WISHLIST
                        ================================================= */}

                        <div className="hidden items-center gap-6 sm:flex">
                            <Link
                                href="/wishlist"
                                className="
                                    relative
                                    flex
                                    flex-col
                                    items-center
                                    gap-1
                                "
                            >
                                <Heart size={28} />

                                {isLoaded &&
                                    wishlistCount > 0 && (
                                        <span
                                            className="
                                                absolute
                                                -top-2
                                                right-1
                                                flex
                                                h-4
                                                min-w-4
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-badge
                                                px-1
                                                text-[10px]
                                                font-semibold
                                                text-badge-foreground
                                            "
                                        >
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
                            DESKTOP CART
                        ================================================= */}

                        <div className="hidden md:block">
                            <CartSidebar
                                open={cartOpen}
                                onOpenChange={setCartOpen}
                                cartCount={cartCount}
                            />
                        </div>

                        {/* =================================================
                            MOBILE MENU ICON
                        ================================================= */}

                        <button
                            type="button"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                            aria-expanded={open}
                            className="
                                shrink-0
                                text-foreground
                                lg:hidden
                            "
                        >
                            {open ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {/* =====================================================
                    DESKTOP BOTTOM NAV
                ====================================================== */}

                <div className="sticky top-10">
                    <div
                        className="
                            relative
                            z-20
                            hidden
                            border-t
                            border-gray-300
                            lg:block
                        "
                    >
                        <nav
                            className="
                                mx-auto
                                flex
                                max-w-350
                                items-center
                                gap-16
                                px-4
                                py-3
                            "
                        >
                            <ul
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                "
                            >
                                {navItems.map((item) => (
                                    <li
                                        key={item.label}
                                        className="relative z-0"
                                    >
                                        <Link
                                            href={item.href}
                                            className="
                                                flex
                                                items-center
                                                gap-1
                                                whitespace-nowrap
                                                text-sm
                                                font-medium
                                                text-foreground
                                                transition-colors
                                                hover:text-brand
                                            "
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div
                                className="
                                    ml-auto
                                    flex
                                    shrink-0
                                    items-center
                                    gap-2
                                    whitespace-nowrap
                                    text-sm
                                    font-semibold
                                    text-foreground
                                "
                            >
                                <Tag
                                    size={16}
                                    className="text-badge"
                                />

                                $20 Off Your First Order
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* =====================================================
                MOBILE SEARCH (rendered outside <header> so it isn't
                trapped by header's `isolate` stacking context — this
                is what let AnnouncementBar sit above it)
            ====================================================== */}

            <div
                className={`
                    fixed
                    inset-x-0
                    top-0
                    z-[100]
                    lg:hidden
                    transition-all
                    duration-500
                    ease-in-out
                    ${mobileSearchOpen
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-full pointer-events-none opacity-0"
                    }
                `}
            >
                <div
                    className="
                        mx-auto
                        w-full
                        max-w-110
                        bg-white
                        shadow-xl
                    "
                >
                    {/* SEARCH HEADER */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-gray-200
                            px-4
                            py-3
                        "
                    >
                        <span className="text-sm font-semibold text-foreground">
                            Search Products
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setMobileSearchOpen(false)
                            }
                            aria-label="Close search"
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                bg-red-50
                                text-red-500
                                transition-colors
                                hover:bg-red-100
                            "
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* PRODUCT SEARCH */}

                    <div className="px-4 py-3">
                        <ProductSearch className="w-full" />
                    </div>
                </div>
            </div>

            <div
                onClick={() => setMobileSearchOpen(false)}
                className={`
                    fixed
                    inset-0
                    z-[90]
                    bg-black/50
                    lg:hidden
                    transition-opacity
                    duration-500
                    ease-in-out
                    ${mobileSearchOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    }
                `}
            />

            {/* =====================================================
                MOBILE MENU (also outside <header>, same reason)
            ====================================================== */}

            <div
                className={`
                    fixed
                    inset-x-0
                    top-0
                    z-[100]
                    lg:hidden
                    transition-all
                    duration-500
                    ease-in-out
                    ${open
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-full pointer-events-none opacity-0"
                    }
                `}
            >
                <div
                    className="
                        mx-auto
                        w-full
                        bg-white
                        shadow-xl
                    "
                >
                    <nav
                        className="
                            mx-auto
                            max-w-350
                            px-4
                            py-3
                        "
                    >
                        <div
                            className="
                                mb-2
                                flex
                                items-center
                                justify-between
                                border-b
                                border-gray-200
                                pb-3
                            "
                        >
                            <span className="text-sm font-semibold text-foreground">
                                Menu
                            </span>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close menu"
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-50
                                    text-red-500
                                    transition-colors
                                    hover:bg-red-100
                                "
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
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            py-3
                                            text-sm
                                            font-medium
                                            text-foreground
                                        "
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            <div
                onClick={() => setOpen(false)}
                className={`
                    fixed
                    inset-0
                    z-[90]
                    bg-black/50
                    lg:hidden
                    transition-opacity
                    duration-500
                    ease-in-out
                    ${open
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    }
                `}
            />

            {/* =====================================================
                MOBILE BOTTOM NAVIGATION
            ====================================================== */}

            <nav className="
                    fixed
                    bottom-0
                    left-0
                    right-0
                    z-40
                    flex
                    h-15
                    items-center
                    justify-around
                    bg-primary
                    md:hidden
                "
            >
                {/* HOME */}

                <Link
                    href="/"
                    className="
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-center
                        justify-center
                        gap-0.5
                        text-white
                    "
                >
                    <span className="text-lg leading-none">
                        ⌂
                    </span>

                    <span className="text-[10px] font-semibold uppercase">
                        Home
                    </span>
                </Link>

                {/* WISHLIST */}

                <Link
                    href="/wishlist"
                    className="
                        relative
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-center
                        justify-center
                        gap-0.5
                        text-white
                    "
                >
                    <Heart size={20} />

                    {isLoaded &&
                        wishlistCount > 0 && (
                            <span
                                className="
                                    absolute
                                    top-1
                                    left-1/2
                                    ml-2
                                    flex
                                    h-4
                                    min-w-4
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-black
                                    px-1
                                    text-[9px]
                                    font-semibold
                                    text-white
                                "
                            >
                                {wishlistCount > 99
                                    ? "99+"
                                    : wishlistCount}
                            </span>
                        )}

                    <span className="text-[10px] font-semibold uppercase">
                        Wishlist
                    </span>
                </Link>

                {/* CART */}

                <button
                    type="button"
                    onClick={() =>
                        setCartOpen(true)
                    }
                    className="
                        relative
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-center
                        justify-center
                        gap-0.5
                        text-white
                    "
                >
                    <ShoppingCart size={20} />

                    {cartCount > 0 && (
                        <span
                            className="
                                absolute
                                top-1
                                left-1/2
                                ml-2
                                flex
                                h-4
                                min-w-4
                                items-center
                                justify-center
                                rounded-full
                                bg-black
                                px-1
                                text-[9px]
                                font-semibold
                                text-white
                            "
                        >
                            {cartCount > 99
                                ? "99+"
                                : cartCount}
                        </span>
                    )}

                    <span className="text-[10px] font-semibold uppercase">
                        Cart
                    </span>
                </button>

                {/* SEARCH */}

                <button
                    type="button"
                    onClick={openMobileSearch}
                    className="
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-center
                        justify-center
                        gap-0.5
                        text-white
                    "
                >
                    <Search size={20} />

                    <span className="text-[10px] font-semibold uppercase">
                        Search
                    </span>
                </button>

                {/* ACCOUNT */}

                <Link
                    href={
                        isLoggedIn
                            ? "/dashboard"
                            : "/login"
                    }
                    className="
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-center
                        justify-center
                        gap-0.5
                        text-white
                    "
                >
                    <User size={20} />

                    <span className="text-[10px] font-semibold uppercase">
                        {isPending
                            ? "Account"
                            : isLoggedIn
                                ? "Account"
                                : "Login"}
                    </span>
                </Link>
            </nav>
        </>
    );
}