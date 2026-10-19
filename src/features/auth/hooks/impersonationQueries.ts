import { queryOptions } from "@tanstack/react-query";
import { authRepository } from "../repositories/authRepository";

export const impersonationQueryKeys = {
  targets: () => ["impersonation-targets"] as const,
};

export const impersonationTargetsQueryOptions = () =>
  queryOptions({
    queryKey: impersonationQueryKeys.targets(),
    queryFn: ({ signal }) => authRepository.getImpersonationTargets(signal),
    retry: false,
  });
