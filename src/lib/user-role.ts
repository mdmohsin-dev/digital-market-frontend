export type UserRole =
    | "admin"
    | "customer";

export function getUserRole(): UserRole | null {
    if (typeof window === "undefined") {
        return null;
    }

    const role =
        localStorage.getItem("user-role");

    if (
        role === "admin" ||
        role === "customer"
    ) {
        return role;
    }

    return null;
}