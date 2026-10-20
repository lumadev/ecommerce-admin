import type {
  ProductMediaInput,
  ProductMediaRecord,
  ProductMediaType,
} from "@/features/product/types/product-media.types";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  mediaUrls: string[];
  mediaTypes?: ProductMediaType[];
  media?: ProductMediaRecord[];
  mediaPublicIds?: string[];
  variants?: ProductVariantInput[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariantInput {
  attributeId: string;
  optionId?: string;
  value?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductListItem extends Product {
  categories: ProductCategory[];
}

export interface CreateProductData {
  merchantCode: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  media?: ProductMediaInput[];
  categoryIds: string[];
  variants?: ProductVariantInput[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  media?: ProductMediaInput[];
  categoryIds?: string[];
  variants?: ProductVariantInput[];
}
