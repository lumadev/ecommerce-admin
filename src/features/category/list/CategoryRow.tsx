import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { TableCell } from "@/shared/components/ui/table";
import ConfirmActionDialog from "@/shared/components/ConfirmActionDialog";
import { Category } from "@/data/categories";

interface Props {
  category: Category;
  index: number;
  onEdit: (category: Category) => void;
  onRemove: (id: string) => Promise<void> | void;
}

const CategoryRow = ({ category, index, onEdit, onRemove }: Props) => {
  const handleRemove = () => {
    void onRemove(category.id);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b transition-colors hover:bg-muted/50"
    >
      <TableCell className="font-medium text-foreground">
        <div className="flex items-center gap-3">
          {category.url && (
            <img
              src={category.url}
              alt={category.name}
              className="h-10 w-10 rounded-md border border-border object-cover"
            />
          )}
          <span>{category.name}</span>
        </div>
      </TableCell>

      <TableCell>
        <span className="line-clamp-2 text-sm text-muted-foreground">
          {category.description}
        </span>
      </TableCell>

      <TableCell className="max-w-[300px]">
        <div className="flex flex-wrap gap-1.5">
          {category.hashtags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="max-w-[180px] truncate text-[11px]"
            >
              {tag}
            </Badge>
          ))}

          {category.hashtags.length > 3 && (
            <Badge variant="outline" className="text-[11px]">
              +{category.hashtags.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>

      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => onEdit(category)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            <Pencil size={16} />
          </button>

          <ConfirmActionDialog
            trigger={
              <button className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive">
                <Trash2 size={16} />
              </button>
            }
            title="Excluir categoria?"
            description={`Tem certeza que deseja excluir a categoria "${category.name}"? Essa ação não pode ser desfeita.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            onConfirm={handleRemove}
          />
        </div>
      </TableCell>
    </motion.tr>
  );
};

export default CategoryRow;
