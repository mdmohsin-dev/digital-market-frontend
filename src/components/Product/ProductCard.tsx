import { Product } from "@/types/product";
import Image from "next/image";
import { Star } from "lucide-react";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const displayPrice = product.salePrice ?? product.regularPrice;
    const { images, name, rating, reviewCount } = product;

    return (
        <div className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between h-110 border border-gray-300">
            <div className="flex justify-center mb-5">
                <Image className="w-48 min-h-48 h-full max-h-56" width={200} height={200} src={images[0]} alt={name} />
            </div>
            <div className="flex flex-col gap-3">
                <h3 className="text-xl">{name}</h3>

                <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => {
                            // eita i-th star er fill percentage (0 to 100)
                            const fillPercent = Math.max(
                                0,
                                Math.min(100, (rating - i) * 100)
                            );

                            return (
                                <div key={i} className="relative w-4 h-4">
                                    {/* background empty star */}
                                    <Star
                                        size={16}
                                        className="absolute inset-0 fill-gray-200 text-gray-200"
                                    />
                                    {/* filled star, width clip diye partial dekhano */}
                                    <div
                                        className="absolute inset-0 overflow-hidden"
                                        style={{ width: `${fillPercent}%` }}
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

                <p className="text-red-500 font-semibold">Price:{displayPrice}</p>
                <button className="bg-primary text-white w-full p-2 rounded-md">Add to cart</button>
            </div>
        </div>
    );
}