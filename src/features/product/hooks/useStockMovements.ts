import { useEffect, useState } from "react";
import axios from "axios";
import { productRepository } from "../repositories/productRepository";
import type { StockMovementPage } from "../types/product.types";

export const useStockMovements = (
  productId: string,
  merchantCode: string | undefined,
) => {
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState<StockMovementPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const data = await productRepository.findStockMovements(
          productId,
          page,
          merchantCode,
          controller.signal,
        );
        if (!controller.signal.aborted) setResult(data);
      } catch (error) {
        if (!controller.signal.aborted && !axios.isCancel(error)) {
          setHasError(true);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [productId, merchantCode, page, retry]);

  return {
    page,
    setPage,
    result,
    isLoading,
    hasError,
    retry: () => setRetry((value) => value + 1),
  };
};
