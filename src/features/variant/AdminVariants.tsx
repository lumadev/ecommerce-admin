import { useState } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useVariants } from "./hooks/useVariants";
import VariantList from "./components/VariantList";
import VariantOptionsPanel from "./components/VariantOptionsPanel";

const AdminVariants = () => {
  const { variants, isLoading, loadError, addOption, removeOption } = useVariants();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected =
    variants.find((variant) => variant.id === selectedId) ?? variants[0];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Variantes</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie as opções de cada variante da loja.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : loadError ? (
        <p role="alert" className="text-sm text-destructive">
          {loadError}
        </p>
      ) : !selected ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma variante com lista de opções cadastrada para esta loja.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <VariantList
            variants={variants}
            selectedId={selected.id}
            onSelect={setSelectedId}
          />
          <VariantOptionsPanel
            variant={selected}
            onAdd={addOption}
            onRemove={removeOption}
          />
        </div>
      )}
    </div>
  );
};

export default AdminVariants;
