import { Category } from "@/Data/categories";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-neutral-800 transition-all duration-300 hover:ring-[#9D1749]/60 hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* subtle bottom gradient so the label reads cleanly over any image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-sm font-medium text-white sm:text-base">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}