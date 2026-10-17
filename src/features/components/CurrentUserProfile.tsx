import { useState } from "react";
import { Pencil } from "lucide-react";
import { useAdminAuth } from "@/features/auth/hooks/useAdminAuth";
import { useMerchantAdmins } from "@/features/merchant/hooks/useMerchantAdmins";
import EditMerchantAdminDialog from "@/features/merchant/form/EditMerchantAdminDialog";
import {
  MerchantAdmin,
  UpdateMerchantAdminData,
} from "@/features/merchant/types/merchant-admin.types";

interface Props {
  collapsed: boolean;
}

const CurrentUserProfile = ({ collapsed }: Props) => {
  const { user, refreshSession } = useAdminAuth();
  const { updateAdmin } = useMerchantAdmins(user?.merchantId ?? "", []);
  const [open, setOpen] = useState(false);

  if (!user || collapsed) return null;

  const currentAdmin: MerchantAdmin = {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username ?? "",
    role: "ADMIN",
    merchantId: user.merchantId ?? "",
    createdAt: "",
    updatedAt: "",
  };

  const handleUpdate = async (id: string, data: UpdateMerchantAdminData) => {
    const updated = await updateAdmin(id, data);
    await refreshSession();
    return updated;
  };

  return (
    <>
      <div className="px-3 pt-4 pr-6">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold uppercase text-primary">
            {user.name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight" title={user.name}>
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.role === "SUPER_ADMIN" ? "Super admin" : "Admin"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Editar meus dados"
            title="Editar meus dados"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            <Pencil size={14} />
          </button>
        </div>
      </div>

      <EditMerchantAdminDialog
        open={open}
        admin={currentAdmin}
        allowPasswordChange={user.role !== "SUPER_ADMIN"}
        confirmBeforeSave
        onClose={() => setOpen(false)}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default CurrentUserProfile;
