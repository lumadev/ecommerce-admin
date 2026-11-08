import type { ApiEndpoint } from "../api-docs.types";
import { API_BASE_URL, MERCHANT_CODE_TOKEN } from "../api-docs.constants";

export const customerEndpoints: ApiEndpoint[] = [
  {
    id: "users-create",
    method: "POST",
    path: `/users?merchantCode=${MERCHANT_CODE_TOKEN}`,
    title: "Cadastrar cliente",
    summary: "Cria uma conta de cliente vinculada à loja.",
    access: "Público • limite de requisicoes • em manutencao",
    details: [
      {
        label: "Query param",
        value: "merchantCode",
        description: "Código da loja. Obrigatório.",
      },
      {
        label: "Body",
        value: "name, email, password",
        description: "Senha com pelo menos 6 caracteres.",
      },
    ],
    request: `curl -X POST "${API_BASE_URL}users?merchantCode=${MERCHANT_CODE_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Cliente Exemplo","email":"cliente@example.com","password":"senha-segura"}'`,
    response: `{
  "id": "1455943e-6757-4a14-85c1-4376d9531059",
  "merchantId": "0c2c334a-100f-4356-9ba9-0ffaf5527b05",
  "name": "Cliente Exemplo",
  "email": "cliente@example.com"
}`,
  },
  {
    id: "auth-register",
    method: "POST",
    path: "/auth/register",
    title: "Cadastrar cliente (autenticacao)",
    summary: "Cria uma conta de cliente enviando o codigo da loja no corpo.",
    access: "Público • limite de requisicoes • em manutencao",
    details: [
      {
        label: "Body",
        value: "merchantCode, name, email, password",
        description: "Senha com pelo menos 6 caracteres.",
      },
    ],
    request: `curl -X POST "${API_BASE_URL}auth/register" \\
  -H "Content-Type: application/json" \\
  -d '{"merchantCode":"${MERCHANT_CODE_TOKEN}","name":"Cliente Exemplo","email":"cliente@example.com","password":"senha-segura"}'`,
    response: `{
  "id": "1455943e-6757-4a14-85c1-4376d9531059",
  "email": "cliente@example.com",
  "name": "Cliente Exemplo"
}`,
  },
  {
    id: "auth-login",
    method: "POST",
    path: "/auth/login",
    title: "Entrar como cliente",
    summary: "Autentica um cliente no contexto da loja e inicia a sessao.",
    access: "Público • limite de requisicoes",
    details: [
      {
        label: "Body",
        value: "merchantCode, email, password",
        description: "O backend tambem envia um cookie de sessao.",
      },
    ],
    request: `curl -X POST "${API_BASE_URL}auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"merchantCode":"${MERCHANT_CODE_TOKEN}","email":"cliente@example.com","password":"senha-segura"}'`,
    response: `{
  "token": "<token-de-sessao>",
  "user": {
    "id": "1455943e-6757-4a14-85c1-4376d9531059",
    "email": "cliente@example.com",
    "name": "Cliente Exemplo",
    "role": "CUSTOMER"
  }
}`,
  },
  {
    id: "auth-forgot-password",
    method: "POST",
    path: "/auth/forgot-password",
    title: "Solicitar recuperacao de senha",
    summary: "Envia um link de recuperacao para o cliente da loja.",
    access: "Público • limite de requisicoes",
    details: [
      {
        label: "Body",
        value: "merchantCode, email",
        description: "O link de recuperacao expira em 15 minutos.",
      },
    ],
    request: `curl -X POST "${API_BASE_URL}auth/forgot-password" \\
  -H "Content-Type: application/json" \\
  -d '{"merchantCode":"${MERCHANT_CODE_TOKEN}","email":"cliente@example.com"}'`,
    response: `{
  "message": "Email de recuperacao de senha enviado"
}`,
  },
  {
    id: "auth-reset-password-validate",
    method: "POST",
    path: "/auth/reset-password/validate",
    title: "Validar token de recuperacao",
    summary: "Confirma se o token recebido por e-mail ainda pode ser usado.",
    access: "Público • limite de requisicoes",
    details: [
      {
        label: "Body",
        value: "token",
        description: "Token de recuperacao recebido por e-mail.",
      },
    ],
    request: `curl -X POST "${API_BASE_URL}auth/reset-password/validate" \\
  -H "Content-Type: application/json" \\
  -d '{"token":"<token-de-recuperacao>"}'`,
    response: `{
  "valid": true
}`,
  },
  {
    id: "auth-reset-password",
    method: "POST",
    path: "/auth/reset-password",
    title: "Redefinir senha",
    summary: "Define uma nova senha usando um token valido de recuperacao.",
    access: "Público • limite de requisicoes",
    details: [
      {
        label: "Body",
        value: "token, password",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
      },
    ],
    request: `curl -X POST "${API_BASE_URL}auth/reset-password" \\
  -H "Content-Type: application/json" \\
  -d '{"token":"<token-de-recuperacao>","password":"nova-senha-segura"}'`,
    response: `{
  "message": "Senha redefinida com sucesso"
}`,
  },
  {
    id: "auth-logout",
    method: "POST",
    path: "/auth/logout",
    title: "Encerrar sessao do cliente",
    summary: "Encerra a sessao limpando o cookie de autenticacao.",
    access: "Público",
    details: [
      {
        label: "Cookie",
        value: "access_token",
        description: "Envie o cookie da sessao atual.",
      },
    ],
    request: `curl -X POST "${API_BASE_URL}auth/logout" \\
  -H "Cookie: access_token=<token-de-sessao>"`,
    response: `{
  "message": "Logout realizado com sucesso"
}`,
  },
];

export const customOrderEndpoint: ApiEndpoint = {
  id: "email-custom-order",
  method: "POST",
  path: "/email/custom-order",
  title: "Enviar solicitacao de encomenda",
  summary: "Envia uma solicitacao de encomenda para a loja.",
  access: "Público • limite de requisicoes • em manutencao",
  details: [
    {
      label: "Body",
      value: "merchantCode, name, email, description",
      description: "Descricao limitada a 2000 caracteres.",
    },
  ],
  request: `curl -X POST "${API_BASE_URL}email/custom-order" \\
  -H "Content-Type: application/json" \\
  -d '{"merchantCode":"${MERCHANT_CODE_TOKEN}","name":"Cliente Exemplo","email":"cliente@example.com","description":"Solicito informacoes sobre uma encomenda personalizada."}'`,
  response: `{
  "message": "Email de encomenda enviado com sucesso"
}`,
};
