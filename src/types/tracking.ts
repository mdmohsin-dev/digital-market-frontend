export type TrackingStatus =
    | "accepted"
    | "processing"
    | "on-the-way"
    | "with-deliveryman"
    | "delivered";

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