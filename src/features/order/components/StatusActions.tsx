import { useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { OrderStatusColor, OrderStatusLabel } from "@/data/orders";
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

interface StatusActionsProps {
  order: Order;
  onStatusChange: (
    status: OrderStatusAction,
    cancellationMessage?: string,
  ) => Promise<boolean>;
}

const actionLabels: Record<OrderStatusAction, string> = {
  PAID: "Confirmar pagamento",
  SHIPPED: "Marcar como enviado",
  COMPLETED: "Confirmar entrega",
  CANCELED: "Cancelar pedido",
};

export const StatusActions = ({
  order,
  onStatusChange,
}: StatusActionsProps) => {
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

  const handleStatusAction = (selectedStatus: OrderStatusAction) => {
    setPendingStatus(selectedStatus);
    setCancellationMessage("");
  };

  const handleConfirm = async () => {
    if (!pendingStatus || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const succeeded = await onStatusChange(
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
        <Badge
          variant="outline"
          className={`shrink-0 whitespace-nowrap text-xs ${OrderStatusColor[status]}`}
        >
          {OrderStatusLabel[status]}
        </Badge>

        {selectableStatuses.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={isSubmitting}
                aria-label={`Alterar status do pedido. Status atual: ${OrderStatusLabel[status]}`}
                className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md border border-input bg-background px-2 text-xs font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Alterar
                <ChevronDown size={14} aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel>Próxima ação</DropdownMenuLabel>
              {transitionHelp.transitions.map((transition) => (
                <DropdownMenuItem
                  key={transition.status}
                  onSelect={() => handleStatusAction(transition.status)}
                  className="items-start"
                >
                  <span className="grid gap-1">
                    <span className="font-medium">
                      {actionLabels[transition.status]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {transition.explanation}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
              <h3 className="font-medium">Sobre esta etapa</h3>
              <p className="mt-1 text-muted-foreground">
                {transitionHelp.restriction}
              </p>
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