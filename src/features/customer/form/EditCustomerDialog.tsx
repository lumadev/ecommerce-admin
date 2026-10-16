import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button/button";
import { Loader2 } from "lucide-react";

import {
  CustomerFormErrors,
  CustomerFormState,
} from "../types/customer-form.types";
import { Customer, UpdateCustomerData } from "../types/customer.types";

import CustomerForm from "./CustomerForm";
import { validateCustomerForm } from "./validateCustomerForm";

interface Props {
  customer: Customer | null;
  onClose: () => void;
  onSave: (id: string, customer: UpdateCustomerData) => Promise<Customer>;
}

const toFormState = (c: Customer | null): CustomerFormState => ({
  name: c?.name ?? "",
  email: c?.email ?? "",
  password: "",
});

const EditCustomerDialog = ({ customer, onClose, onSave }: Props) => {
  const [form, setForm] = useState<CustomerFormState>(() => toFormState(customer));
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setForm(toFormState(customer));
    setErrors({});
  }, [customer]);

  const handleChange = (field: keyof CustomerFormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSaveEdit();
  };

  const onSaveEdit = async () => {
    if (!customer) return;

    const validationErrors = validateCustomerForm(form, { requirePassword: false });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Senha em branco mantém a atual; não é enviada.
    const updatedCustomer: UpdateCustomerData = {
      name: form.name.trim(),
      email: form.email.trim(),
      ...(form.password && { password: form.password }),
    };

    setIsLoading(true);

    try {
      await onSave(customer.id, updatedCustomer);
      onClose();
    } catch {
      // O hook já notifica o erro.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!customer} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto border-border bg-card text-card-foreground sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-xl">Editar Cliente</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Altere os dados do cliente.
            </DialogDescription>
          </DialogHeader>

          <CustomerForm
            form={form}
            errors={errors}
            onChange={handleChange}
            passwordOptional
          />

          <DialogFooter className="border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
