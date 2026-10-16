import { FormEvent, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import ConfirmActionDialog from "@/shared/components/ConfirmActionDialog";
import { Variant } from "../types/variant.types";
import { pluralizeVariantName } from "../variant.utils";

interface Props {
  variant: Variant;
  onAdd: (variantId: string, value: string) => Promise<boolean>;
  onRemove: (variantId: string, optionId: string) => Promise<boolean>;
}

const VariantOptionsPanel = ({ variant, onAdd, onRemove }: Props) => {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDescription("");
    setError("");
  }, [variant.id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = description.trim();

    if (!value) {
      setError("Informe a descrição.");
      return;
    }

    if (variant.values.some((o) => o.value.toLowerCase() === value.toLowerCase())) {
      setError("Esta opção já está cadastrada.");
      return;
    }

    setIsSaving(true);
    const added = await onAdd(variant.id, value);
    setIsSaving(false);

    if (added) setDescription("");
  };

  return (
    <section
      aria-labelledby="variant-panel-title"
      className="rounded-lg border border-border bg-card p-5"
    >
      <h3 id="variant-panel-title" className="text-base font-semibold">
        {pluralizeVariantName(variant.key)}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {variant.values.length === 0
          ? "Nenhuma opção cadastrada."
          : `${variant.values.length} opç${variant.values.length === 1 ? "ão cadastrada" : "ões cadastradas"}.`}
      </p>

      <form onSubmit={handleSubmit} className="flex items-start gap-2" noValidate>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="variant-option-description" className="sr-only">
            Descrição
          </Label>
          <Input
            id="variant-option-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError("");
            }}
            placeholder={`Descrição (ex: ${variant.key})`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "variant-option-error" : undefined}
            className="bg-background"
            disabled={isSaving}
          />
          {error && (
            <p id="variant-option-error" role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <Button type="submit" className="gap-2" disabled={isSaving}>
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Adicionar
        </Button>
      </form>

      {variant.values.length > 0 && (
        <ul className="mt-4 divide-y divide-border rounded-md border border-border">
          {variant.values.map((option) => (
            <li
              key={option.id}
              className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
            >
              <span className="font-medium text-foreground">{option.value}</span>

              <ConfirmActionDialog
                trigger={
                  <button
                    type="button"
                    aria-label={`Excluir ${option.value}`}
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                }
                title="Excluir opção"
                description={`Deseja excluir "${option.value}"?`}
                confirmText="Excluir"
                onConfirm={() => void onRemove(variant.id, option.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default VariantOptionsPanel;
