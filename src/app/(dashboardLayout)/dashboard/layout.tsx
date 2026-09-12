import DashboardLayoutClient from "@/components/Dashboard/DashboardLayoutClient";
import { requireAuth } from "@/lib/auth-guard";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    await requireAuth();

    return (
        <DashboardLayoutClient>
            {children}
        </DashboardLayoutClient>
    );
}