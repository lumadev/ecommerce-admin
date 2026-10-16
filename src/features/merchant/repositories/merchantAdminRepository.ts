import { httpClientAuth } from "@/infra/http/httpClient";
import {
  CreateMerchantAdminData,
  MerchantAdmin,
  UpdateMerchantAdminData,
} from "../types/merchant-admin.types";

const BASE_URL = "/admins";

interface AdminManagementRecord {
  id: string;
  name: string;
  email: string;
  username: string;
  merchant: { id: string; code: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export const merchantAdminRepository = {
  findByMerchant: async (
    merchantId: string,
    signal?: AbortSignal
  ): Promise<MerchantAdmin[]> => {
    const response = await httpClientAuth.get<AdminManagementRecord[]>(BASE_URL, {
      signal,
    });
    return response.data.flatMap((admin) =>
      admin.merchant?.id === merchantId
        ? [{
            id: admin.id,
            name: admin.name,
            email: admin.email,
            username: admin.username,
            role: "ADMIN" as const,
            merchantId: admin.merchant.id,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
          }]
        : []
    );
  },

  create: async (
    merchantId: string,
    data: CreateMerchantAdminData
  ): Promise<MerchantAdmin> => {
    const response = await httpClientAuth.post<MerchantAdmin>(BASE_URL, {
      ...data,
      merchantId,
    });
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateMerchantAdminData
  ): Promise<MerchantAdmin> => {
    const response = await httpClientAuth.patch<MerchantAdmin>(
      `${BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

};