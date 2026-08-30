"use client";

import { User, Star } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import { products } from "@/Data/products";

export default function CustomerReviewsSection() {
    // Get all reviews from all products
    const customerReviews = products.flatMap( (product) => product.reviews).slice(0,5);
    console.log(customerReviews)

    if (customerReviews.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto mt-32 max-w-350 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 text-center sm:mb-10">
                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-gray-500">
                    Customer Feedback
                </p>

                <h2 className="text-2xl font-semibold sm:text-4xl">
                    What Our Customers Say
                </h2>
            </div>

            {/* Reviews Slider */}
            <div className="relative">
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={customerReviews.length > 3}
                    speed={700}
                    spaceBetween={16}
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                    }}
                    className="customer-reviews-swiper"
                >
                    {customerReviews.map((review) => (
                        <SwiperSlide key={review.id}>
                            <div className="flex min-h-55 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                {/* Comment */}
                                <p className="flex-1 text-sm leading-6 text-gray-600 sm:text-base">
                                    "{review.comment}"
                                </p>

                                {/* Rating */}
                                <div className="mt-5 flex items-center gap-1">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Star
                                                key={index}
                                                className={`h-4 w-4 ${
                                                    index < review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        )
                                    )}
                                </div>

                                {/* Reviewer */}
                                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {review.userName}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Verified Customer
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}