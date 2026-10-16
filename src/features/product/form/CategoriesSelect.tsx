import { Check, ChevronDown } from "lucide-react";

import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

type Category = {
  id: string;
  name: string;
};

type CategoriesSelectProps = {
  value: string[];
  onChange: (categories: string[]) => void;
  categories: Category[];
  isLoading?: boolean;
  hasError?: boolean;
  placeholder?: string;
  label?: string;
};

export function CategoriesSelect({
  value,
  onChange,
  categories,
  isLoading = false,
  hasError = false,
  placeholder = "Selecione uma ou mais categorias",
  label = "Categorias",
}: CategoriesSelectProps) {
  const toggleCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, categoryId]);
    } else {
      onChange(value.filter((c) => c !== categoryId));
    }
  };

  return (
    <div className="grid gap-2">
      <Label className="text-sm font-medium">{label}</Label>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={isLoading}
            aria-busy={isLoading}
            className={`flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${
              value.length <= 1 ? "h-10" : "min-h-10"
            }`}
          >
            {isLoading ? (
              <Skeleton className="h-5 w-48" />
            ) : value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {value.map((id) => {
                  const cat = categories.find((c) => c.id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {cat?.name ?? id}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}

            <ChevronDown size={16} className="ml-2 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-1"
          align="start"
        >
          <div className="max-h-64 overflow-y-auto">
            {isLoading && (
              <div className="grid gap-2 p-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            )}

            {!isLoading && hasError && (
              <p className="px-2 py-3 text-sm text-destructive">
                Nao foi possível carregar as categorias.
              </p>
            )}

            {!isLoading && !hasError && categories.length === 0 && (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                Nenhuma categoria encontrada.
              </p>
            )}

            {!isLoading &&
              !hasError &&
              categories.map((cat) => {
                const checked = value.includes(cat.id);

                return (
                  <div
                    key={cat.id}
                    role="option"
                    aria-selected={checked}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => toggleCategory(cat.id, !checked)}
                  >
                    <Checkbox
                      aria-label={cat.name}
                      checked={checked}
                      onClick={(event) => event.stopPropagation()}
                      onCheckedChange={(val) =>
                        toggleCategory(cat.id, Boolean(val))
                      }
                    />

                    <span>{cat.name}</span>

                    {checked && (
                      <Check size={14} className="ml-auto text-primary" />
                    )}
                  </div>
                );
              })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}