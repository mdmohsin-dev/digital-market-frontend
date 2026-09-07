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
    CART_UPDATED_EVENT,
    clearCart,
} from "@/lib/cart";

import { useEffect, useMemo, useState } from "react";

import {
    useForm,
    type SubmitHandler,
} from "react-hook-form";

import {
    generateOrderId,
    saveOrder,
    type PaymentMethod,
} from "@/lib/orders";

import { useRouter } from "next/navigation";

import bkashLogo from "@/assets/Images/bkashLogo.png";
import rocketLogo from "@/assets/Images/rocketLogo.jpg";
import nagadLogo from "@/assets/Images/nagad-logo-png_seeklogo-411803.png";
import cardLogo from "@/assets/Images/cardLogo.png";
import handCashLogo from "@/assets/Images/cash-in-hand.jpg";
import { CartItem } from "@/types/cart";


// =====================================================
// BUY NOW
// =====================================================

const BUY_NOW_KEY = "buy-now";


// =====================================================
// PAYMENT METHODS
// =====================================================

const paymentMethods: {
    id: PaymentMethod;
    name: string;
    icon: string;
    row: number;
}[] = [
    {
        id: "cod",
        name: "Cash on Delivery",
        icon: "cash",
        row: 1,
    },
    {
        id: "card",
        name: "Card Payment",
        icon: "card",
        row: 1,
    },
    {
        id: "rocket",
        name: "Rocket",
        icon: "rocket",
        row: 2,
    },
    {
        id: "bkash",
        name: "bKash",
        icon: "bkash",
        row: 2,
    },
    {
        id: "nagad",
        name: "Nagad",
        icon: "nagad",
        row: 2,
    },
];


// =====================================================
// PAYMENT ICON
// =====================================================

function PaymentIcon({
    type,
}: {
    type: string;
}) {
    if (type === "cash") {
        return (
            <div className="relative flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
                <Image
                    src={handCashLogo}
                    alt="Cash on Delivery"
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                />
            </div>
        );
    }

    if (type === "card") {
        return (
            <div className="relative flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
                <Image
                    src={cardLogo}
                    alt="Card Payment"
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                />
            </div>
        );
    }

    if (type === "rocket") {
        return (
            <div className="relative flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
                <Image
                    src={rocketLogo}
                    alt="Rocket"
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                />
            </div>
        );
    }

    if (type === "bkash") {
        return (
            <div className="relative flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
                <Image
                    src={bkashLogo}
                    alt="bKash"
                    fill
                    sizes="48px"
                    className="rounded-md object-contain p-1"
                />
            </div>
        );
    }

    if (type === "nagad") {
        return (
            <div className="relative flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
                <Image
                    src={nagadLogo}
                    alt="Nagad"
                    fill
                    className="object-contain p-1"
                />
            </div>
        );
    }

    return (
        <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-md">
            <CreditCard
                size={23}
                className="text-gray-600"
            />
        </div>
    );
}


// =====================================================
// FORM DATA TYPE
// =====================================================

interface CheckoutFormData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    saveAddress: boolean;
}


// =====================================================
// CHECKOUT CLIENT
// =====================================================

