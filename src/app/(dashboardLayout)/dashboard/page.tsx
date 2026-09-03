export default function DashboardPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Welcome to your account.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-white p-5">
                    <p className="text-sm text-muted-foreground">
                        Total Orders
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                        0
                    </h2>
                </div>

                <div className="rounded-xl border bg-white p-5">
                    <p className="text-sm text-muted-foreground">
                        Wishlist
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                        0
                    </h2>
                </div>

                <div className="rounded-xl border bg-white p-5">
                    <p className="text-sm text-muted-foreground">
                        Account
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                        Active
                    </h2>
                </div>
            </div>
        </div>
    );
}