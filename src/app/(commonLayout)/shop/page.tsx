"use client";

import { Suspense, useMemo } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import ProductCard from "@/components/Product/ProductCard";
import { products } from "@/Data/products";
import { categories } from "@/Data/categories";
import { ShopFilter } from "@/components/Filter/ShopFilterSection";

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * URL is the single source of truth.
   */

  const selectedCategories = useMemo(() => {
    const value = searchParams.get("category");

    return value
      ? value.split(",").filter(Boolean)
      : [];
  }, [searchParams]);

  const selectedSubcategories = useMemo(() => {
    const value = searchParams.get("subcategory");

    return value
      ? value.split(",").filter(Boolean)
      : [];
  }, [searchParams]);

  /*
   * Update URL
   */
  const updateUrl = (
    categoryIds: string[],
    subcategoryIds: string[],
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
        subcategoryIds.join(","),
      );
    } else {
      params.delete("subcategory");
    }

    const query = params.toString();

    router.push(
      query ? `${pathname}?${query}` : pathname,
      {
        scroll: false,
      },
    );
  };

  /*
   * Category change
   */
  const handleCategoryChange = (
    categoryIds: string[],
  ) => {

    updateUrl(
      categoryIds,
      selectedSubcategories,
    );
  };



  const handleSubcategoryChange = (
    subcategoryIds: string[],
  ) => {
    updateUrl(
      selectedCategories,
      subcategoryIds,
    );
  };

  /*
   * Product filtering
   */
  const filteredProducts = useMemo(() => {
    /*
     * No filters selected
     */
    if (
      selectedCategories.length === 0 &&
      selectedSubcategories.length === 0
    ) {
      return products;
    }




    const selectedSubcategoriesByCategory =
      new Map<string, Set<string>>();

    for (const subcategoryId of selectedSubcategories) {
      for (const category of categories) {
        const subcategory =
          category.subcategories.find(
            (sub) => sub.id === subcategoryId,
          );

        if (subcategory) {
          if (
            !selectedSubcategoriesByCategory.has(
              category.id,
            )
          ) {
            selectedSubcategoriesByCategory.set(
              category.id,
              new Set(),
            );
          }

          selectedSubcategoriesByCategory
            .get(category.id)!
            .add(subcategoryId);

          break;
        }
      }
    }

    return products.filter((product) => {
      const productCategory = product.category;
      const productSubcategory =
        product.subcategory;



      if (
        selectedCategories.length === 0 &&
        selectedSubcategories.length > 0
      ) {
        return selectedSubcategories.includes(
          productSubcategory,
        );
      }


      const selectedSubcategoriesForProductCategory =
        selectedSubcategoriesByCategory.get(
          productCategory,
        );

      if (
        selectedCategories.includes(
          productCategory,
        )
      ) {

        if (
          !selectedSubcategoriesForProductCategory ||
          selectedSubcategoriesForProductCategory.size ===
          0
        ) {
          return true;
        }



        return selectedSubcategoriesForProductCategory.has(
          productSubcategory,
        );
      }



      if (
        selectedSubcategoriesByCategory.has(
          productCategory,
        )
      ) {
        return selectedSubcategoriesByCategory
          .get(productCategory)!
          .has(productSubcategory);
      }

      return false;
    });
  }, [
    selectedCategories,
    selectedSubcategories,
  ]);

  return (
    <div className="mx-auto flex max-w-350 gap-8">
      {/* Filter */}

      <ShopFilter
        categories={categories}
        selectedCategories={selectedCategories}
        selectedSubcategories={
          selectedSubcategories
        }
        onCategoryChange={
          handleCategoryChange
        }
        onSubcategoryChange={
          handleSubcategoryChange
        }
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