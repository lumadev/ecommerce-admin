import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  MerchantAdminFormErrors,
  MerchantAdminFormState,
} from "../types/merchant-admin.types";

interface Props {
  form: MerchantAdminFormState;
  errors: MerchantAdminFormErrors;
  passwordOptional?: boolean;
  showPassword?: boolean;
  onChange: (field: keyof MerchantAdminFormState, value: string) => void;
}

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  ) : null;

const MerchantAdminForm = ({
  form,
  errors,
  passwordOptional = false,
  showPassword = true,
  onChange,
}: Props) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
  <div className="grid gap-3 py-1">
    <div className="flex flex-col gap-2">
      <Label htmlFor="merchant-admin-name">Nome</Label>
      <Input
        id="merchant-admin-name"
        value={form.name}
        onChange={(event) => onChange("name", event.target.value)}
        autoComplete="name"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "merchant-admin-name-error" : undefined}
      />
      <FieldError id="merchant-admin-name-error" message={errors.name} />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="merchant-admin-username">Usuário</Label>
      <Input
        id="merchant-admin-username"
        value={form.username}
        onChange={(event) => onChange("username", event.target.value)}
        autoComplete="username"
        aria-invalid={!!errors.username}
        aria-describedby={errors.username ? "merchant-admin-username-error" : undefined}
      />
      <FieldError id="merchant-admin-username-error" message={errors.username} />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="merchant-admin-email">E-mail</Label>
      <Input
        id="merchant-admin-email"
        type="email"
        value={form.email}
        onChange={(event) => onChange("email", event.target.value)}
        autoComplete="email"
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "merchant-admin-email-error" : undefined}
      />
      <FieldError id="merchant-admin-email-error" message={errors.email} />
    </div>

    {showPassword && (
      <div className="flex flex-col gap-2">
        <Label htmlFor="merchant-admin-password">
          Senha{passwordOptional ? " (opcional)" : ""}
        </Label>
        <div className="relative">
          <Input
            id="merchant-admin-password"
            type={passwordVisible ? "text" : "password"}
            autoComplete="new-password"
            className="pr-10"
            value={form.password}
            onChange={(event) => onChange("password", event.target.value)}
            placeholder={passwordOptional ? "Deixe em branco para manter a atual" : "Mínimo de 6 caracteres"}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "merchant-admin-password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
            aria-label={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <FieldError id="merchant-admin-password-error" message={errors.password} />
      </div>
    )}
  </div>
  );
};

export default MerchantAdminForm;