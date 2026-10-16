import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import ConfirmActionDialog from "@/shared/components/ConfirmActionDialog";
import { Highlight } from "../types/highlight.types";

interface Props {
  highlight: Highlight;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => Promise<void>;
}

const HighlightCard = ({
  highlight,
  index,
  isFirst,
  isLast,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) => {
  const { product } = highlight;
  const formattedPrice = product.price.toFixed(2).replace(".", ",");

  const handleRemove = () => {
    void onRemove(highlight.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {highlight.position}
      </span>

      {product.media?.[0]?.type === "video" ? (
        <img
          src={product.media[0].poster ?? product.mediaUrls[0]}
          alt={product.name}
          className="h-14 w-14 shrink-0 rounded-md border border-border object-cover"
        />
      ) : product.mediaUrls?.[0] ? (
        <img
          src={product.media?.[0]?.src ?? product.mediaUrls[0]}
          alt={product.name}
          className="h-14 w-14 shrink-0 rounded-md border border-border object-cover"
        />
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-md border border-border bg-muted" />
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-sm text-muted-foreground">R$ {formattedPrice}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="flex flex-col">
          {!isFirst && (
            <button
              onClick={() => onIncrease(highlight.id)}
              aria-label="Mover para cima"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronUp size={16} />
            </button>
          )}
          {!isLast && (
            <button
              onClick={() => onDecrease(highlight.id)}
              aria-label="Mover para baixo"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronDown size={16} />
            </button>
          )}
        </div>

        <ConfirmActionDialog
          trigger={
            <button
              aria-label="Remover dos destaques"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
            >
              <Trash2 size={16} />
            </button>
          }
          title="Remover produto dos destaques?"
          description={`Tem certeza que deseja remover "${product.name}" da área de destaque?`}
          confirmText="Remover"
          cancelText="Cancelar"
          onConfirm={handleRemove}
        />
      </div>
    </motion.div>
  );
};

export default HighlightCard;
