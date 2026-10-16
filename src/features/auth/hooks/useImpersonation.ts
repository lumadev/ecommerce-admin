import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "./useAdminAuth";
import { authRepository } from "../repositories/authRepository";
import { ImpersonationTarget } from "../types/auth.types";

export const useImpersonation = () => {
  const { user, refreshSession } = useAdminAuth();
  const [targets, setTargets] = useState<ImpersonationTarget[]>([]);
  const [isSwitching, setIsSwitching] = useState(false);

  const impersonatedBy = user?.impersonatedBy ?? null;
  const isImpersonating = Boolean(impersonatedBy);
  const canImpersonate = user?.role === "SUPER_ADMIN" || isImpersonating;

  useEffect(() => {
    if (!canImpersonate) return;

    authRepository
      .getImpersonationTargets()
      .then(setTargets)
      .catch((error) => {
        console.error("Falha ao listar admins para impersonate", error);
        setTargets([]);
      });
  }, [canImpersonate]);

  const run = useCallback(
    async (request: () => Promise<void>) => {
      setIsSwitching(true);
      try {
        await request();
        await refreshSession();
      } finally {
        setIsSwitching(false);
      }
    },
    [refreshSession]
  );

  const impersonate = (adminId: string) =>
    run(() => authRepository.impersonate(adminId));

  const stopImpersonation = () => run(authRepository.stopImpersonation);

  return {
    canImpersonate,
    isImpersonating,
    impersonatedAdminId: isImpersonating ? user?.id ?? null : null,
    targets,
    isSwitching,
    impersonate,
    stopImpersonation,
  };
};
