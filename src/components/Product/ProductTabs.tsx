"use client";

import { Truck, RotateCcw } from "lucide-react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import type { Product } from "@/types/product";

interface ProductTabsProps {
    product: Product;
}

export default function ProductTabs({
    product,
}: ProductTabsProps) {
    return (
        <section className="mt-20">
            <Tabs
                selectedTabClassName="!border-black !text-black"
            >
                {/* TAB LIST */}

                <TabList className="!mb-0 flex gap-6 overflow-x-auto border-b border-gray-200">
                    <Tab className="shrink-0 cursor-pointer border-0 border-b-2 border-transparent px-0 pb-4 text-sm font-medium text-gray-500 outline-none transition-colors hover:text-black">
                        Description
                    </Tab>

                    <Tab className="shrink-0 cursor-pointer border-0 border-b-2 border-transparent px-0 pb-4 text-sm font-medium text-gray-500 outline-none transition-colors hover:text-black">
                        Specifications
                    </Tab>

                    <Tab className="shrink-0 cursor-pointer border-0 border-b-2 border-transparent px-0 pb-4 text-sm font-medium text-gray-500 outline-none transition-colors hover:text-black">
                        Delivery & Returns
                    </Tab>

                    <Tab className="shrink-0 cursor-pointer border-0 border-b-2 border-transparent px-0 pb-4 text-sm font-medium text-gray-500 outline-none transition-colors hover:text-black">
                        Reviews ({product.reviewCount})
                    </Tab>
                </TabList>

                {/*  DESCRIPTION*/}

                <TabPanel className="outline-none">
                    <div className="py-8">
                        <div className="max-w-3xl">
                            <h2 className="text-xl font-semibold">
                                Product Description
                            </h2>

                            <p className="mt-4 leading-7 text-gray-600">
                                {product.description}
                            </p>
                        </div>
                    </div>
                </TabPanel>

                {/* SPECIFICATIONS */}

                <TabPanel className="outline-none">
                    <div className="py-8">
                        <div className="max-w-3xl">
                            <h2 className="text-xl font-semibold">
                                Product Specifications
                            </h2>

                            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                                {Object.entries(
                                    product.specifications
                                ).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="grid grid-cols-2 border-b border-gray-200 last:border-b-0"
                                    >
                                        <div className="bg-gray-50 px-4 py-3 text-sm font-medium">
                                            {key}
                                        </div>

                                        <div className="px-4 py-3 text-sm text-gray-600">
                                            {value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabPanel>

                {/* DELIVERY & RETURNS */}

                <TabPanel className="outline-none">
                    <div className="py-8">
                        <div className="grid max-w-4xl gap-8 sm:grid-cols-2">
                            {/* Delivery */}

                            <div className="rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                        <Truck size={20} />
                                    </div>

                                    <h2 className="font-semibold">
                                        Delivery Information
                                    </h2>
                                </div>

                                <p className="mt-4 text-sm leading-7 text-gray-600">{product.deliveryInformation}
                                </p>
                            </div>

                            {/* Returns */}

                            <div className="rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                        <RotateCcw size={20} />
                                    </div>

                                    <h2 className="font-semibold">Return Policy</h2>
                                </div>

                                <p className="mt-4 text-sm leading-7 text-gray-600">{product.returnPolicy}</p>
                            </div>
                        </div>
                    </div>
                </TabPanel>

                {/* REVIEWS */}

                <TabPanel className="outline-none">
                    <div className="py-8">
                        {/* Review Summary */}

                        <div className="flex flex-col gap-6 border-b border-gray-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Customer Reviews
                                </h2>

                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {Array.from({
                                            length: 5,
                                        }).map(
                                            (_, index) => (
                                                <span
                                                    key={
                                                        index
                                                    }
                                                    className={
                                                        index <
                                                            Math.round(
                                                                product.rating
                                                            )
                                                            ? "text-yellow-400"
                                                            : "text-gray-200"
                                                    }
                                                >
                                                    ★
                                                </span>
                                            )
                                        )}
                                    </div>

                                    <span className="text-sm text-gray-500">
                                        {product.rating} / 5
                                    </span>

                                    <span className="text-sm text-gray-400">
                                        ({product.reviewCount}{" "}
                                        reviews)
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-fit rounded-md bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                            >
                                Write a Review
                            </button>
                        </div>

                        {/* Reviews */}

                        <div className="mt-8 space-y-5">
                            {product.reviews.length > 0 ? (
                                product.reviews.map(
                                    (review) => (
                                        <article
                                            key={
                                                review.id
                                            }
                                            className="rounded-xl border border-gray-200 p-5"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* User Icon */}

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                                                    {review.userName
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                        <h3 className="font-medium">
                                                            {
                                                                review.userName
                                                            }
                                                        </h3>

                                                        <span className="text-xs text-gray-400">
                                                            {
                                                                review.date
                                                            }
                                                        </span>
                                                    </div>

                                                    {/* Review Rating */}

                                                    <div className="mt-2 flex items-center gap-1">
                                                        {Array.from(
                                                            {
                                                                length: 5,
                                                            }
                                                        ).map(
                                                            (
                                                                _,
                                                                index
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        index
                                                                    }
                                                                    className={
                                                                        index <
                                                                            review.rating
                                                                            ? "text-yellow-400"
                                                                            : "text-gray-200"
                                                                    }
                                                                >
                                                                    ★
                                                                </span>
                                                            )
                                                        )}
                                                    </div>

                                                    {/* Comment */}

                                                    <p className="mt-3 text-sm leading-7 text-gray-600">
                                                        {
                                                            review.comment
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                )
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-gray-500">
                                        No reviews yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </TabPanel>
            </Tabs>

            <div className="mt-10 border-t border-gray-200 pt-8"></div>
        </section>
    );
}