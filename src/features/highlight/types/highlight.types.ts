import type { MediaRecord, MediaType } from "@/infra/media/media.types";

export interface HighlightProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  mediaUrls: string[];
  mediaTypes?: MediaType[];
  media?: MediaRecord[];
}

export interface Highlight {
  id: string;
  productId: string;
  position: number;
  product: HighlightProduct;
}
