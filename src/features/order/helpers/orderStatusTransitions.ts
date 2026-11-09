import type { OrderStatus, OrderStatusAction } from "@/data/orders";

export interface OrderStatusTransitionHelp {
  transitions: Array<{
    status: OrderStatusAction;
    explanation: string;
  }>;
  restriction: string;
}

const transitionsByStatus: Record<OrderStatus, OrderStatusTransitionHelp> = {
  PENDING: {
    transitions: [
      {
        status: "PAID",
        explanation: "Confirme o pagamento recebido; o estoque será baixado.",
      },
      {
        status: "CANCELED",
        explanation: "Encerre o pedido antes do envio.",
      },
    ],
    restriction:
      "O pedido ainda aguarda pagamento. O envio só pode ser marcado depois da confirmação.",
  },
  PAYMENT_FAILED: {
    transitions: [
      {
        status: "PAID",
        explanation:
          "Use se o pagamento foi confirmado por outro meio; o estoque será baixado.",
      },
      {
        status: "CANCELED",
        explanation: "Encerre o pedido após a recusa do pagamento.",
      },
    ],
    restriction:
      "Um pagamento recusado não pode ser enviado. Confirme outro pagamento ou encerre o pedido.",
  },
  PAID: {
    transitions: [
      {
        status: "SHIPPED",
        explanation:
          "Registre o envio; o cliente receberá um e-mail de atualização.",
      },
    ],
    restriction:
      "O pagamento já foi aprovado. O cancelamento não está disponível nesta etapa; resolva eventual estorno ou conciliação financeira antes de qualquer ação.",
  },
  INVENTORY_ISSUE: {
    transitions: [
      {
        status: "PAID",
        explanation:
          "Depois de repor o estoque, selecione esta opção para baixar os itens e confirmar o pedido.",
      },
      {
        status: "CANCELED",
        explanation: "Cancele o pedido se não conseguir resolver o problema de estoque.",
      },
    ],
    restriction:
      "O pagamento foi aprovado, mas o estoque não foi descontado (quantidade insuficiente). Para continuar: (1) reponha o estoque dos produtos do pedido; (2) neste seletor, escolha “Pagamento aprovado” e confirme para baixar o estoque. Se não puder atender, escolha “Cancelado” — o pagamento não será estornado automaticamente.",
  },
  SHIPPED: {
    transitions: [
      {
        status: "COMPLETED",
        explanation: "Confirme quando o pedido tiver sido entregue.",
      },
    ],
    restriction:
      "Depois do envio, não é possível voltar para etapas anteriores nem cancelar por esta tela.",
  },
  COMPLETED: {
    transitions: [],
    restriction:
      "O pedido foi entregue e está encerrado; nenhum outro status está disponível.",
  },
  CANCELED: {
    transitions: [],
    restriction:
      "O pedido foi cancelado e está encerrado; nenhum outro status está disponível.",
  },
};

export function getOrderStatusTransitionHelp(
  status: OrderStatus,
): OrderStatusTransitionHelp {
  return transitionsByStatus[status];
}
