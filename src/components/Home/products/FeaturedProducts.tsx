// src/components/home/products/FeaturedProducts.tsx
import { getFeaturedProducts } from "@/Data/products";
import Link from "next/link";import ProductCard from "./ProductCard";
;

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center sm:mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9D1749]">
          Curated For You
        </span>
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
          Featured Products
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-400 sm:text-base">
          Handpicked styles loved by our customers. Explore our most popular
          picks.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-white underline-offset-4 hover:text-[#9D1749] hover:underline"
        >
          View All Products →
        </Link>
      </div>
    </section>
  );
}