import type { ApiEndpoint } from "./api-docs.types";

export const API_BASE_URL = "https://ecommerce-3d-back.onrender.com/api/";

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: "list",
    method: "GET",
    path: "/categories?merchantCode={merchantCode}",
    title: "Listar categorias",
    summary: "Retorna as categorias públicas que o e-commerce pode exibir.",
    access: "Endpoint público",
    details: [
      {
        label: "Query param",
        value: "merchantCode",
        description: "Código da loja. Obrigatório.",
      },
    ],
    request: `curl -X GET "${API_BASE_URL}categories?merchantCode=minha-loja" \\
  -H "Accept: application/json"`,
    response: `[
  {
    "id": "f64f13f7-c7d8-4f2b-bcd2-45cca3408966",
    "merchantId": "0c2c334a-100f-4356-9ba9-0ffaf5527b05",
    "name": "Brinquedo",
    "description": null,
    "hashtags": [
      "brinquedos"
    ],
    "picturePublicId": null,
    "createdAt": "2026-10-05T18:03:10.659Z",
    "updatedAt": "2026-10-05T18:03:10.659Z",
    "url": null
  },
  {
    "id": "d5cc447d-a606-4b38-95bf-330e6be604d7",
    "merchantId": "0c2c334a-100f-4356-9ba9-0ffaf5527b05",
    "name": "Decoração",
    "description": "Itens para decoração ou armazenamento.",
    "hashtags": [
      "decoracao",
      "armazenamento"
    ],
    "picturePublicId": null,
    "createdAt": "2026-10-05T00:59:14.939Z",
    "updatedAt": "2026-10-05T00:59:14.939Z",
    "url": null
  },
  {
    "id": "c857123e-4769-47e5-8e92-817b779fc555",
    "merchantId": "0c2c334a-100f-4356-9ba9-0ffaf5527b05",
    "name": "Música",
    "description": "Produtos musicais",
    "hashtags": [
      "Música",
      "palheta",
      "portapalheta"
    ],
    "picturePublicId": null,
    "createdAt": "2026-09-20T01:50:28.580Z",
    "updatedAt": "2026-09-20T01:50:28.580Z",
    "url": null
  }
]`,
  },
];
