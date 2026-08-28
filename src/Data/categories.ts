// src/data/categories.ts

import tShirt from "@/assets/Images/blank-grey-t-shirt-front-hanger-design-mockup-clipping-path-side-view-gray-clear-plain-cotton-tshirt-mock-up-template-apparel-74254040 (1).webp"
import { StaticImageData } from "next/image";

/**
 * Category data shape.
 * Mirrors what the future GET /api/categories?featured=true
 * endpoint (Express -> Prisma -> PostgreSQL) is expected to return,
 * so swapping mock data for a real fetch later requires no changes
 * to CategorySection or CategoryCard.
 * 
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | StaticImageData;
  description?: string;
  featured: boolean;
  displayOrder: number;
}

export const categories: Category[] = [
  {
    id: "cat_headphone",
    name: "Headphones",
    slug: "headphones",
    image: tShirt,
    description: "Wired and wireless sound, tuned for every ear.",
    featured: true,
    displayOrder: 1,
  },
  {
    id: "cat_camera",
    name: "Cameras",
    slug: "cameras",
    image: "/images/categories/cameras.jpg",
    description: "Capture more, from everyday shots to pro shoots.",
    featured: true,
    displayOrder: 2,
  },
  {
    id: "cat_router",
    name: "Routers",
    slug: "routers",
    image: "/images/categories/routers.jpg",
    description: "Faster, more reliable connections for every room.",
    featured: true,
    displayOrder: 3,
  },
  {
    id: "cat_speaker",
    name: "Speakers",
    slug: "speakers",
    image: "/images/categories/speakers.jpg",
    description: "Room-filling sound for home and on the go.",
    featured: true,
    displayOrder: 4,
  },
  {
    id: "cat_projector",
    name: "Projectors",
    slug: "projectors",
    image: "/images/categories/projectors.jpg",
    description: "Big-screen experiences, anywhere you set up.",
    featured: true,
    displayOrder: 5,
  },
  {
    id: "cat_drone",
    name: "Drones",
    slug: "drones",
    image: "/images/categories/drones.jpg",
    description: "Aerial shots and smart flight, simplified.",
    featured: false,
    displayOrder: 6,
  },
  {
    id: "cat_smartwatch",
    name: "Smartwatches",
    slug: "smartwatches",
    image: "/images/categories/smartwatches.jpg",
    description: "Track, notify, and stay connected on your wrist.",
    featured: true,
    displayOrder: 7,
  },
  {
    id: "cat_powerbank",
    name: "Powerbanks",
    slug: "powerbanks",
    image: "/images/categories/powerbanks.jpg",
    description: "Reliable backup power for every device.",
    featured: false,
    displayOrder: 8,
  },
];

/**
 * Returns categories flagged for homepage display, sorted by
 * admin-configurable displayOrder.
 *
 * Later this becomes: `await fetch("/api/categories?featured=true")`
 * — the function signature/return shape stays the same, so callers
 * (CategorySection) don't need to change.
 */
export function getFeaturedCategories(): Category[] {
  return categories
    .filter((category) => category.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}