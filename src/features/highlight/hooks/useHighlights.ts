import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { highlightRepository } from "../repositories/highlightRepository";
import { Highlight } from "../types/highlight.types";

export const useHighlights = () => {
  const { toast } = useToast();
  const [highlightList, setHighlightList] = useState<Highlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHighlights = useCallback(async (signal?: AbortSignal) => {
    try {
      const highlights = await highlightRepository.findAll(signal);
      setHighlightList(highlights);
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }

      toast({ description: "Não foi possível carregar os destaques." });
    }
  }, [toast]);

  useEffect(() => {
    const controller = new AbortController();

    const initialLoad = async () => {
      setIsLoading(true);
      await loadHighlights(controller.signal);
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    };

    void initialLoad();

    return () => {
      controller.abort();
    };
  }, [loadHighlights]);

  const addHighlight = async (productId: string) => {
    try {
      const created = await highlightRepository.create(productId);

      setHighlightList((prev) =>
        [...prev, created].sort((a, b) => a.position - b.position)
      );

      toast({ variant: "success", description: "Produto adicionado aos destaques." });
      return created;
    } catch (error) {
      toast({ description: "Não foi possível adicionar o produto aos destaques." });
      throw error;
    }
  };

  const removeHighlight = async (id: string) => {
    try {
      await highlightRepository.remove(id);

      setHighlightList((prev) => {
        const removed = prev.find((highlight) => highlight.id === id);
        if (!removed) {
          return prev;
        }

        return prev
          .filter((highlight) => highlight.id !== id)
          .map((highlight) =>
            highlight.position > removed.position
              ? { ...highlight, position: highlight.position - 1 }
              : highlight
          );
      });

      toast({ variant: "success", description: "Produto removido dos destaques." });
    } catch (error) {
      toast({ description: "Não foi possível remover o produto dos destaques." });
      throw error;
    }
  };

  const increaseHighlight = async (id: string) => {
    try {
      await highlightRepository.increase(id);

      setHighlightList((prev) => {
        const index = prev.findIndex((highlight) => highlight.id === id);
        if (index <= 0) {
          return prev;
        }

        const next = [...prev];
        const current = { ...next[index], position: next[index - 1].position };
        const previous = { ...next[index - 1], position: next[index].position };

        next[index - 1] = current;
        next[index] = previous;

        return next.sort((a, b) => a.position - b.position);
      });
    } catch (error) {
      toast({ description: "Não foi possível mover o destaque para cima." });
      throw error;
    }
  };

  const decreaseHighlight = async (id: string) => {
    try {
      await highlightRepository.decrease(id);

      setHighlightList((prev) => {
        const index = prev.findIndex((highlight) => highlight.id === id);
        if (index === -1 || index >= prev.length - 1) {
          return prev;
        }

        const next = [...prev];
        const current = { ...next[index], position: next[index + 1].position };
        const following = { ...next[index + 1], position: next[index].position };

        next[index + 1] = current;
        next[index] = following;

        return next.sort((a, b) => a.position - b.position);
      });
    } catch (error) {
      toast({ description: "Não foi possível mover o destaque para baixo." });
      throw error;
    }
  };

  return {
    highlightList,
    isLoading,
    addHighlight,
    removeHighlight,
    increaseHighlight,
    decreaseHighlight,
  };
};
