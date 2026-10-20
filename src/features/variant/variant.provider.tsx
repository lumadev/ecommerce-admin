import { ReactNode, useCallback, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { variantRepository } from "./repositories/variantRepository";
import { Variant } from "./types/variant.types";
import { VariantContext } from "./variant.context";

interface VariantProviderProps {
  children: ReactNode;
  merchantCode?: string;
}

export const VariantProvider = ({
  children,
  merchantCode,
}: VariantProviderProps) => {
  const { toast } = useToast();

  const [variants, setVariants] = useState<Variant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!merchantCode) {
        setVariants([]);
        return;
      }

      const list = await variantRepository.findAll(merchantCode, signal);
      setVariants(list);
    },
    [merchantCode]
  );

  const loadVariants = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setLoadError(
        merchantCode ? null : "Não foi possível identificar a loja do usuário."
      );

      try {
        await load(signal);
      } catch (error) {
        if (axios.isCancel(error) || signal?.aborted) return;
        setVariants([]);
        setLoadError("Não foi possível carregar as variantes.");
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [load, merchantCode]
  );

  const addOption = useCallback(
    async (variantId: string, value: string) => {
      try {
        await variantRepository.addOption(variantId, value);
        await load();
        toast({ variant: "success", description: "Opção adicionada com sucesso." });
        return true;
      } catch {
        toast({ description: "Não foi possível adicionar a opção." });
        return false;
      }
    },
    [load, toast]
  );

  const removeOption = useCallback(
    async (variantId: string, optionId: string) => {
      try {
        await variantRepository.removeOption(variantId, optionId);
        await load();
        toast({ variant: "success", description: "Opção removida com sucesso." });
        return true;
      } catch {
        toast({ description: "Não foi possível remover a opção." });
        return false;
      }
    },
    [load, toast]
  );

  const value = useMemo(
    () => ({
      variants,
      isLoading,
      loadError,
      load: loadVariants,
      addOption,
      removeOption,
    }),
    [variants, isLoading, loadError, loadVariants, addOption, removeOption]
  );

  return (
    <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
  );
};
