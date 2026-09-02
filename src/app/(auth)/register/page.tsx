"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShoppingCart,
    User,
} from "lucide-react";
import { useState } from "react";

type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    const onSubmit = (data: RegisterFormData) => {
        console.log("Register Data:", data);

        // Later Better Auth registration logic will go here.
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center bg-white px-4 py-10">

            {/* Back Button */}
            <Link
                href="/"
                className="absolute left-5 top-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-black sm:left-8 sm:top-8"
            >
                <ArrowLeft size={18} />
                Back
            </Link>

            {/* Register Card */}
            <div className="w-full max-w-[610px] rounded-2xl border border-gray-200 bg-white px-6 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:px-12 sm:py-12">

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
                        <ShoppingCart
                            size={34}
                            strokeWidth={1.7}
                            className="text-gray-800"
                        />
                    </div>
                </div>

                {/* Heading */}
                <div className="mt-6 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-black">
                        Create Account
                    </h1>

                    <p className="mt-2 text-base text-gray-500">
                        Create your account to start shopping
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-9 space-y-5"
                >

                    {/* Name */}
                    <div>
                        <div
                            className={`flex h-13 items-center rounded-lg border bg-white px-4 transition-colors focus-within:border-black ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        >
                            <User
                                size={21}
                                className="shrink-0 text-gray-500"
                            />

                            <input
                                type="text"
                                placeholder="Full name"
                                autoComplete="name"
                                className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-black outline-none placeholder:text-gray-500"
                                {...register("name", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 2,
                                        message:
                                            "Name must be at least 2 characters",
                                    },
                                })}
                            />
                        </div>

                        {errors.name && (
                            <p className="mt-1.5 text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <div
                            className={`flex h-13 items-center rounded-lg border bg-white px-4 transition-colors focus-within:border-black ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        >
                            <Mail
                                size={21}
                                className="shrink-0 text-gray-500"
                            />

                            <input
                                type="email"
                                placeholder="Email address"
                                autoComplete="email"
                                className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-black outline-none placeholder:text-gray-500"
                                {...register("email", {
                                    required: "Email address is required",
                                    pattern: {
                                        value:
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message:
                                            "Please enter a valid email address",
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
                            className={`flex h-13 items-center rounded-lg border bg-white px-4 transition-colors focus-within:border-black ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        >
                            <LockKeyhole
                                size={21}
                                className="shrink-0 text-gray-500"
                            />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Password"
                                autoComplete="new-password"
                                className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-black outline-none placeholder:text-gray-500"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password must be at least 8 characters",
                                    },
                                })}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="shrink-0 text-gray-500 transition-colors hover:text-black"
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

                    {/* Confirm Password */}
                    <div>
                        <div
                            className={`flex h-13 items-center rounded-lg border bg-white px-4 transition-colors focus-within:border-black ${
                                errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        >
                            <LockKeyhole
                                size={21}
                                className="shrink-0 text-gray-500"
                            />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-black outline-none placeholder:text-gray-500"
                                {...register("confirmPassword", {
                                    required:
                                        "Please confirm your password",
                                    validate: (value) =>
                                        value === password ||
                                        "Passwords do not match",
                                })}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (prev) => !prev
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                                className="shrink-0 text-gray-500 transition-colors hover:text-black"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={21} />
                                ) : (
                                    <Eye size={21} />
                                )}
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-sm text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3 pt-1">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-black"
                        />

                        <label
                            htmlFor="terms"
                            className="text-sm leading-5 text-gray-500"
                        >
                            I agree to the{" "}
                            <Link
                                href="/terms"
                                className="font-medium text-black underline underline-offset-2"
                            >
                                Terms & Conditions
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="font-medium text-black underline underline-offset-2"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </label>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="flex h-13 w-full items-center justify-center rounded-lg bg-black text-base font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        Create Account
                    </button>
                </form>

                {/* Divider */}
                <div className="my-8 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200" />

                    <span className="text-sm font-medium text-gray-500">
                        OR CONTINUE WITH
                    </span>

                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-3 gap-3">

                    {/* Google */}
                    <button
                        type="button"
                        className="flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl font-semibold text-black transition-colors hover:bg-gray-50"
                        aria-label="Continue with Google"
                    >
                        G
                    </button>

                    {/* Apple */}
                    <button
                        type="button"
                        className="flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl text-black transition-colors hover:bg-gray-50"
                        aria-label="Continue with Apple"
                    >
                        
                    </button>

                    {/* Meta */}
                    <button
                        type="button"
                        className="flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl font-semibold text-black transition-colors hover:bg-gray-50"
                        aria-label="Continue with Meta"
                    >
                        ∞
                    </button>
                </div>

                {/* Login Link */}
                <p className="mt-8 text-center text-base text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-black underline underline-offset-2 transition-opacity hover:opacity-70"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}