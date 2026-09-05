"use client";

import { authClient } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa6";

export default function GoogleLoginButton() {
    const handleGoogleLogin = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
            });

            /*
             * Google login successful হলে
             * customer role save হবে.
             */
            localStorage.setItem(
                "user-role",
                "customer"
            );

            /*
             * পুরোনো demo admin data থাকলে remove হবে.
             */
            localStorage.removeItem(
                "demo-auth-user"
            );
        } catch (error) {
            console.error(
                "Google login failed:",
                error
            );
        }
    };

    return (
        <button
            type="button"
            className="flex h-12 w-32 items-center justify-center cursor-pointer rounded-lg border border-gray-200 bg-white text-xl font-medium text-gray-900 transition-colors hover:bg-gray-50"
            aria-label="Continue with Google"
            onClick={handleGoogleLogin}
        >
            <FaGoogle />
        </button>
    );
}
