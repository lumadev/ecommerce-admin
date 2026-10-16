import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/features/auth/hooks/useAdminAuth";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar/sidebar";

import AdminSidebar from "@/features/components/AdminSidebar";
import { ImpersonationSelect } from "@/features/components/ImpersonationSelect";
import { VariantProvider } from "@/features/variant/variant.provider";

export const AdminLayout = () => {
  const { user } = useAdminAuth();

  return (
    <VariantProvider>
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AdminSidebar className="hidden md:flex" />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="shrink-0 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-4 px-4">
              <SidebarTrigger />

              {user?.role !== "SUPER_ADMIN" && (
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    Loja
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user?.name || "Painel administrativo"}
                  </p>
                </div>
              )}

              <ImpersonationSelect />
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto p-6">
            <motion.div
              key={user?.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </VariantProvider>
  );
};