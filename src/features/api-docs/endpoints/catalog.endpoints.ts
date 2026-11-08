import type { ApiEndpoint } from "../api-docs.types";
import { API_BASE_URL, MERCHANT_CODE_TOKEN } from "../api-docs.constants";

export const catalogEndpoints: ApiEndpoint[] = [
  {
    id: "categories-list",
    method: "GET",
    path: `/categories?merchantCode=${MERCHANT_CODE_TOKEN}`,
    title: "Listar categorias",
    summary: "Retorna as categorias públicas disponíveis no catálogo da loja.",
    access: "Público",
    details: [
      {
        label: "Query param",
        value: "merchantCode",
        description: "Código da loja. Obrigatório.",
      },
    ],
    request: `curl -X GET "${API_BASE_URL}categories?merchantCode=${MERCHANT_CODE_TOKEN}" \\
  -H "Accept: application/json"`,
    response: `[
  {
    "id": "f64f13f7-c7d8-4f2b-bcd2-45cca3408966",
    "merchantId": "0c2c334a-100f-4356-9ba9-0ffaf5527b05",
    "name": "Decoracao",
    "description": "Itens para decoracao.",
    "hashtags": ["decoracao"],
    "picturePublicId": null,
    "createdAt": "2026-10-05T18:03:10.659Z",
    "updatedAt": "2026-10-05T18:03:10.659Z",
    "url": null
  }
]`,
  },
  {
    id: "categories-detail",
    method: "GET",
    path: `/categories/{categoryId}?merchantCode=${MERCHANT_CODE_TOKEN}`,
    title: "Consultar categoria",
    summary: "Retorna uma categoria da loja e seus produtos relacionados.",
    access: "Público",
    details: [
      {
        label: "Path param",
        value: "categoryId",
        description: "ID da categoria.",
      },
      {
        label: "Query param",
        value: "merchantCode",
        description: "Código da loja. Obrigatório.",
      },
    ],
    request: `curl -X GET "${API_BASE_URL}categories/f64f13f7-c7d8-4f2b-bcd2-45cca3408966?merchantCode=${MERCHANT_CODE_TOKEN}" \\
  -H "Accept: application/json"`,
    response: `{
  "id": "f64f13f7-c7d8-4f2b-bcd2-45cca3408966",
  "merchantId": "0c2c334a-100f-4356-9ba9-0ffaf5527b05",
  "name": "Decoracao",
  "description": "Itens para decoracao.",
  "hashtags": ["decoracao"],
  "picturePublicId": null,
  "products": []
}`,
  },
  {
    id: "products-list",
    method: "GET",
    path: `/products?merchantCode=${MERCHANT_CODE_TOKEN}`,
    title: "Listar produtos",
    summary: "Retorna os produtos em estoque, ordenados por nome.",
    access: "Público",
    details: [
      {
        label: "Query param",
        value: "merchantCode",
        description: "Código da loja. Obrigatório.",
      },
    ],
    request: `curl -X GET "${API_BASE_URL}products?merchantCode=${MERCHANT_CODE_TOKEN}" \\
  -H "Accept: application/json"`,
    response: `[
  {
    "id": "3e56c479-fc2c-4c63-a6b8-e6f674d81b22",
    "name": "Luminaria de mesa",
    "description": "Luminaria impressa em 3D.",
    "price": "89.90",
    "stock": 12,
    "categories": [
      { "id": "f64f13f7-c7d8-4f2b-bcd2-45cca3408966", "name": "Decoracao" }
    ],
    "media": [
      { "type": "image", "src": "https://res.cloudinary.com/demo/image/upload/luminaria.jpg" }
    ],
    "variants": []
  }
]`,
  },
  {
    id: "products-search",
    method: "GET",
    path: `/products/search?merchantCode=${MERCHANT_CODE_TOKEN}&q=luminaria&page=1&limit=20`,
    title: "Buscar produtos",
    summary: "Busca produtos em estoque com filtros, ordenacao e paginacao.",
    access: "Público",
    details: [
      {
        label: "merchantCode",
        value: "Obrigatorio",
        description: "Codigo da loja; a busca so retorna produtos dessa loja.",
      },
      {
        label: "Filtros",
        value: "q, categoryId, minPrice, maxPrice",
        description: "Texto, categoria e faixa de preco sao opcionais.",
      },
      {
        label: "Paginacao",
        value: "page, limit",
        description: "Padrao: pagina 1 e 20 resultados; limite maximo: 200.",
      },
      {
        label: "Ordenacao",
        value: "sortBy, sortOrder",
        description: "sortBy: name, price ou createdAt; sortOrder: asc ou desc.",
      },
      {
        label: "Variantes",
        value: "attributes[attributeId]=valor",
        description: "Pode ser repetido; cada filtro usa o ID da variante da loja.",
      },
    ],
    request: `curl -G "${API_BASE_URL}products/search" \\
  --data-urlencode "merchantCode=${MERCHANT_CODE_TOKEN}" \\
  --data-urlencode "q=luminaria" \\
  --data-urlencode "page=1" \\
  --data-urlencode "limit=20" \\
  --data-urlencode "sortBy=price" \\
  --data-urlencode "sortOrder=asc" \\
  -H "Accept: application/json"`,
    response: `{
  "products": [
    {
      "id": "3e56c479-fc2c-4c63-a6b8-e6f674d81b22",
      "name": "Luminaria de mesa",
      "description": "Luminaria impressa em 3D.",
      "price": "89.90",
      "stock": 12,
      "categories": [],
      "media": [],
      "variants": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalResults": 1,
    "totalPages": 1
  }
}`,
  },
  {
    id: "products-detail",
    method: "GET",
    path: `/products/{productId}?merchantCode=${MERCHANT_CODE_TOKEN}`,
    title: "Consultar produto",
    summary: "Retorna os dados públicos de um produto da loja.",
    access: "Público",
    details: [
      {
        label: "Path param",
        value: "productId",
        description: "ID do produto.",
      },
      {
        label: "Query param",
        value: "merchantCode",
        description: "Código da loja. Obrigatório.",
      },
    ],
    request: `curl -X GET "${API_BASE_URL}products/3e56c479-fc2c-4c63-a6b8-e6f674d81b22?merchantCode=${MERCHANT_CODE_TOKEN}" \\
  -H "Accept: application/json"`,
    response: `{
  "id": "3e56c479-fc2c-4c63-a6b8-e6f674d81b22",
  "name": "Luminaria de mesa",
  "description": "Luminaria impressa em 3D.",
  "price": "89.90",
  "stock": 12,
  "categories": [],
  "media": [],
  "variants": []
}`,
  },
  {
    id: "highlights-list",
    method: "GET",
    path: `/highlights?merchantCode=${MERCHANT_CODE_TOKEN}`,
    title: "Listar destaques",
    summary: "Retorna os produtos em destaque na ordem configurada para a loja.",
    access: "Público",
    details: [
      {
        label: "Query param",
        value: "merchantCode",
        description: "Código da loja. Obrigatório.",
      },
    ],
    request: `curl -X GET "${API_BASE_URL}highlights?merchantCode=${MERCHANT_CODE_TOKEN}" \\
  -H "Accept: application/json"`,
    response: `[
  {
    "id": "af0cbabe-0b53-4fbc-9d8b-303b2b5b0098",
    "productId": "3e56c479-fc2c-4c63-a6b8-e6f674d81b22",
    "position": 1,
    "product": {
      "id": "3e56c479-fc2c-4c63-a6b8-e6f674d81b22",
      "name": "Luminaria de mesa",
      "price": "89.90",
      "media": [],
      "mediaUrls": [],
      "mediaPublicIds": [],
      "mediaTypes": []
    }
  }
]`,
  },
];
