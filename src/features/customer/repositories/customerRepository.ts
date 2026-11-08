import { httpClientAuth } from "@/infra/http/httpClient";
import {
  CreateCustomerData,
  Customer,
  UpdateCustomerData,
} from "../types/customer.types";

const BASE_URL = "/users";
const ADMIN_BASE_URL = "/admin/users";

export const customerRepository = {
  findAll: async (signal?: AbortSignal): Promise<Customer[]> => {
    const response = await httpClientAuth.get<Customer[]>(BASE_URL, { signal });
    return response.data;
  },

  create: async (data: CreateCustomerData): Promise<Customer> => {
    const response = await httpClientAuth.post<Customer>(ADMIN_BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateCustomerData): Promise<Customer> => {
    const response = await httpClientAuth.patch<Customer>(
      `${BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await httpClientAuth.delete(`${BASE_URL}/${id}`);
  },
};
