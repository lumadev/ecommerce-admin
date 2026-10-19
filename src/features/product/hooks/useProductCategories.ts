import { useQuery } from "@tanstack/react-query";
import { categoryListQueryOptions } from "@/features/category/hooks/categoryQueries";
import { Category } from "@/features/category/types/category.types";

export type ProductCategory = {
  id: string;
  name: string;
};

export const useProductCategories = (
  enabled: boolean,
  merchantCode?: string,
) => {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    ...categoryListQueryOptions(merchantCode),
    enabled: enabled && Boolean(merchantCode),
  });

  return {
    categories: categories.map(({ id, name }: Category) => ({ id, name })),
    isLoading: enabled && (!merchantCode || isLoading),
    hasError: isError,
  };
};
