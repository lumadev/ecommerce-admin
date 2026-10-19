import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdminAuth } from "./useAdminAuth";
import { authRepository } from "../repositories/authRepository";
import {
  impersonationQueryKeys,
  impersonationTargetsQueryOptions,
} from "./impersonationQueries";

export const useImpersonation = () => {
  const { user, refreshSession } = useAdminAuth();
  const queryClient = useQueryClient();
  const [isSwitching, setIsSwitching] = useState(false);

  const impersonatedBy = user?.impersonatedBy ?? null;
  const isImpersonating = Boolean(impersonatedBy);
  const canImpersonate = user?.role === "SUPER_ADMIN" || isImpersonating;
  const {
    data: targets = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    ...impersonationTargetsQueryOptions(),
    enabled: canImpersonate,
  });

  useEffect(() => {
    if (isError) {
      console.error("Falha ao listar admins para impersonate", error);
    }
  }, [error, isError]);

  const run = useCallback(
    async (request: () => Promise<void>) => {
      setIsSwitching(true);
      try {
        await request();
        await refreshSession();
        await queryClient.invalidateQueries({
          queryKey: impersonationQueryKeys.targets(),
        });
      } finally {
        setIsSwitching(false);
      }
    },
    [queryClient, refreshSession]
  );

  const impersonate = (adminId: string) =>
    run(() => authRepository.impersonate(adminId));

  const stopImpersonation = () => run(authRepository.stopImpersonation);

  return {
    canImpersonate,
    isImpersonating,
    impersonatedAdminId: isImpersonating ? user?.id ?? null : null,
    targets: canImpersonate ? targets : [],
    isLoading,
    isRefreshing: isFetching && !isLoading,
    isSwitching,
    impersonate,
    stopImpersonation,
  };
};
