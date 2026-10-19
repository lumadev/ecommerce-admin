import { useEffect, useState } from "react";
import axios from "axios";
import { categoryRepository } from "@/features/product/repositories/categoryRepository";

export type ProductCategory = {
  id: string;
  name: string;
};

export const useProductCategories = (enabled: boolean) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadCategories = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await categoryRepository.findAll(controller.signal);
        setCategories(response.map(({ id, name }) => ({ id, name })));
        setHasLoaded(true);
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
  }, [enabled]);

  return {
    categories,
    isLoading: enabled && (isLoading || (!hasLoaded && !hasError)),
    hasError,
  };
};
