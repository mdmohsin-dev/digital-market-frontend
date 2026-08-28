// src/types/product.ts

export type ProductBadge = "NEW" | "SALE" | "HOT";

export type ProductStatus = "in_stock" | "low_stock" | "out_of_stock";

/**
 * Mirrors the product structure expected from the future
 * Express + Prisma + PostgreSQL API. Swapping mock data for a real
 * fetch later should not require changes to this shape.
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  regularPrice: number;
  salePrice?: number;
  images: string[];
  category: string;
  brand?: string;
  tags?: string[];
  stockQuantity: number;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  featured: boolean;
  colors?: string[];
  badge?: ProductBadge;
}