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
import { LuUserRound } from "react-icons/lu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/shop" },
  { label: "Flash Sale", href: "/flash-sale" },
  { label: "Contact Us", href: "/contact" },
];

function SearchBar({
  className = "",
  compact = false,
  onSubmit,
}: {
  className?: string;
  compact?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex h-11 items-center rounded-md border border-gray-300 bg-background focus-within:border-brand ${className}`}
      role="search"
    >
      {!compact && (
        <Search
          size={18}
          className="ml-3 shrink-0 text-muted-foreground"
        />
      )}

      <input
        type="search"
        placeholder="Search for products..."
        aria-label="Search for products"
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />

      {compact ? (
        <button
          type="submit"
          aria-label="Search"
          className="m-1 inline-flex h-9 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Search size={18} />
        </button>
      ) : (
        <button
          type="submit"
          className="m-1 inline-flex h-9 shrink-0 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Search
        </button>
      )}
    </form>
  );
}

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  // Mobile search state
  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);

  const {
    wishlistCount,
    isLoaded,
  } = useWishlist();


  // CART COUNT 

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

  // MOBILE SEARCH BODY SCROLL CONTROL

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

  // MOBILE MENU BODY SCROLL CONTROL

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

  // CLOSE MOBILE SEARCH + MENU ON DESKTOP

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
        handleResize,
      );
    };
  }, []);

  return (
    <>

      <header className="relative z-30 mt-8 w-full bg-white">

        {/* TOP BAR */}

        <div
          className="
                        mx-auto grid max-w-350
                        grid-cols-[auto_minmax(0,1fr)_auto]
                        items-center gap-3
                        px-4 py-3
                        sm:gap-10
                        lg:grid-cols-[auto_minmax(0,1fr)_auto]
                        lg:gap-32
                        lg:py-4
                    "
        >

          {/* LOGO */}

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

          <SearchBar
            compact
            className="
                            hidden
                            sm:flex
                            lg:hidden
                            w-full
                            max-w-75
                            justify-self-center
                            md:max-w-100
                        "
          />

          <SearchBar className="hidden lg:flex w-full" />


          <div className="flex min-w-0 items-center justify-end gap-4 sm:gap-6">
            <Link
              href="/login"
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
                Login
              </span>
            </Link>

            <div className="hidden items-center gap-6 sm:flex">
              <Link
                href="/wishlist"
                className="relative flex flex-col items-center gap-1"
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
            <div className="hidden md:block">
              <CartSidebar
                open={cartOpen}
                onOpenChange={setCartOpen}
                cartCount={cartCount}
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setOpen((v) => !v)
              }
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
                      className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-foreground transition-colors hover:text-brand">
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

      </header>
      <div
        className={`
                    fixed
                    inset-x-0
                    top-0
                    z-[999]
                    lg:hidden
                    transition-all
                    duration-300
                    ease-out
                    ${mobileSearchOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
          }
                `}
      >
        {/* Search panel */}

        <div className="mx-auto w-full max-w-110 bg-white shadow-xl">

          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">

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

          <div className="px-4 py-3">
            <SearchBar
              compact
              className="w-full"
              onSubmit={() =>
                setMobileSearchOpen(false)
              }
            />
          </div>
        </div>
      </div>

      {/* 
                MOBILE SEARCH BACKDROP (moved outside <header>)
             */}

      <div
        onClick={() =>
          setMobileSearchOpen(false)
        }
        className={`
                    fixed
                    inset-0
                    z-[998]
                    bg-black/50
                    lg:hidden
                    transition-opacity
                    duration-300
                    ${mobileSearchOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"}  `}
      />


      <div
        className={`
                    fixed
                    inset-x-0
                    top-0
                    z-[999]
                    lg:hidden
                    transition-all
                    duration-300
                    ease-out
                    ${open
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
          }
                `}
      >
        <div className="mx-auto w-full bg-white shadow-xl">

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
                className=" flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100">
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
                    className="flex  items-center  justify-between  py-3  text-sm  font-medium  text-foreground">
                    {item.label}
                  </Link>

                </li>
              ))}

            </ul>

          </nav>
        </div>
      </div>

      {/* 
                MOBILE MENU BACKDROP
             */}

      <div
        onClick={() =>
          setOpen(false)
        }
        className={`
                    fixed
                    inset-0
                    z-[998]
                    bg-black/50
                    lg:hidden
                    transition-opacity
                    duration-300
                    ${open
            ? "opacity-100"
            : "pointer-events-none opacity-0"
          }
                `}
      />

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-15 items-center justify-around bg-primary md:hidden
                "
      >

        {/* 
                    HOME
                 */}

        <Link
          href="/"
          className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-white ">
          <span className="text-lg leading-none">
            ⌂
          </span>

          <span className="text-[10px] font-semibold uppercase">
            Home
          </span>
        </Link>
        

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

          {isLoaded && wishlistCount > 0 && (
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

        {/* 
                    CART
                 */}

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
              className="absolute  top-1  left-1/2  ml-2  flex  h-4  min-w-4  items-center  justify-center  rounded-full bg-black  px-1  text-[9px]  font-semibold  text-white">
              {cartCount > 99
                ? "99+"
                : cartCount}
            </span>
          )}

          <span className="text-[10px] font-semibold uppercase">
            Cart
          </span>
        </button>

        {/* 
                    SEARCH
                 */}

        <button
          type="button"
          onClick={() =>
            setMobileSearchOpen(true)
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
          <Search size={20} />

          <span className="text-[10px] font-semibold uppercase">
            Search
          </span>
        </button>

        {/* ACCOUNT */}

        <Link
          href="/login"
          className=" flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-white">
          <User size={20} />

          <span className="text-[10px] font-semibold uppercase">
            Account
          </span>
        </Link>

      </nav>
    </>
  );
}