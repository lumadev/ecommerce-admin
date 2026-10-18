import { Outlet, useLocation } from "react-router-dom";
import { useLayoutEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/features/auth/hooks/useAdminAuth";
import { useMerchant } from "@/features/merchant/hooks/useMerchant";
import type { Merchant } from "@/features/merchant/types/merchant.types";
import type { SessionUser } from "@/features/auth/types/auth.types";
import { setActiveMerchantCode } from "@/infra/http/httpClient";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar/sidebar";

import AdminSidebar from "@/features/components/AdminSidebar";
import { ImpersonationSelect } from "@/features/components/ImpersonationSelect";
import { StoreSelect } from "@/features/components/StoreSelect";
import { VariantProvider } from "@/features/variant/variant.provider";
import { AdminTheme } from "@/features/theme/AdminTheme";

const STORE_DATA_ROUTES = new Set(["/produtos", "/categorias", "/destaques"]);

interface AdminLayoutState {
  user: SessionUser | null;
  merchantCode?: string;
  themeMerchantCode?: string;
  selectedMerchant: Merchant | null;
  setSelectedMerchant: (merchant: Merchant) => void;
  showStoreSelector: boolean;
  requiresStoreSelection: boolean;
  contentKey: string;
}

const useAdminLayoutState = (): AdminLayoutState => {
  const { user } = useAdminAuth();
  const location = useLocation();
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isSuperAdminActingAsSelf =
    isSuperAdmin && user?.impersonatedBy == null;
  const isStoreDataRoute = STORE_DATA_ROUTES.has(location.pathname);
  const showStoreSelector = isSuperAdminActingAsSelf && isStoreDataRoute;
  const accountMerchantId = user?.merchant?.id ?? user?.merchantId ?? undefined;

  const merchantIdToFetch = isSuperAdminActingAsSelf
    ? undefined
    : accountMerchantId;
  const { merchant: fetchedMerchant } = useMerchant(
    user?.merchant?.code ? undefined : merchantIdToFetch
  );
  const merchantCode = showStoreSelector
    ? selectedMerchant?.code
    : user?.merchant?.code ?? fetchedMerchant?.code;
  const activeMerchantCode = isSuperAdminActingAsSelf
    ? isStoreDataRoute
      ? selectedMerchant?.code
      : undefined
    : merchantCode;
  const themeMerchantCode = isSuperAdminActingAsSelf
    ? undefined
    : user?.merchant?.code ?? fetchedMerchant?.code;

  useLayoutEffect(() => {
    setActiveMerchantCode(activeMerchantCode);
  }, [activeMerchantCode]);

  return {
    user,
    merchantCode,
    themeMerchantCode,
    selectedMerchant,
    setSelectedMerchant,
    showStoreSelector,
    requiresStoreSelection: showStoreSelector && !selectedMerchant,
    contentKey: `${user?.id}:${showStoreSelector ? selectedMerchant?.id ?? "none" : "account"}`,
  };
};

interface AdminHeaderProps {
  storeName?: string;
  showAccountStore: boolean;
  storePicker: ReactNode;
  onImpersonationChange: () => void;
}

const AdminHeader = ({
  storeName,
  showAccountStore,
  storePicker,
  onImpersonationChange,
}: AdminHeaderProps) => (
  <header className="shrink-0 border-b border-border bg-background/80 backdrop-blur-xl">
    <div className="flex min-h-16 flex-wrap items-center gap-4 px-4 py-3">
      <SidebarTrigger />

      {showAccountStore && (
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Loja
          </p>
          <p className="truncate text-sm font-semibold text-foreground">
            {storeName}
          </p>
        </div>
      )}

      {storePicker}
      <ImpersonationSelect onBeforeChange={onImpersonationChange} />
    </div>
  </header>
);

interface AdminPageContentProps {
  contentKey: string;
  merchantCode?: string;
  requiresStoreSelection: boolean;
}

const AdminPageContent = ({
  contentKey,
  merchantCode,
  requiresStoreSelection,
}: AdminPageContentProps) => (
  <main className="min-h-0 flex-1 overflow-y-auto p-6">
    <motion.div
      key={contentKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {requiresStoreSelection ? (
        <p className="text-sm text-muted-foreground">
          Selecione uma loja para visualizar os dados.
        </p>
      ) : (
        <Outlet context={{ merchantCode }} />
      )}
    </motion.div>
  </main>
);

export const AdminLayout = () => {
  const layout = useAdminLayoutState();

  return (
    <AdminTheme merchantCode={layout.themeMerchantCode}>
    <VariantProvider merchantCode={layout.merchantCode}>
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AdminSidebar className="hidden md:flex" merchantCode={layout.merchantCode} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            showAccountStore={layout.user?.role !== "SUPER_ADMIN"}
            storeName={layout.user?.merchant?.name}
            onImpersonationChange={() => layout.setSelectedMerchant(null)}
            storePicker={
              layout.showStoreSelector ? (
                <StoreSelect
                  selectedMerchant={layout.selectedMerchant}
                  onChange={layout.setSelectedMerchant}
                />
              ) : null
            }
          />

          <AdminPageContent
            contentKey={layout.contentKey}
            merchantCode={layout.merchantCode}
            requiresStoreSelection={layout.requiresStoreSelection}
          />
        </div>
      </div>
    </SidebarProvider>
    </VariantProvider>
    </AdminTheme>
  );
};