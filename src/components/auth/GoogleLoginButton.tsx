"use client";

import { authClient } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa6";

export default function GoogleLoginButton() {
    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
        });
    };

    return (
        <button
            type="button"
            className="flex h-12 w-32 items-center justify-center cursor-pointer rounded-lg border border-gray-200 bg-white text-xl font-medium text-gray-900 transition-colors hover:bg-gray-50"
            aria-label="Continue with Google"
            onClick={handleGoogleLogin}>
            <FaGoogle />
        </button>
    );
}