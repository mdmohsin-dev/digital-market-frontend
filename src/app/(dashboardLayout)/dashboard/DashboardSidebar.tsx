"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    X,
    Package,
    Users,
    Tags,
} from "lucide-react";
import { useEffect, useState } from "react";

import LogoutButton from "@/components/auth/LogoutButton";

type UserRole = "admin" | "customer";

interface SidebarItem {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    roles: UserRole[];
}

const sidebarItems: SidebarItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["admin", "customer"],
    },
    {
        label: "Products",
        href: "/dashboard/products",
        icon: Package,
        roles: ["admin"],
    },
    {
        label: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingBag,
        roles: ["admin"],
    },
    {
        label: "My Orders",
        href: "/dashboard/my-orders",
        icon: ShoppingBag,
        roles: ["customer"],
    },
    {
        label: "Customers",
        href: "/dashboard/customers",
        icon: Users,
        roles: ["admin"],
    },
    {
        label: "Categories",
        href: "/dashboard/categories",
        icon: Tags,
        roles: ["admin"],
    },
];

interface DashboardSidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function DashboardSidebar({
    open,
    onClose,
}: DashboardSidebarProps) {
    const pathname = usePathname();

    const [role, setRole] = useState<UserRole | null>(
        null
    );

    /*
     * Get logged-in user's role
     */

    useEffect(() => {
        const storedRole =
            localStorage.getItem("user-role");

        if (
            storedRole === "admin" ||
            storedRole === "customer"
        ) {
            setRole(storedRole);
        }
    }, []);

    const isItemActive = (href: string) => {
        return href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);
    };

    /*
     * Show only items allowed for current role
     */

    const visibleSidebarItems = sidebarItems.filter(
        (item) =>
            role !== null &&
            item.roles.includes(role)
    );

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
            {/* =====================================================
                SIDEBAR HEADER
            ====================================================== */}

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

                {/* Mobile / Tablet Close Button */}

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

            {/* =====================================================
                NAVIGATION
            ====================================================== */}

            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-2">
                    {visibleSidebarItems.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            isItemActive(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
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
                                            isActive
                                                ? "bg-primary text-white"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }
                                    `}
                                >
                                    <Icon size={19} />

                                    <span>
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/*LOGOUT*/}

            <div className="shrink-0 border-t border-gray-800 p-4">
                <LogoutButton />
            </div>
        </aside>
    );
}