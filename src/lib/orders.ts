export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export type PaymentMethod =
    | "cod"
    | "card"
    | "rocket"
    | "bkash"
    | "nagad";

export type DeliveryInfo = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
};

export type OrderItem = {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
};

export type Order = {
    id: string;
    items: OrderItem[];
    deliveryInfo: DeliveryInfo;
    paymentMethod: PaymentMethod;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    status: OrderStatus;
    createdAt: string;
};

const ORDERS_STORAGE_KEY = "orders";

export const getOrders = (): Order[] => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const orders = localStorage.getItem(ORDERS_STORAGE_KEY);

        if (!orders) {
            return [];
        }

        return JSON.parse(orders) as Order[];
    } catch {
        return [];
    }
};

export const getOrderById = (orderId: string): Order | null => {
    const orders = getOrders();

    return orders.find((order) => order.id === orderId) ?? null;
};

export const saveOrder = (order: Order): void => {
    if (typeof window === "undefined") {
        return;
    }

    const orders = getOrders();

    localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify([order, ...orders]),
    );
};

export const generateOrderId = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();

    const random = Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();

    return `ORD-${timestamp}-${random}`;
};