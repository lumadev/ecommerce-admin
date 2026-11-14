import { useState } from "react";
import { OrderStatusLabel, mockOrders } from "@/data/orders";
import type { Order, OrderStatusAction } from "@/data/orders";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/infra/http/httpError";
import { orderRepository } from "../repositories/orderRepository";

export const useOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const updateStatus = async (
    orderId: string,
    newStatus: OrderStatusAction,
    cancellationMessage?: string,
  ): Promise<boolean> => {
    try {
      const updatedOrder = await orderRepository.updateStatus(
        orderId,
        newStatus,
        cancellationMessage,
      );
      const now = new Date().toISOString();

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: updatedOrder.status,
                statusHistory: [
                  ...order.statusHistory,
                  { status: updatedOrder.status, date: now },
                ],
              }
            : order,
        ),
      );

      toast({
        variant: "success",
        description: `Pedido ${orderId} atualizado para "${OrderStatusLabel[updatedOrder.status]}"`,
      });
      return true;
    } catch (error) {
      toast({ variant: "destructive", description: getErrorMessage(error) });
      return false;
    }
  };

  return {
    orders,
    updateStatus,
  };
};