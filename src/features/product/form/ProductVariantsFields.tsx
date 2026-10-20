import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import FieldCompletionIndicator from "@/shared/components/ui/FieldCompletionIndicator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Variant } from "@/features/variant/types/variant.types";
import type { ProductFormState } from "../types/product-form.types";

const EMPTY_OPTION = "__empty_option__";

interface Props {
  variants: Variant[];
  value: ProductFormState["variants"];
  errors: Record<string, string>;
  isLoading: boolean;
  loadError: string | null;
  onChange: (variants: ProductFormState["variants"]) => void;
  onRetry: () => void;
}

const ProductVariantsFields = ({
  variants,
  value,
  errors,
  isLoading,
  loadError,
  onChange,
  onRetry,
}: Props) => {
  const updateValue = (
    attributeId: string,
    nextValue: ProductFormState["variants"][number] | undefined,
  ) => {
    onChange([
      ...value.filter((variant) => variant.attributeId !== attributeId),
      ...(nextValue ? [nextValue] : []),
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
        <Loader2 className="h-4 w-4 animate-spin" />
        Carregando variantes da loja...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="grid gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4" role="alert">
        <p className="text-sm text-destructive">{loadError}</p>
        <Button type="button" variant="outline" className="w-fit gap-2" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border p-5 text-sm text-muted-foreground">
        Esta loja ainda não tem variantes configuradas. Você pode salvar o
        produto sem preencher esta etapa.
      </p>
    );
  }

  return (
    <div className="grid content-start gap-4">
      <p className="text-sm text-muted-foreground">
        Informe os atributos aplicáveis a este produto. Os campos obrigatórios
        são definidos pela loja.
      </p>
      {variants.map((definition) => {
        const selected = value.find(
          (variant) => variant.attributeId === definition.id,
        );
        const error = errors[definition.id];
        const fieldId = `product-variant-${definition.id}`;
        const selectedValue = selected?.value.trim().toLocaleLowerCase();
        const selectedOption =
          definition.type === "preset" &&
          Boolean(selected) &&
          definition.values.some(
            (option) =>
              option.id === selected?.optionId ||
              (Boolean(selectedValue) &&
                option.value.toLocaleLowerCase() === selectedValue),
          );
        const isRequiredValueValid =
          definition.isRequired &&
          !error &&
          (definition.type === "free_text"
            ? Boolean(selected?.value.trim())
            : selectedOption);

        return (
          <div key={definition.id} className="grid gap-2 rounded-md border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor={fieldId} className="text-sm font-medium">
                {definition.key}
              </Label>
              <span
                className={
                  definition.isRequired
                    ? "text-xs font-normal text-muted-foreground"
                    : "text-xs text-muted-foreground"
                }
              >
                {definition.isRequired ? "Obrigatório" : "Opcional"}
              </span>
            </div>

            {definition.type === "free_text" ? (
              <div className="relative">
                <Input
                  id={fieldId}
                  value={selected?.value ?? ""}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    updateValue(
                      definition.id,
                      nextValue
                        ? { attributeId: definition.id, value: nextValue }
                        : undefined,
                    );
                  }}
                  placeholder={`Informe ${definition.key.toLocaleLowerCase()}`}
                  aria-required={definition.isRequired}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${fieldId}-error` : undefined}
                  className={definition.isRequired ? "bg-background pr-10" : "bg-background"}
                />
                {isRequiredValueValid && (
                  <FieldCompletionIndicator label={`${definition.key} preenchida corretamente`} />
                )}
              </div>
            ) : (
              <div className="relative">
                <Select
                  disabled={definition.values.length === 0}
                  value={
                    selected?.optionId ??
                    definition.values.find(
                      (option) =>
                        option.value.toLocaleLowerCase() ===
                        selected?.value.toLocaleLowerCase(),
                    )?.id ??
                    ""
                  }
                  onValueChange={(optionId) => {
                    const option = definition.values.find(
                      (item) => item.id === optionId,
                    );
                    updateValue(
                      definition.id,
                      option
                        ? {
                            attributeId: definition.id,
                            optionId: option.id,
                            value: option.value,
                          }
                        : undefined,
                    );
                  }}
                >
                  <SelectTrigger
                    id={fieldId}
                    aria-required={definition.isRequired}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${fieldId}-error` : undefined}
                    className={definition.isRequired ? "bg-background pr-10" : "bg-background"}
                  >
                    <SelectValue
                      placeholder={
                        definition.values.length === 0
                          ? "Nenhuma opção disponível"
                          : `Selecione ${definition.key.toLocaleLowerCase()}`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EMPTY_OPTION}>Não selecionar</SelectItem>
                    {definition.values.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isRequiredValueValid && (
                  <FieldCompletionIndicator
                    label={`${definition.key} preenchida corretamente`}
                    className="right-9"
                  />
                )}
              </div>
            )}

            {definition.type === "preset" && definition.values.length === 0 && (
              <div
                role={definition.isRequired ? "alert" : "status"}
                className={
                  definition.isRequired
                    ? "rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
                    : "rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
                }
              >
                {definition.isRequired
                  ? `Esta variante é obrigatória, mas ainda não possui opções. Cadastre opções em Variantes antes de salvar o produto.`
                  : "Esta variante não possui opções cadastradas e ficará indisponível para este produto. Cadastre opções em Variantes para habilitá-la."}
              </div>
            )}
            {error && (
              <p id={`${fieldId}-error`} role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductVariantsFields;
