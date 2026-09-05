"use client";

import { ArrowDownUp } from "lucide-react";

type SortOption =
    | "default"
    | "price-low"
    | "price-high"
    | "rating-high";

interface ProductSortProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

export default function ProductSort({
    value,
    onChange,
}: ProductSortProps) {
    return (
        <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
                <ArrowDownUp
                    size={17}
                    className="text-gray-500"
                />

                <label
                    htmlFor="product-sort"
                    className="text-sm text-gray-600"
                >
                    Sort by:
                </label>

                <select
                    id="product-sort"
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value as SortOption,
                        )
                    }
                    className="h-10 cursor-pointer rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-primary"
                >
                    <option value="default">
                        Default
                    </option>

                    <option value="price-low">
                        Price: Low to High
                    </option>

                    <option value="price-high">
                        Price: High to Low
                    </option>

                    <option value="rating-high">
                        Rating: High to Low
                    </option>
                </select>
            </div>
        </div>
    );
}

export type { SortOption };