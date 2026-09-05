export const demoAccounts = {
    admin: {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin" as const,
    },

    customer: {
        name: "Demo Customer",
        email: "customer@example.com",
        password: "customer123",
        role: "customer" as const,
    },
};