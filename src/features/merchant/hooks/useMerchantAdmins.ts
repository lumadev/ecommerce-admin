import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { merchantAdminRepository } from "../repositories/merchantAdminRepository";
import {
  CreateMerchantAdminData,
  MerchantAdmin,
  UpdateMerchantAdminData,
} from "../types/merchant-admin.types";

export const useMerchantAdmins = (merchantId: string) => {
  const { toast } = useToast();
  const [adminList, setAdminList] = useState<MerchantAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadAdmins = async () => {
      setIsLoading(true);

      try {
        const admins = await merchantAdminRepository.findByMerchant(
          merchantId,
          controller.signal
        );
        setAdminList(admins);
      } catch (error) {
        if (axios.isCancel(error)) return;
        toast({ description: "Não foi possível carregar os admins da loja." });
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadAdmins();
    return () => controller.abort();
  }, [merchantId]);

  const createAdmin = async (data: CreateMerchantAdminData) => {
    try {
      const created = await merchantAdminRepository.create(merchantId, data);
      setAdminList((previous) => [created, ...previous]);
      toast({ variant: "success", description: "Admin criado com sucesso." });
      return created;
    } catch (error) {
      toast({ description: "Não foi possível criar o admin." });
      throw error;
    }
  };

  const updateAdmin = async (id: string, data: UpdateMerchantAdminData) => {
    try {
      const updated = await merchantAdminRepository.update(id, data);
      setAdminList((previous) =>
        previous.map((admin) => (admin.id === id ? updated : admin))
      );
      toast({ variant: "success", description: "Admin atualizado com sucesso." });
      return updated;
    } catch (error) {
      toast({ description: "Não foi possível atualizar o admin." });
      throw error;
    }
  };

  return { adminList, isLoading, createAdmin, updateAdmin };
};