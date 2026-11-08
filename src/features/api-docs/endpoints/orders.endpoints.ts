import type { ApiEndpoint } from "../api-docs.types";
import { API_BASE_URL } from "../api-docs.constants";

export const orderEndpoints: ApiEndpoint[] = [
  {
    id: "orders-checkout",
    method: "POST",
    path: "/orders/checkout",
    title: "Criar checkout",
    summary: "Cria um pedido; a loja e identificada pelos produtos do carrinho.",
    access: "Público",
    details: [
      {
        label: "Body",
        value: "checkoutKey, items, customerEmail",
        description: "checkoutKey e um UUID unico gerado pelo cliente para idempotencia.",
      },
      {
        label: "Dados adicionais",
        value: "customerName, customerPhone, shippingAddress",
        description: "Obrigatorios no checkout integrado; nao envie merchantCode.",
      },
    ],
    request: `curl -X POST "${API_BASE_URL}orders/checkout" \\
  -H "Content-Type: application/json" \\
  -d '{
    "checkoutKey": "a8c26431-3602-4c67-bd26-20f84ccbfb89",
    "items": [
      {
        "productId": "3e56c479-fc2c-4c63-a6b8-e6f674d81b22",
        "quantity": 1
      }
    ],
    "customerName": "Cliente Exemplo",
    "customerEmail": "cliente@example.com",
    "customerPhone": "+55 11 99999-9999",
    "shippingAddress": {
      "recipient": "Cliente Exemplo",
      "postalCode": "01001-000",
      "street": "Praca da Se",
      "number": "100",
      "neighborhood": "Se",
      "city": "Sao Paulo",
      "state": "SP"
    }
  }'`,
    response: `{
  "id": "6f630fb3-fdcc-4a73-b509-24d2ac4f83e0",
  "checkoutKey": "a8c26431-3602-4c67-bd26-20f84ccbfb89",
  "checkoutMode": "INTEGRATED",
  "checkoutUrl": null,
  "subtotal": 89.9,
  "shippingAmount": 0,
  "total": 89.9,
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "items": [
    {
      "productId": "3e56c479-fc2c-4c63-a6b8-e6f674d81b22",
      "name": "Luminaria de mesa",
      "quantity": 1,
      "unitPrice": 89.9,
      "customNote": null
    }
  ]
}`,
  },
  {
    id: "orders-checkout-status",
    method: "GET",
    path: "/orders/checkout/{checkoutKey}/status",
    title: "Consultar status do checkout",
    summary: "Consulta o estado do pedido pela chave UUID do checkout.",
    access: "Público",
    details: [
      {
        label: "Path param",
        value: "checkoutKey",
        description: "UUID retornado ao criar o checkout.",
      },
    ],
    request: `curl -X GET "${API_BASE_URL}orders/checkout/a8c26431-3602-4c67-bd26-20f84ccbfb89/status" \\
  -H "Accept: application/json"`,
    response: `{
  "id": "6f630fb3-fdcc-4a73-b509-24d2ac4f83e0",
  "checkoutKey": "a8c26431-3602-4c67-bd26-20f84ccbfb89",
  "checkoutMode": "INTEGRATED",
  "checkoutUrl": null,
  "total": 89.9,
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "paymentStatusDetail": null
}`,
  },
  {
    id: "orders-payment-config",
    method: "GET",
    path: "/orders/payment-config",
    title: "Consultar configuracao de pagamento",
    summary: "Retorna a chave publica e informa se o pagamento integrado esta habilitado.",
    access: "Público",
    details: [],
    request: `curl -X GET "${API_BASE_URL}orders/payment-config" \\
  -H "Accept: application/json"`,
    response: `{
  "publicKey": "<chave-publica-ou-null>",
  "enabled": true
}`,
  },
  {
    id: "orders-card-payment",
    method: "POST",
    path: "/orders/{orderId}/payments/card",
    title: "Pagar pedido com cartao",
    summary: "Inicia um pagamento de cartao para um pedido em checkout integrado.",
    access: "Público",
    details: [
      {
        label: "Path param",
        value: "orderId",
        description: "ID do pedido retornado pelo checkout.",
      },
      {
        label: "Body",
        value: "attemptKey, token, paymentMethodId, installments",
        description: "token e gerado pelo SDK do Mercado Pago; nunca envie dados brutos do cartao.",
      },
    ],
    request: `curl -X POST "${API_BASE_URL}orders/6f630fb3-fdcc-4a73-b509-24d2ac4f83e0/payments/card" \\
  -H "Content-Type: application/json" \\
  -d '{
    "attemptKey": "d17f1284-74fc-46bc-95f2-27ad34f08ea2",
    "token": "<token-gerado-pelo-sdk>",
    "paymentMethodId": "visa",
    "installments": 1
  }'`,
    response: `{
  "id": "6f630fb3-fdcc-4a73-b509-24d2ac4f83e0",
  "checkoutKey": "a8c26431-3602-4c67-bd26-20f84ccbfb89",
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "paymentStatusDetail": null,
  "total": 89.9
}`,
  },
];
