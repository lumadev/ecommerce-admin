import { useCallback, useEffect, useState } from "react";
import { API_PAGE_SIZE, ITEMS_PER_PAGE } from "@/shared/pagination.constants";

interface PageResult<T> {
  items: T[];
  total: number;
}

interface UsePaginationOptions<T> {
  fetchPage: (page: number, limit: number, signal: AbortSignal) => Promise<PageResult<T>>;
  onError?: (error: unknown) => void;
  enabled?: boolean;
  pageSize?: number;
  apiPageSize?: number;
}

export const usePagination = <T>({
  fetchPage,
  onError,
  enabled = true,
  pageSize = ITEMS_PER_PAGE,
  apiPageSize = API_PAGE_SIZE,
}: UsePaginationOptions<T>) => {
  if (
    !Number.isSafeInteger(pageSize) || pageSize < 1 ||
    !Number.isSafeInteger(apiPageSize) || apiPageSize < 1
  ) {
    throw new Error("Os tamanhos de página devem ser números inteiros positivos.");
  }

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [revision, setRevision] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();

    const loadPage = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const start = (page - 1) * pageSize;
        const firstApiPage = Math.floor(start / apiPageSize) + 1;
        const first = await fetchPage(firstApiPage, apiPageSize, controller.signal);
        if (controller.signal.aborted) return;

        const lastPage = Math.max(1, Math.ceil(first.total / pageSize));
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }

        const lastApiPage = Math.ceil(Math.min(start + pageSize, first.total) / apiPageSize);
        const results = [...first.items];
        for (let apiPage = firstApiPage + 1; apiPage <= lastApiPage; apiPage++) {
          const next = await fetchPage(apiPage, apiPageSize, controller.signal);
          if (controller.signal.aborted) return;
          results.push(...next.items);
        }

        const offset = start % apiPageSize;
        setItems(results.slice(offset, offset + pageSize));
        setTotal(first.total);
      } catch (error) {
        if (!controller.signal.aborted) {
          setHasError(true);
          onError?.(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadPage();
    return () => controller.abort();
  }, [enabled, page, pageSize, apiPageSize, fetchPage, onError, revision]);

  return { items, total, page, setPage, totalPages, isLoading, hasError, refresh };
};
