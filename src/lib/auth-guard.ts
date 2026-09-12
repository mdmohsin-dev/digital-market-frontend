import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { CurrentUser } from "@/types/user";

export async function requireAuth(): Promise<CurrentUser> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    return {
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email,
        role: "customer",
    };
}

export async function requireAdmin(): Promise<CurrentUser> {
    const user = await requireAuth();

    if (user.role !== "admin") {
        redirect("/dashboard");
    }

    return user;
}