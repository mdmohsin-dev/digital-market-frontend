"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    X,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import { authClient } from "@/lib/auth-client";
import { createCurrentUser } from "@/lib/current-user";

interface DashboardSidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function DashboardSidebar({
    open,
    onClose,
}: DashboardSidebarProps) {
    const pathname = usePathname();

    const { data: session, isPending } =
        authClient.useSession();

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (isPending) {
            return;
        }

        const user = createCurrentUser(session);

        setIsAdmin(user?.role === "admin");
    }, [session, isPending]);

    const isItemActive = (href: string) => {
        return href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);
    };

    return (
        <aside
            className={`
                fixed
                inset-y-0
                left-0
                z-50
                flex
                h-screen
                w-64
                shrink-0
                flex-col
                border-r
                border-gray-800
                bg-[#181818]
                text-white
                shadow-xl
                transition-transform
                duration-300
                ease-in-out
                lg:translate-x-0
                lg:shadow-none
                ${
                    open
                        ? "translate-x-0"
                        : "-translate-x-full"
                }
            `}
        >
            <div
                className="
                    flex
                    h-20
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-gray-800
                    px-6
                "
            >
                <Link
                    href="/"
                    onClick={onClose}
                    className="text-xl font-semibold tracking-wide"
                >
                    Kalni
                </Link>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close sidebar"
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-md
                        text-gray-400
                        transition-colors
                        hover:bg-white/5
                        hover:text-white
                        lg:hidden
                    "
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/dashboard"
                            onClick={onClose}
                            className={`
                                flex
                                items-center
                                gap-3
                                rounded-lg
                                px-4
                                py-3
                                text-sm
                                font-medium
                                transition-colors
                                ${
                                    isItemActive("/dashboard")
                                        ? "bg-primary text-white"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >
                            <LayoutDashboard size={19} />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/dashboard/orders"
                            onClick={onClose}
                            className={`
                                flex
                                items-center
                                gap-3
                                rounded-lg
                                px-4
                                py-3
                                text-sm
                                font-medium
                                transition-colors
                                ${
                                    isItemActive("/dashboard/orders")
                                        ? "bg-primary text-white"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >
                            <ShoppingBag size={19} />
                            <span>Orders</span>
                        </Link>
                    </li>

                    {isAdmin && (
                        <li>
                            <Link
                                href="/dashboard/customers"
                                onClick={onClose}
                                className={`
                                    flex
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    transition-colors
                                    ${
                                        isItemActive(
                                            "/dashboard/customers"
                                        )
                                            ? "bg-primary text-white"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }
                                `}
                            >
                                <Users size={19} />
                                <span>Customers</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="shrink-0 border-t border-gray-800 p-4">
                <LogoutButton />
            </div>
        </aside>
    );
}