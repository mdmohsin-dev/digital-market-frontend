"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import { products } from "@/Data/products";
import ProductCard from "@/components/Product/ProductCard";

export default function NewArrivalsSection() {
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const newProducts = products.filter(
        (product) => product.newArrival === true
    );

    if (newProducts.length === 0) {
        return null;
    }

    const handleSlideChange = (swiper: SwiperType) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (
        <section className="mx-auto md:mt-32 mt-16 max-w-350 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-4 flex items-end justify-between sm:mb-6">
                <div>
                    <h2 className="text-2xl font-semibold font-lora sm:text-4xl">
                        New Arrivals
                    </h2>
                </div>

                <Link
                    href="/shop"
                    className="text-sm text-primary flex items-center gap-1 font-medium transition-opacity hover:opacity-60" >
                    View All
                    <ChevronRight size={20}/>
                </Link>
            </div>

            {/* Slider */}
            <div className="relative">
                <Swiper
                    modules={[Navigation]}
                    onSwiper={(swiper) => {
                        setSwiper(swiper);
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    onSlideChange={handleSlideChange}
                    spaceBetween={16}
                    slidesPerView={1.2}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 25,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 26,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 26,
                        },
                    }}
                    className="new-arrivals-swiper"
                >
                    {newProducts.map((product) => (
                        <SwiperSlide key={product.id}>
                            <ProductCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Previous Button */}
                <button
                    type="button"
                    aria-label="Previous products"
                    disabled={isBeginning}
                    onClick={() => swiper?.slidePrev()}
                    className={`
                        absolute left-0 top-1/2 z-10
                        flex h-10 w-10
                        -translate-x-1/2 -translate-y-1/2
                        items-center justify-center
                        rounded-full
                        shadow-md
                        transition-all duration-200
                        sm:h-11 sm:w-11
                        ${
                            isBeginning
                                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                : "bg-primary text-white hover:opacity-90"
                        }
                    `}
                >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                {/* Next Button */}
                <button
                    type="button"
                    aria-label="Next products"
                    disabled={isEnd}
                    onClick={() => swiper?.slideNext()}
                    className={`
                        absolute right-0 top-1/2 z-10
                        flex h-10 w-10
                        translate-x-1/2 -translate-y-1/2
                        items-center justify-center
                        rounded-full
                        shadow-md
                        transition-all duration-200
                        sm:h-11 sm:w-11
                        ${
                            isEnd
                                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                : "bg-primary text-white hover:opacity-90"
                        }
                    `}
                >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
            </div>
        </section>
    );
}