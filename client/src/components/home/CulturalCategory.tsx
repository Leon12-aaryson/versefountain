import { Link } from "wouter";
import { CulturalCategory } from "@shared/schema";

interface CulturalCategoryProps {
  category: CulturalCategory;
}

export default function CulturalCategoryComponent({ category }: CulturalCategoryProps) {
  return (
    <Link href={`/culture/${category.name.toLowerCase()}`}>
      <a className="group">
        <div className="aspect-square rounded-lg overflow-hidden relative">
          <img
            src={category.imageUrl}
            alt={`${category.name} literature`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white font-display text-center">
            {category.name}
          </div>
        </div>
        <div className="mt-2 text-center text-sm text-neutral-charcoal">
          {category.workCount} Works
        </div>
      </a>
    </Link>
  );
}
