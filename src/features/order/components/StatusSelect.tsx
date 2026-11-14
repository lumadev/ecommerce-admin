import { useState } from "react";
import { CircleHelp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { OrderStatusLabel } from "@/data/orders";
import type { Order, OrderStatusAction } from "@/data/orders";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { getOrderStatusTransitionHelp } from "../helpers/orderStatusTransitions";
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
import { Textarea } from "@/shared/components/ui/textarea";

interface StatusSelectProps {
  order: Order;
  onChange: (
    status: OrderStatusAction,
    cancellationMessage?: string,
  ) => Promise<boolean>;
}

export const StatusSelect = ({ order, onChange }: StatusSelectProps) => {
  const { status, items } = order;
  const transitionHelp = getOrderStatusTransitionHelp(status);
  const selectableStatuses = transitionHelp.transitions.map(
    (transition) => transition.status,
  );
  const [pendingStatus, setPendingStatus] =
    useState<OrderStatusAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancellationMessage, setCancellationMessage] = useState("");
  const itemQuantities = items
    .map(({ productName, quantity }) => `${quantity}x ${productName}`)
    .join(", ");

  const handleStatusSelect = (selectedValue: string) => {
    const selectedStatus = selectableStatuses.find(
      (candidate) => candidate === selectedValue,
    );
    if (selectedStatus) {
      setPendingStatus(selectedStatus);
      setCancellationMessage("");
    }
  };

  const handleConfirm = async () => {
    if (!pendingStatus || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const succeeded = await onChange(
        pendingStatus,
        pendingStatus === "CANCELED"
          ? cancellationMessage.trim() || undefined
          : undefined,
      );
      if (succeeded) {
        setPendingStatus(null);
        setCancellationMessage("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inventoryWarning =
    pendingStatus === "PAID"
      ? `As quantidades dos produtos do pedido serão descontadas do estoque: ${itemQuantities}.`
      : null;
  const emailWarning =
    pendingStatus === "PAID"
      ? "Um e-mail de confirmação do pagamento será enviado ao cliente."
      : pendingStatus === "SHIPPED"
        ? "Um e-mail com as informações de envio será enviado ao cliente."
        : pendingStatus === "CANCELED"
          ? "Um e-mail informando o cancelamento será enviado ao cliente."
          : null;

  return (
    <>
      <div className="flex items-center gap-1">
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

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={`Ajuda sobre mudanças de status: ${OrderStatusLabel[status]}`}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CircleHelp size={16} aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 space-y-3 text-sm">
            <div>
              <h3 className="font-medium">
                Mudanças: {OrderStatusLabel[status]}
              </h3>
              <p className="mt-1 text-muted-foreground">
                {transitionHelp.restriction}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Status disponíveis</h4>
              {transitionHelp.transitions.length > 0 ? (
                <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                  {transitionHelp.transitions.map((transition) => (
                    <li key={transition.status}>
                      <strong className="text-foreground">
                        {OrderStatusLabel[transition.status]}:
                      </strong>{" "}
                      {transition.explanation}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-muted-foreground">
                  Não há mudanças disponíveis para este pedido.
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <AlertDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setPendingStatus(null);
            setCancellationMessage("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatus === "CANCELED"
                ? "Confirmar cancelamento do pedido?"
                : `Confirmar alteração para ${
                    pendingStatus ? OrderStatusLabel[pendingStatus] : ""
                  }?`}
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
          {pendingStatus === "CANCELED" && (
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor={`cancellation-message-${order.id}`}
              >
                Mensagem para o cliente (opcional)
              </label>
              <Textarea
                id={`cancellation-message-${order.id}`}
                value={cancellationMessage}
                onChange={(event) => setCancellationMessage(event.target.value)}
                maxLength={2000}
                disabled={isSubmitting}
                placeholder="Informe o motivo do cancelamento ou deixe uma mensagem de desculpas."
                aria-describedby={`cancellation-message-help-${order.id}`}
              />
              <p
                id={`cancellation-message-help-${order.id}`}
                className="text-xs text-muted-foreground"
              >
                Esta mensagem será incluída no e-mail de cancelamento.{" "}
                {cancellationMessage.length}/2000
              </p>
            </div>
          )}
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
              {isSubmitting
                ? "Salvando..."
                : pendingStatus === "CANCELED"
                  ? "Confirmar cancelamento"
                  : "Confirmar alteração"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};