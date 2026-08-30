import { StaticImageData } from "next/image";

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductVariation {
  id: string;
  size?: string;
  color?: string;
  price: number;
  salePrice?: number;
  stock: number;
  image: string | StaticImageData;
}

export interface Product {
  id: string;
  name: string;
  slug: string;

  // Images
  images: (string|StaticImageData)[];

  // Category
  category: string;
  subcategory: string;

  // Pricing
  regularPrice: number;
  salePrice?: number;
  discount?: number;

  // Rating & Reviews
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];

  // Stock
  stock: number;

  // Variations
  variations?: ProductVariation[];

  // Product Information
  description: string;

  specifications: {
    [key: string]: string;
  };

  // Delivery & Return
  deliveryInformation: string;
  returnPolicy: string;

  // Related Products
  relatedProductIds: string[];

  // Homepage / Product flags
  featured?: boolean;
  newArrival?: boolean;
  bestSelling?: boolean;
}