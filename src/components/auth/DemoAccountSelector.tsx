"use client";

import { demoAccounts } from "@/config/demo-auth";

type DemoRole = "admin" | "customer";

interface DemoAccountSelectorProps {
    selectedRole: DemoRole | null;
    onSelect: (
        role: DemoRole,
        email: string,
        password: string
    ) => void;
}

export default function DemoAccountSelector({
    selectedRole,
    onSelect,
}: DemoAccountSelectorProps) {
    const handleSelect = (role: DemoRole) => {
        const account = demoAccounts[role];

        onSelect(
            role,
            account.email,
            account.password
        );
    };

    return (
        <div className="rounded-lg border border-gray-200 mt-4 bg-gray-50 p-3">
            <p className="mb-3 text-center text-sm font-medium text-gray-600">
                Demo Account
            </p>

            <div className="grid grid-cols-2 gap-3">
                {/* Admin */}
                <button
                    type="button"
                    onClick={() => handleSelect("admin")}
                    className={`h-11 rounded-md border text-sm font-medium transition-colors duration-300 ${
                        selectedRole === "admin"
                            ? "bg-primary text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-primary hover:text-white"
                    }`}
                >
                    Admin
                </button>

                {/* Customer */}
                <button
                    type="button"
                    onClick={() => handleSelect("customer")}
                    className={`h-11 rounded-md border text-sm font-medium transition-colors duration-300 ${
                        selectedRole === "customer"
                            ? " bg-primary text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-primary hover:text-white"
                    }`}
                >
                    Customer
                </button>
            </div>
        </div>
    );
}