"use client";

import {
    Bell,
    Menu,
    Search,
} from "lucide-react";

type DashboardHeaderProps = {
    onMenuClick?: () => void;
};

export default function DashboardHeader({
    onMenuClick,
}: DashboardHeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
            {/* Left */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
                {/* Mobile Menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="shrink-0 text-muted-foreground lg:hidden"
                    aria-label="Open dashboard menu"
                >
                    <Menu size={22} />
                </button>

                {/* Search */}
                <div className="hidden w-full max-w-md items-center gap-2 rounded-lg bg-muted px-3 py-2 sm:flex">
                    <Search
                        size={18}
                        className="shrink-0 text-muted-foreground"
                    />

                    <input
                        type="search"
                        placeholder="Search..."
                        className="
                            min-w-0 flex-1
                            bg-transparent
                            text-sm
                            text-foreground
                            outline-none
                            placeholder:text-muted-foreground
                        "
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 sm:gap-5">
                {/* Notification */}
                <button
                    type="button"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Notifications"
                >
                    <Bell size={20} />

                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-badge" />
                </button>

                {/* User */}
                <div className="hidden items-center gap-3 sm:flex">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        M
                    </div>

                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-foreground">
                            My Account
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Customer
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}