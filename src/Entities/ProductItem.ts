import { Media } from "@/payload-types";
import { ProductCategoryEntity } from "./ProductCategory";

type ProductCategory = ProductCategoryEntity

export interface ProductImage {
  id: string;
  item: Media;
}
export interface Feature {
  id: number;
  item: string;
}
export interface ProductEntity {
  id: number;
  name: string;
  price: number;
  discounted: boolean;
  originalPrice?: number; 
  excerpt: string;
  description: string;
  unit: string;
  category: ProductCategory;
  images: ProductImage[];
  features: Feature[];
  updatedAt: string;
  createdAt: string;
}
