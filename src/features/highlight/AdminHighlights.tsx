import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { useHighlights } from "./hooks/useHighlights";

import HighlightListSkeleton from "./list/HighlightListSkeleton";
import HighlightList from "./list/HighlightList";
import AddHighlightDialog from "./form/AddHighlightDialog";

const AdminHighlights = () => {
  const {
    highlightList,
    isLoading,
    addHighlight,
    removeHighlight,
    increaseHighlight,
    decreaseHighlight,
  } = useHighlights();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">Produtos em Destaque</h2>

        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus size={16} />
          Adicionar Destaque
        </Button>
      </div>

      {isLoading ? (
        <HighlightListSkeleton />
      ) : highlightList.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum produto em destaque no momento.
        </p>
      ) : (
        <HighlightList
          highlights={highlightList}
          onIncrease={increaseHighlight}
          onDecrease={decreaseHighlight}
          onRemove={removeHighlight}
        />
      )}

      <AddHighlightDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        excludedProductIds={highlightList.map((h) => h.productId)}
        onLink={addHighlight}
      />
    </div>
  );
};

export default AdminHighlights;
