import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Variant } from "../types/variant.types";
import { pluralizeVariantName } from "../variant.utils";

interface Props {
  variants: Variant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const VariantList = ({ variants, selectedId, onSelect }: Props) => (
  <nav
    aria-label="Variantes da loja"
    className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
  >
    {variants.map((variant) => {
      const isSelected = variant.id === selectedId;

      return (
        <button
          key={variant.id}
          type="button"
          aria-current={isSelected ? "true" : undefined}
          onClick={() => onSelect(variant.id)}
          className={cn(
            "flex w-[220px] shrink-0 items-center justify-between gap-3 rounded-md border border-l-[3px] px-3 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:w-full",
            isSelected
              ? "border-y-primary border-r-primary border-l-primary bg-primary/5 text-foreground shadow-sm"
              : "border-border border-l-transparent bg-card text-muted-foreground hover:border-l-muted-foreground/40 hover:bg-secondary/40 hover:text-foreground"
          )}
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">
              {pluralizeVariantName(variant.key)}
            </span>
            <span className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
                {variant.type === "free_text" ? "Texto livre" : "Opções"}
              </Badge>
              <span className="text-[11px] text-muted-foreground">
                {variant.isRequired ? "Obrigatória" : "Opcional"}
              </span>
            </span>
          </span>
          {variant.type === "preset" && (
            <Badge variant="secondary" className="shrink-0 text-[11px]">
              {variant.values.length}
            </Badge>
          )}
        </button>
      );
    })}
  </nav>
);

export default VariantList;
