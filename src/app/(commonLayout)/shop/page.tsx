"use client";

import {
  Suspense,
  useMemo,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import ProductCard from "@/components/Product/ProductCard";
import ProductListCard from "@/components/Product/ProductListCard";
import ProductSort, {
  SortOption,
} from "@/components/Product/ProductSort";

import {
  Grid2X2,
  List,
} from "lucide-react";

import { products } from "@/Data/products";
import { categories } from "@/Data/categories";

import {
  ShopFilter,
} from "@/components/Filter/ShopFilterSection";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div>Loading...</div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =
    useSearchParams();

  /* =====================================================
     VIEW MODE
  ===================================================== */

  const [viewMode, setViewMode] =
    useState<"grid" | "list">("grid");

  /* =====================================================
     SELECTED CATEGORY
  ===================================================== */

  const selectedCategories =
    useMemo(() => {
      const value =
        searchParams.get(
          "category"
        );

      return value
        ? value
          .split(",")
          .filter(Boolean)
        : [];
    }, [searchParams]);

  /* =====================================================
     SELECTED SUBCATEGORY
  ===================================================== */

  const selectedSubcategories =
    useMemo(() => {
      const value =
        searchParams.get(
          "subcategory"
        );

      return value
        ? value
          .split(",")
          .filter(Boolean)
        : [];
    }, [searchParams]);

  /* =====================================================
     SORT
  ===================================================== */

  const sortOption =
    (searchParams.get(
      "sort"
    ) as SortOption) || "default";

  /* =====================================================
     PAGINATION
  ===================================================== */

  const currentPage = Math.max(
    1,
    Number(
      searchParams.get("page")
    ) || 1
  );

  const productsPerPage = 9;

  /* =====================================================
     UPDATE URL
  ===================================================== */

  const updateUrl = (
    categoryIds: string[],
    subcategoryIds: string[]
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (categoryIds.length > 0) {
      params.set(
        "category",
        categoryIds.join(",")
      );
    } else {
      params.delete("category");
    }

    if (
      subcategoryIds.length > 0
    ) {
      params.set(
        "subcategory",
        subcategoryIds.join(",")
      );
    } else {
      params.delete(
        "subcategory"
      );
    }

    /*
     * Filter change করলে আবার
     * প্রথম page থেকে শুরু
     */
    params.delete("page");

    const query =
      params.toString();

    router.push(
      query
        ? `${pathname}?${query}`
        : pathname,
      {
        scroll: false,
      }
    );
  };

  /* =====================================================
     CATEGORY CHANGE
  ===================================================== */

  const handleCategoryChange = (
    categoryIds: string[]
  ) => {
    updateUrl(
      categoryIds,
      selectedSubcategories
    );
  };

  /* =====================================================
     SUBCATEGORY CHANGE
  ===================================================== */

  const handleSubcategoryChange = (
    subcategoryIds: string[]
  ) => {
    updateUrl(
      selectedCategories,
      subcategoryIds
    );
  };

  /* =====================================================
     SORT CHANGE
  ===================================================== */

  const handleSortChange = (
    value: SortOption
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    /*
     * Sort change করলে প্রথম
     * page থেকে শুরু
     */
    params.delete("page");

    const query =
      params.toString();

    router.push(
      query
        ? `${pathname}?${query}`
        : pathname,
      {
        scroll: false,
      }
    );
  };

  /* =====================================================
     PRODUCT FILTERING
  ===================================================== */

  const filteredProducts =
    useMemo(() => {
      /*
       * No filters selected
       */

      if (
        selectedCategories.length ===
        0 &&
        selectedSubcategories.length ===
        0
      ) {
        return products;
      }

      const selectedSubcategoriesByCategory =
        new Map<
          string,
          Set<string>
        >();

      for (const subcategoryId of selectedSubcategories) {
        for (const category of categories) {
          const subcategory =
            category.subcategories.find(
              (sub) =>
                sub.id ===
                subcategoryId
            );

          if (subcategory) {
            if (
              !selectedSubcategoriesByCategory.has(
                category.id
              )
            ) {
              selectedSubcategoriesByCategory.set(
                category.id,
                new Set()
              );
            }

            selectedSubcategoriesByCategory
              .get(
                category.id
              )!
              .add(
                subcategoryId
              );

            break;
          }
        }
      }

      return products.filter(
        (product) => {
          const productCategory =
            product.category;

          const productSubcategory =
            product.subcategory;

          if (
            selectedCategories.length ===
            0 &&
            selectedSubcategories.length >
            0
          ) {
            return selectedSubcategories.includes(
              productSubcategory
            );
          }

          const selectedSubcategoriesForProductCategory =
            selectedSubcategoriesByCategory.get(
              productCategory
            );

          if (
            selectedCategories.includes(
              productCategory
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
              productSubcategory
            );
          }

          if (
            selectedSubcategoriesByCategory.has(
              productCategory
            )
          ) {
            return selectedSubcategoriesByCategory
              .get(
                productCategory
              )!
              .has(
                productSubcategory
              );
          }

          return false;
        }
      );
    }, [
      selectedCategories,
      selectedSubcategories,
    ]);

  /* =====================================================
     PRODUCT SORTING
  ===================================================== */

  const sortedProducts =
    useMemo(() => {
      const sorted = [
        ...filteredProducts,
      ];

      switch (sortOption) {
        case "price-low":
          return sorted.sort(
            (a, b) =>
              (a.salePrice ??
                a.regularPrice) -
              (b.salePrice ??
                b.regularPrice)
          );

        case "price-high":
          return sorted.sort(
            (a, b) =>
              (b.salePrice ??
                b.regularPrice) -
              (a.salePrice ??
                a.regularPrice)
          );

        case "rating-high":
          return sorted.sort(
            (a, b) =>
              b.rating -
              a.rating
          );

        case "default":
        default:
          return sorted;
      }
    }, [
      filteredProducts,
      sortOption,
    ]);

  /* =====================================================
     PAGINATION CALCULATION
  ===================================================== */

  const totalPages =
    Math.ceil(
      sortedProducts.length /
      productsPerPage
    );

  const safeCurrentPage =
    totalPages > 0
      ? Math.min(
        currentPage,
        totalPages
      )
      : 1;

  const startIndex =
    (safeCurrentPage - 1) *
    productsPerPage;

  const endIndex =
    startIndex +
    productsPerPage;

  const paginatedProducts =
    sortedProducts.slice(
      startIndex,
      endIndex
    );

  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const handlePageChange = (
    page: number
  ) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === safeCurrentPage
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set(
      "page",
      page.toString()
    );

    const query =
      params.toString();

    router.push(
      `${pathname}?${query}`,
      {
        scroll: true,
      }
    );
  };

  /* =====================================================
     PAGE NUMBERS
  ===================================================== */

  const pageNumbers =
    Array.from(
      { length: totalPages },
      (_, index) =>
        index + 1
    );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="mx-auto mt-20 flex max-w-350 items-start gap-8">
      {/* =================================================
                FILTER
            ================================================= */}

      <ShopFilter
        categories={categories}
        selectedCategories={
          selectedCategories
        }
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

      {/* =================================================
                PRODUCTS
            ================================================= */}

      <div className="flex-1">
        {/* =================================================
                    SORT + VIEW TOGGLE
                ================================================= */}

        <div className="flex items-center justify-between">
          {/* Sort - Left */}
          <div>
            <ProductSort
              value={sortOption}
              onChange={handleSortChange}
            />
          </div>

          {/* View Toggle - Right */}
          <div className="flex h-11 shrink-0 items-center rounded-md border border-gray-300 bg-white p-1">
            {/* Grid View */}
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`flex h-9 w-9 items-center justify-center rounded transition ${viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Grid2X2 size={19} />
            </button>

            {/* List View */}
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`flex h-9 w-9 items-center justify-center rounded transition ${viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* =================================================
                    PRODUCT DISPLAY
                ================================================= */}

        {viewMode ===
          "grid" ? (
          /* ================================
             GRID VIEW
          ================================= */

          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">
            {paginatedProducts.map(
              (product) => (
                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />
              )
            )}
          </div>
        ) : (
          /* ================================
             LIST VIEW
          ================================= */

          <div className="mt-6 space-y-6">
            {paginatedProducts.map(
              (product) => (
                <ProductListCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />
              )
            )}
          </div>
        )}

        {/* =================================================
                    PAGINATION
                ================================================= */}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {/* Previous */}

            <button
              type="button"
              onClick={() =>
                handlePageChange(
                  safeCurrentPage -
                  1
                )
              }
              disabled={
                safeCurrentPage ===
                1
              }
              className="flex h-10 items-center rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-600"
            >
              Prev
            </button>

            {/* Page Numbers */}

            {pageNumbers.map(
              (page) => {
                const isActive =
                  page ===
                  safeCurrentPage;

                return (
                  <button
                    key={
                      page
                    }
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        page
                      )
                    }
                    className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition ${isActive
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
                      }`}
                  >
                    {page}
                  </button>
                );
              }
            )}

            {/* Next */}

            <button
              type="button"
              onClick={() =>
                handlePageChange(
                  safeCurrentPage +
                  1
                )
              }
              disabled={
                safeCurrentPage ===
                totalPages
              }
              className="flex h-10 items-center rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}