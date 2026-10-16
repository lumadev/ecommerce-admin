import { AxiosRequestConfig } from "axios";
import { httpClientAuth } from "./httpClient";

export const httpService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await httpClientAuth.get<T>(url, config);
    return data;
  },

  post: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const { data } = await httpClientAuth.post<T>(url, body, config);
    return data;
  },

  put: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const { data } = await httpClientAuth.put<T>(url, body, config);
    return data;
  },
};