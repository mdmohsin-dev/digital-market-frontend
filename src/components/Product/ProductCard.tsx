import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { FaCartPlus } from "react-icons/fa6";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const displayPrice = product.salePrice ?? product.regularPrice;

    const { images, name, rating, reviewCount, slug } = product;

    const handleAddToCart = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        // Add to cart logic এখানে থাকবে
        console.log("Added to cart:", product.id);
    };

    return (
        <Link
            href={`/shop/${slug}`}
            className="block h-full"
        >
            <div className="flex h-110 flex-col justify-between rounded-lg border border-gray-300 bg-gray-100 p-4 transition-shadow hover:shadow-md">
                {/* Product Image */}
                <div className="mb-5 flex justify-center">
                    <Image
                        className="h-full min-h-48 w-48 max-h-56 object-contain"
                        width={200}
                        height={200}
                        src={images[0]}
                        alt={name}
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-xl">
                        {name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => {
                                const fillPercent = Math.max(
                                    0,
                                    Math.min(100, (rating - i) * 100)
                                );

                                return (
                                    <div
                                        key={i}
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
                            {rating} ({reviewCount})
                        </span>
                    </div>

                    {/* Price */}
                    <p className="font-semibold text-red-500">
                        Price: {displayPrice}
                    </p>

                    {/* Add To Cart */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-primary p-2 text-white transition-opacity hover:opacity-90"> <FaCartPlus size={24}/> Add to cart
                    </button>
                </div>
            </div>
        </Link>
    );
}