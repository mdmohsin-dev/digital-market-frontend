"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
    ChevronDown, Heart, Menu, Search, ShoppingCart, Tag, User, X,
} from "lucide-react";

import brandLogo from "@/assets/Images/brandLogo.png";
import Image from "next/image";

const navItems = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/shop" },
    { label: "Product section", href: "/products" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "Contact Us", href: "/contact" },
];

const categoryItems = [
    { label: "Electronics", href: "/categories/electronics" },
    { label: "Fashion", href: "/categories/fashion" },
    { label: "Home & Living", href: "/categories/home-living" },
    { label: "Beauty & Health", href: "/categories/beauty-health" },
    { label: "Sports & Outdoors", href: "/categories/sports-outdoors" },
    { label: "Toys & Kids", href: "/categories/toys-kids" },
    { label: "Groceries", href: "/categories/groceries" },
    { label: "Automotive", href: "/categories/automotive" },
];

function IconWithCount({
    children,
    count,
    label,
}: {
    children: React.ReactNode;
    count: number;
    label: string;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            className="relative shrink-0 text-foreground transition-colors hover:text-brand"
        >
            {children}
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-badge text-[10px] font-semibold text-badge-foreground">
                {count}
            </span>
        </button>
    );
}

function SearchBar({ className = "" }: { className?: string }) {
    return (
        <form
            className={`flex h-11 items-center rounded-md border border-gray-300 bg-background focus-within:border-brand ${className}`}
            role="search"
        >
            <Search size={18} className="ml-3 shrink-0 text-muted-foreground" />
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
    const [catOpen, setCatOpen] = useState(false);

    // Timeout ref so we can debounce the close – this is what stops the
    // dropdown from disappearing the instant the cursor leaves the button
    // while it's travelling down toward the menu.
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openCategories = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setCatOpen(true);
    };

    const scheduleCloseCategories = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(() => {
            setCatOpen(false);
        }, 150);
    };

    return (
        // relative + isolate => this header gets its own stacking context,
        // so the dropdown's z-index is always compared against its own
        // siblings only, never fighting with unrelated z-index values
        // elsewhere on the page.
        <header className="relative  isolate z-30 w-full mt-8 bg-background">
            {/* Top bar */}
            <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)] items-center gap-4 px-4 py-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-24 lg:py-4">
                {/* Logo */}
                <Link href="/" className="flex shrink-0 items-center gap-2">
                   <Image width={160} height={160} alt="kalni" src={brandLogo}/>
                </Link>

                {/* Search (desktop) */}
                <SearchBar className="hidden lg:flex" />

                {/* Actions */}
                <div className="flex min-w-0 items-center justify-end gap-4 sm:gap-6">
                    <Link
                        href="/login"
                        className="hidden shrink-0 items-center gap-2 sm:flex"
                    >
                        <User size={22} className="text-muted-foreground" />
                    </Link>

                    <div className="hidden shrink-0 items-center gap-6 sm:flex">
                        <IconWithCount count={0} label="Wishlist">
                            <Heart size={22} />
                        </IconWithCount>
                        
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <IconWithCount count={0} label="Cart">
                            <ShoppingCart size={22} />
                        </IconWithCount>
                        <span className="hidden leading-tight md:block">
                            <span className="block text-xs text-muted-foreground">
                                Your Cart
                            </span>
                            <span className="block text-sm font-semibold text-foreground">
                                $0.00
                            </span>
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Toggle menu"
                        aria-expanded={open}
                        className="shrink-0 text-foreground lg:hidden"
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Search (mobile) */}
            <div className="mx-auto max-w-7xl px-4 pb-3 lg:hidden">
                <SearchBar className="w-full" />
            </div>

            {/* Bottom nav (desktop) */}
            <div className="sticky top-10">
                <div className="relative  z-20 hidden border-t border-gray-300 lg:block">
                <nav className="mx-auto flex max-w-7xl items-center gap-16 px-4 py-3">
                    <ul className="flex w-full items-center justify-between">
                        {/* All Categories dropdown */}
                        <li
                            className="relative z-20"
                            onMouseEnter={openCategories}
                            onMouseLeave={scheduleCloseCategories}
                        >
                            <button
                                type="button"
                                onClick={() => setCatOpen((v) => !v)}
                                aria-expanded={catOpen}
                                className="flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-brand"
                            >
                                All Categories
                                <ChevronDown
                                    size={14}
                                    className={`shrink-0 transition-transform ${catOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {catOpen && (
                                <div
                                    onMouseEnter={openCategories}
                                    onMouseLeave={scheduleCloseCategories}
                                    // No gap between button and panel: pt-2 (padding) instead of
                                    // mt-2 (margin) keeps the hoverable area continuous so the
                                    // cursor never leaves the li's hit area while moving down.
                                    // z-[100] (well above the other nav li's z-index) guarantees
                                    // this panel paints on top of "Home / Popular Categories / ..."
                                    className="absolute left-0 top-full bg-white z-[100] w-56 pt-2"
                                >
                                    <div className="rounded-lg bg-background p-2 shadow-lg ring-1 ring-border">
                                        <ul className="space-y-1">
                                            {categoryItems.map((cat) => (
                                                <li key={cat.label}>
                                                    <Link
                                                        href={cat.href}
                                                        className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-brand"
                                                    >
                                                        {cat.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </li>

                        {navItems.map((item) => (
                            <li key={item.label} className="relative z-0">
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
                        <Tag size={16} className="text-badge" />
                        $20 Off Your First Order
                    </div>
                </nav>
            </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="relative z-20 border-t border-border lg:hidden">
                    <nav className="mx-auto max-w-7xl px-4 py-3">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">
                                Menu
                            </span>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close menu"
                                className="text-muted-foreground"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <ul className="">
                            {/* Mobile All Categories accordion */}
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setCatOpen((v) => !v)}
                                    aria-expanded={catOpen}
                                    className="flex w-full items-center justify-between py-3 text-sm font-semibold text-foreground"
                                >
                                    All Categories
                                    <ChevronDown
                                        size={16}
                                        className={`shrink-0 text-muted-foreground transition-transform ${catOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {catOpen && (
                                    <ul className="pb-2 pl-3">
                                        {categoryItems.map((cat) => (
                                            <li key={cat.label}>
                                                <Link
                                                    href={cat.href}
                                                    className="block py-2 text-sm text-muted-foreground transition-colors hover:text-brand"
                                                >
                                                    {cat.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>

                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-between py-3 text-sm font-medium text-foreground"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/login"
                            onClick={() => setOpen(false)}
                            className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground sm:hidden"
                        >
                            <User size={18} className="text-muted-foreground" /> Login /
                            Account
                        </Link>
                        <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Tag size={16} className="text-badge" />
                            $20 Off Your First Order
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}