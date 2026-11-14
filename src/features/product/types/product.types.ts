import type {
  MediaInput,
  MediaRecord,
  MediaType,
} from "@/infra/media/media.types";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  mediaUrls: string[];
  mediaTypes?: MediaType[];
  media?: MediaRecord[];
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
  name: string;
  description?: string;
  price: number;
  stock: number;
  media?: MediaInput[];
  categoryIds: string[];
  variants?: ProductVariantInput[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  media?: MediaInput[];
  categoryIds?: string[];
  variants?: ProductVariantInput[];
}

export interface StockMovement {
  id: string;
  type: "INITIAL_STOCK" | "ADMIN_ADJUSTMENT" | "ORDER_DEDUCTION" | "ORDER_RETURN";
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  orderId: string | null;
  createdAt: string;
}

export interface StockMovementPage {
  items: StockMovement[];
  total: number;
  page: number;
  pageSize: number;
}
