"use client";

import { authClient } from "@/lib/auth-client";

export function useUserSession() {
    const { data: session, isPending, error, refetch, } = authClient.useSession();

    return {
        session,
        user: session?.user ?? null,
        isLoggedIn: !!session,
        isPending,
        error,
        refetch,
    };
}