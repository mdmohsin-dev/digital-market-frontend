export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
}

const CART_STORAGE_KEY = "cart";

// =========================================================
// GET CART
// =========================================================

export const getCart = (): CartItem[] => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const storedCart = localStorage.getItem(
            CART_STORAGE_KEY
        );

        if (!storedCart) {
            return [];
        }

        const parsedCart = JSON.parse(storedCart);

        return Array.isArray(parsedCart)
            ? parsedCart
            : [];
    } catch {
        return [];
    }
};

// =========================================================
// SAVE CART
// =========================================================

const saveCart = (cart: CartItem[]) => {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );
};

// =========================================================
// ADD TO CART
// =========================================================

export const addToCart = (
    newItem: CartItem
): CartItem[] => {
    const cart = getCart();

    const existingItemIndex = cart.findIndex(
        (item) =>
            item.productId === newItem.productId &&
            item.size === newItem.size &&
            item.color === newItem.color
    );

    if (existingItemIndex !== -1) {
        cart[existingItemIndex] = {
            ...cart[existingItemIndex],
            quantity:
                cart[existingItemIndex].quantity +
                newItem.quantity,
        };
    } else {
        cart.push(newItem);
    }

    saveCart(cart);

    return cart;
};

// =========================================================
// CLEAR CART
// =========================================================

export const clearCart = () => {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(CART_STORAGE_KEY);
};