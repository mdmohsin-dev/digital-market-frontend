export type TrackingStatus =
    | "confirmed"
    | "processing"
    | "shipped"
    | "in-delivery-man"
    | "delivered"
    | "accepted";

export interface TrackingStep {
    id: TrackingStatus;
    title: string;
    description: string;
    date?: string;
    time?: string;
}

export interface TrackingOrder {
    id: string;
    orderId: string;
    placedAt: string;
    currentStatus: TrackingStatus;
    steps: TrackingStep[];
}