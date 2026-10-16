import { useEffect, useState } from "react";
import axios from "axios";
import { categoryRepository } from "@/features/product/repositories/categoryRepository";

type ProductCategory = {
  id: string;
  name: string;
};

export const useProductCategories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await categoryRepository.findAll(controller.signal);
        setCategories(response.map(({ id, name }) => ({ id, name })));
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        setHasError(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    categories,
    isLoading,
    hasError,
  };
};
