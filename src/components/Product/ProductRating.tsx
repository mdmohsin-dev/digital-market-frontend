import { Star } from "lucide-react";

interface ProductRatingProps {
    rating: number;
    reviewCount?: number;
    showCount?: boolean;
}

export default function ProductRating({
    rating,
    reviewCount,
    showCount = true,
}: ProductRatingProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => {
                    const fillPercent = Math.max(
                        0,
                        Math.min(100, (rating - index) * 100)
                    );

                    return (
                        <div
                            key={index}
                            className="relative h-4 w-4"
                        >
                            {/* Empty star */}
                            <Star
                                size={16}
                                className="absolute inset-0 fill-gray-200 text-gray-200"
                            />

                            {/* Filled star */}
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{
                                    width: `${fillPercent}%`,
                                }}
                            >
                                <Star
                                    size={16}
                                    className="fill-yellow-400 text-yellow-400"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <span className="text-sm text-gray-500">
                {rating.toFixed(1)}
                {showCount && reviewCount !== undefined
                    ? ` (${reviewCount} reviews)`
                    : ""}
            </span>
        </div>
    );
}