import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { OrderStatus, OrderStatusLabel } from "@/data/orders";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

const adminStatuses: OrderStatus[] = [
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
];

export const StatusSelect = ({
  value,
  onChange,
}: {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
}) => {
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  const handleStatusSelect = (status: OrderStatus) => {
    if (status !== value) setPendingStatus(status);
  };

  const handleConfirm = () => {
    if (!pendingStatus) return;
    onChange(pendingStatus);
    setPendingStatus(null);
  };

  return (
    <>
      <Select
        value={value}
        onValueChange={(status) => handleStatusSelect(status as OrderStatus)}
      >
        <SelectTrigger className="h-8 w-[200px] border-border bg-secondary/50 text-xs hover:bg-secondary">
          <SelectValue>
            <span className="text-xs font-medium">
              {OrderStatusLabel[value]}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {adminStatuses.map((status) => (
            <SelectItem key={status} value={status} className="text-xs">
              <span className="text-xs font-medium">
                {OrderStatusLabel[status]}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AlertDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open) setPendingStatus(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteração de status?</AlertDialogTitle>
            <AlertDialogDescription>
              O status será alterado para{" "}
              {pendingStatus ? OrderStatusLabel[pendingStatus] : ""}.{" "}
              Um e-mail será enviado ao usuário para informá-lo sobre essa alteração.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirmar alteração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};