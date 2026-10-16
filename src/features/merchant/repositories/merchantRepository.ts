import { httpClientAuth } from "@/infra/http/httpClient";
import {
  CreateMerchantData,
  Merchant,
  MerchantDetails,
  UpdateMerchantData,
} from "../types/merchant.types";

const BASE_URL = "/merchants";

export const merchantRepository = {
  findAll: async (signal?: AbortSignal): Promise<Merchant[]> => {
    const response = await httpClientAuth.get<Merchant[]>(BASE_URL, { signal });
    return response.data;
  },

  findById: async (
    id: string,
    signal?: AbortSignal
  ): Promise<MerchantDetails> => {
    const response = await httpClientAuth.get<MerchantDetails>(
      `${BASE_URL}/${id}`,
      { signal }
    );
    return response.data;
  },

  create: async (data: CreateMerchantData): Promise<Merchant> => {
    const response = await httpClientAuth.post<Merchant>(BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateMerchantData): Promise<Merchant> => {
    const response = await httpClientAuth.patch<Merchant>(
      `${BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await httpClientAuth.delete(`${BASE_URL}/${id}`);
  },
};
