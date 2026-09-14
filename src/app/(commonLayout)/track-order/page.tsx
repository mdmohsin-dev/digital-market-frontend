"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Check,
    CheckCheck,
    CircleAlert,
    Clock3,
    PackageCheck,
    Search,
    Truck,
    UserRound,
} from "lucide-react";

import {
    formatTrackingDate,
    getTrackingDataFromOrderStatus,
    getTrackingStep,
    getTrackingStepIndex,
    TRACKING_STEPS,
} from "@/lib/tracking";

import type {
    OrderTrackingData,
} from "@/lib/tracking";

import type {
    TrackingStatus,
} from "@/types/tracking";

import {
    ORDER_STORAGE_KEY,
    type Order,
} from "@/lib/orders";

const ORDER_STATUS_UPDATED_EVENT =
    "ORDER_STATUS_UPDATED";

type TrackableOrder = Order;

const statusIcons: Record<
    TrackingStatus,
    typeof Check
> = {
    confirmed:Check,
    accepted: CheckCheck,
    processing: Clock3,
    "shipped": Truck,
    "in-delivery-man": UserRound,
    delivered: PackageCheck,
};

const readOrders = (): TrackableOrder[] => {
    if (typeof window === "undefined") {
        return [];
    }

    const storedOrders =
        localStorage.getItem(
            ORDER_STORAGE_KEY,
        );

    if (!storedOrders) {
        return [];
    }

    try {
        const parsedOrders =
            JSON.parse(
                storedOrders,
            ) as TrackableOrder[];

        return Array.isArray(parsedOrders)
            ? parsedOrders
            : [];
    } catch {
        return [];
    }
};

const findOrderById = (
    orderId: string,
): TrackableOrder | null => {
    const normalizedId =
        orderId.trim().toUpperCase();

    if (!normalizedId) {
        return null;
    }

    return (
        readOrders().find(
            (order) =>
                order.id.trim().toUpperCase() ===
                normalizedId,
        ) ?? null
    );
};

