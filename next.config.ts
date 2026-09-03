import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            // future-e onno OAuth provider (GitHub, Facebook etc) add korle
            // egula-o ekhane add korte hobe
        ],
    },
};

export default nextConfig;