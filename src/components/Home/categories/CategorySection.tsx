import { getFeaturedCategories } from "@/Data/categories";
import CategoryCard from "./CategoryCard";

export default function CategorySection() {
  const featuredCategories = getFeaturedCategories();

  if (featuredCategories.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 text-center sm:mb-10">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Shop by Category
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-400 sm:text-base">
          Explore our full range, organized to help you find exactly what
          you're looking for.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6 lg:gap-6">
        {featuredCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}