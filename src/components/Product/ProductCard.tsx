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
            <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
                {/* Product Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-200 p-4">
                    <Image
                        className="object-contain p-5"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        src={images[0]}
                        alt={name}
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col bg-white p-4">
                    <div className="flex flex-col gap-3">
                        {/* Product Name */}
                        <h3 className="line-clamp-2 min-h-[3rem] text-xl">
                            {name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const fillPercent = Math.max(
                                        0,
                                        Math.min(
                                            100,
                                            (rating - i) * 100
                                        )
                                    );

                                    return (
                                        <div
                                            key={i}
                                            className="relative h-4 w-4"
                                        >
                                            {/* Empty Star */}
                                            <Star
                                                size={16}
                                                className="absolute inset-0 fill-gray-200 text-gray-200"
                                            />

                                            {/* Filled Star */}
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
                    </div>

                    {/* Add To Cart */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-primary p-2 text-white transition-opacity hover:opacity-90"
                    >
                        <FaCartPlus size={24} />
                        Add to cart
                    </button>
                </div>
            </div>
        </Link>
    );
}