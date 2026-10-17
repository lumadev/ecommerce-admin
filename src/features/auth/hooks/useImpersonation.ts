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
    if (!canImpersonate) {
      setTargets([]);
      return;
    }

    const controller = new AbortController();

    authRepository
      .getImpersonationTargets(controller.signal)
      .then(setTargets)
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Falha ao listar admins para impersonate", error);
        setTargets([]);
      });

    return () => controller.abort();
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
