"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductImageGalleryProps {
    product: Product;
}

export default function ProductImageGallery({
    product,
}: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    const images = product.images ?? [];

    if (images.length === 0) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100">
                <span className="text-gray-400">
                    No image available
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 md:flex-row">
            {/* Thumbnails */}
            <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:w-20 md:flex-col">
                {images.map((image, index) => (
                    <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                            selectedImage === index
                                ? "border-black"
                                : "border-gray-200 hover:border-gray-400"
                        }`}
                        aria-label={`View product image ${index + 1}`}
                    >
                        <Image
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="80px"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="group relative order-1 aspect-square min-w-0 flex-1 overflow-hidden rounded-xl bg-gray-100 md:order-2">
                <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Fullscreen style button */}
                <button
                    type="button"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100"
                    aria-label="View image"
                >
                    <Maximize2 size={18} />
                </button>
            </div>
        </div>
    );
}