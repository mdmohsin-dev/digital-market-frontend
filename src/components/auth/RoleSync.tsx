"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

export default function RoleSync() {
    const {
        data: session,
        isPending,
    } = authClient.useSession();

    useEffect(() => {
        /*
         * Wait until Better Auth finishes
         * checking the session.
         */
        if (isPending) {
            return;
        }

        /*
         * No Better Auth session.
         *
         * This can happen for Demo Admin
         * because Demo Admin is currently
         * a frontend-only demo account.
         */
        if (!session?.user) {
            return;
        }

        /*
         * If Demo Admin data exists,
         * don't overwrite it here.
         */
        const demoUser =
            localStorage.getItem(
                "demo-auth-user"
            );

        if (demoUser) {
            return;
        }

        /*
         * Any Google authenticated user
         * is currently treated as customer.
         */
        localStorage.setItem(
            "user-role",
            "customer"
        );
    }, [session, isPending]);

    return null;
}