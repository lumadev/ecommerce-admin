import { type ReactNode } from "react";

import { ImpersonationSelect } from "@/features/components/ImpersonationSelect";
import { SidebarTrigger } from "@/shared/components/ui/sidebar/sidebar";

interface AdminHeaderProps {
  storeName?: string;
  showAccountStore: boolean;
  storePicker: ReactNode;
  onImpersonationChange: () => void;
}

export const AdminHeader = ({
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
