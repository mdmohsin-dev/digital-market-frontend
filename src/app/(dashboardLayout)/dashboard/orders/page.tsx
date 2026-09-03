export default function OrdersPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-foreground">
                My Orders
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
                View and manage your orders.
            </p>

            <div className="mt-6 rounded-xl border bg-white p-8 text-center">
                <p className="text-sm text-muted-foreground">
                    No orders found.
                </p>
            </div>
        </div>
    );
}