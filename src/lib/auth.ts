import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

const env = {
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

if (!env.secret) {
  throw new Error("Missing BETTER_AUTH_SECRET environment variable.");
}

if (!env.googleClientId) {
  throw new Error("Missing GOOGLE_CLIENT_ID environment variable.");
}

if (!env.googleClientSecret) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable.");
}

export const auth = betterAuth({
  baseURL: env.baseURL,
  secret: env.secret,
  socialProviders: {
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      prompt: "select_account",
    },
  },
  plugins: [nextCookies()],
});
