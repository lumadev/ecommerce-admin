import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { TableCell } from "@/shared/components/ui/table";
import ConfirmActionDialog from "@/shared/components/ConfirmActionDialog";
import { Customer } from "../types/customer.types";

interface Props {
  customer: Customer;
  index: number;
  onEdit: (customer: Customer) => void;
  onRemove: (id: string) => Promise<void> | void;
}

const CustomerRow = ({ customer, index, onEdit, onRemove }: Props) => {
  const handleRemove = () => {
    void onRemove(customer.id);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b transition-colors hover:bg-muted/50"
    >
      <TableCell className="font-medium text-foreground">{customer.name}</TableCell>

      <TableCell className="text-sm text-muted-foreground">{customer.email}</TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
      </TableCell>

      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => onEdit(customer)}
            aria-label={`Editar ${customer.name}`}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            <Pencil size={16} />
          </button>

          <ConfirmActionDialog
            trigger={
              <button
                aria-label={`Excluir ${customer.name}`}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
              >
                <Trash2 size={16} />
              </button>
            }
            title="Excluir cliente?"
            description={`Tem certeza que deseja excluir o cliente "${customer.name}"? Os pedidos dele também serão removidos. Essa ação não pode ser desfeita.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            onConfirm={handleRemove}
          />
        </div>
      </TableCell>
    </motion.tr>
  );
};

export default CustomerRow;
