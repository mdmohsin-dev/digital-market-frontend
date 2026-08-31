import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Product } from "@/types/product";
import { flashSales } from "@/Data/flashSales";
import { products } from "@/Data/products";
import FlashSaleCountdown from "@/components/Home/Flash-sale/FlashSaleCountdown";
import FlashSaleCard from "@/components/Home/Flash-sale/FlashSaleCard";

export default function FlashSalePage() {
    const now = new Date();

    // Find active flash sale
    const activeFlashSale = flashSales.find(
        (flashSale) => {
            const startAt = new Date(
                flashSale.startAt
            );

            const endAt = new Date(
                flashSale.endAt
            );

            return (
                now >= startAt &&
                now < endAt
            );
        }
    );

    // No active flash sale
    if (!activeFlashSale) {
        return (
            <main className="min-h-screen">
                <div className="mx-auto flex min-h-[60vh] max-w-350 flex-col items-center justify-center px-4 text-center">
                    <h1 className="text-3xl font-semibold">
                        Flash Sale
                    </h1>

                    <p className="mt-3 text-gray-500">
                        There is no active flash sale
                        right now.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-6 rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    /*
     * Find products from productIds.
     *
     * products.find() returns Product | undefined,
     * so we use a type guard in filter() to make
     * the final result Product[].
     */
    const flashSaleProducts =
        activeFlashSale.productIds
            .map((productId) =>
                products.find(
                    (product) =>
                        product.id === productId
                )
            )
            .filter(
                (
                    product
                ): product is Product =>
                    product !== undefined
            );

    return (
        <main className="min-h-screen">
            {/* Page Header */}
            <section className="border-b border-gray-200 bg-gray-50">
                <div className="mx-auto max-w-350 px-4 py-10">
                    {/* Back To Home */}
                    <Link
                        href="/"
                        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-black"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>

                    {/* Title + Countdown */}
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                {
                                    activeFlashSale.title
                                }
                            </h1>

                            <p className="mt-2 text-gray-500">
                                Grab your favorite
                                products before
                                the sale ends.
                            </p>
                        </div>

                        {/* Countdown */}
                        <div className="rounded-lg border border-gray-200 bg-white px-5 py-3">
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Sale ends in
                            </p>

                            <FlashSaleCountdown
                                endAt={
                                    activeFlashSale.endAt
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="py-10 sm:py-14">
                <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
                    {/* Top Bar */}
                    <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500">
                            Showing{" "}
                            <span className="font-medium text-gray-900">
                                {
                                    flashSaleProducts.length
                                }
                            </span>{" "}
                            flash sale products
                        </p>

                        {/* Sort */}
                        <select
                            defaultValue="featured"
                            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-black"
                            aria-label="Sort flash sale products"
                        >
                            <option value="featured">
                                Featured
                            </option>

                            <option value="price-low">
                                Price: Low to High
                            </option>

                            <option value="price-high">
                                Price: High to Low
                            </option>

                            <option value="discount">
                                Highest Discount
                            </option>
                        </select>
                    </div>

                    {/* Product Grid */}
                    {flashSaleProducts.length >
                    0 ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {flashSaleProducts.map(
                                (product) => (
                                    <FlashSaleCard
                                        key={
                                            product.id
                                        }
                                        product={
                                            product
                                        }
                                    />
                                )
                            )}
                        </div>
                    ) : (
                        <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">
                                No products available
                                in this flash sale.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}