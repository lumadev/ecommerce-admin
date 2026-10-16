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
            "flex shrink-0 items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isSelected
              ? "border-primary bg-primary/10 font-medium text-foreground"
              : "border-border bg-card text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          )}
        >
          <span>{pluralizeVariantName(variant.key)}</span>
          <Badge variant="secondary" className="text-[11px]">
            {variant.values.length}
          </Badge>
        </button>
      );
    })}
  </nav>
);

export default VariantList;
