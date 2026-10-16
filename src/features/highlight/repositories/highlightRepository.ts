import { httpClientAuth, httpClientPublic } from "@/infra/http/httpClient";
import { Highlight, HighlightProduct } from "../types/highlight.types";

const BASE_URL = "/highlights";

type ApiHighlightProduct = Omit<HighlightProduct, "price"> & {
  price: number | string;
};

type ApiHighlight = Omit<Highlight, "product"> & {
  product: ApiHighlightProduct;
};

const normalizeHighlight = (highlight: ApiHighlight): Highlight => ({
  ...highlight,
  product: {
    ...highlight.product,
    price: Number(highlight.product.price),
  },
});

export const highlightRepository = {
  findAll: async (signal?: AbortSignal): Promise<Highlight[]> => {
    const response = await httpClientPublic.get<ApiHighlight[]>(BASE_URL, {
      signal,
    });
    return response.data.map(normalizeHighlight);
  },

  create: async (productId: string): Promise<Highlight> => {
    const response = await httpClientAuth.post<ApiHighlight>(BASE_URL, {
      productId,
    });
    return normalizeHighlight(response.data);
  },

  remove: async (id: string): Promise<void> => {
    await httpClientAuth.delete(`${BASE_URL}/${id}`);
  },

  increase: async (id: string): Promise<Highlight> => {
    const response = await httpClientAuth.patch<ApiHighlight>(
      `${BASE_URL}/${id}/increase`
    );
    return normalizeHighlight(response.data);
  },

  decrease: async (id: string): Promise<Highlight> => {
    const response = await httpClientAuth.patch<ApiHighlight>(
      `${BASE_URL}/${id}/decrease`
    );
    return normalizeHighlight(response.data);
  },
};
