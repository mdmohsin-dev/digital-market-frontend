import { categories } from "@/Data/categories";
import CategoryCard from "./CategoryCard";

export default function CategorySection() {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-350 md:mt-20 mt-16 px-4">
      <div className="mb-8 text-center sm:mb-10">
        <h2 className="text-2xl font-semibold font-lora sm:text-5xl">
          Shop by Category
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6 lg:gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}