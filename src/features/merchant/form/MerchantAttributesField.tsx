import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { MerchantAttributeFormItem } from "../types/merchant-form.types";
import { MerchantAttributeType } from "../types/merchant.types";

interface Props {
  value: MerchantAttributeFormItem[];
  onChange: (attributes: MerchantAttributeFormItem[]) => void;
  error?: string;
}

const TYPE_LABELS: Record<MerchantAttributeType, string> = {
  preset: "Lista de opções",
  free_text: "Texto livre",
};

const createItem = (): MerchantAttributeFormItem => ({
  uid: crypto.randomUUID(),
  key: "",
  type: "preset",
  productCount: 0,
});

const MerchantAttributesField = ({ value, onChange, error }: Props) => {
  const update = (
    uid: string,
    patch: Partial<Pick<MerchantAttributeFormItem, "key" | "type">>
  ) => onChange(value.map((a) => (a.uid === uid ? { ...a, ...patch } : a)));

  const remove = (uid: string) => onChange(value.filter((a) => a.uid !== uid));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Variantes</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, createItem()])}
        >
          <Plus className="mr-1 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhuma variante. Ex: Tamanho (lista de opções ou texto livre).
        </p>
      )}

      {value.map((attribute, index) => {
        const inUse = attribute.productCount > 0;

        return (
          <div key={attribute.uid} className="flex items-center gap-2">
            <Input
              value={attribute.key}
              onChange={(e) => update(attribute.uid, { key: e.target.value })}
              placeholder="Ex: Tamanho"
              aria-label={`Nome da variante ${index + 1}`}
              className="flex-1 bg-background"
            />

            <Select
              value={attribute.type}
              onValueChange={(type) =>
                update(attribute.uid, { type: type as MerchantAttributeType })
              }
            >
              <SelectTrigger
                className="w-[160px] bg-background"
                aria-label={`Tipo da variante ${index + 1}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TYPE_LABELS) as MerchantAttributeType[]).map(
                  (type) => (
                    <SelectItem key={type} value={type}>
                      {TYPE_LABELS[type]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(attribute.uid)}
              disabled={inUse}
              title={
                inUse
                  ? `Em uso por ${attribute.productCount} produto(s)`
                  : "Remover variante"
              }
              aria-label={`Remover variante ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

export default MerchantAttributesField;
