"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/Data/products";


interface ProductSearchProps {
    className?: string;
}

export default function ProductSearch({
    className = "",
}: ProductSearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);

    const allProducts = products;

    const searchResults = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) {
            return [];
        }

        return allProducts
            .filter((product) => {
                return (
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query) ||
                    product.subcategory?.toLowerCase().includes(query)
                );
            })
            .slice(0, 6);
    }, [searchTerm, products]);

    const showResults =
        isFocused && searchTerm.trim().length > 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(
                    event.target as Node
                )
            ) {
                setIsFocused(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const handleClear = () => {
        setSearchTerm("");
    };

    const handleProductClick = () => {
        setIsFocused(false);
        setSearchTerm("");
    };

    return (
        <div
            ref={searchRef}
            className={`relative w-full ${className}`}
        >
            {/* Search Input */}
            <div className="relative flex h-11 w-full items-center rounded-md border border-gray-300 bg-white">
                <Search
                    size={19}
                    className="ml-4 shrink-0 text-gray-400"
                />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search in..."
                    className="
                        h-full
                        min-w-0
                        flex-1
                        bg-transparent
                        px-3
                        text-sm
                        text-gray-800
                        outline-none
                        placeholder:text-gray-400
                    "
                />

                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Clear search"
                        className="
                            mr-3
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-gray-400
                            transition-colors
                            hover:bg-gray-100
                            hover:text-gray-700
                        "
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Search Results */}
            {showResults && (
                <div
                    className="
                        absolute
                        left-0
                        right-0
                        top-full
                        z-50
                        mt-2
                        overflow-hidden
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        shadow-xl
                    "
                >
                    {searchResults.length > 0 ? (
                        <div className="max-h-100 overflow-y-auto py-2">
                            {searchResults.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/shop/${product.slug}`}
                                    onClick={handleProductClick}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        transition-colors
                                        hover:bg-gray-50
                                    "
                                >
                                    {/* Product Image */}
                                    <div
                                        className="
                                            relative
                                            h-14
                                            w-14
                                            shrink-0
                                            overflow-hidden
                                            rounded-md
                                            bg-gray-100
                                        "
                                    >
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            sizes="56px"
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="
                                                truncate
                                                text-sm
                                                font-medium
                                                text-gray-800
                                            "
                                        >
                                            {product.name}
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                capitalize
                                                text-gray-400
                                            "
                                        >
                                            {product.category}
                                        </p>

                                        <div className="mt-1 flex items-center gap-2">
                                            {product.salePrice ? (
                                                <>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        ৳
                                                        {product.salePrice.toLocaleString()}
                                                    </span>

                                                    <span className="text-xs text-gray-400 line-through">
                                                        ৳
                                                        {product.regularPrice.toLocaleString()}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ৳
                                                    {product.regularPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center">
                            <p className="text-sm font-medium text-gray-700">
                                No products found
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Try searching with another keyword
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}