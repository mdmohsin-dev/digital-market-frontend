import type { TrackingStatus } from "@/types/tracking";

export interface TrackingEvent {
    status: TrackingStatus;
    title: string;
    description: string;
    timestamp: string;
}

export interface OrderTrackingData {
    trackingStatus: TrackingStatus;
    trackingHistory: TrackingEvent[];
}

export const TRACKING_STEPS: Array<{
    status: TrackingStatus;
    title: string;
    description: string;
}> = [
        {
            status: "confirmed",
            title: "Order Confirmed",
            description: "Your order has been Confirmed successfully.",
        },
        {
            status: "processing",
            title: "Processing",
            description: "Your order is being prepared for shipment.",
        },
        {
            status: "shipped",
            title: "On the Way",
            description: "Your parcel is on the way to your location.",
        },
        {
            status: "in-delivery-man",
            title: "In Delivery man",
            description:
                "Your parcel is with the deliveryman and will arrive soon.",
        },
        {
            status: "delivered",
            title: "Delivered",
            description: "Your order has been delivered successfully.",
        },
    ];

/**
 * Converts the actual order status into
 * the tracking status used by the UI.
 *
 * Current frontend stage:
 * order.status comes from localStorage.
 *
 * Future:
 * order.status will come from PostgreSQL/API.
 */
export const mapOrderStatusToTrackingStatus = (
    orderStatus: string,
): TrackingStatus => {
    switch (orderStatus) {
        case "pending":
        case "confirmed":
            return "confirmed";

        case "processing":
            return "processing";

        case "shipped":
            return "shipped";

        case "out-for-delivery":
            return "in-delivery-man";

        case "delivered":
            return "delivered";

        default:
            return "accepted";
    }
};

export const getTrackingStepIndex = (
    status: TrackingStatus,
): number => {
    const index = TRACKING_STEPS.findIndex(
        (step) => step.status === status,
    );

    return index >= 0 ? index : 0;
};

export const getTrackingStep = (
    status: TrackingStatus,
) => {
    return (
        TRACKING_STEPS.find(
            (step) => step.status === status,
        ) ?? TRACKING_STEPS[0]
    );
};

/**
 * Creates tracking history from the current order status.
 *
 * This is temporary frontend/mock behavior.
 *
 * Later, the backend can return real tracking history
 * with different timestamps for each status.
 */
export const getTrackingDataFromOrderStatus = (
    orderStatus: string,
    createdAt: string,
): OrderTrackingData => {
    const trackingStatus =
        mapOrderStatusToTrackingStatus(orderStatus);

    const currentIndex =
        getTrackingStepIndex(trackingStatus);

    const createdDate = new Date(createdAt);

    const safeCreatedAt = Number.isNaN(
        createdDate.getTime(),
    )
        ? new Date().toISOString()
        : createdDate.toISOString();

    const trackingHistory: TrackingEvent[] =
        TRACKING_STEPS
            .slice(0, currentIndex + 1)
            .map((step) => ({
                status: step.status,
                title: step.title,
                description: step.description,
                timestamp: safeCreatedAt,
            }));

    return {
        trackingStatus,
        trackingHistory,
    };
};

export const formatTrackingDate = (
    timestamp: string,
): string => {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};