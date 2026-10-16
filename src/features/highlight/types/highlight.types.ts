import type {
  ProductMediaRecord,
  ProductMediaType,
} from "@/features/product/types/product-media.types";

export interface HighlightProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  mediaUrls: string[];
  mediaTypes?: ProductMediaType[];
  media?: ProductMediaRecord[];
}

export interface Highlight {
  id: string;
  productId: string;
  position: number;
  product: HighlightProduct;
}
