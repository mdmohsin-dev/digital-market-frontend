"use client";

import { Heart, Menu, Search, ShoppingCart, Tag, User, X } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const pathname = usePathname();

    const cartCount = useCartCount();

    const { wishlistCount, isLoaded, } = useWishlist();

    const { isLoggedIn, isPending, } = useUserSession();

    // "/" only matches exactly; every other href matches itself or any nested route under it
    const isActive = (href:any) =>
        href === "/"
            ? pathname === "/"
            : pathname === href || pathname?.startsWith(`${href}/`);


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
            <header className="relative isolate z-30 mt-8 w-full bg-white">

                <div
                    className="
                        mx-auto grid max-w-350
                        grid-cols-[auto_minmax(0,1fr)_auto]
                        items-center gap-3
                        px-4 py-3
                        sm:gap-6
                        lg:grid-cols-[auto_minmax(0,1fr)_auto]
                        lg:gap-28
                        xl:gap-40
                        lg:py-4
                    "
                >


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


                    <ProductSearch
                        className="
                            hidden
                            w-full
                            lg:flex
                        "
                    />


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


                        <Link
                            href={
                                isLoggedIn
                                    ? "/dashboard"
                                    : "/login"
                            }
                            className={`
                                hidden
                                shrink-0
                                flex-col
                                items-center
                                gap-1
                                sm:flex
                                ${isActive(isLoggedIn ? "/dashboard" : "/login")
                                    ? "text-primary"
                                    : ""
                                }
                            `}
                        >
                            <LuUserRound
                                size={28}
                                className={
                                    isActive(isLoggedIn ? "/dashboard" : "/login")
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                }
                            />

                            <span
                                className={`
                                    text-xs
                                    font-semibold
                                    ${isActive(isLoggedIn ? "/dashboard" : "/login")
                                        ? "text-primary"
                                        : "text-foreground"
                                    }
                                `}
                            >
                                {isPending
                                    ? "Account"
                                    : isLoggedIn
                                        ? "My Account"
                                        : "Login"}
                            </span>
                        </Link>


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
                                <Heart
                                    size={28}
                                    className={
                                        isActive("/wishlist")
                                            ? "text-primary"
                                            : ""
                                    }
                                />

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

                                <span
                                    className={`
                                        text-xs
                                        font-semibold
                                        ${isActive("/wishlist")
                                            ? "text-primary"
                                            : "text-foreground"
                                        }
                                    `}
                                >
                                    Wishlist
                                </span>
                            </Link>
                        </div>

                        <div className="hidden md:block">
                            <CartSidebar
                                open={cartOpen}
                                onOpenChange={setCartOpen}
                                cartCount={cartCount}
                            />
                        </div>


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


                <div className="sticky top-10">
                    <div className="
                            relative
                            z-20
                            hidden
                            border-t
                            border-gray-300
                            bg-[#041F1E]
                            text-white
                            lg:block
                        "
                    >
                        <nav className="
                                mx-auto
                                flex
                                max-w-350
                                items-center
                                gap-16
                                px-4
                                py-3">

                            <ul className="
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
                                            aria-current={
                                                isActive(item.href)
                                                    ? "page"
                                                    : undefined
                                            }
                                            className={`
                                                flex
                                                items-center
                                                gap-1
                                                whitespace-nowrap
                                                text-sm
                                                font-medium
                                                transition-colors
                                                hover:text-primary
                                                ${isActive(item.href)
                                                    ? "text-primary"
                                                    : "text-foreground"
                                                }
                                            `}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>


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
                                        aria-current={
                                            isActive(item.href)
                                                ? "page"
                                                : undefined
                                        }
                                        className={`
                                            flex
                                            items-center
                                            justify-between
                                            py-3
                                            text-sm
                                            font-medium
                                            transition-colors
                                            hover:text-primary
                                            ${isActive(item.href)
                                                ? "text-primary"
                                                : "text-foreground"
                                            }
                                        `}
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
                    aria-current={isActive("/") ? "page" : undefined}
                    className={`
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-center
                        justify-center
                        gap-0.5
                        text-white
                        ${isActive("/")
                            ? "font-bold underline underline-offset-4"
                            : "opacity-80"
                        }
                    `}
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
                    aria-current={isActive("/wishlist") ? "page" : undefined}
                    className={`
                        relative
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-center
                        justify-center
                        gap-0.5
                        text-white
                        ${isActive("/wishlist")
                            ? "font-bold underline underline-offset-4"
                            : "opacity-80"
                        }
                    `}
                >
                    <Heart size={20} />

                    {isLoaded &&
                        wishlistCount > 0 && (
                            <span
                                className="absolute top-1 left-1/2 ml-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white ">
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
                            className="absolute top-1 left-1/2 ml-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
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
                    className={`
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-center
                        justify-center
                        gap-0.5
                        text-white
                        ${mobileSearchOpen
                            ? "font-bold underline underline-offset-4"
                            : "opacity-80"
                        }
                    `}
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
                            : "/login"}
                    aria-current={
                        isActive(isLoggedIn ? "/dashboard" : "/login")
                            ? "page"
                            : undefined
                    }
                    className={`
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-center
                        justify-center
                        gap-0.5
                        text-white
                        ${isActive(isLoggedIn ? "/dashboard" : "/login")
                            ? "font-bold underline underline-offset-4"
                            : "opacity-80"
                        }
                    `}
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