export default function CheckoutClient() {
    // =====================================================
    // CART
    // =====================================================

    const [cart, setCart] =
        useState<CartItem[]>([]);

    const router = useRouter();

    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>("cod");


    // =====================================================
    // REACT HOOK FORM
    // =====================================================

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
            saveAddress: false,
        },
    });


    // =====================================================
    // PROMO
    // =====================================================

    const [promoCode, setPromoCode] =
        useState("");

    const [promoApplied, setPromoApplied] =
        useState(false);


    // =====================================================
    // CART LOAD
    // =====================================================

    useEffect(() => {
        const loadCheckoutItems = () => {
            // -------------------------------------------------
            // FIRST CHECK BUY NOW
            // -------------------------------------------------

            const storedBuyNow =
                localStorage.getItem(
                    BUY_NOW_KEY,
                );

            if (storedBuyNow) {
                try {
                    const buyNowItem =
                        JSON.parse(
                            storedBuyNow,
                        ) as CartItem;

                    if (buyNowItem?.productId) {
                        setCart([
                            buyNowItem,
                        ]);

                        return;
                    }
                } catch {
                    localStorage.removeItem(
                        BUY_NOW_KEY,
                    );
                }
            }

            // -------------------------------------------------
            // OTHERWISE NORMAL CART
            // -------------------------------------------------

            setCart(getCart());
        };

        loadCheckoutItems();

        window.addEventListener(
            CART_UPDATED_EVENT,
            loadCheckoutItems,
        );

        window.addEventListener(
            "storage",
            loadCheckoutItems,
        );

        return () => {
            window.removeEventListener(
                CART_UPDATED_EVENT,
                loadCheckoutItems,
            );

            window.removeEventListener(
                "storage",
                loadCheckoutItems,
            );
        };
    }, []);


    // =====================================================
    // LOAD SAVED ADDRESS
    // =====================================================

    useEffect(() => {
        const savedAddress =
            localStorage.getItem(
                "saved_delivery_info",
            );

        if (!savedAddress) {
            return;
        }

        try {
            const data =
                JSON.parse(
                    savedAddress,
                );

            reset({
                fullName:
                    data.fullName ?? "",

                email:
                    data.email ?? "",

                phone:
                    data.phone ?? "",

                address:
                    data.address ?? "",

                city:
                    data.city ?? "",

                postalCode:
                    data.postalCode ?? "",

                saveAddress: true,
            });
        } catch {
            localStorage.removeItem(
                "saved_delivery_info",
            );
        }
    }, [reset]);


    // =====================================================
    // SUBTOTAL
    // =====================================================

    const subtotal = useMemo(() => {
        return cart.reduce(
            (total, item) =>
                total +
                item.price *
                    item.quantity,
            0,
        );
    }, [cart]);


    // =====================================================
    // SHIPPING
    // =====================================================

    const shipping =
        cart.length > 0
            ? 80
            : 0;


    // =====================================================
    // DISCOUNT
    // =====================================================

    const discount = 0;


    // =====================================================
    // TOTAL
    // =====================================================

    const total =
        subtotal +
        shipping -
        discount;


    // =====================================================
    // UPDATE QUANTITY
    // =====================================================

    const handleIncrease = (
        item: CartItem,
    ) => {
        updateCartItemQuantity(
            item.productId,
            item.size??'',
            item.color??'',
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
            item.size?? '',
            item.color?? '',
            item.quantity - 1,
        );

        setCart(getCart());
    };


    // =====================================================
    // REMOVE
    // =====================================================

    const handleRemove = (
        item: CartItem,
    ) => {
        removeFromCart(
            item.productId,
            item.size??'',
            item.color??'',
        );

        setCart(getCart());

        // If this was a Buy Now item,
        // remove the Buy Now data too.
        const storedBuyNow =
            localStorage.getItem(
                BUY_NOW_KEY,
            );

        if (storedBuyNow) {
            try {
                const buyNowItem =
                    JSON.parse(
                        storedBuyNow,
                    ) as CartItem;

                if (
                    buyNowItem.productId ===
                    item.productId
                ) {
                    localStorage.removeItem(
                        BUY_NOW_KEY,
                    );
                }
            } catch {
                localStorage.removeItem(
                    BUY_NOW_KEY,
                );
            }
        }
    };


    // =====================================================
    // PROMO
    // =====================================================

    const handlePromo = () => {
        if (!promoCode.trim()) {
            return;
        }

        setPromoApplied(true);
    };


    // =====================================================
    // PLACE ORDER
    // =====================================================

    const onPlaceOrder: SubmitHandler<
        CheckoutFormData
    > = (data) => {
        if (cart.length === 0) {
            alert(
                "Your cart is empty.",
            );

            return;
        }


        // -------------------------------------------------
        // CREATE ORDER
        // -------------------------------------------------

        const order = {
            id: generateOrderId(),

            items: cart.map(
                (item) => ({
                    productId:
                        item.productId,

                    name: item.name,

                    image: item.image,

                    price: item.price,

                    quantity:
                        item.quantity,

                    size: item.size,

                    color: item.color,
                }),
            ),

            deliveryInfo: {
                fullName:
                    data.fullName.trim(),

                email:
                    data.email.trim(),

                phone:
                    data.phone.trim(),

                address:
                    data.address.trim(),

                city:
                    data.city.trim(),

                postalCode:
                    data.postalCode.trim(),

                country:
                    "Bangladesh",
            },

            paymentMethod,

            subtotal,

            shipping,

            discount,

            total,

            status: "pending" as const,

            createdAt:
                new Date().toISOString(),
        };


        // -------------------------------------------------
        // SAVE ORDER
        // -------------------------------------------------

        saveOrder(order);


        // -------------------------------------------------
        // SAVE DELIVERY INFORMATION
        // -------------------------------------------------

        if (data.saveAddress) {
            const deliveryInfo = {
                fullName:
                    data.fullName.trim(),

                email:
                    data.email.trim(),

                phone:
                    data.phone.trim(),

                address:
                    data.address.trim(),

                city:
                    data.city.trim(),

                postalCode:
                    data.postalCode.trim(),

                country:
                    "Bangladesh",
            };

            localStorage.setItem(
                "saved_delivery_info",
                JSON.stringify(
                    deliveryInfo,
                ),
            );
        } else {
            localStorage.removeItem(
                "saved_delivery_info",
            );
        }


        // -------------------------------------------------
        // CLEAR NORMAL CART
        // -------------------------------------------------

        clearCart();


        // -------------------------------------------------
        // CLEAR BUY NOW
        // -------------------------------------------------

        localStorage.removeItem(
            BUY_NOW_KEY,
        );


        // -------------------------------------------------
        // GO TO SUCCESS PAGE
        // -------------------------------------------------

        router.push(
            `/order-success?orderId=${order.id}`,
        );
    };


    // =====================================================
    // EMPTY CART
    // =====================================================

    // if (cart.length === 0) {
    //     return (
    //         <main className="mx-auto flex min-h-[70vh] max-w-350 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    //             <div className="text-center">
    //                 <ShoppingBag
    //                     size={48}
    //                     className="mx-auto text-gray-300"
    //                 />

    //                 <h1 className="mt-5 text-2xl font-semibold">
    //                     Your cart is empty
    //                 </h1>

    //                 <p className="mt-2 text-sm text-gray-500">
    //                     Add some products before
    //                     proceeding to checkout.
    //                 </p>

    //                 <Link
    //                     href="/shop"
    //                     className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-white transition hover:opacity-90"
    //                 >
    //                     <ArrowLeft
    //                         size={17}
    //                     />

    //                     Continue Shopping
    //                 </Link>
    //             </div>
    //         </main>
    //     );
    // }


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main className="mx-auto max-w-350 px-4 py-8 sm:px-6 lg:px-8">

            {/* BACK TO SHOPPING */}

            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
                >
                    <ArrowLeft
                        size={17}
                    />

                    Back to Shopping
                </Link>
            </div>


            {/* CHECKOUT GRID */}

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">

                {/* =================================================
                    LEFT
                ================================================= */}

                <form
                    onSubmit={handleSubmit(
                        onPlaceOrder,
                    )}
                    noValidate
                    className="overflow-hidden rounded-xl"
                >

                    {/* CONTACT INFORMATION */}

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
                                    {...register(
                                        "fullName",
                                        {
                                            required:
                                                "Full name is required",
                                        },
                                    )}
                                    type="text"
                                    placeholder="Your full name"
                                    className={`h-12 w-full rounded-md border px-4 text-sm outline-none transition focus:border-primary ${
                                        errors.fullName
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    }`}
                                />

                                {errors.fullName && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {
                                            errors
                                                .fullName
                                                .message
                                        }
                                    </p>
                                )}
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
                                    {...register(
                                        "email",
                                        {
                                            required:
                                                "Email is required",

                                            pattern: {
                                                value:
                                                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                                                message:
                                                    "Enter a valid email address",
                                            },
                                        },
                                    )}
                                    type="email"
                                    placeholder="you@example.com"
                                    className={`h-12 w-full rounded-md border px-4 text-sm outline-none transition focus:border-primary ${
                                        errors.email
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    }`}
                                />

                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {
                                            errors
                                                .email
                                                .message
                                        }
                                    </p>
                                )}
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
                                    {...register(
                                        "phone",
                                        {
                                            required:
                                                "Phone number is required",
                                        },
                                    )}
                                    type="tel"
                                    placeholder="+880 1XXXXXXXXX"
                                    className={`h-12 w-full rounded-md border px-4 text-sm outline-none transition focus:border-primary ${
                                        errors.phone
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    }`}
                                />

                                {errors.phone && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {
                                            errors
                                                .phone
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                        </div>

                    </section>


                    <div className="border-t border-gray-200" />


                    {/* SHIPPING ADDRESS */}

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
                                {...register(
                                    "address",
                                    {
                                        required:
                                            "Address is required",
                                    },
                                )}
                                type="text"
                                placeholder="House, Road, Area"
                                className={`h-12 w-full rounded-md border px-4 text-sm outline-none transition focus:border-primary ${
                                    errors.address
                                        ? "border-red-400"
                                        : "border-gray-300"
                                }`}
                            />

                            {errors.address && (
                                <p className="mt-1 text-xs text-red-500">
                                    {
                                        errors
                                            .address
                                            .message
                                    }
                                </p>
                            )}
                        </div>


                        {/* City / Postal / Country */}

                        <div className="mt-4 grid gap-4 md:grid-cols-3">

                            {/* City */}

                            <div>
                                <label className="mb-2 block text-sm text-gray-600">
                                    City{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    {...register(
                                        "city",
                                        {
                                            required:
                                                "City is required",
                                        },
                                    )}
                                    type="text"
                                    placeholder="Dhaka"
                                    className={`h-12 w-full rounded-md border px-4 text-sm outline-none transition focus:border-primary ${
                                        errors.city
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    }`}
                                />

                                {errors.city && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {
                                            errors
                                                .city
                                                .message
                                        }
                                    </p>
                                )}
                            </div>


                            {/* Postal */}

                            <div>
                                <label className="mb-2 block text-sm text-gray-600">
                                    Postal Code{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    {...register(
                                        "postalCode",
                                        {
                                            required:
                                                "Postal code is required",
                                        },
                                    )}
                                    type="text"
                                    placeholder="1205"
                                    className={`h-12 w-full rounded-md border px-4 text-sm outline-none transition focus:border-primary ${
                                        errors.postalCode
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    }`}
                                />

                                {errors.postalCode && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {
                                            errors
                                                .postalCode
                                                .message
                                        }
                                    </p>
                                )}
                            </div>


                            {/* Country */}

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
                                {...register(
                                    "saveAddress",
                                )}
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


                        {/* ROW 1 */}

                        <div className="grid grid-cols-2 gap-3">

                            {paymentMethods
                                .filter(
                                    (method) =>
                                        method.row ===
                                        1,
                                )
                                .map(
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

                                                </span>

                                            </button>
                                        );
                                    },
                                )}

                        </div>


                        {/* ROW 2 */}

                        <div className="mt-3 grid grid-cols-3 gap-3">

                            {paymentMethods
                                .filter(
                                    (method) =>
                                        method.row ===
                                        2,
                                )
                                .map(
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
                                                className={`flex min-h-20 items-center gap-3 rounded-md border p-4 text-left transition ${
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

                                                </span>

                                            </button>
                                        );
                                    },
                                )}

                        </div>


                        {/* PLACE ORDER */}

                        <button
                            type="submit"
                            className="mt-6 flex h-13 w-full items-center justify-center gap-3 rounded-md bg-primary px-6 text-base font-semibold text-white transition hover:opacity-90"
                        >
                            <Lock
                                size={18}
                            />

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

                </form>


                {/* =================================================
                    RIGHT — ORDER SUMMARY
                ================================================= */}

                <aside className="h-fit rounded-xl p-6 sm:p-7 lg:sticky lg:top-6">

                    {/* HEADER */}

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


                    {/* CART ITEMS */}

                    <div className="mt-6 space-y-5">

                        {cart.map(
                            (item) => {
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
                                                    item.image
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
                            },
                        )}

                    </div>


                    {/* DIVIDER */}

                    <div className="my-6 border-t border-dashed border-gray-300" />


                    {/* PRICE SUMMARY */}

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


                    {/* TOTAL */}

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


                    {/* PROMO */}

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
                                value={
                                    promoCode
                                }
                                onChange={(
                                    event,
                                ) => {
                                    setPromoCode(
                                        event
                                            .target
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