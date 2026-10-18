import { FormEvent, useEffect, useState } from "react";
import { Check, Info, Loader2, Plus, TextCursorInput, Trash2 } from "lucide-react";
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

  if (variant.type === "free_text") {
    return (
      <section
        aria-labelledby="variant-panel-title"
        className="rounded-md border border-border bg-card p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Texto livre
            </p>
            <h3 id="variant-panel-title" className="mt-1 text-lg font-semibold">
              {variant.key}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <Check size={14} />
            {variant.isRequired ? "Obrigatória" : "Opcional"}
          </span>
        </div>
        <div className="mt-5 flex gap-3 rounded-md border border-border bg-muted/40 p-4">
          <TextCursorInput className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">O valor é informado em cada produto</p>
            <p className="mt-1 text-sm text-muted-foreground">
              O lojista digita o conteúdo no cadastro do produto, por exemplo,
              a composição ou instruções de cuidado. Não é necessário criar
              opções nesta tela.
            </p>
          </div>
        </div>
      </section>
    );
  }

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
      className="rounded-md border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Lista de opções
          </p>
          <h3 id="variant-panel-title" className="mt-1 text-lg font-semibold">
            {pluralizeVariantName(variant.key)}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre os valores que poderão ser selecionados nos produtos.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <Check size={14} />
          {variant.isRequired ? "Obrigatória" : "Opcional"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col items-stretch gap-2 sm:flex-row sm:items-start" noValidate>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="variant-option-description" className="sr-only">
            Nova opção
          </Label>
          <Input
            id="variant-option-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError("");
            }}
            placeholder={variant.key === "Tamanho" ? "Ex: P, M ou G" : `Nova opção de ${variant.key}`}
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

        <Button type="submit" className="gap-2 sm:shrink-0" disabled={isSaving}>
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Adicionar opção
        </Button>
      </form>

      {variant.values.length === 0 ? (
        <div className="mt-5 flex gap-3 rounded-md border border-dashed border-border px-4 py-5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Ainda não há opções</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Adicione os valores usados nos produtos, como P, M e G para tamanhos.
            </p>
          </div>
        </div>
      ) : (
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
