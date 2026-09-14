"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
    ArrowLeft,
    Package,
    ShoppingBag,
} from "lucide-react";
import { Copy, Check } from "lucide-react";

import { useUserSession } from "@/hooks/useUserSession";
import {
    Order,
    OrderStatus,
    ORDER_STORAGE_KEY,
    updateOrderStatus,
} from "@/lib/orders";
import { DEFAULT_USER_ROLE } from "@/lib/user-role";
import { FaEye } from "react-icons/fa6";

export default function OrdersPage() {
    const {
        session,
        isPending: sessionLoading,
    } = useUserSession();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const [copiedId, setCopiedId] = useState<string | null>(
        null,
    );

    /**
     * Admin status update state.
     *
     * Keeps the currently selected status for each order.
     */
    const [selectedStatuses, setSelectedStatuses] =
        useState<Record<string, OrderStatus>>({});

    /**
     * Order currently being updated.
     */
    const [updatingOrderId, setUpdatingOrderId] =
        useState<string | null>(null);

    const handleCopy = (
        e: React.MouseEvent<HTMLButtonElement>,
        id: string,
    ) => {
        e.preventDefault();

        navigator.clipboard.writeText(id).then(() => {
            setCopiedId(id);

            setTimeout(() => {
                setCopiedId(null);
            }, 1500);
        });
    };

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

                /**
                 * Keep selected status synchronized
                 * with the actual localStorage status.
                 */
                const statusMap: Record<
                    string,
                    OrderStatus
                > = {};

                sortedOrders.forEach((order) => {
                    statusMap[order.id] = order.status;
                });

                setSelectedStatuses(statusMap);

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
     * ORDER_STATUS_UPDATED:
     * Handles status changes inside the same tab.
     *
     * orders-updated:
     * Keeps compatibility with any existing order update
     * implementation in the project.
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

        const handleOrderStatusUpdated = () => {
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

        window.addEventListener(
            "ORDER_STATUS_UPDATED",
            handleOrderStatusUpdated,
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

            window.removeEventListener(
                "ORDER_STATUS_UPDATED",
                handleOrderStatusUpdated,
            );
        };
    }, [loadOrders]);

    /**
     * Admin order status options.
     *
     * These values must match OrderStatus exactly.
     */
    const orderStatusOptions: OrderStatus[] = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
    ];

    /**
     * Convert internal status value into
     * user-friendly display text.
     */
    const getStatusLabel = (
        status: OrderStatus,
    ): string => {
        switch (status) {
            case "pending":
                return "Pending";

            case "confirmed":
                return "Confirmed";

            case "processing":
                return "Processing";

            case "shipped":
                return "Shipped";

            case "in-delivery-man":
                return "In Delivery Man";

            case "delivered":
                return "Delivered";

            case "cancelled":
                return "Cancelled";

            default:
                return status;
        }
    };

    /**
     * Update selected status locally in the UI.
     *
     * This does NOT update localStorage yet.
     * Actual update happens when Admin clicks
     * "Update Status".
     */
    const handleStatusSelect = (
        orderId: string,
        status: OrderStatus,
    ) => {
        setSelectedStatuses((previous) => ({
            ...previous,
            [orderId]: status,
        }));
    };

    /**
     * Admin status update.
     *
     * Source of truth:
     * localStorage order.status
     */
    const handleStatusUpdate = (
        orderId: string,
    ) => {
        if (!isAdmin) {
            return;
        }

        const selectedStatus =
            selectedStatuses[orderId];

        if (!selectedStatus) {
            return;
        }

        setUpdatingOrderId(orderId);

        const updated =
            updateOrderStatus(
                orderId,
                selectedStatus,
            );

        if (!updated) {
            console.error(
                "Failed to update order status.",
            );

            setUpdatingOrderId(null);
            return;
        }

        /**
         * Reload orders immediately.
         *
         * updateOrderStatus() already dispatches
         * ORDER_STATUS_UPDATED, but we also refresh
         * directly here so the Admin UI updates
         * immediately.
         */
        loadOrders();

        setUpdatingOrderId(null);
    };

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
                {orders.map((order) => {
                    const selectedStatus =
                        selectedStatuses[order.id] ??
                        order.status;

                    const isUpdating =
                        updatingOrderId === order.id;

                    return (
                        <div
                            key={order.id}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                        >
                            {/* Order Header */}
                            <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Order ID
                                    </p>

                                    <div className="mt-1 flex items-center gap-2">
                                        <p className="text-sm font-semibold">
                                            {order.id}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={(e) =>
                                                handleCopy(
                                                    e,
                                                    order.id,
                                                )
                                            }
                                            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                            title="Copy Order ID"
                                        >
                                            {copiedId ===
                                            order.id ? (
                                                <Check
                                                    size={21}
                                                    color="green"
                                                />
                                            ) : (
                                                <Copy size={21} />
                                            )}
                                        </button>
                                    </div>
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

                                {/* Status */}
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Status
                                    </p>

                                    {!isAdmin ? (
                                        <span className="mt-1 inline-flex rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium capitalize text-yellow-700">
                                            {getStatusLabel(
                                                order.status,
                                            )}
                                        </span>
                                    ) : (
                                        <div className="mt-1 flex items-center gap-2">
                                            <select
                                                value={
                                                    selectedStatus
                                                }
                                                onChange={(e) =>
                                                    handleStatusSelect(
                                                        order.id,
                                                        e.target
                                                            .value as OrderStatus,
                                                    )
                                                }
                                                disabled={
                                                    isUpdating
                                                }
                                                className="h-9 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {orderStatusOptions.map(
                                                    (
                                                        status,
                                                    ) => (
                                                        <option
                                                            key={
                                                                status
                                                            }
                                                            value={
                                                                status
                                                            }
                                                        >
                                                            {getStatusLabel(
                                                                status,
                                                            )}
                                                        </option>
                                                    ),
                                                )}
                                            </select>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        order.id,
                                                    )
                                                }
                                                disabled={
                                                    isUpdating ||
                                                    selectedStatus ===
                                                        order.status
                                                }
                                                className="h-9 rounded-md bg-primary px-3 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isUpdating
                                                    ? "Updating..."
                                                    : "Update"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Action
                                    </p>

                                    <span className="mt-1 inline-flex rounded-sm bg-primary p-1 px-2 text-sm text-white">
                                        <Link
                                            href={`/dashboard/orders/${order.id}`}
                                        >
                                            View Details
                                        </Link>
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
                                    (
                                        item,
                                        index,
                                    ) => (
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
                                                    {
                                                        item.name
                                                    }
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
                        </div>
                    );
                })}
            </div>
        </main>
    );
}