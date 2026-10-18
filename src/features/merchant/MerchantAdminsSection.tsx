import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
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
  admins: MerchantAdmin[];
}

const formatCreatedAt = (value?: string | null) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
};

const MerchantAdminsSection = ({ merchantId, admins }: Props) => {
  const {
    adminList,
    createAdmin,
    updateAdmin,
    removeAdmin,
  } = useMerchantAdmins(merchantId, admins);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<MerchantAdmin | null>(null);
  const [removingAdmin, setRemovingAdmin] = useState<MerchantAdmin | null>(null);

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

  const handleRemoveAdmin = async () => {
    if (!removingAdmin) return;
    try {
      await removeAdmin(removingAdmin.id);
    } catch {
      return;
    } finally {
      setRemovingAdmin(null);
    }
  };

  return (
    <section className="space-y-4 border-t border-border pt-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Admins da loja</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie quem pode administrar esta loja.
          </p>
        </div>
        <Button type="button" onClick={openCreateDialog} className="gap-2">
          <Plus size={16} />
          Novo Admin
        </Button>
      </div>

      {adminList.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">
          Nenhum admin cadastrado para esta loja.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
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
                    {formatCreatedAt(admin.createdAt)}
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
                      <button
                        type="button"
                        onClick={() => setRemovingAdmin(admin)}
                        aria-label={`Remover ${admin.name}`}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={16} />
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
      <AlertDialog
        open={removingAdmin !== null}
        onOpenChange={(open) => {
          if (!open) setRemovingAdmin(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover admin da loja?</AlertDialogTitle>
            <AlertDialogDescription>
              {removingAdmin?.name} perderá o acesso administrativo a esta loja.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAdmin}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default MerchantAdminsSection;