export default function TrackOrderPage() {
    const [searchId, setSearchId] =
        useState("");

    const [foundOrder, setFoundOrder] =
        useState<TrackableOrder | null>(
            null,
        );

    const [hasSearched, setHasSearched] =
        useState(false);

    const [isRefreshing, setIsRefreshing] =
        useState(false);

    /**
     * Re-read the same order from localStorage.
     *
     * This is what keeps the tracking UI synced
     * with the stored order.status.
     */
    const refreshFoundOrder = () => {
        if (!foundOrder) {
            return;
        }

        const updatedOrder =
            findOrderById(foundOrder.id);

        if (updatedOrder) {
            setFoundOrder(updatedOrder);
        }
    };

    /**
     * Listen for status changes.
     *
     * 1. "storage" → changes from another tab
     * 2. ORDER_STATUS_UPDATED → changes from same tab
     * 3. interval → fallback sync
     */
    useEffect(() => {
        if (!foundOrder) {
            return;
        }

        const handleStorage = () => {
            refreshFoundOrder();
        };

        const handleOrderStatusUpdate = () => {
            refreshFoundOrder();
        };

        window.addEventListener(
            "storage",
            handleStorage,
        );

        window.addEventListener(
            ORDER_STATUS_UPDATED_EVENT,
            handleOrderStatusUpdate,
        );

        const interval =
            window.setInterval(
                refreshFoundOrder,
                3000,
            );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorage,
            );

            window.removeEventListener(
                ORDER_STATUS_UPDATED_EVENT,
                handleOrderStatusUpdate,
            );

            window.clearInterval(interval);
        };
    }, [foundOrder?.id]);

    const handleSearch = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const normalizedId =
            searchId.trim();

        if (!normalizedId) {
            setFoundOrder(null);
            setHasSearched(true);
            return;
        }

        setIsRefreshing(true);

        const order =
            findOrderById(normalizedId);

        setFoundOrder(order);
        setHasSearched(true);

        setIsRefreshing(false);
    };

    /**
     * IMPORTANT:
     *
     * The tracking UI is derived ONLY from
     * foundOrder.status.
     *
     * We intentionally do not store a separate
     * trackingStatus as the source of truth.
     *
     * Future:
     * foundOrder.status can come from API/database
     * without changing this UI.
     */
    const trackingData =
        useMemo<OrderTrackingData | null>(
            () => {
                if (!foundOrder) {
                    return null;
                }

                return getTrackingDataFromOrderStatus(
                    foundOrder.status,
                    foundOrder.createdAt,
                );
            },
            [foundOrder],
        );

    const currentStepIndex =
        trackingData
            ? getTrackingStepIndex(
                  trackingData.trackingStatus,
              )
            : 0;

    const currentStep =
        trackingData
            ? getTrackingStep(
                  trackingData.trackingStatus,
              )
            : null;

    const progressPercentage =
        TRACKING_STEPS.length > 1
            ? (currentStepIndex /
                  (TRACKING_STEPS.length - 1)) *
              100
            : 0;

    const currentEvent =
        trackingData
            ? trackingData.trackingHistory[
                  trackingData.trackingHistory
                      .length - 1
              ]
            : null;

    const isDelivered =
        trackingData?.trackingStatus ===
        "delivered";

    return (
        <main className="min-h-screen bg-neutral-50">
            {/* Header */}
            <section className="border-b border-neutral-200 bg-white">
                <div className="mx-auto max-w-350 px-4 py-14 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
                        {/* Left */}
                        <div className="max-w-xl text-center lg:text-left">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                Live Order Tracking
                            </p>

                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                                Track Your Order
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base">
                                Real-time updates on your shipment progress.
                            </p>
                        </div>

                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="flex w-full max-w-xl flex-col gap-3 sm:flex-row lg:w-auto lg:max-w-md"
                        >
                            <div className="relative flex-1">
                                <Search
                                    size={19}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                                />

                                <input
                                    type="text"
                                    value={searchId}
                                    onChange={(event) =>
                                        setSearchId(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Enter your Order ID"
                                    aria-label="Order ID"
                                    className="h-12 w-full rounded-lg border border-neutral-300 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isRefreshing}
                                className="h-12 shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                Track Order
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-350 px-4 py-10 sm:px-6 lg:px-8">
                {/* Initial state */}
                {!hasSearched && (
                    <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Truck size={25} />
                        </div>

                        <p className="mx-auto mt-2 max-w-lg text-md leading-6 text-neutral-500">
                            Your Order ID is available in your
                            orders and order details page.
                        </p>
                    </div>
                )}

                {/* Not found */}
                {hasSearched && !foundOrder && (
                    <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <CircleAlert size={26} />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-neutral-900">
                            Order not found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                            We could not find an order with the ID{" "}
                            <span className="font-semibold text-neutral-800">
                                {searchId.trim()}
                            </span>
                            . Please check the Order ID and try
                            again.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchId("");
                                setHasSearched(false);
                                setFoundOrder(null);
                            }}
                            className="mt-6 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Tracking */}
                {foundOrder &&
                    trackingData &&
                    currentStep && (
                        <div className="space-y-6">
                            {/* Order header */}
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                                            Order ID
                                        </p>

                                        <h2 className="mt-1 text-lg font-semibold tracking-wide text-neutral-900">
                                            {foundOrder.id}
                                        </h2>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                                            Order Placed
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-neutral-800">
                                            {formatTrackingDate(
                                                foundOrder.createdAt,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Current status */}
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            {(() => {
                                                const Icon =
                                                    statusIcons[
                                                        currentStep.status
                                                    ];

                                                return (
                                                    <Icon
                                                        size={25}
                                                    />
                                                );
                                            })()}
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                                                Current Status
                                            </p>

                                            <h3 className="mt-1 text-xl font-semibold text-neutral-900">
                                                {currentStep.title}
                                            </h3>

                                            <p className="mt-1 text-sm leading-6 text-neutral-500">
                                                {
                                                    currentStep.description
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                            isDelivered
                                                ? "bg-green-50 text-green-600"
                                                : "bg-primary/10 text-primary"
                                        }`}
                                    >
                                        {isDelivered
                                            ? "Delivered"
                                            : "In Progress"}
                                    </span>
                                </div>

                                {currentEvent?.timestamp && (
                                    <div className="mt-5 border-t border-neutral-100 pt-4">
                                        <p className="text-xs text-neutral-500">
                                            Last update
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-neutral-800">
                                            {formatTrackingDate(
                                                currentEvent.timestamp,
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Progress */}
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                                <div className="mb-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-semibold text-neutral-900 sm:text-lg">
                                                Delivery Progress
                                            </h3>

                                            <p className="mt-1 text-sm text-neutral-500">
                                                Follow your parcel
                                                from acceptance to
                                                delivery.
                                            </p>
                                        </div>

                                        <span className="text-sm font-semibold text-primary">
                                            {Math.round(
                                                progressPercentage,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop */}
                                <div className="hidden md:block">
                                    <div className="relative">
                                        <div className="absolute left-[10%] right-[10%] top-5 h-1.5 rounded-full bg-neutral-200" />

                                        <div
                                            className="absolute left-[10%] top-5 h-1.5 rounded-full bg-primary transition-all duration-500"
                                            style={{
                                                width: `calc(${progressPercentage}% * 0.8)`,
                                            }}
                                        />

                                        <div className="relative grid grid-cols-5">
                                            {TRACKING_STEPS.map(
                                                (
                                                    step,
                                                    index,
                                                ) => {
                                                    const StepIcon =
                                                        statusIcons[
                                                            step.status
                                                        ];

                                                    const isCompleted =
                                                        index <
                                                        currentStepIndex;

                                                    const isCurrent =
                                                        index ===
                                                        currentStepIndex;

                                                    const isUpcoming =
                                                        index >
                                                        currentStepIndex;

                                                    const event =
                                                        trackingData.trackingHistory.find(
                                                            (
                                                                item,
                                                            ) =>
                                                                item.status ===
                                                                step.status,
                                                        );

                                                    return (
                                                        <div
                                                            key={
                                                                step.status
                                                            }
                                                            className="flex flex-col items-center text-center"
                                                        >
                                                            <div
                                                                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-all duration-500 ${
                                                                    isCompleted
                                                                        ? "border-primary bg-primary text-white"
                                                                        : isCurrent
                                                                          ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                                                                          : "border-neutral-300 text-neutral-400"
                                                                }`}
                                                            >
                                                                <StepIcon
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="mt-3 max-w-32">
                                                                <p
                                                                    className={`text-xs font-semibold leading-5 sm:text-sm ${
                                                                        isUpcoming
                                                                            ? "text-neutral-400"
                                                                            : "text-neutral-900"
                                                                    }`}
                                                                >
                                                                    {
                                                                        step.title
                                                                    }
                                                                </p>

                                                                {isCurrent && (
                                                                    <span className="mt-1.5 inline-flex rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                                                                        In
                                                                        Progress
                                                                    </span>
                                                                )}

                                                                {event && (
                                                                    <p className="mt-2 text-[10px] leading-4 text-neutral-400 sm:text-xs">
                                                                        {formatTrackingDate(
                                                                            event.timestamp,
                                                                        )}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile */}
                                <div className="md:hidden">
                                    <div className="relative space-y-0">
                                        {TRACKING_STEPS.map(
                                            (
                                                step,
                                                index,
                                            ) => {
                                                const StepIcon =
                                                    statusIcons[
                                                        step.status
                                                    ];

                                                const isCompleted =
                                                    index <
                                                    currentStepIndex;

                                                const isCurrent =
                                                    index ===
                                                    currentStepIndex;

                                                const isUpcoming =
                                                    index >
                                                    currentStepIndex;

                                                const event =
                                                    trackingData.trackingHistory.find(
                                                        (
                                                            item,
                                                        ) =>
                                                            item.status ===
                                                            step.status,
                                                    );

                                                return (
                                                    <div
                                                        key={
                                                            step.status
                                                        }
                                                        className="relative flex gap-4"
                                                    >
                                                        {index <
                                                            TRACKING_STEPS.length -
                                                                1 && (
                                                            <div
                                                                className={`absolute left-5 top-10 h-full w-0.5 ${
                                                                    index <
                                                                    currentStepIndex
                                                                        ? "bg-primary"
                                                                        : "bg-neutral-200"
                                                                }`}
                                                            />
                                                        )}

                                                        <div
                                                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-all duration-500 ${
                                                                isCompleted
                                                                    ? "border-primary bg-primary text-white"
                                                                    : isCurrent
                                                                      ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                                                                      : "border-neutral-300 text-neutral-400"
                                                            }`}
                                                        >
                                                            <StepIcon
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-h-24 flex-1 pb-5">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p
                                                                    className={`text-sm font-semibold ${
                                                                        isUpcoming
                                                                            ? "text-neutral-400"
                                                                            : "text-neutral-900"
                                                                    }`}
                                                                >
                                                                    {
                                                                        step.title
                                                                    }
                                                                </p>

                                                                {isCurrent && (
                                                                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                                                                        In
                                                                        Progress
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p
                                                                className={`mt-1 text-xs leading-5 ${
                                                                    isUpcoming
                                                                        ? "text-neutral-400"
                                                                        : "text-neutral-500"
                                                                }`}
                                                            >
                                                                {
                                                                    step.description
                                                                }
                                                            </p>

                                                            {event && (
                                                                <p className="mt-2 text-[11px] font-medium text-neutral-400">
                                                                    {formatTrackingDate(
                                                                        event.timestamp,
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2 border-t border-neutral-100 pt-5 text-xs text-neutral-400">
                                    <Clock3 size={14} />

                                    <span>
                                        Status updates automatically
                                        when your order status changes.
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
            </section>
        </main>
    );
}