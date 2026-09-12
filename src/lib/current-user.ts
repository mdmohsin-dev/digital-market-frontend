import type { UserRole } from "@/types/user";
import { DEFAULT_USER_ROLE } from "@/lib/user-role";

interface AuthSessionUser {
    id: string;
    name?: string | null;
    email: string;
}

interface AuthSession {
    user?: AuthSessionUser;
}

export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export function createCurrentUser(
    session: AuthSession | null | undefined
): CurrentUser | null {
    if (!session?.user) {
        return null;
    }

    return {
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email,
        role: DEFAULT_USER_ROLE,
    };
}