import { motion } from "framer-motion";
import { PackageCheck, Pencil, Trash2 } from "lucide-react";
import ConfirmActionDialog from "@/shared/components/ConfirmActionDialog";
import { ProductListItem } from "../types/product.types";

interface Props {
  product: ProductListItem;
  index: number;
  onEdit: (product: ProductListItem) => void;
  onRemove: (id: string) => Promise<void>;
}

const ProductCard = ({ product, index, onEdit, onRemove }: Props) => {
  const numericPrice = Number(product.price);
  const formattedPrice = Number.isFinite(numericPrice)
    ? numericPrice.toFixed(2).replace(".", ",")
    : "0,00";

  const imageSrc =
    product.media?.[0]?.type === "video"
      ? product.media[0].poster ?? product.mediaUrls[0]
      : product.media?.[0]?.src ?? product.mediaUrls?.[0];

  const handleRemove = () => {
    void onRemove(product.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-lg border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-14 w-14 shrink-0 rounded-md border border-border object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-14 w-14 shrink-0 rounded-md border border-border bg-muted"
          />
        )}

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold leading-snug">
            {product.name}
          </h3>
          <p className="mt-1 text-base font-semibold">R$ {formattedPrice}</p>
        </div>
      </div>

      {product.description && (
        <p className="mt-3 line-clamp-3 break-words text-sm text-muted-foreground">
          {product.description}
        </p>
      )}

      {product.categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.categories.map((category) => (
            <span
              key={category.id}
              className="inline-flex max-w-full items-center rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
            >
              <span className="min-w-0 truncate">{category.name}</span>
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        {product.stock === 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-destructive">
            Sem Estoque
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground">
            <PackageCheck size={14} aria-hidden="true" />
            {product.stock} {product.stock === 1 ? "unidade" : "unidades"}
          </span>
        )}

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(product)}
            aria-label={`Editar ${product.name}`}
            className="rounded-md p-2.5 transition-colors hover:bg-secondary"
          >
            <Pencil size={18} aria-hidden="true" />
          </button>

          <ConfirmActionDialog
            trigger={
              <button
                type="button"
                aria-label={`Excluir ${product.name}`}
                className="rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            }
            title="Excluir produto?"
            description={`Tem certeza que deseja excluir o produto "${product.name}"? Essa ação não pode ser desfeita.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            onConfirm={handleRemove}
          />
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
