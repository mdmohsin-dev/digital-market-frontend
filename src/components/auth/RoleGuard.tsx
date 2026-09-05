"use client";

import { authClient } from "@/lib/auth-client";
import { ReactNode } from "react";

interface RoleGuardProps {
    role: "admin" | "user";
    children: ReactNode;
    fallback?: ReactNode;
}

export default function RoleGuard({
    role,
    children,
    fallback = null,
}: RoleGuardProps) {
    const { data: session, isPending } =
        authClient.useSession();

    if (isPending) {
        return null;
    }

    if (!session?.user) {
        return <>{fallback}</>;
    }

    if (session.user.role !== role) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}