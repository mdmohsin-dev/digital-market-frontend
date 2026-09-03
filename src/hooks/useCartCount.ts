"use client";

import { useEffect, useState } from "react";
import {getCartCount,CART_UPDATED_EVENT,} from "@/lib/cart";

export function useCartCount() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCartCount = () => {
            setCartCount(getCartCount());
        };

        updateCartCount();

        window.addEventListener(
            CART_UPDATED_EVENT,
            updateCartCount,
        );

        window.addEventListener(
            "storage",
            updateCartCount,
        );

        return () => {
            window.removeEventListener(
                CART_UPDATED_EVENT,
                updateCartCount,
            );

            window.removeEventListener(
                "storage",
                updateCartCount,
            );
        };
    }, []);

    return cartCount;
}