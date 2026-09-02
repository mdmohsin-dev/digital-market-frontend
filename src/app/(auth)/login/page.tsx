"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, ShoppingCart, } from "lucide-react";
import { BsArrowLeft } from "react-icons/bs";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

type LoginFormData = { email: string; password: string; rememberMe: boolean; };

export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = (data: LoginFormData) => {
        console.log("Login Form Data:", data);

        // Later:
        // Better Auth login logic will be added here.
    };

    return (
        <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
            <Link
                href="/"
                className="absolute left-5 top-5 inline-flex items-center gap-2 text-md font-medium text-gray-600 transition-colors hover:text-gray-950 sm:left-8 sm:top-8"
            >
                <BsArrowLeft size={25} />
                Back
            </Link>
            <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
                <div className="w-full max-w-[550px] rounded-2xl border border-gray-200 bg-white px-6 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:px-10 sm:py-12 md:px-12">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
                            <ShoppingCart
                                size={36}
                                strokeWidth={1.8}
                                className="text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mt-7 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                            Welcome Back!
                        </h1>

                        <p className="mt-3 text-base text-gray-500 sm:text-lg">
                            Sign in to continue your journey
                        </p>
                    </div>

                    {/* Login Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-10 space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <div
                                className={`flex h-14 items-center rounded-lg border bg-white px-4 transition-colors ${errors.email
                                    ? "border-red-500"
                                    : "border-gray-300 focus-within:border-gray-500"
                                    }`}
                            >
                                <Mail
                                    size={22}
                                    strokeWidth={1.8}
                                    className="shrink-0 text-gray-500"
                                />

                                <input
                                    type="email"
                                    placeholder="me@example.com"
                                    autoComplete="email"
                                    className="ml-3 h-full min-w-0 flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-500"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message:
                                                "Please enter a valid email",
                                        },
                                    })}
                                />
                            </div>

                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div
                                className={`flex h-14 items-center rounded-lg border bg-white px-4 transition-colors ${errors.password
                                    ? "border-red-500"
                                    : "border-gray-300 focus-within:border-gray-500"
                                    }`}
                            >
                                <Lock
                                    size={22}
                                    strokeWidth={1.8}
                                    className="shrink-0 text-gray-500"
                                />

                                <input
                                    type={
                                        showPassword ? "text" : "password"
                                    }
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    className="ml-3 h-full min-w-0 flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-500"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Password must be at least 6 characters",
                                        },
                                    })}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((value) => !value)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="ml-2 shrink-0 text-gray-500 transition-colors hover:text-gray-900"
                                >
                                    {showPassword ? (
                                        <EyeOff size={21} />
                                    ) : (
                                        <Eye size={21} />
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between gap-4 pt-1">
                            <label className="flex cursor-pointer items-center gap-2.5">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 cursor-pointer rounded border-gray-300 accent-black"
                                    {...register("rememberMe")}
                                />

                                <span className="text-sm text-gray-600 sm:text-base">
                                    Remember me
                                </span>
                            </label>

                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-gray-900 transition-opacity hover:opacity-60 sm:text-base"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Sign In */}
                        <button
                            type="submit"
                            className="flex h-14 w-full items-center justify-center rounded-lg bg-gray-950 text-base font-semibold text-white transition-colors hover:bg-gray-800"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />

                        <span className="text-sm font-medium text-gray-500">
                            OR CONTINUE WITH
                        </span>

                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* Social Login */}
                    <div className="w-full flex justify-center">
                        {/* Google */}
                        <GoogleLoginButton />
                    </div>

                    {/* Register */}
                    <p className="mt-8 text-center text-sm text-gray-700 sm:text-base">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-gray-950 underline underline-offset-2 transition-opacity hover:opacity-60"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}