import { StaticImageData } from "next/image";

import menImage from "@/assets/Images/categories/cat-men.png";
import womenImage from "@/assets/Images/categories/cat-women.png";
import kidsImage from "@/assets/Images/categories/cat-kids.png";
import bagsImage from "@/assets/Images/categories/cat-bags.png";
import weddingImage from "@/assets/Images/categories/cat-weading.png";
import homeDecorImage from "@/assets/Images/categories/cat-homedecor.png";

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | StaticImageData;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: "men",
    name: "Men",
    slug: "men",
    image: menImage,
    subcategories: [
      {
        id: "men_shirts",
        name: "Shirts",
        slug: "shirts",
      },
      {
        id: "men_pants",
        name: "Pants",
        slug: "pants",
      },
      {
        id: "men_tshirts",
        name: "T-Shirts",
        slug: "t-shirts",
      },
      {
        id: "men_shoes",
        name: "Shoes",
        slug: "shoes",
      },
    ],
  },

  {
    id: "women",
    name: "Women",
    slug: "women",
    image: womenImage,
    subcategories: [
      {
        id: "women_three-piece",
        name: "Three-Piece",
        slug: "three-piece",
      },
      {
        id: "women_tops",
        name: "Tops",
        slug: "tops",
      },
      {
        id: "women_pants",
        name: "Pants",
        slug: "pants",
      },
      {
        id: "women_shoes",
        name: "Shoes",
        slug: "shoes",
      },
    ],
  },

  {
    id: "kids",
    name: "Kids",
    slug: "kids",
    image: kidsImage,
    subcategories: [
      {
        id: "kids_boys",
        name: "Boys",
        slug: "boys",
      },
      {
        id: "kids_girls",
        name: "Girls",
        slug: "girls",
      },
      {
        id: "kids_shoes",
        name: "Shoes",
        slug: "shoes",
      },
    ],
  },

  {
    id: "bags",
    name: "Bags",
    slug: "bags",
    image: bagsImage,
    subcategories: [
      {
        id: "bags_handbags",
        name: "Handbags",
        slug: "handbags",
      },
      {
        id: "bags_backpacks",
        name: "Backpacks",
        slug: "backpacks",
      },
      {
        id: "bags_wallets",
        name: "Wallets",
        slug: "wallets",
      },
    ],
  },

  {
    id: "wedding",
    name: "Wedding",
    slug: "wedding",
    image: weddingImage,
    subcategories: [
      {
        id: "wedding_lehenga",
        name: "Lehenga",
        slug: "lehenga",
      },
      {
        id: "wedding_saree",
        name: "Saree",
        slug: "saree",
      },
      {
        id: "wedding_suits",
        name: "Suits",
        slug: "suits",
      },
    ],
  },

  {
    id: "home_decor",
    name: "Home Decor",
    slug: "home-decor",
    image: homeDecorImage,
    subcategories: [
      {
        id: "home_decor_lighting",
        name: "Lighting",
        slug: "lighting",
      },
      {
        id: "home_decor_wall",
        name: "Wall Decor",
        slug: "wall-decor",
      },
      {
        id: "home_decor_decor",
        name: "Decor Items",
        slug: "decor-items",
      },
    ],
  },
];