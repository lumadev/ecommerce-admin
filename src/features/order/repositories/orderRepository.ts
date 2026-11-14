import { httpClientAuth } from "@/infra/http/httpClient";
import type { OrderStatus, OrderStatusAction } from "@/data/orders";

interface OrderStatusChangeResponse {
  id: string;
  status: OrderStatus;
  shippedEmailSent: boolean;
  canceledEmailSent?: boolean;
}

const statusEndpoints: Record<OrderStatusAction, string> = {
  PAID: "confirm-payment",
  SHIPPED: "ship",
  COMPLETED: "complete",
  CANCELED: "cancel",
};

export const orderRepository = {
  updateStatus: async (
    orderId: string,
    status: OrderStatusAction,
    cancellationMessage?: string,
  ): Promise<OrderStatusChangeResponse> => {
    const endpoint = statusEndpoints[status];
    const response = await httpClientAuth.post<OrderStatusChangeResponse>(
      `/admin/orders/${orderId}/${endpoint}`,
      status === "CANCELED" ? { cancellationMessage } : undefined,
    );
    return response.data;
  },
};
