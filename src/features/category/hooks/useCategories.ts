import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { categoryRepository } from "../repositories/categoryRepository";
import {
  CreateCategoryData,
  UpdateCategoryData,
} from "../types/category.types";
import {
  categoryListQueryOptions,
  categoryQueryKeys,
  updateCategoryListCache,
} from "./categoryQueries";

export const useCategories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { merchantCode } = useOutletContext<{ merchantCode?: string }>();
  const queryKey = categoryQueryKeys.list(merchantCode);
  const {
    data: categoryList = [],
    isLoading,
    isError,
  } = useQuery({
    ...categoryListQueryOptions(merchantCode),
    enabled: Boolean(merchantCode),
  });

  useEffect(() => {
    if (isError) {
      toast({ description: "Não foi possível carregar as categorias." });
    }
  }, [isError, toast]);

  const updateCategory = async (id: string, data: UpdateCategoryData) => {
    try {
      const updated = await categoryRepository.update(id, data);
      await updateCategoryListCache(queryClient, queryKey, (categories) =>
        categories.map((category) =>
          category.id === id ? updated : category,
        ),
      );

      toast({ variant: "success", description: "Categoria atualizada com sucesso." });
      return updated;
    } catch (error) {
      toast({ description: "Não foi possível atualizar a categoria." });
      return false;
    }
  };

  const createCategory = async (data: CreateCategoryData) => {
    try {
      const created = await categoryRepository.create(data);
      await updateCategoryListCache(queryClient, queryKey, (categories) => [
        created,
        ...categories,
      ]);

      toast({ variant: "success", description: "Categoria criada com sucesso." });
      return created;
    } catch (error) {
      toast({ description: "Não foi possível criar a categoria." });
      throw error;
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await categoryRepository.remove(id);
      await updateCategoryListCache(queryClient, queryKey, (categories) =>
        categories.filter((category) => category.id !== id),
      );

      toast({ variant: "success", description: "Categoria removida com sucesso." });
    } catch (error) {
      toast({ description: "Não foi possível remover a categoria." });
      throw error;
    }
  };

  return {
    categoryList,
    isLoading: isLoading || !merchantCode,
    updateCategory,
    createCategory,
    removeCategory,
  };
};
