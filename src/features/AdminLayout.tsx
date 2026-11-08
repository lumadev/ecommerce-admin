import { Outlet } from "react-router-dom";
import { type ReactNode } from "react";
import { motion } from "framer-motion";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar/sidebar";

import AdminSidebar from "@/features/components/AdminSidebar";
import { ImpersonationSelect } from "@/features/components/ImpersonationSelect";
import { StoreSelect } from "@/features/components/StoreSelect";
import { VariantProvider } from "@/features/variant/variant.provider";
import { AdminTheme } from "@/features/theme/AdminTheme";
import { useAdminLayoutState } from "@/features/admin/hooks/useAdminLayoutState";

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
  isLoadingMerchants: boolean;
  requiresStoreSelection: boolean;
}

const AdminPageContent = ({
  contentKey,
  merchantCode,
  isLoadingMerchants,
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
          {isLoadingMerchants
            ? "Carregando a loja padrão..."
            : "Selecione uma loja para visualizar os dados."}
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
                  merchantList={layout.merchantList}
                  isLoading={layout.isLoadingMerchants}
                  onChange={layout.setSelectedMerchant}
                />
              ) : null
            }
          />

          <AdminPageContent
            contentKey={layout.contentKey}
            merchantCode={layout.merchantCode}
            isLoadingMerchants={layout.isLoadingMerchants}
            requiresStoreSelection={layout.requiresStoreSelection}
          />
        </div>
      </div>
    </SidebarProvider>
    </VariantProvider>
    </AdminTheme>
  );
};