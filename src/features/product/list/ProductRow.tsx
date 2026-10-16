import { motion } from "framer-motion";
import { PackageCheck, Pencil, Trash2 } from "lucide-react";
import { TableCell } from "@/shared/components/ui/table";
import { ProductListItem } from "../types/product.types";
import ConfirmActionDialog from "@/shared/components/ConfirmActionDialog";

interface Props {
  product: ProductListItem;
  index: number;
  onEdit: (product: ProductListItem) => void;
  onRemove: (id: string) => Promise<void>;
}

const ProductRow = ({ product, index, onEdit, onRemove }: Props) => {
  const numericPrice = Number(product.price);
  const formattedPrice = Number.isFinite(numericPrice)
    ? numericPrice.toFixed(2).replace(".", ",")
    : "0,00";

  const handleRemove = () => {
    void onRemove(product.id);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b transition-colors hover:bg-muted/50"
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          {product.media?.[0]?.type === "video" ? (
            <img
              src={product.media[0].poster ?? product.mediaUrls[0]}
              alt={product.name}
              className="h-10 w-10 rounded-md border border-border object-cover"
            />
          ) : (
            product.mediaUrls?.[0] && (
              <img
                src={product.media?.[0]?.src ?? product.mediaUrls[0]}
                alt={product.name}
                className="h-10 w-10 rounded-md border border-border object-cover"
              />
            )
          )}
          <span>{product.name}</span>
        </div>
      </TableCell>

      <TableCell className="max-w-[300px]">
        <span className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </span>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-1">
          {product.categories.map((category) => (
            <span
              key={category.id}
              className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {category.name}
            </span>
          ))}
        </div>
      </TableCell>

      <TableCell className="text-right">
        R$ {formattedPrice}
      </TableCell>

      <TableCell className="text-center">
        {product.stock === 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
            Sem Estoque
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            <PackageCheck size={14} aria-hidden="true" />
            {product.stock} {product.stock === 1 ? "unidade" : "unidades"}
          </span>
        )}
      </TableCell>

      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => onEdit(product)}
            className="rounded-md p-2 hover:bg-secondary"
          >
            <Pencil size={16} />
          </button>

          <ConfirmActionDialog
            trigger={
              <button className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive">
                <Trash2 size={16} />
              </button>
            }
            title="Excluir produto?"
            description={`Tem certeza que deseja excluir o produto "${product.name}"? Essa ação não pode ser desfeita.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            onConfirm={handleRemove}
          />
        </div>
      </TableCell>
    </motion.tr>
  );
};

export default ProductRow;