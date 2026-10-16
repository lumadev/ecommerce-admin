import { useState } from "react";
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
import { CreateCustomerData, Customer } from "../types/customer.types";

import CustomerForm from "./CustomerForm";
import { validateCustomerForm } from "./validateCustomerForm";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (customer: CreateCustomerData) => Promise<Customer>;
}

const emptyForm: CustomerFormState = {
  name: "",
  email: "",
  password: "",
};

const CreateCustomerDialog = ({ open, onClose, onCreate }: Props) => {
  const [form, setForm] = useState<CustomerFormState>(emptyForm);
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const resetState = () => {
    setForm(emptyForm);
    setErrors({});
  };

  const handleCancel = () => {
    onClose();
    resetState();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSaveCreate();
  };

  const handleChange = (field: keyof CustomerFormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSaveCreate = async () => {
    const validationErrors = validateCustomerForm(form, { requirePassword: true });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newCustomer: CreateCustomerData = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    };

    setIsLoading(true);

    try {
      await onCreate(newCustomer);
      onClose();
      resetState();
    } catch {
      // O hook já notifica o erro.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto border-border bg-card text-card-foreground sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-xl">Novo Cliente</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Preencha os dados do cliente.
            </DialogDescription>
          </DialogHeader>

          <CustomerForm form={form} errors={errors} onChange={handleChange} />

          <DialogFooter className="border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancelar
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Salvando..." : "Confirmar Cadastro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomerDialog;
