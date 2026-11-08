import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAdminAuth } from "@/features/auth/hooks/useAdminAuth";
import { useMerchant } from "@/features/admin/merchant/hooks/useMerchant";
import { useMerchants } from "@/features/admin/merchant/hooks/useMerchants";
import type { Merchant } from "@/features/admin/merchant/types/merchant.types";
import type { SessionUser } from "@/features/auth/types/auth.types";
import { setActiveMerchantCode } from "@/infra/http/httpClient";

const STORE_DATA_ROUTES = new Set([
  "/produtos",
  "/categorias",
  "/destaques",
  "/clientes",
  "/templates-email",
]);

const DEFAULT_STORE_CODE = "ecommerce-3d";

interface AdminLayoutState {
  user: SessionUser | null;
  merchantCode?: string;
  themeMerchantCode?: string;
  selectedMerchant: Merchant | null;
  merchantList: Merchant[];
  isLoadingMerchants: boolean;
  setSelectedMerchant: (merchant: Merchant | null) => void;
  showStoreSelector: boolean;
  requiresStoreSelection: boolean;
  contentKey: string;
}

export const useAdminLayoutState = (): AdminLayoutState => {
  const { user } = useAdminAuth();
  const { pathname } = useLocation();
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(
    null,
  );

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isSuperAdminActingAsSelf =
    isSuperAdmin && user?.impersonatedBy == null;
  const isStoreDataRoute = STORE_DATA_ROUTES.has(pathname);
  const showStoreSelector = isSuperAdminActingAsSelf && isStoreDataRoute;
  const { merchantList, isLoading: isLoadingMerchants } =
    useMerchants(showStoreSelector);
  const selectedMerchant =
    selectedMerchantId === null
      ? showStoreSelector && !isLoadingMerchants
        ? merchantList.find(
            (merchant) => merchant.code === DEFAULT_STORE_CODE,
          ) ?? null
        : null
      : merchantList.find((merchant) => merchant.id === selectedMerchantId) ??
        null;

  const accountMerchantId = user?.merchant?.id ?? user?.merchantId ?? undefined;
  const merchantIdToFetch = isSuperAdminActingAsSelf
    ? undefined
    : accountMerchantId;
  const { merchant: fetchedMerchant } = useMerchant(
    user?.merchant?.code ? undefined : merchantIdToFetch,
  );

  const accountMerchantCode = user?.merchant?.code ?? fetchedMerchant?.code;
  const merchantCode = showStoreSelector
    ? selectedMerchant?.code
    : accountMerchantCode;
  const activeMerchantCode = isSuperAdminActingAsSelf
    ? isStoreDataRoute
      ? selectedMerchant?.code
      : undefined
    : merchantCode;
  const themeMerchantCode = isSuperAdminActingAsSelf
    ? undefined
    : accountMerchantCode;

  useLayoutEffect(() => {
    setActiveMerchantCode(activeMerchantCode);
  }, [activeMerchantCode]);

  return {
    user,
    merchantCode,
    themeMerchantCode,
    selectedMerchant,
    merchantList,
    isLoadingMerchants,
    setSelectedMerchant: (merchant) =>
      setSelectedMerchantId(merchant?.id ?? null),
    showStoreSelector,
    requiresStoreSelection: showStoreSelector && !selectedMerchant,
    contentKey: `${user?.id}:${showStoreSelector ? selectedMerchant?.id ?? "none" : "account"}`,
  };
};
