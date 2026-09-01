export interface CartItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
}

export const CART_STORAGE_KEY = "cart";
export const CART_UPDATED_EVENT = "cartUpdated";

export const getCart = (): CartItem[] => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);

        if (!storedCart) {
            return [];
        }

        const parsedCart = JSON.parse(storedCart);

        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
        return [];
    }
};

const notifyCartUpdated = () => {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(
        new CustomEvent(CART_UPDATED_EVENT),
    );
};

export const addToCart = (item: CartItem) => {
    if (typeof window === "undefined") {
        return;
    }

    const existingCart = getCart();

    const existingItemIndex =
        existingCart.findIndex(
            (cartItem) =>
                cartItem.productId === item.productId &&
                cartItem.size === item.size &&
                cartItem.color === item.color,
        );

    if (existingItemIndex !== -1) {
        existingCart[existingItemIndex] = {
            ...existingCart[existingItemIndex],
            quantity:
                existingCart[existingItemIndex].quantity +
                item.quantity,
        };
    } else {
        existingCart.push(item);
    }

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(existingCart),
    );

    notifyCartUpdated();
};

export const removeFromCart = (
    productId: string,
    size: string,
    color: string,
) => {
    if (typeof window === "undefined") {
        return;
    }

    const updatedCart = getCart().filter(
        (item) =>
            !(
                item.productId === productId &&
                item.size === size &&
                item.color === color
            ),
    );

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(updatedCart),
    );

    notifyCartUpdated();
};

export const updateCartItemQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number,
) => {
    if (typeof window === "undefined") {
        return;
    }

    if (quantity <= 0) {
        removeFromCart(productId, size, color);
        return;
    }

    const updatedCart = getCart().map((item) => {
        if (
            item.productId === productId &&
            item.size === size &&
            item.color === color
        ) {
            return {
                ...item,
                quantity,
            };
        }

        return item;
    });

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(updatedCart),
    );

    notifyCartUpdated();
};

export const getCartCount = (): number => {
    return getCart().length;
};