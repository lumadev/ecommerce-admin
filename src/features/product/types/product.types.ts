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
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductListItem extends Product {
  categories: ProductCategory[];
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  media: ProductMediaInput[];
  categoryIds: string[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  media?: ProductMediaInput[];
  categoryIds?: string[];
}
