import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useMerchantAdmins } from "./hooks/useMerchantAdmins";
import { MerchantAdmin } from "./types/merchant-admin.types";
import CreateMerchantAdminDialog from "./form/CreateMerchantAdminDialog";
import EditMerchantAdminDialog from "./form/EditMerchantAdminDialog";

interface Props {
  merchantId: string;
}

const MerchantAdminsSection = ({ merchantId }: Props) => {
  const {
    adminList,
    isLoading,
    createAdmin,
    updateAdmin,
  } = useMerchantAdmins(merchantId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<MerchantAdmin | null>(null);

  const openCreateDialog = () => {
    setEditingAdmin(null);
    setDialogOpen(true);
  };

  const openEditDialog = (admin: MerchantAdmin) => {
    setEditingAdmin(admin);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingAdmin(null);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Admins da loja</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie quem pode administrar esta loja.
          </p>
        </div>
        <Button type="button" onClick={openCreateDialog} className="gap-2">
          <Plus size={16} />
          Novo Admin
        </Button>
      </div>

      {isLoading ? (
        <p className="py-6 text-sm text-muted-foreground">Carregando admins...</p>
      ) : adminList.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">
          Nenhum admin cadastrado para esta loja.
        </p>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="w-16 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminList.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {admin.username}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {admin.email}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(admin.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditDialog(admin)}
                        aria-label={`Editar ${admin.name}`}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateMerchantAdminDialog
        open={dialogOpen && !editingAdmin}
        onClose={closeDialog}
        onCreate={createAdmin}
      />
      {editingAdmin && (
        <EditMerchantAdminDialog
          open={dialogOpen}
          admin={editingAdmin}
          onClose={closeDialog}
          onUpdate={updateAdmin}
        />
      )}
    </section>
  );
};

export default MerchantAdminsSection;