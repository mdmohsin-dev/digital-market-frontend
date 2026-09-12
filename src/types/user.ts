export type UserRole = "admin" | "customer";

export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}