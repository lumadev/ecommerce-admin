import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button/button";
import {
  CreateMerchantAdminData,
  MerchantAdmin,
  MerchantAdminFormErrors,
  MerchantAdminFormState,
  UpdateMerchantAdminData,
} from "../types/merchant-admin.types";
import MerchantAdminForm from "./MerchantAdminForm";
import { validateMerchantAdminForm } from "./validateMerchantAdminForm";

interface Props {
  open: boolean;
  admin: MerchantAdmin | null;
  onClose: () => void;
  onCreate?: (data: CreateMerchantAdminData) => Promise<MerchantAdmin>;
  onUpdate?: (id: string, data: UpdateMerchantAdminData) => Promise<MerchantAdmin>;
}

const emptyForm: MerchantAdminFormState = {
  name: "",
  email: "",
  username: "",
  password: "",
};

const MerchantAdminFormDialog = ({
  open,
  admin,
  onClose,
  onCreate,
  onUpdate,
}: Props) => {
  const [form, setForm] = useState<MerchantAdminFormState>(emptyForm);
  const [errors, setErrors] = useState<MerchantAdminFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      name: admin?.name ?? "",
      email: admin?.email ?? "",
      username: admin?.username ?? "",
      password: "",
    });
    setErrors({});
  }, [admin, open]);

  const handleClose = () => {
    if (!isSaving) onClose();
  };

  const handleChange = (field: keyof MerchantAdminFormState, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateMerchantAdminForm(form, {
      requirePassword: !admin,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim();
    setIsSaving(true);

    try {
      if (admin) {
        if (!onUpdate) return;
        const data: UpdateMerchantAdminData = {
          name,
          email,
          username: form.username.trim(),
          ...(form.password && { password: form.password }),
        };
        await onUpdate(admin.id, data);
      } else {
        if (!onCreate) return;
        await onCreate({
          name,
          email,
          username: form.username.trim(),
          password: form.password,
        });
      }
      onClose();
    } catch {
      // A notificação de erro é apresentada pelo hook de dados.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto border-border bg-card text-card-foreground sm:max-w-[520px]">
        <form onSubmit={(event) => void handleSubmit(event)}>
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-xl">
              {admin ? "Editar Admin" : "Novo Admin"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {admin
                ? "Atualize os dados de acesso do administrador da loja."
                : "Cadastre um administrador para esta loja."}
            </DialogDescription>
          </DialogHeader>

          <MerchantAdminForm
            form={form}
            errors={errors}
            onChange={handleChange}
            passwordOptional={!!admin}
          />

          <DialogFooter className="border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantAdminFormDialog;