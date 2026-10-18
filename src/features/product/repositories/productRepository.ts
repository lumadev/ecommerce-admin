import { httpClientAuth } from "@/infra/http/httpClient";
import {
  CreateProductData,
  Product,
  ProductCategory,
  ProductListItem,
  UpdateProductData,
} from "../types/product.types";

const BASE_URL = "/products";

type ApiProduct = Omit<Product, "price"> & {
  price: number | string;
};

type ApiProductListItem = ApiProduct & {
  categories?: ProductCategory[];
};

const normalizeProduct = (product: ApiProduct): Product => ({
  ...product,
  price: Number(product.price),
});

const normalizeProductListItem = (
  product: ApiProductListItem
): ProductListItem => ({
  ...normalizeProduct(product),
  categories: product.categories ?? [],
});

export const productRepository = {
  findAll: async (signal?: AbortSignal): Promise<ProductListItem[]> => {
    const response = await httpClientAuth.get<ApiProductListItem[]>(BASE_URL, {
      signal,
    });
    return response.data.map(normalizeProductListItem);
  },

  create: async (data: CreateProductData): Promise<Product> => {
    const response = await httpClientAuth.post<ApiProduct>(BASE_URL, data);
    return normalizeProduct(response.data);
  },

  findOne: async (id: string): Promise<Product> => {
    const response = await httpClientAuth.get<ApiProduct>(`${BASE_URL}/${id}`);
    return normalizeProduct(response.data);
  },

  update: async (
    id: string,
    data: UpdateProductData
  ): Promise<ProductListItem> => {
    const response = await httpClientAuth.patch<ApiProductListItem>(
      `${BASE_URL}/${id}`,
      data
    );
    return normalizeProductListItem(response.data);
  },

  remove: async (id: string): Promise<void> => {
    await httpClientAuth.delete(`${BASE_URL}/${id}`);
  },
};
