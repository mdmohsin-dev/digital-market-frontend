"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import RoleSync from "@/components/auth/RoleSync";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-gray-50">
            {/* ================= SIDEBAR ================= */}
            <DashboardSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* ================= MAIN AREA ================= */}
            <div className="lg:ml-64 h-full">
                
                {/* ================= HEADER ================= */}
                <div className="fixed top-0 right-0 left-0 z-40 lg:left-64">
                    <DashboardHeader
                        onMenuClick={() => setSidebarOpen(true)}
                    />
                </div>

                {/* ================= CONTENT ================= */}
                <main className="h-full overflow-y-auto pt-16">
                    <div className="p-4 sm:p-6">
                        {children}
                        <RoleSync/>
                    </div>
                </main>
            </div>
        </div>
    );
}