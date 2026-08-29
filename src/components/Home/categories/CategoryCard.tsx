import { Category } from "@/Data/categories";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${category.id}`}
      className="group relative flex flex-col overflow-hidden bg-neutral-900 transition-all duration-300 hover:-translate-y-1 rounded-2xl"
    >
      <div className="relative aspect-square w-full">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover rounded-2xl"
        />

        {/* hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </div>

      <div className="absolute bottom-0 flex w-full items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-xl font-semibold text-white">
          {category.name}
        </h3>
        <FaArrowRight className="text-white text-lg" />
      </div>
    </Link>
  );
}