import {
  queryOptions,
  type QueryClient,
} from "@tanstack/react-query";
import { categoryRepository } from "../repositories/categoryRepository";
import type { Category } from "../types/category.types";

export const categoryQueryKeys = {
  list: (merchantCode?: string) =>
    ["categories", merchantCode ?? null] as const,
};

export const categoryListQueryOptions = (merchantCode?: string) =>
  queryOptions({
    queryKey: categoryQueryKeys.list(merchantCode),
    queryFn: ({ signal }) => categoryRepository.findAll(signal),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

export const updateCategoryListCache = async (
  queryClient: QueryClient,
  queryKey: ReturnType<typeof categoryQueryKeys.list>,
  update: (categories: Category[]) => Category[],
) => {
  await queryClient.cancelQueries({ queryKey });
  const categories = queryClient.getQueryData<Category[]>(queryKey);

  if (categories) {
    queryClient.setQueryData(queryKey, update(categories));
    return;
  }

  await queryClient.invalidateQueries({ queryKey });
};
