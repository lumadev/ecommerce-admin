import { httpClientAuth } from "@/infra/http/httpClient";
import { Variant } from "../types/variant.types";

const BASE_URL = "/variants";

export const variantRepository = {
  findAll: async (
    merchantId: string,
    signal?: AbortSignal
  ): Promise<Variant[]> => {
    const response = await httpClientAuth.get<Variant[]>(BASE_URL, {
      params: { merchantId },
      signal,
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  addOption: async (variantId: string, value: string): Promise<void> => {
    await httpClientAuth.post(`${BASE_URL}/${variantId}/options`, { value });
  },

  // Endpoint de exclusão ainda não confirmado no backend.
  removeOption: async (variantId: string, optionId: string): Promise<void> => {
    await httpClientAuth.delete(`${BASE_URL}/${variantId}/options/${optionId}`);
  },
};
