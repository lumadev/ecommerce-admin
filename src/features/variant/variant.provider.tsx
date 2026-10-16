import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/features/auth/hooks/useAdminAuth";
import { variantRepository } from "./repositories/variantRepository";
import { Variant } from "./types/variant.types";
import { VariantContext } from "./variant.context";

export const VariantProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAdminAuth();
  const merchantId = user?.merchantId ?? null;

  const [variants, setVariants] = useState<Variant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!merchantId) {
        setVariants([]);
        return;
      }

      const list = await variantRepository.findAll(merchantId, signal);
      setVariants(list.filter((variant) => variant.type === "preset"));
    },
    [merchantId]
  );

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setLoadError(
      merchantId ? null : "Não foi possível identificar a loja do usuário."
    );

    load(controller.signal)
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setVariants([]);
        setLoadError("Não foi possível carregar as variantes.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [load]);

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
    () => ({ variants, isLoading, loadError, addOption, removeOption }),
    [variants, isLoading, loadError, addOption, removeOption]
  );

  return (
    <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
  );
};
