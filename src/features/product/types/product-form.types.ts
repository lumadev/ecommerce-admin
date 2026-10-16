import type { ProductMediaType } from "@/features/product/types/product-media.types";

export interface ProductFormMedia {
  type: ProductMediaType;
  src: string;
  poster?: string;
  publicId: string;
  format?: string;
  persisted: boolean;
}

export interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  media: ProductFormMedia[];
  categoryIds: string[];
}