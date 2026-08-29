"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProductCard from "@/components/Product/ProductCard";
import { products } from "@/Data/products";
import { categories } from "@/Data/categories";
import { ShopFilter } from "@/components/Filter/ShopFilterSection";

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * URL is the single source of truth.
   */

  const selectedCategories = useMemo(() => {
    const value = searchParams.get("category");

    return value ? value.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedSubcategories = useMemo(() => {
    const value = searchParams.get("subcategory");

    return value ? value.split(",").filter(Boolean) : [];
  }, [searchParams]);

  /*
   * Update only the URL.
   * No useEffect.
   * No state -> URL loop.
   */
  const updateUrl = (
    categoryIds: string[],
    subcategoryIds: string[]
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryIds.length > 0) {
      params.set("category", categoryIds.join(","));
    } else {
      params.delete("category");
    }

    if (subcategoryIds.length > 0) {
      params.set(
        "subcategory",
        subcategoryIds.join(",")
      );
    } else {
      params.delete("subcategory");
    }

    const query = params.toString();

    router.push(
      query ? `${pathname}?${query}` : pathname,
      {
        scroll: false,
      }
    );
  };

  /*
   * Category change
   */
  const handleCategoryChange = (categoryIds: string[]) => {
    updateUrl(
      categoryIds,
      selectedSubcategories
    );
  };

  /*
   * Subcategory change
   */
  const handleSubcategoryChange = (
    subcategoryIds: string[]
  ) => {
    updateUrl(
      selectedCategories,
      subcategoryIds
    );
  };

  /*
   * Product filtering
   */
  const filteredProducts = useMemo(() => {
  return products.filter((product) => {
    const categoryMatch =
      selectedCategories.length > 0 &&
      selectedCategories.includes(product.category);

    const subcategoryMatch =
      selectedSubcategories.length > 0 &&
      selectedSubcategories.includes(product.subcategory);

    // No filter selected
    if (
      selectedCategories.length === 0 &&
      selectedSubcategories.length === 0
    ) {
      return true;
    }

    // Any selected filter matches
    return categoryMatch || subcategoryMatch;
  });
}, [selectedCategories, selectedSubcategories]);

  return (
    <div className="mx-auto flex max-w-350 gap-8">
      {/* Filter */}
      <ShopFilter
        categories={categories}
        selectedCategories={selectedCategories}
        selectedSubcategories={selectedSubcategories}
        onCategoryChange={handleCategoryChange}
        onSubcategoryChange={handleSubcategoryChange}
      />

      {/* Products */}
      <div className="grid flex-1 grid-cols-2 gap-6 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}