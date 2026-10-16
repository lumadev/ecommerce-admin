import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  CustomerFormErrors,
  CustomerFormState,
} from "../types/customer-form.types";

export interface CustomerFormProps {
  form: CustomerFormState;
  errors: CustomerFormErrors;
  onChange: (field: keyof CustomerFormState, value: string) => void;
  passwordOptional?: boolean;
}

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  ) : null;

const CustomerForm = ({
  form,
  errors,
  onChange,
  passwordOptional = false,
}: CustomerFormProps) => {
  return (
    <div className="grid gap-3 py-1">
      <div className="flex flex-col gap-2">
        <Label htmlFor="customer-name" className="text-sm font-medium">
          Nome
        </Label>
        <Input
          id="customer-name"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Ex: João da Silva"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "customer-name-error" : undefined}
          className="bg-background"
        />
        <FieldError id="customer-name-error" message={errors.name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="customer-email" className="text-sm font-medium">
          E-mail
        </Label>
        <Input
          id="customer-email"
          type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="cliente@email.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "customer-email-error" : undefined}
          className="bg-background"
        />
        <FieldError id="customer-email-error" message={errors.email} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="customer-password" className="text-sm font-medium">
          Senha{passwordOptional ? " (opcional)" : ""}
        </Label>
        <Input
          id="customer-password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          placeholder={
            passwordOptional ? "Deixe em branco para manter a atual" : "Mínimo de 6 caracteres"
          }
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "customer-password-error" : undefined}
          className="bg-background"
        />
        <FieldError id="customer-password-error" message={errors.password} />
      </div>
    </div>
  );
};

export default CustomerForm;
