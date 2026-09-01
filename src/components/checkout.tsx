"use client";

import {
    ArrowLeft,
    Check,
    CreditCard,
    Lock,
    MapPin,
    Minus,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Tag,
    Trash2,
    User,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import {
    getCart,
    removeFromCart,
    updateCartItemQuantity,
    type CartItem,
    CART_UPDATED_EVENT,
} from "@/lib/cart";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

/* =========================================================
   PAYMENT METHODS
========================================================= */

const paymentMethods = [
    {
        id: "cod",
        name: "Cash on Delivery",
        description:
            "Pay when you receive your order",
        icon: "cash",
    },
    {
        id: "bkash",
        name: "bKash",
        description:
            "Pay securely with bKash",
        icon: "bkash",
    },
    {
        id: "nagad",
        name: "Nagad",
        description:
            "Pay securely with Nagad",
        icon: "nagad",
    },
    {
        id: "card",
        name: "Card Payment",
        description:
            "Pay with Visa / Mastercard",
        icon: "card",
    },
];

/* =========================================================
   PAYMENT ICON
========================================================= */

function PaymentIcon({
    type,
}: {
    type: string;
}) {
    if (type === "cash") {
        return (
            <div className="flex h-10 w-12 items-center justify-center rounded-md border border-green-200 bg-green-50 text-green-600">
                <span className="text-lg font-bold">
                    ৳
                </span>
            </div>
        );
    }

    if (type === "bkash") {
        return (
            <div className="flex h-10 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
                <span className="text-sm font-bold text-pink-500">
                    bKash
                </span>
            </div>
        );
    }

    if (type === "nagad") {
        return (
            <div className="flex h-10 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
                <span className="text-sm font-bold text-orange-500">
                    Nagad
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-10 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
            <CreditCard
                size={23}
                className="text-gray-600"
            />
        </div>
    );
}

/* =========================================================
   CHECKOUT CLIENT
========================================================= */

export default function CheckoutClient() {
    /* =====================================================
       CART
    ===================================================== */

    const [cart, setCart] = useState<CartItem[]>(
        [],
    );

    /* =====================================================
       FORM
    ===================================================== */

    const [fullName, setFullName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [address, setAddress] =
        useState("");

    const [city, setCity] =
        useState("");

    const [postalCode, setPostalCode] =
        useState("");

    /* =====================================================
       PAYMENT
    ===================================================== */

    const [paymentMethod, setPaymentMethod] =
        useState("cod");

    /* =====================================================
       PROMO
    ===================================================== */

    const [promoCode, setPromoCode] =
        useState("");

    const [promoApplied, setPromoApplied] =
        useState(false);

    /* =====================================================
       CART LOAD
    ===================================================== */

    useEffect(() => {
        const loadCart = () => {
            setCart(getCart());
        };

        loadCart();

        window.addEventListener(
            CART_UPDATED_EVENT,
            loadCart,
        );

        window.addEventListener(
            "storage",
            loadCart,
        );

        return () => {
            window.removeEventListener(
                CART_UPDATED_EVENT,
                loadCart,
            );

            window.removeEventListener(
                "storage",
                loadCart,
            );
        };
    }, []);

    /* =====================================================
       SUBTOTAL
    ===================================================== */

    const subtotal = useMemo(() => {
        return cart.reduce(
            (total, item) =>
                total +
                item.price * item.quantity,
            0,
        );
    }, [cart]);

    /* =====================================================
       SHIPPING
    ===================================================== */

    const shipping = cart.length > 0 ? 80 : 0;

    /* =====================================================
       DISCOUNT
       
       এখন real coupon system নেই।
       Promo apply করলে শুধু UI state change হবে।
    ===================================================== */

    const discount = 0;

    /* =====================================================
       TOTAL
    ===================================================== */

    const total =
        subtotal + shipping - discount;

    /* =====================================================
       UPDATE QUANTITY
    ===================================================== */

    const handleIncrease = (
        item: CartItem,
    ) => {
        updateCartItemQuantity(
            item.productId,
            item.size,
            item.color,
            item.quantity + 1,
        );

        setCart(getCart());
    };

    const handleDecrease = (
        item: CartItem,
    ) => {
        if (item.quantity <= 1) {
            return;
        }

        updateCartItemQuantity(
            item.productId,
            item.size,
            item.color,
            item.quantity - 1,
        );

        setCart(getCart());
    };

    /* =====================================================
       REMOVE
    ===================================================== */

    const handleRemove = (
        item: CartItem,
    ) => {
        removeFromCart(
            item.productId,
            item.size,
            item.color,
        );

        setCart(getCart());
    };

    /* =====================================================
       PROMO
    ===================================================== */

    const handlePromo = () => {
        if (!promoCode.trim()) {
            return;
        }

        setPromoApplied(true);
    };

    /* =====================================================
       PLACE ORDER
    ===================================================== */

    const handlePlaceOrder = () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        if (!fullName.trim()) {
            alert("Please enter your full name.");
            return;
        }

        if (!email.trim()) {
            alert("Please enter your email.");
            return;
        }

        if (!phone.trim()) {
            alert(
                "Please enter your phone number.",
            );
            return;
        }

        if (!address.trim()) {
            alert(
                "Please enter your shipping address.",
            );
            return;
        }

        if (!city.trim()) {
            alert("Please enter your city.");
            return;
        }

        if (!postalCode.trim()) {
            alert(
                "Please enter your postal code.",
            );
            return;
        }

        alert(
            `Order ready to place using ${paymentMethod}.`,
        );
    };

    /* =====================================================
       EMPTY CART
    ===================================================== */

    if (cart.length === 0) {
        return (
            <main className="mx-auto flex min-h-[70vh] max-w-350 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center">
                    <ShoppingBag
                        size={48}
                        className="mx-auto text-gray-300"
                    />

                    <h1 className="mt-5 text-2xl font-semibold">
                        Your cart is empty
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Add some products before
                        proceeding to checkout.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        <ArrowLeft size={17} />
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <main className="mx-auto max-w-350 px-4 py-8 sm:px-6 lg:px-8">
            {/* =================================================
                BACK TO CART
            ================================================= */}

            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
                >
                    <ArrowLeft size={17} />
                    Back to Shopping
                </Link>
            </div>

            {/* =================================================
                CHECKOUT GRID
            ================================================= */}

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {/* =================================================
                        CONTACT INFORMATION
                    ================================================= */}

                    <section className="p-6 sm:p-7">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                <User
                                    size={19}
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">
                                    1. Contact Information
                                </h2>

                                <p className="text-sm text-gray-500">
                                    We&apos;ll use this to
                                    send your order
                                    updates
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {/* Full Name */}

                            <div>
                                <label className="mb-2 block text-sm text-gray-600">
                                    Full Name{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    value={fullName}
                                    onChange={(event) =>
                                        setFullName(
                                            event.target
                                                .value,
                                        )
                                    }
                                    type="text"
                                    placeholder="Your full name"
                                    className="h-12 w-full rounded-md border border-gray-300 px-4 text-sm outline-none transition focus:border-primary"
                                />
                            </div>

                            {/* Email */}

                            <div>
                                <label className="mb-2 block text-sm text-gray-600">
                                    Email Address{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target
                                                .value,
                                        )
                                    }
                                    type="email"
                                    placeholder="you@example.com"
                                    className="h-12 w-full rounded-md border border-gray-300 px-4 text-sm outline-none transition focus:border-primary"
                                />
                            </div>

                            {/* Phone */}

                            <div>
                                <label className="mb-2 block text-sm text-gray-600">
                                    Phone Number{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    value={phone}
                                    onChange={(event) =>
                                        setPhone(
                                            event.target
                                                .value,
                                        )
                                    }
                                    type="tel"
                                    placeholder="+880 1XXXXXXXXX"
                                    className="h-12 w-full rounded-md border border-gray-300 px-4 text-sm outline-none transition focus:border-primary"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-gray-200" />

                    {/* =================================================
                        SHIPPING ADDRESS
                    ================================================= */}

                    <section className="p-6 sm:p-7">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                <MapPin
                                    size={19}
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">
                                    2. Shipping Address
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Where should we deliver
                                    your order?
                                </p>
                            </div>
                        </div>

                        {/* Address */}

                        <div>
                            <label className="mb-2 block text-sm text-gray-600">
                                Address{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                value={address}
                                onChange={(event) =>
                                    setAddress(
                                        event.target
                                            .value,
                                    )
                                }
                                type="text"
                                placeholder="House, Road, Area"
                                className="h-12 w-full rounded-md border border-gray-300 px-4 text-sm outline-none transition focus:border-primary"
                            />
                        </div>

                        {/* City / Postal / Country */}

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm text-gray-600">
                                    City{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    value={city}
                                    onChange={(event) =>
                                        setCity(
                                            event.target
                                                .value,
                                        )
                                    }
                                    type="text"
                                    placeholder="Dhaka"
                                    className="h-12 w-full rounded-md border border-gray-300 px-4 text-sm outline-none transition focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-gray-600">
                                    Postal Code{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    value={postalCode}
                                    onChange={(event) =>
                                        setPostalCode(
                                            event.target
                                                .value,
                                        )
                                    }
                                    type="text"
                                    placeholder="1205"
                                    className="h-12 w-full rounded-md border border-gray-300 px-4 text-sm outline-none transition focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-gray-600">
                                    Country{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <select
                                    defaultValue="Bangladesh"
                                    className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-primary"
                                >
                                    <option>
                                        Bangladesh
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Save Address */}

                        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                className="h-4 w-4 accent-primary"
                            />

                            Save this address for
                            next time
                        </label>
                    </section>

                    <div className="border-t border-gray-200" />

                    {/* =================================================
                        PAYMENT
                    ================================================= */}

                    <section className="p-6 sm:p-7">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                <CreditCard
                                    size={19}
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">
                                    3. Payment Method
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Select your preferred
                                    payment option
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            {paymentMethods.map(
                                (method) => {
                                    const selected =
                                        paymentMethod ===
                                        method.id;

                                    return (
                                        <button
                                            key={
                                                method.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod(
                                                    method.id,
                                                )
                                            }
                                            className={`flex min-h-20 items-center gap-4 rounded-md border p-4 text-left transition ${
                                                selected
                                                    ? "border-primary bg-primary/5"
                                                    : "border-gray-200 hover:border-gray-400"
                                            }`}
                                        >
                                            {/* Radio */}

                                            <span
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                                    selected
                                                        ? "border-primary"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                {selected && (
                                                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                                                )}
                                            </span>

                                            {/* Icon */}

                                            <PaymentIcon
                                                type={
                                                    method.icon
                                                }
                                            />

                                            {/* Text */}

                                            <span className="min-w-0">
                                                <span className="block text-sm font-medium">
                                                    {
                                                        method.name
                                                    }
                                                </span>

                                                <span className="mt-1 block text-xs text-gray-500">
                                                    {
                                                        method.description
                                                    }
                                                </span>
                                            </span>
                                        </button>
                                    );
                                },
                            )}
                        </div>

                        {/* =================================================
                            PLACE ORDER
                        ================================================= */}

                        <button
                            type="button"
                            onClick={
                                handlePlaceOrder
                            }
                            className="mt-6 flex h-13 w-full items-center justify-center gap-3 rounded-md bg-primary px-6 text-base font-semibold text-white transition hover:opacity-90"
                        >
                            <Lock size={18} />
                            Place Order
                            <ArrowLeft
                                size={19}
                                className="rotate-180"
                            />
                        </button>

                        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                            <ShieldCheck
                                size={15}
                            />
                            Your information is safe
                            and secure
                        </p>
                    </section>
                </div>

                {/* =================================================
                    RIGHT — ORDER SUMMARY
                ================================================= */}

                <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 sm:p-7 lg:sticky lg:top-6">
                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingBag
                                size={21}
                                className="text-primary"
                            />

                            <h2 className="text-lg font-semibold">
                                Order Summary
                            </h2>
                        </div>

                        <span className="text-sm text-gray-500">
                            {cart.length}{" "}
                            {cart.length === 1
                                ? "Item"
                                : "Items"}
                        </span>
                    </div>

                    {/* =================================================
                        CART ITEMS
                    ================================================= */}

                    <div className="mt-6 space-y-5">
                        {cart.map((item) => {
                            const imageSrc =item.image ;

                            const itemTotal =
                                item.price *
                                item.quantity;

                            return (
                                <div
                                    key={`${item.productId}-${item.size}-${item.color}`}
                                    className="flex gap-3"
                                >
                                    {/* Image */}

                                    <div className="relative h-23 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                        <Image
                                            src={
                                                imageSrc
                                            }
                                            alt={
                                                item.name
                                            }
                                            fill
                                            sizes="80px"
                                            className="object-contain p-1"
                                        />
                                    </div>

                                    {/* Details */}

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="line-clamp-2 text-sm font-medium">
                                                {
                                                    item.name
                                                }
                                            </h3>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(
                                                        item,
                                                    )
                                                }
                                                aria-label={`Remove ${item.name}`}
                                                className="shrink-0 text-gray-400 transition hover:text-red-500"
                                            >
                                                <Trash2
                                                    size={
                                                        17
                                                    }
                                                />
                                            </button>
                                        </div>

                                        {/* Variation */}

                                        {(item.size ||
                                            item.color) && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                {item.size &&
                                                    `Size: ${item.size}`}
                                                {item.size &&
                                                    item.color &&
                                                    "  •  "}
                                                {item.color &&
                                                    `Color: ${item.color}`}
                                            </p>
                                        )}

                                        {/* Quantity */}

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex h-8 items-center overflow-hidden rounded-md border border-gray-200">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDecrease(
                                                            item,
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <=
                                                        1
                                                    }
                                                    className="flex h-full w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <Minus
                                                        size={
                                                            14
                                                        }
                                                    />
                                                </button>

                                                <span className="flex h-full min-w-8 items-center justify-center border-x border-gray-200 px-2 text-xs font-medium">
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleIncrease(
                                                            item,
                                                        )
                                                    }
                                                    className="flex h-full w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50"
                                                >
                                                    <Plus
                                                        size={
                                                            14
                                                        }
                                                    />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm font-semibold">
                                                    ৳
                                                    {itemTotal.toLocaleString()}
                                                </p>

                                                <p className="text-[11px] text-gray-400">
                                                    ৳
                                                    {item.price.toLocaleString()}{" "}
                                                    ×{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* =================================================
                        DIVIDER
                    ================================================= */}

                    <div className="my-6 border-t border-dashed border-gray-300" />

                    {/* =================================================
                        PRICE SUMMARY
                    ================================================= */}

                    <div className="space-y-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                                Subtotal
                            </span>

                            <span className="font-medium">
                                ৳
                                {subtotal.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                                Shipping
                            </span>

                            <span className="font-medium">
                                ৳
                                {shipping.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-green-600">
                                Discount
                            </span>

                            <span className="font-medium text-green-600">
                                -৳
                                {discount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* =================================================
                        TOTAL
                    ================================================= */}

                    <div className="my-5 border-t border-gray-200" />

                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                            Total
                            <span className="ml-2 text-xs font-normal text-gray-500">
                                (BDT)
                            </span>
                        </span>

                        <span className="text-2xl font-bold text-primary">
                            ৳
                            {total.toLocaleString()}
                        </span>
                    </div>

                    {/* =================================================
                        PROMO
                    ================================================= */}

                    <div className="mt-6 rounded-md border border-primary/20 bg-primary/5 p-3">
                        <div className="flex items-center gap-2">
                            <Tag
                                size={18}
                                className="shrink-0 text-primary"
                            />

                            <span className="text-sm font-medium">
                                Have a promo code?
                            </span>
                        </div>

                        <div className="mt-3 flex gap-2">
                            <input
                                value={promoCode}
                                onChange={(event) => {
                                    setPromoCode(
                                        event.target
                                            .value,
                                    );
                                    setPromoApplied(
                                        false,
                                    );
                                }}
                                type="text"
                                placeholder="Enter code"
                                className="h-10 min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary"
                            />

                            <button
                                type="button"
                                onClick={
                                    handlePromo
                                }
                                className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-white transition hover:opacity-90"
                            >
                                Apply
                            </button>
                        </div>

                        {promoApplied && (
                            <p className="mt-2 flex items-center gap-1 text-xs text-green-600">
                                <Check
                                    size={14}
                                />
                                Promo code applied
                                successfully.
                            </p>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    );
}