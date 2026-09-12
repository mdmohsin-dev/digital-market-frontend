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

        if (!result.isConfirmed) {
            return;
        }

        try {
            await authClient.signOut();

            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);

            Swal.fire({
                title: "Logout Failed",
                text: "Something went wrong. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
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