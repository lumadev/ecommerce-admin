import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { useMerchant } from "./hooks/useMerchant";
import {
  MerchantAttributeFormItem,
  MerchantFormErrors,
  MerchantFormState,
} from "./types/merchant-form.types";
import { Merchant, UpdateMerchantData } from "./types/merchant.types";
import MerchantForm from "./form/MerchantForm";
import ConfirmMerchantChangesDialog from "./form/ConfirmMerchantChangesDialog";
import { getMerchantChanges } from "./form/getMerchantChanges";
import { validateMerchantForm } from "./form/validateMerchantForm";
import MerchantAdminsSection from "./MerchantAdminsSection";
import MerchantDetailsSkeleton from "./MerchantDetailsSkeleton";

const toFormState = (merchant: Merchant | null): MerchantFormState => ({
  code: merchant?.code ?? "",
  name: merchant?.name ?? "",
  email: merchant?.email ?? "",
  domain: merchant?.domain ?? "",
  isActive: merchant?.isActive ?? true,
  attributes: (merchant?.attributes ?? []).map((attribute) => ({
    uid: attribute.id,
    key: attribute.key,
    type: attribute.type,
    productCount: attribute._count?.products ?? 0,
  })),
});

const EditMerchantPage = () => {
  const { merchantId } = useParams();
  const navigate = useNavigate();
  const { merchant, isLoading, updateMerchant } = useMerchant(merchantId);
  const [form, setForm] = useState<MerchantFormState>(() => toFormState(null));
  const [errors, setErrors] = useState<MerchantFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    setForm(toFormState(merchant));
    setErrors({});
    setIsConfirming(false);
  }, [merchant]);

  const handleChange = (
    field: Exclude<keyof MerchantFormState, "attributes">,
    value: string | boolean
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleAttributesChange = (attributes: MerchantAttributeFormItem[]) => {
    setForm((previous) => ({ ...previous, attributes }));
    setErrors((previous) => ({ ...previous, attributes: undefined }));
  };

  const changes = merchant ? getMerchantChanges(merchant, form) : [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!merchant) return;

    const validationErrors = validateMerchantForm(form, { validateCode: false });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (changes.length === 0) return;
    setIsConfirming(true);
  };

  const handleSave = async () => {
    if (!merchant) return;

    const email = form.email.trim();
    const domain = form.domain.trim();
    const data: UpdateMerchantData = {
      name: form.name.trim(),
      isActive: form.isActive,
      attributes: form.attributes.map((attribute) => ({
        key: attribute.key.trim(),
        type: attribute.type,
      })),
      ...(email && { email }),
      ...(domain && { domain }),
    };

    setIsSaving(true);
    try {
      await updateMerchant(merchant.id, data);
      setIsConfirming(false);
    } catch {
      setIsConfirming(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <MerchantDetailsSkeleton />;
  }

  if (!merchant) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Loja não encontrada.</p>
        <Button type="button" variant="outline" onClick={() => navigate("/lojas")}>
          Voltar para lojas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 gap-2"
          onClick={() => navigate("/lojas")}
        >
          <ArrowLeft size={16} />
          Lojas
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Editar Loja</h1>
          <p className="text-sm text-muted-foreground">{merchant.name}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-5 rounded-lg border border-border bg-card p-5"
      >
        <MerchantForm
          form={form}
          errors={errors}
          onChange={handleChange}
          onAttributesChange={handleAttributesChange}
          codeDisabled
        />
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/lojas")}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            Salvar Alterações
          </Button>
        </div>
      </form>

      <MerchantAdminsSection merchantId={merchant.id} admins={merchant.admins} />

      <ConfirmMerchantChangesDialog
        open={isConfirming}
        changes={changes}
        isLoading={isSaving}
        onCancel={() => setIsConfirming(false)}
        onConfirm={() => void handleSave()}
      />
    </div>
  );
};

export default EditMerchantPage;