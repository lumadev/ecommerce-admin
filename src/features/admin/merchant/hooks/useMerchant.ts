import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { merchantRepository } from "../repositories/merchantRepository";
import { MerchantDetails, UpdateMerchantData } from "../types/merchant.types";

export const useMerchant = (merchantId?: string) => {
  const { toast } = useToast();
  const [merchant, setMerchant] = useState<MerchantDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadMerchant = async () => {
      if (!merchantId) {
        setMerchant(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setMerchant(null);

      try {
        const details = await merchantRepository.findById(
          merchantId,
          controller.signal
        );
        setMerchant(details);
      } catch (error) {
        if (axios.isCancel(error)) return;
        setMerchant(null);
        toast({ description: "Não foi possível carregar a loja." });
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadMerchant();
    return () => controller.abort();
  }, [merchantId, toast]);

  const updateMerchant = async (id: string, data: UpdateMerchantData) => {
    try {
      const updated = await merchantRepository.update(id, data);
      setMerchant((previous) =>
        previous ? { ...previous, ...updated, admins: previous.admins } : previous
      );
      toast({ variant: "success", description: "Loja atualizada com sucesso." });
      return updated;
    } catch (error) {
      toast({ description: "Não foi possível atualizar a loja." });
      throw error;
    }
  };

  return { merchant, isLoading, updateMerchant };
};