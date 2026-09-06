import type { CartItem } from "@/lib/cart";

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

export type PaymentMethod =
    | "cod"
    | "card"
    | "rocket"
    | "bkash"
    | "nagad";

export interface DeliveryInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface OrderItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
}

export interface Order {
    id: string;
    items: OrderItem[];
    deliveryInfo: DeliveryInfo;
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    status: OrderStatus;
    createdAt: string;
}

export const ORDER_STORAGE_KEY = "orders";

export const generateOrderId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `ORD-${timestamp}-${random}`;
};

export const getOrders = (): Order[] => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const storedOrders =
            localStorage.getItem(ORDER_STORAGE_KEY);

        if (!storedOrders) {
            return [];
        }

        const parsedOrders = JSON.parse(storedOrders);

        return Array.isArray(parsedOrders)
            ? parsedOrders
            : [];
    } catch {
        return [];
    }
};

export const saveOrder = (order: Order): void => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        const existingOrders = getOrders();

        const updatedOrders = [
            order,
            ...existingOrders,
        ];

        localStorage.setItem(
            ORDER_STORAGE_KEY,
            JSON.stringify(updatedOrders),
        );
    } catch (error) {
        console.error("Failed to save order:", error);
    }
};

export const getOrdersByEmail = (
    email: string,
): Order[] => {
    if (!email.trim()) {
        return [];
    }

    const normalizedEmail = email
        .trim()
        .toLowerCase();

    return getOrders().filter(
        (order) =>
            order.deliveryInfo.email
                .trim()
                .toLowerCase() === normalizedEmail,
    );
};

export const getOrderById = (
    orderId: string,
): Order | null => {
    const orders = getOrders();

    return (
        orders.find(
            (order) => order.id === orderId,
        ) ?? null
    );
};

export const clearOrders = (): void => {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(ORDER_STORAGE_KEY);
};