export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "in-delivery-man"
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



export const updateOrderStatus = (
    orderId: string,
    status: string,
): boolean => {
    if (typeof window === "undefined") {
        return false;
    }

    const storedOrders =
        localStorage.getItem(ORDER_STORAGE_KEY);

    if (!storedOrders) {
        return false;
    }

    try {
        const orders = JSON.parse(
            storedOrders,
        ) as Array<Record<string, unknown>>;

        const normalizedOrderId =
            orderId.trim().toUpperCase();

        const orderIndex = orders.findIndex(
            (order) =>
                typeof order.id === "string" &&
                order.id.trim().toUpperCase() ===
                normalizedOrderId,
        );

        if (orderIndex === -1) {
            return false;
        }

        orders[orderIndex] = {
            ...orders[orderIndex],
            status,
            updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(
            ORDER_STORAGE_KEY,
            JSON.stringify(orders),
        );

        /**
         * Same-tab update event.
         *
         * The browser "storage" event does not fire
         * in the same tab that changed localStorage.
         *
         * So Track Order listens to this custom event.
         */
        window.dispatchEvent(
            new CustomEvent(
                "ORDER_STATUS_UPDATED",
            ),
        );

        return true;
    } catch {
        return false;
    }
};