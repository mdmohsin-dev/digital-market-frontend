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
      href={`/category/${category.slug}`}
      className="flex flex-col bg-neutral-900  transition-all duration-300 hover:-translate-y-1"
    >
      <div>
        <Image
          src={category.image}
          alt={category.name}
          className=""
        />
      </div>

      <div className="absolute bottom-0 p-4">
        <h3 className="text-xl w-full font-semibold text-white">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}