import { SidebarProvider } from "@/shared/components/ui/sidebar/sidebar";

import AdminSidebar from "@/features/components/AdminSidebar";
import { StoreSelect } from "@/features/components/StoreSelect";
import { VariantProvider } from "@/features/variant/variant.provider";
import { AdminTheme } from "@/features/theme/AdminTheme";
import { useAdminLayoutState } from "@/features/admin/hooks/useAdminLayoutState";
import { AdminHeader } from "@/layout/components/AdminHeader";
import { AdminPageContent } from "@/layout/components/AdminPageContent";

export const AdminLayout = () => {
  const layout = useAdminLayoutState();
  const isSuperAdmin = layout.user?.role === "SUPER_ADMIN";

  return (
    <AdminTheme merchantCode={layout.themeMerchantCode}>
      <VariantProvider merchantCode={layout.merchantCode}>
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            <AdminSidebar className="hidden md:flex" merchantCode={layout.merchantCode} />

            <div className="flex min-w-0 flex-1 flex-col">
              <AdminHeader
                showAccountStore={!isSuperAdmin}
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