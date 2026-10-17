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
  allowPasswordChange?: boolean;
  confirmBeforeSave?: boolean;
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
  allowPasswordChange = true,
  confirmBeforeSave = false,
  onClose,
  onCreate,
  onUpdate,
}: Props) => {
  const [form, setForm] = useState<MerchantAdminFormState>(emptyForm);
  const [errors, setErrors] = useState<MerchantAdminFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      name: admin?.name ?? "",
      email: admin?.email ?? "",
      username: admin?.username ?? "",
      password: "",
    });
    setErrors({});
    setIsConfirming(false);
  }, [admin, open]);

  const handleClose = () => {
    if (!isSaving) onClose();
  };

  const handleChange = (field: keyof MerchantAdminFormState, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const saveChanges = async () => {
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
          ...(allowPasswordChange && form.password && { password: form.password }),
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
      setIsConfirming(false);
      onClose();
    } catch {
      // A notificação de erro é apresentada pelo hook de dados.
    } finally {
      setIsSaving(false);
    }
  };

  const changes = admin
    ? [
        ...(admin.name !== form.name.trim()
          ? [{ label: "Nome", before: admin.name, after: form.name.trim() }]
          : []),
        ...(admin.username !== form.username.trim()
          ? [{ label: "Usuário", before: admin.username, after: form.username.trim() }]
          : []),
        ...(admin.email !== form.email.trim()
          ? [{ label: "E-mail", before: admin.email, after: form.email.trim() }]
          : []),
      ]
    : [];
  const passwordChanged = allowPasswordChange && !!form.password;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateMerchantAdminForm(form, {
      requirePassword: !admin,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (admin && confirmBeforeSave) {
      if (changes.length === 0 && !passwordChanged) return;
      setIsConfirming(true);
      return;
    }

    await saveChanges();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto border-border bg-card text-card-foreground sm:max-w-[520px]">
        <form onSubmit={(event) => void handleSubmit(event)}>
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-xl">
              {isConfirming ? "Confirmar alterações" : admin ? "Editar Admin" : "Novo Admin"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isConfirming
                ? "Revise as informações e confirme se deseja realmente alterá-las."
                : admin
                ? "Atualize os dados de acesso do administrador da loja."
                : "Cadastre um administrador para esta loja."}
            </DialogDescription>
          </DialogHeader>

          {isConfirming && changes.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              {passwordChanged ? "Senha alterada. " : ""}Confirme para salvar as alterações.
            </p>
          ) : isConfirming ? (
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full table-fixed text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="w-1/3 px-3 py-2 font-medium">Campo</th>
                    <th className="w-1/3 px-3 py-2 font-medium">Atual</th>
                    <th className="w-1/3 px-3 py-2 font-medium">Novo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {changes.map((change) => (
                    <tr key={change.label} className="align-top">
                      <td className="break-words px-3 py-2 font-medium">{change.label}</td>
                      <td className="break-words px-3 py-2 text-muted-foreground">{change.before}</td>
                      <td className="break-words px-3 py-2 font-medium">{change.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {passwordChanged && (
                <p className="border-t border-border px-3 py-2 text-sm text-muted-foreground">
                  Senha alterada. Confirme para salvar as alterações.
                </p>
              )}
            </div>
          ) : (
            <MerchantAdminForm
              form={form}
              errors={errors}
              onChange={handleChange}
              passwordOptional={!!admin}
              showPassword={allowPasswordChange}
            />
          )}

          <DialogFooter className="border-t border-border pt-4">
            {isConfirming ? (
              <>
                <Button type="button" variant="outline" onClick={() => setIsConfirming(false)} disabled={isSaving}>
                  Voltar
                </Button>
                <Button type="button" onClick={() => void saveChanges()} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSaving ? "Salvando..." : "Confirmar e salvar"}
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantAdminFormDialog;