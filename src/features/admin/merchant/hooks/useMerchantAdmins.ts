import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { impersonationQueryKeys } from "@/features/auth/hooks/impersonationQueries";
import { merchantAdminRepository } from "../repositories/merchantAdminRepository";
import {
  CreateMerchantAdminData,
  MerchantAdmin,
  UpdateMerchantAdminData,
} from "../types/merchant-admin.types";

export const useMerchantAdmins = (
  merchantId: string,
  initialAdmins: MerchantAdmin[]
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adminList, setAdminList] = useState<MerchantAdmin[]>(initialAdmins);

  const createAdmin = async (data: CreateMerchantAdminData) => {
    try {
      const created = await merchantAdminRepository.create(merchantId, data);
      setAdminList((previous) => [created, ...previous]);
      await queryClient.invalidateQueries({
        queryKey: impersonationQueryKeys.targets(),
      });
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
      await queryClient.invalidateQueries({
        queryKey: impersonationQueryKeys.targets(),
      });
      toast({ variant: "success", description: "Admin atualizado com sucesso." });
      return updated;
    } catch (error) {
      toast({ description: "Não foi possível atualizar o admin." });
      throw error;
    }
  };

  const removeAdmin = async (id: string) => {
    try {
      await merchantAdminRepository.remove(id);
      setAdminList((previous) => previous.filter((admin) => admin.id !== id));
      await queryClient.invalidateQueries({
        queryKey: impersonationQueryKeys.targets(),
      });
      toast({ variant: "success", description: "Admin removido com sucesso." });
    } catch (error) {
      toast({ description: "Não foi possível remover o admin." });
      throw error;
    }
  };

  return { adminList, createAdmin, updateAdmin, removeAdmin };
};