"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
    ArrowLeft,
    Package,
    ShoppingBag,
} from "lucide-react";

import { useUserSession } from "@/hooks/useUserSession";
import {
    Order,
    ORDER_STORAGE_KEY,
} from "@/lib/orders";
import { DEFAULT_USER_ROLE } from "@/lib/user-role";

export default function OrdersPage() {
    const {
        session,
        isPending: sessionLoading,
    } = useUserSession();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    /**
     * Current user's role
     *
     * Role is coming from the centralized role source.
     *
     * Frontend stage:
     * - customer = customer dashboard
     * - admin = admin dashboard
     *
     * Later this value will come from the backend/database.
     */
    const userRole = DEFAULT_USER_ROLE;

    const isAdmin = userRole === "admin";

    /**
     * Better Auth session email
     *
     * Customer orders are matched using the authenticated
     * Better Auth user's email.
     */
    const userEmail =
        session?.user?.email
            ?.trim()
            .toLowerCase() ?? "";

    /**
     * Load orders
     *
     * ADMIN:
     * Shows all orders.
     *
     * CUSTOMER:
     * Shows only orders belonging to the
     * authenticated Better Auth user.
     */
    const loadOrders = useCallback(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (sessionLoading) {
            return;
        }

        setLoading(true);

        try {
            const storedOrders =
                localStorage.getItem(
                    ORDER_STORAGE_KEY,
                );

            /**
             * No orders available.
             */
            if (!storedOrders) {
                setOrders([]);
                setLoading(false);
                return;
            }

            const parsedOrders: Order[] =
                JSON.parse(storedOrders);

            /**
             * Validate stored data.
             */
            if (!Array.isArray(parsedOrders)) {
                setOrders([]);
                setLoading(false);
                return;
            }

            /**
             * Newest orders first.
             */
            const sortedOrders = [...parsedOrders].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );

            /**
             * ADMIN
             *
             * Admin can see every order.
             */
            if (isAdmin) {
                setOrders(sortedOrders);
                setLoading(false);
                return;
            }

            /**
             * CUSTOMER
             *
             * Customer must have a Better Auth session.
             */
            if (!userEmail) {
                setOrders([]);
                setLoading(false);
                return;
            }

            /**
             * Match order email with authenticated
             * Better Auth user's email.
             */
            const customerOrders =
                sortedOrders.filter((order) => {
                    const orderEmail =
                        order?.deliveryInfo?.email
                            ?.trim()
                            .toLowerCase() ?? "";

                    return (
                        orderEmail !== "" &&
                        orderEmail === userEmail
                    );
                });

            setOrders(customerOrders);
            setLoading(false);
        } catch (error) {
            console.error(
                "Failed to load orders:",
                error,
            );

            setOrders([]);
            setLoading(false);
        }
    }, [
        isAdmin,
        sessionLoading,
        userEmail,
    ]);

    /**
     * Load orders when authentication/session
     * information is ready.
     */
    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    /**
     * Listen for order updates.
     *
     * storage:
     * Handles changes from another browser tab.
     *
     * orders-updated:
     * Handles changes inside the same tab.
     */
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const handleStorageChange = (
            event: StorageEvent,
        ) => {
            if (
                event.key === ORDER_STORAGE_KEY ||
                event.key === null
            ) {
                loadOrders();
            }
        };

        const handleOrdersUpdated = () => {
            loadOrders();
        };

        window.addEventListener(
            "storage",
            handleStorageChange,
        );

        window.addEventListener(
            "orders-updated",
            handleOrdersUpdated,
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange,
            );

            window.removeEventListener(
                "orders-updated",
                handleOrdersUpdated,
            );
        };
    }, [loadOrders]);

    /**
     * Loading
     */
    if (sessionLoading || loading) {
        return (
            <main className="mx-auto flex min-h-[70vh] max-w-350 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading orders...
                    </p>
                </div>
            </main>
        );
    }

    /**
     * User must be logged in.
     */
    if (!session?.user?.email) {
        return (
            <main className="mx-auto flex min-h-[70vh] max-w-350 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center">
                    <ShoppingBag
                        size={48}
                        className="mx-auto text-gray-300"
                    />

                    <h1 className="mt-5 text-2xl font-semibold">
                        Please log in
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Please log in to view your orders.
                    </p>

                    <Link
                        href="/login"
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        Log In
                    </Link>
                </div>
            </main>
        );
    }

    /**
     * No orders
     */
    if (orders.length === 0) {
        return (
            <main className="mx-auto flex min-h-[70vh] max-w-350 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center">
                    <Package
                        size={48}
                        className="mx-auto text-gray-300"
                    />

                    <h1 className="mt-5 text-2xl font-semibold">
                        No orders yet
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        {isAdmin
                            ? "There are no orders yet."
                            : "You haven't placed any orders yet."}
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

    return (
        <main className="mx-auto max-w-350 px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
                >
                    <ArrowLeft size={17} />
                    Back to Shopping
                </Link>

                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">
                                {isAdmin
                                    ? "All Orders"
                                    : "My Orders"}
                            </h1>

                            {isAdmin && (
                                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium capitalize text-red-600">
                                    Admin
                                </span>
                            )}
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                            {isAdmin
                                ? "View all customer orders."
                                : "View your order history and details."}
                        </p>
                    </div>

                    <span className="text-sm text-gray-500">
                        {orders.length}{" "}
                        {orders.length === 1
                            ? "Order"
                            : "Orders"}
                    </span>
                </div>
            </div>

            {/* Orders */}
            <div className="space-y-5">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                        <Link
                            href={`/dashboard/orders/${order.id}`}
                        >
                            {/* Order Header */}
                            <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Order ID
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        {order.id}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Date
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {new Date(
                                            order.createdAt,
                                        ).toLocaleDateString(
                                            "en-BD",
                                            {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            },
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Payment
                                    </p>

                                    <p className="mt-1 text-sm font-medium capitalize">
                                        {order.paymentMethod ===
                                        "cod"
                                            ? "Cash on Delivery"
                                            : order.paymentMethod}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Status
                                    </p>

                                    <span className="mt-1 inline-flex rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium capitalize text-yellow-700">
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Customer Info - Admin only */}
                            {isAdmin && (
                                <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                                    <p className="text-xs text-gray-500">
                                        Customer
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {
                                            order.deliveryInfo
                                                .fullName
                                        }
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {
                                            order.deliveryInfo
                                                .email
                                        }
                                    </p>
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="divide-y divide-gray-100">
                                {order.items.map(
                                    (item, index) => (
                                        <div
                                            key={`${order.id}-${item.productId}-${index}`}
                                            className="flex gap-4 p-5"
                                        >
                                            {/* Product Image */}
                                            <div className="relative h-20 w-18 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                                <Image
                                                    src={
                                                        item.image
                                                    }
                                                    alt={
                                                        item.name
                                                    }
                                                    fill
                                                    sizes="72px"
                                                    className="object-contain p-1"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="min-w-0 flex-1">
                                                <h2 className="text-sm font-medium">
                                                    {item.name}
                                                </h2>

                                                {(item.size ||
                                                    item.color) && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {item.size &&
                                                            `Size: ${item.size}`}

                                                        {item.size &&
                                                            item.color &&
                                                            " • "}

                                                        {item.color &&
                                                            `Color: ${item.color}`}
                                                    </p>
                                                )}

                                                <p className="mt-2 text-xs text-gray-500">
                                                    ৳
                                                    {item.price.toLocaleString()}{" "}
                                                    ×{" "}
                                                    {item.quantity}
                                                </p>
                                            </div>

                                            {/* Item Total */}
                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-semibold">
                                                    ৳
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>

                            {/* Order Footer */}
                            <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Deliver to
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {
                                            order.deliveryInfo
                                                .fullName
                                        }
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {
                                            order.deliveryInfo
                                                .address
                                        }
                                        ,{" "}
                                        {
                                            order.deliveryInfo
                                                .city
                                        }
                                    </p>

                                    {isAdmin && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            {
                                                order.deliveryInfo
                                                    .email
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="text-left sm:text-right">
                                    <p className="text-xs text-gray-500">
                                        Total
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-primary">
                                        ৳
                                        {order.total.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}