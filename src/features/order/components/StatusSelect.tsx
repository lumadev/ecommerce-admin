import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { OrderStatusLabel } from "@/data/orders";
import type { Order, OrderStatus, OrderStatusAction } from "@/data/orders";
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

const availableStatuses: Record<OrderStatus, OrderStatusAction[]> = {
  PENDING: ["PAID", "CANCELED"],
  PAYMENT_FAILED: ["PAID", "CANCELED"],
  PAID: ["SHIPPED", "CANCELED"],
  INVENTORY_ISSUE: ["PAID", "CANCELED"],
  SHIPPED: ["COMPLETED"],
  COMPLETED: [],
  CANCELED: [],
};

interface StatusSelectProps {
  order: Order;
  onChange: (status: OrderStatusAction) => Promise<boolean>;
}

export const StatusSelect = ({ order, onChange }: StatusSelectProps) => {
  const { status, items } = order;
  const selectableStatuses = availableStatuses[status];
  const [pendingStatus, setPendingStatus] =
    useState<OrderStatusAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemQuantities = items
    .map(({ productName, quantity }) => `${quantity}x ${productName}`)
    .join(", ");

  const handleStatusSelect = (selectedValue: string) => {
    const selectedStatus = selectableStatuses.find(
      (candidate) => candidate === selectedValue,
    );
    if (selectedStatus) setPendingStatus(selectedStatus);
  };

  const handleConfirm = async () => {
    if (!pendingStatus || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const succeeded = await onChange(pendingStatus);
      if (succeeded) setPendingStatus(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inventoryWarning =
    pendingStatus === "PAID"
      ? `As quantidades dos produtos do pedido serão descontadas do estoque: ${itemQuantities}.`
      : pendingStatus === "CANCELED" && status === "PAID"
        ? `O estoque será acrescido pelas quantidades dos produtos deste pedido: ${itemQuantities}.`
        : null;
  const emailWarning =
    pendingStatus === "PAID"
      ? "Um e-mail de confirmação do pagamento será enviado ao cliente."
      : pendingStatus === "SHIPPED"
        ? "Um e-mail com as informações de envio será enviado ao cliente."
        : null;

  return (
    <>
      <Select
        value={status}
        disabled={isSubmitting || selectableStatuses.length === 0}
        onValueChange={handleStatusSelect}
      >
        <SelectTrigger className="h-8 w-[200px] border-border bg-secondary/50 text-xs hover:bg-secondary">
          <SelectValue>
            <span className="text-xs font-medium">
              {OrderStatusLabel[status]}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {selectableStatuses.map((nextStatus) => (
            <SelectItem key={nextStatus} value={nextStatus} className="text-xs">
              <span className="text-xs font-medium">
                {OrderStatusLabel[nextStatus]}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AlertDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) setPendingStatus(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmar alteração para{" "}
              {pendingStatus ? OrderStatusLabel[pendingStatus] : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="block">
                O status do pedido será alterado para{" "}
                {pendingStatus ? OrderStatusLabel[pendingStatus] : ""}.
              </span>
              {inventoryWarning && (
                <span className="mt-2 block">{inventoryWarning}</span>
              )}
              {emailWarning && (
                <span className="mt-2 block">{emailWarning}</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirm();
              }}
            >
              {isSubmitting ? "Salvando..." : "Confirmar alteração"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};