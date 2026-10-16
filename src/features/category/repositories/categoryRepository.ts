import { httpClientAuth } from "@/infra/http/httpClient";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "../types/category.types";

const BASE_URL = "/categories";

export const categoryRepository = {
  findAll: async (signal?: AbortSignal): Promise<Category[]> => {
    const response = await httpClientAuth.get<Category[]>(BASE_URL, {
      signal,
    });
    return response.data;
  },
    
  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await httpClientAuth.post<Category>(BASE_URL, data);
    return response.data;
  },

  findOne: async (id: string): Promise<Category> => {
    const response = await httpClientAuth.get<Category>(`${BASE_URL}/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryData): Promise<Category> => {
    const response = await httpClientAuth.patch<Category>(
      `${BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await httpClientAuth.delete(`${BASE_URL}/${id}`);
  },
};
