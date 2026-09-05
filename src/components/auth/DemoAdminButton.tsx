"use client";

import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { demoAdmin } from "@/config/demo-auth";
import { authClient } from "@/lib/auth-client";

export default function DemoAdminButton() {
    const router = useRouter();

    const handleAdminLogin = async () => {
        try {
            /*
             * If a Better Auth Google session
             * exists, sign it out first.
             *
             * This prevents Google customer
             * session and Demo Admin mode from
             * being active together.
             */
            await authClient.signOut();

            /*
             * Save admin role.
             */
            localStorage.setItem(
                "user-role",
                demoAdmin.role
            );

            /*
             * Save demo admin information.
             *
             * IMPORTANT:
             * This is temporary frontend demo data.
             * Never store real passwords this way
             * in a production application.
             */
            localStorage.setItem(
                "demo-auth-user",
                JSON.stringify({
                    name: demoAdmin.name,
                    email: demoAdmin.email,
                    password: demoAdmin.password,
                    role: demoAdmin.role,
                })
            );

            /*
             * Go to common dashboard.
             */
            router.push("/dashboard");
        } catch (error) {
            console.error(
                "Demo admin login failed:",
                error
            );
        }
    };

    return (
        <button
            type="button"
            onClick={handleAdminLogin}
            className="
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                text-base
                font-medium
                text-gray-900
                transition-colors
                hover:bg-gray-50
            "
        >
            <ShieldCheck size={21} />

            <span>
                Continue as Demo Admin
            </span>
        </button>
    );
}