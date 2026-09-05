"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Swiper,
    SwiperSlide,
} from "swiper/react";
import {
    Navigation,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import type { Product } from "@/types/product";

import FlashSaleCard from "./FlashSaleCard";
import FlashSaleCountdown from "./FlashSaleCountdown";
import { FlashSale } from "@/Data/flashSales";

interface FlashSaleSectionProps {
    flashSale: FlashSale;
    products: Product[];
}

export default function FlashSaleSection({
    flashSale,
    products,
}: FlashSaleSectionProps) {
    /*
     * Get products that belong to
     * this flash sale.
     */
    const flashSaleProducts =
        flashSale.productIds
            .map((productId) =>
                products.find(
                    (product) =>
                        product.id === productId
                )
            )
            .filter(
                (product): product is Product =>
                    Boolean(product)
            );

    /*
     * Don't render the section if
     * there are no products.
     */
    if (flashSaleProducts.length === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="flash-sale-title"
            className="md:mt-32 mt-16">
            <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-4">
                            <h2
                                id="flash-sale-title"
                                className="text-2xl font-semibold font-lora tracking-tight sm:text-3xl"
                            >
                                {flashSale.title}
                            </h2>

                            <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-red-600">
                                <span className="text-xs font-medium">
                                    Ends in
                                </span>

                                <FlashSaleCountdown
                                    endAt={
                                        flashSale.endAt
                                    }
                                />
                            </div>
                        </div>

                    </div>

                    {/* View All */}
                    <Link
                        href="/flash-sale"
                        className="shrink-0 text-sm flex items-center gap-1 font-medium text-primary underline-offset-4">
                        View All Flash Sale
                        <ChevronRight size={20}/>
                    </Link>
                </div>

                {/* Products */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl:
                                ".flash-sale-prev",
                            nextEl:
                                ".flash-sale-next",
                        }}
                        spaceBetween={16}
                        slidesPerView={1.2}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 16,
                            },

                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },

                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="!pb-1"
                    >
                        {flashSaleProducts.map(
                            (product) => (
                                <SwiperSlide
                                    key={
                                        product.id
                                    }
                                    className="h-auto"
                                >
                                    <FlashSaleCard
                                        product={
                                            product
                                        }
                                    />
                                </SwiperSlide>
                            )
                        )}
                    </Swiper>

                    {/* Previous */}
                    <button
                        type="button"
                        className="flash-sale-prev absolute -left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50 lg:flex"
                        aria-label="Previous flash sale products"
                    >
                        <ChevronLeft
                            size={20}
                        />
                    </button>

                    {/* Next */}
                    <button
                        type="button"
                        className="flash-sale-next absolute -right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50 lg:flex"
                        aria-label="Next flash sale products"
                    >
                        <ChevronRight
                            size={20}
                        />
                    </button>
                </div>
            </div>
        </section>
    );
}