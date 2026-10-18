import { useState } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useVariants } from "./hooks/useVariants";
import VariantList from "./components/VariantList";
import VariantOptionsPanel from "./components/VariantOptionsPanel";
import VariantsHelpDialog from "./components/VariantsHelpDialog";

const AdminVariants = () => {
  const { variants, isLoading, loadError, addOption, removeOption } = useVariants();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected =
    variants.find((variant) => variant.id === selectedId) ?? variants[0];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-xl font-semibold">Variantes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure os valores e veja como cada informação será preenchida nos produtos.
          </p>
        </div>
        <VariantsHelpDialog />
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : loadError ? (
        <p role="alert" className="text-sm text-destructive">
          {loadError}
        </p>
      ) : !selected ? (
        <div className="rounded-md border border-dashed border-border px-5 py-10 text-center">
          <p className="font-medium">Nenhuma variante cadastrada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            As variantes da loja aparecerão aqui depois de serem configuradas.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside aria-label="Navegação de variantes">
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="text-sm font-medium">Atributos da loja</h3>
              <span className="text-xs text-muted-foreground">
                {variants.length}
              </span>
            </div>
            <VariantList
              variants={variants}
              selectedId={selected.id}
              onSelect={setSelectedId}
            />
          </aside>
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
