"use client";

import {
    Truck,
    RotateCcw,
    Star,
} from "lucide-react";

import {
    Tab,
    Tabs,
    TabList,
    TabPanel,
} from "react-tabs";

import "react-tabs/style/react-tabs.css";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    Product,
    ProductReview,
} from "@/types/product";

interface ProductTabsProps {
    product: Product;
}

const PRODUCT_REVIEWS_KEY = "product-reviews";

interface StoredReviews {
    [productId: string]: ProductReview[];
}

export default function ProductTabs({
    product,
}: ProductTabsProps) {
    const [reviews, setReviews] =
        useState<ProductReview[]>(
            product.reviews
        );

    const [showReviewForm, setShowReviewForm] =
        useState(false);

    const [rating, setRating] =
        useState(0);

    const [comment, setComment] =
        useState("");

    const [userName, setUserName] =
        useState("");

    /*
     * Load reviews from localStorage
     * and combine them with mock reviews.
     */
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const stored =
            localStorage.getItem(
                PRODUCT_REVIEWS_KEY
            );

        if (!stored) {
            setReviews(product.reviews);
            return;
        }

        try {
            const parsed =
                JSON.parse(
                    stored
                ) as StoredReviews;

            const localReviews =
                parsed[product.id] ?? [];

            setReviews([
                ...product.reviews,
                ...localReviews,
            ]);
        } catch {
            setReviews(product.reviews);
        }
    }, [
        product.id,
        product.reviews,
    ]);

    /*
     * Calculate average rating
     * from mock + localStorage reviews.
     */
    const averageRating = useMemo(() => {
        if (reviews.length === 0) {
            return 0;
        }

        const total =
            reviews.reduce(
                (
                    sum,
                    review
                ) =>
                    sum + review.rating,
                0
            );

        return Number(
            (
                total /
                reviews.length
            ).toFixed(1)
        );
    }, [reviews]);

    /*
     * Write Review
     */
    const handleSubmitReview = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!userName.trim()) {
            return;
        }

        if (rating === 0) {
            return;
        }

        if (!comment.trim()) {
            return;
        }

        const newReview: ProductReview = {
            id: `review_${Date.now()}`,
            userName: userName.trim(),
            rating,
            comment: comment.trim(),
            date: new Date()
                .toISOString()
                .split("T")[0],
        };

        /*
         * Get existing localStorage reviews.
         */
        let storedReviews: StoredReviews =
            {};

        const stored =
            localStorage.getItem(
                PRODUCT_REVIEWS_KEY
            );

        if (stored) {
            try {
                storedReviews =
                    JSON.parse(
                        stored
                    ) as StoredReviews;
            } catch {
                storedReviews = {};
            }
        }

        /*
         * Add new review for
         * current product.
         */
        const currentLocalReviews =
            storedReviews[
            product.id
            ] ?? [];

        storedReviews[
            product.id
        ] = [
                ...currentLocalReviews,
                newReview,
            ];

        /*
         * Save to localStorage.
         */
        localStorage.setItem(
            PRODUCT_REVIEWS_KEY,
            JSON.stringify(
                storedReviews
            )
        );

        /*
         * Update UI immediately.
         */
        setReviews((previous) => [
            ...previous,
            newReview,
        ]);

        /*
         * Reset form.
         */
        setUserName("");
        setRating(0);
        setComment("");
        setShowReviewForm(false);
    };

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
                        Reviews ({reviews.length})
                    </Tab>
                </TabList>

                {/* DESCRIPTION */}
                <TabPanel className="outline-none">
                    <div className="py-8">
                        <div className="max-w-3xl">
                            <h2 className="text-xl font-semibold">
                                Product Description
                            </h2>

                            <p className="mt-4 leading-7 text-gray-600">
                                {
                                    product.description
                                }
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
                                ).map(
                                    ([
                                        key,
                                        value,
                                    ]) => (
                                        <div
                                            key={
                                                key
                                            }
                                            className="grid grid-cols-2 border-b border-gray-200 last:border-b-0"
                                        >
                                            <div className="bg-gray-50 px-4 py-3 text-sm font-medium">
                                                {
                                                    key
                                                }
                                            </div>

                                            <div className="px-4 py-3 text-sm text-gray-600">
                                                {
                                                    value
                                                }
                                            </div>
                                        </div>
                                    )
                                )}
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
                                        <Truck
                                            size={
                                                20
                                            }
                                        />
                                    </div>

                                    <h2 className="font-semibold">
                                        Delivery
                                        Information
                                    </h2>
                                </div>

                                <p className="mt-4 text-sm leading-7 text-gray-600">
                                    {
                                        product.deliveryInformation
                                    }
                                </p>
                            </div>

                            {/* Returns */}
                            <div className="rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                        <RotateCcw
                                            size={
                                                20
                                            }
                                        />
                                    </div>

                                    <h2 className="font-semibold">
                                        Return
                                        Policy
                                    </h2>
                                </div>

                                <p className="mt-4 text-sm leading-7 text-gray-600">
                                    {
                                        product.returnPolicy
                                    }
                                </p>
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
                                                            Math.round(
                                                                averageRating
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
                                        {
                                            averageRating
                                        }{" "}
                                        / 5
                                    </span>

                                    <span className="text-sm text-gray-400">
                                        (
                                        {
                                            reviews.length
                                        }{" "}
                                        reviews)
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowReviewForm(
                                        (
                                            previous
                                        ) =>
                                            !previous
                                    )
                                }
                                className="w-fit rounded-md bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                            >
                                {showReviewForm
                                    ? "Cancel"
                                    : "Write a Review"}
                            </button>
                        </div>

                        {/* WRITE REVIEW FORM */}
                        {showReviewForm && (
                            <form
                                onSubmit={
                                    handleSubmitReview
                                }
                                className="mt-8 max-w-2xl rounded-xl border border-gray-200 p-6"
                            >
                                <h3 className="text-lg font-semibold">
                                    Write a Review
                                </h3>

                                {/* Name */}
                                <div className="mt-5">
                                    <label
                                        htmlFor="review-name"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Your Name
                                    </label>

                                    <input
                                        id="review-name"
                                        type="text"
                                        value={
                                            userName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setUserName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter your name"
                                        className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-black"
                                    />
                                </div>

                                {/* Rating */}
                                <div className="mt-5">
                                    <p className="mb-2 text-sm font-medium">
                                        Your Rating
                                    </p>

                                    <div className="flex items-center gap-1">
                                        {Array.from(
                                            {
                                                length: 5,
                                            }
                                        ).map(
                                            (
                                                _,
                                                index
                                            ) => {
                                                const
                                                    star =
                                                        index +
                                                        1;

                                                return (
                                                    <button
                                                        key={
                                                            star
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setRating(
                                                                star
                                                            )
                                                        }
                                                        aria-label={`Rate ${star} out of 5`}
                                                        className="p-0.5 text-2xl transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            size={
                                                                24
                                                            }
                                                            className={
                                                                star <=
                                                                    rating
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                            }
                                                        />
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                {/* Comment */}
                                <div className="mt-5">
                                    <label
                                        htmlFor="review-comment"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Your Review
                                    </label>

                                    <textarea
                                        id="review-comment"
                                        value={
                                            comment
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setComment(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        rows={5}
                                        placeholder="Write your review..."
                                        className="w-full resize-none rounded-md border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-black"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-5 rounded-md bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                                >
                                    Submit Review
                                </button>
                            </form>
                        )}

                        {/* Reviews */}
                        <div className="mt-8 space-y-5">
                            {reviews.length > 0 ? (
                                [...reviews]
                                    .reverse()
                                    .map((review) => (
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
                                        No reviews
                                        yet.
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