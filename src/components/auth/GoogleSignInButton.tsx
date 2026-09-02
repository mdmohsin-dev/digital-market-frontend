"use client";

import { authClient } from "@/lib/auth-client";

export function GoogleSignInButton({
  label = "Continue with Google",
}: {
  label?: string;
}) {
  const handleGoogleSignIn = async () => {
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    const redirectUrl =
      typeof result === "string"
        ? result
        : result && typeof result === "object" && "data" in result && result.data && typeof result.data === "object" && "url" in result.data
          ? String(result.data.url)
          : undefined;

    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
    >
      <span aria-hidden="true">G</span>
      <span>{label}</span>
    </button>
  );
}
