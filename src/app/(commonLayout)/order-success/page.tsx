import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";

type OrderSuccessPageProps = { searchParams: Promise<{ orderId?: string; }>; };

export default async function OrderSuccessPage({ searchParams, }: OrderSuccessPageProps) {
    const { orderId } = await searchParams;

    return (
        <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-4 py-12">
            <div className="w-full rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
                <CheckCircle2
                    size={64}
                    className="mx-auto text-green-500"
                />

                <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
                    Order Placed Successfully!
                </h1>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
                    Thank you for your order. We have received your
                    order and will contact you shortly to confirm it.
                </p>

                {orderId && (
                    <div className="mx-auto mt-6 w-fit rounded-md bg-gray-50 px-5 py-3">
                        <p className="text-xs text-gray-500">
                            Order ID
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                            {orderId}
                        </p>
                    </div>
                )}

                <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-5 text-left">
                    <h2 className="text-sm font-semibold">
                        Cash on Delivery
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        Your order has been placed with Cash on
                        Delivery. Please keep the order amount ready
                        when your order is delivered.
                    </p>
                </div>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/shop"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        <ShoppingBag size={17} />
                        Continue Shopping
                    </Link>

                    {orderId && (
                        <Link
                            href={`/dashboard/orders/${orderId}`}
                            className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 px-6 text-sm font-medium transition hover:bg-gray-50"
                        >
                            View Order
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}