"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    UserRound,
    MapPin,
    Settings,
} from "lucide-react";

const sidebarItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "My Orders",
        href: "/dashboard/orders",
        icon: ShoppingBag,
    },
    {
        label: "Wishlist",
        href: "/dashboard/wishlist",
        icon: Heart,
    },
    {
        label: "Profile",
        href: "/dashboard/profile",
        icon: UserRound,
    },
    {
        label: "Address",
        href: "/dashboard/address",
        icon: MapPin,
    },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-gray-800 bg-[#181818] text-white lg:flex">
            {/* Logo */}
            <div className="flex h-20 items-center border-b border-gray-800 px-6">
                <Link
                    href="/"
                    className="text-xl font-semibold tracking-wide"
                >
                    Kalni
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <Icon size={19} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Settings */}
            <div className="border-t border-gray-800 p-4">
                <Link
                    href="/dashboard/settings"
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        pathname.startsWith("/dashboard/settings")
                            ? "bg-primary text-white"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                    <Settings size={19} />
                    <span>Settings</span>
                </Link>
            </div>
        </aside>
    );
}