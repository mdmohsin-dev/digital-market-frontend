"use client";

import Link from "next/link";
import { ArrowLeft, Package, Truck } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {getOrderById,type Order,} from "@/lib/orders";

export default function OrderDetailsPage() {
    const params = useParams();

    const orderId = params.orderId as string;

    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const storedOrder = getOrderById(orderId);

        setOrder(storedOrder);
    }, [orderId]);

    if (!order) {
        return (
            <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-12">
                <div className="text-center">
                    <Package
                        size={50}
                        className="mx-auto text-gray-300"
                    />

                    <h1 className="mt-5 text-2xl font-semibold">
                        Order not found
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        We couldn't find this order.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-white"
                    >
                        <ArrowLeft size={17} />
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
            >
                <ArrowLeft size={17} />
                Back to Home
            </Link>

            <div className="mt-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm text-gray-500">
                            Order ID
                        </p>

                        <h1 className="mt-1 text-xl font-bold">
                            {order.id}
                        </h1>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700">
                        <Truck size={16} />
                        {order.status}
                    </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">
                    {/* LEFT */}
                    <div className="space-y-6">
                        <section className="rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold">
                                Order Items
                            </h2>

                            <div className="mt-5 space-y-5">
                                {order.items.map((item) => (
                                    <div
                                        key={`${item.productId}-${item.size}-${item.color}`}
                                        className="flex gap-4"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium">
                                                {item.name}
                                            </h3>

                                            {(item.size ||
                                                item.color) && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {item.size &&
                                                        `Size: ${item.size}`}

                                                    {item.size &&
                                                        item.color &&
                                                        " • "}

                                                    {item.color &&
                                                        `Color: ${item.color}`}
                                                </p>
                                            )}

                                            <p className="mt-2 text-xs text-gray-500">
                                                ৳
                                                {item.price.toLocaleString()}{" "}
                                                × {item.quantity}
                                            </p>
                                        </div>

                                        <p className="text-sm font-semibold">
                                            ৳
                                            {(
                                                item.price *
                                                item.quantity
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* DELIVERY */}
                        <section className="rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold">
                                Delivery Information
                            </h2>

                            <div className="mt-5 space-y-3 text-sm">
                                <p>
                                    <span className="text-gray-500">
                                        Name:
                                    </span>{" "}
                                    {order.deliveryInfo.fullName}
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Email:
                                    </span>{" "}
                                    {order.deliveryInfo.email}
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Phone:
                                    </span>{" "}
                                    {order.deliveryInfo.phone}
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Address:
                                    </span>{" "}
                                    {order.deliveryInfo.address}
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        City:
                                    </span>{" "}
                                    {order.deliveryInfo.city}
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Postal Code:
                                    </span>{" "}
                                    {order.deliveryInfo.postalCode}
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Country:
                                    </span>{" "}
                                    {order.deliveryInfo.country}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT */}
                    <aside className="h-fit rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold">
                            Order Summary
                        </h2>

                        <div className="mt-6 space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Subtotal
                                </span>

                                <span>
                                    ৳
                                    {order.subtotal.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Shipping
                                </span>

                                <span>
                                    ৳
                                    {order.shipping.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Discount
                                </span>

                                <span className="text-green-600">
                                    -৳
                                    {order.discount.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="my-5 border-t border-gray-200" />

                        <div className="flex items-center justify-between">
                            <span className="font-semibold">
                                Total
                            </span>

                            <span className="text-xl font-bold text-primary">
                                ৳
                                {order.total.toLocaleString()}
                            </span>
                        </div>

                        <div className="mt-6 rounded-md bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">
                                Payment Method
                            </p>

                            <p className="mt-1 text-sm font-medium">
                                {order.paymentMethod === "cod"
                                    ? "Cash on Delivery"
                                    : order.paymentMethod}
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}