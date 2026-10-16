import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import {
  MerchantAttributeFormItem,
  MerchantFormErrors,
  MerchantFormState,
} from "../types/merchant-form.types";
import MerchantAttributesField from "./MerchantAttributesField";

export interface MerchantFormProps {
  form: MerchantFormState;
  errors: MerchantFormErrors;
  onChange: (
    field: Exclude<keyof MerchantFormState, "attributes">,
    value: string | boolean
  ) => void;
  onAttributesChange: (attributes: MerchantAttributeFormItem[]) => void;
  codeDisabled?: boolean;
}

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  ) : null;

const MerchantForm = ({
  form,
  errors,
  onChange,
  onAttributesChange,
  codeDisabled = false,
}: MerchantFormProps) => {
  return (
    <div className="grid gap-3 py-1">
      <div className="flex flex-col gap-2">
        <Label htmlFor="merchant-code" className="text-sm font-medium">
          Código
        </Label>
        <Input
          id="merchant-code"
          value={form.code}
          onChange={(e) => onChange("code", e.target.value)}
          placeholder="Ex: loja-do-joao"
          disabled={codeDisabled}
          aria-invalid={!!errors.code}
          aria-describedby={errors.code ? "merchant-code-error" : undefined}
          className="bg-background"
        />
        <FieldError id="merchant-code-error" message={errors.code} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="merchant-name" className="text-sm font-medium">
          Nome
        </Label>
        <Input
          id="merchant-name"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Ex: Loja do João"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "merchant-name-error" : undefined}
          className="bg-background"
        />
        <FieldError id="merchant-name-error" message={errors.name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="merchant-email" className="text-sm font-medium">
          E-mail
        </Label>
        <Input
          id="merchant-email"
          type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="contato@loja.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "merchant-email-error" : undefined}
          className="bg-background"
        />
        <FieldError id="merchant-email-error" message={errors.email} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="merchant-domain" className="text-sm font-medium">
          Domínio
        </Label>
        <Input
          id="merchant-domain"
          value={form.domain}
          onChange={(e) => onChange("domain", e.target.value)}
          placeholder="loja.com.br"
          aria-invalid={!!errors.domain}
          aria-describedby={errors.domain ? "merchant-domain-error" : undefined}
          className="bg-background"
        />
        <FieldError id="merchant-domain-error" message={errors.domain} />
      </div>

      <MerchantAttributesField
        value={form.attributes}
        onChange={onAttributesChange}
        error={errors.attributes}
      />

      <div className="flex items-center gap-3">
        <Switch
          id="merchant-active"
          checked={form.isActive}
          onCheckedChange={(checked) => onChange("isActive", checked)}
        />
        <Label htmlFor="merchant-active" className="text-sm font-medium">
          Loja ativa
        </Label>
      </div>
    </div>
  );
};

export default MerchantForm;
