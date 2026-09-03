import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <DashboardSidebar />

                {/* Main Area */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Dashboard Header */}
                    <header className="flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-4 sm:px-6">
                        <h2 className="text-lg font-semibold text-foreground">
                            My Account
                        </h2>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-4 sm:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}