"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ChevronDown, Menu } from "lucide-react";
import { LuUserRound } from "react-icons/lu";

import { useUserSession } from "@/hooks/useUserSession";

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export default function DashboardHeader({
    onMenuClick,
}: DashboardHeaderProps) {
    const [mounted, setMounted] = useState(false);

    const {
        user,
        isLoggedIn,
        isPending,
    } = useUserSession();

    useEffect(() => {
        setMounted(true);
    }, []);

    const showLoading = !mounted || isPending;

    const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 17) {
        return "Good afternoon";
    }

    return "Good evening";
};

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
            {/* =====================================================
                LEFT SIDE
            ====================================================== */}
            <div className="flex min-w-0 items-center gap-3">
                {/* Mobile / Tablet Menu Button */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Toggle dashboard sidebar"
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        text-gray-600
                        transition-colors
                        hover:bg-gray-100
                        hover:text-gray-900
                        lg:hidden
                    "
                >
                    <Menu size={22} />
                </button>

                {/* Greeting */}
                <h1 className="truncate text-3xl font-semibold text-gray-800">
                    {showLoading
                        ? "Welcome"
                        : isLoggedIn && user
                            ? `${getGreeting()}, ${user.name}`
                            : "Welcome, Guest"}
                </h1>
            </div>

            {/* =====================================================
                RIGHT SIDE - USER
            ====================================================== */}
            <Link
                href="/dashboard/profile"
                className="
                    flex
                    shrink-0
                    items-center
                    gap-3
                    rounded-md
                    px-2
                    py-1.5
                    transition-colors
                    hover:bg-gray-50
                "
            >
                {/* =================================================
                    PROFILE IMAGE / FALLBACK ICON
                ================================================== */}
                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-gray-100
                    "
                >
                    {mounted && user?.image ? (
                        <Image
                            src={user.image}
                            alt={user.name || "User profile"}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <LuUserRound
                            size={22}
                            className="text-gray-500"
                        />
                    )}
                </div>

                {/* =================================================
                    USER INFO
                ================================================== */}
                <div className="hidden sm:block">
                    {showLoading ? (
                        <>
                            <p className="text-sm font-semibold text-gray-400">
                                Loading...
                            </p>

                            <p className="text-xs text-gray-400">
                                Account
                            </p>
                        </>
                    ) : isLoggedIn && user ? (
                        <p className="max-w-40 truncate text-sm font-semibold text-gray-800">
                            {user.name}
                        </p>
                    ) : (
                        <>
                            <p className="text-sm font-semibold text-gray-800">
                                Guest
                            </p>

                            <p className="text-xs text-gray-500">
                                Not logged in
                            </p>
                        </>
                    )}
                </div>

                {/* Dropdown Icon */}
                <ChevronDown
                    size={19}
                    className="text-gray-400"
                />
            </Link>
        </header>
    );
}