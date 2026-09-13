import { TrackingStatus } from "@/types/tracking";

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
        status: "accepted",
        title: "Order Accepted",
        description: "Your order has been accepted successfully.",
    },
    {
        status: "processing",
        title: "Processing",
        description: "Your order is being prepared for shipment.",
    },
    {
        status: "on-the-way",
        title: "On the Way",
        description: "Your parcel is on the way to your location.",
    },
    {
        status: "with-deliveryman",
        title: "With Deliveryman",
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
 * Maps the actual order status to the tracking UI status.
 *
 * Frontend/localStorage stage now:
 * pending / confirmed -> accepted
 * processing          -> processing
 * shipped             -> on-the-way
 * out-for-delivery    -> with-deliveryman
 * delivered           -> delivered
 *
 * Later the backend can return the same statuses
 * without changing the tracking UI.
 */
export const mapOrderStatusToTrackingStatus = (
    orderStatus: string,
): TrackingStatus => {
    switch (orderStatus) {
        case "pending":
        case "confirmed":
            return "accepted";

        case "processing":
            return "processing";

        case "shipped":
            return "on-the-way";

        case "out-for-delivery":
            return "with-deliveryman";

        case "delivered":
            return "delivered";

        default:
            return "accepted";
    }
};

export const getTrackingStepIndex = (
    status: TrackingStatus,
): number => {
    return TRACKING_STEPS.findIndex(
        (step) => step.status === status,
    );
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
 * Creates tracking data from the actual order status.
 *
 * No timer.
 * No fake automatic progression.
 * The current order status is the source of truth.
 */
export const getTrackingDataFromOrderStatus = (
    orderStatus: string,
    createdAt: string,
): OrderTrackingData => {
    const trackingStatus =
        mapOrderStatusToTrackingStatus(orderStatus);

    const currentIndex =
        getTrackingStepIndex(trackingStatus);

    const createdTime = new Date(createdAt);

    const safeCreatedAt = Number.isNaN(createdTime.getTime())
        ? new Date().toISOString()
        : createdTime.toISOString();

    const trackingHistory: TrackingEvent[] =
        TRACKING_STEPS.slice(0, currentIndex + 1).map(
            (step, index) => ({
                status: step.status,
                title: step.title,
                description: step.description,
                timestamp:
                    index === 0
                        ? safeCreatedAt
                        : safeCreatedAt,
            }),
        );

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