"use client";

import Swal from "sweetalert2";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to logout?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "No",
            reverseButtons: true,
            focusCancel: true,
        });

        /*
         * User clicked No.
         */
        if (!result.isConfirmed) {
            return;
        }

        try {
            /*
             * Always try Better Auth sign out.
             *
             * For Demo Admin there may be no
             * Better Auth session, but that's okay.
             */
            await authClient.signOut();

            /*
             * Remove role.
             */
            localStorage.removeItem(
                "user-role"
            );

            /*
             * Remove Demo Admin data.
             */
            localStorage.removeItem(
                "demo-auth-user"
            );

            /*
             * Remove old demo auth data
             * if it exists from previous code.
             */
            localStorage.removeItem(
                "auth-user"
            );

            /*
             * Clean old sessionStorage data too.
             */
            sessionStorage.removeItem(
                "user-role"
            );

            sessionStorage.removeItem(
                "auth-user"
            );

            /*
             * Go back to login.
             */
            router.push("/login");
        } catch (error) {
            console.error(
                "Logout failed:",
                error
            );

            /*
             * Even if Better Auth signOut
             * fails, remove frontend demo data.
             */
            localStorage.removeItem(
                "user-role"
            );

            localStorage.removeItem(
                "demo-auth-user"
            );

            router.push("/login");
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="
                flex
                w-full
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                text-gray-400
                transition-colors
                hover:bg-white/5
                hover:text-white
            "
        >
            <LogOut size={19} />

            <span>Logout</span>
        </button>
    );
}