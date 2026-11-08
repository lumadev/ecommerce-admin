import type { ApiEndpoint } from "../api-docs.types";
import { API_BASE_URL, MERCHANT_CODE_TOKEN } from "../api-docs.constants";

export const customerEndpoints: ApiEndpoint[] = [
  {
    id: "auth-register",
    method: "POST",
    path: "/auth/register",
    title: "Autocadastro de cliente",
    summary: "Permite que o próprio cliente crie uma conta enviando o código da loja no corpo.",
    access: "Público • limite de requisições",
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
    summary: "Autentica um cliente no contexto da loja e inicia a sessão.",
    access: "Público • limite de requisições",
    details: [
      {
        label: "Body",
        value: "merchantCode, email, password",
        description: "O backend também envia um cookie de sessão.",
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
    title: "Solicitar recuperação de senha",
    summary: "Envia um link de recuperação para o cliente da loja.",
    access: "Público • limite de requisições",
    details: [
      {
        label: "Body",
        value: "merchantCode, email",
        description: "O link de recuperação expira em 15 minutos.",
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
    title: "Validar token de recuperação",
    summary: "Confirma se o token recebido por e-mail ainda pode ser usado.",
    access: "Público • limite de requisições",
    details: [
      {
        label: "Body",
        value: "token",
        description: "Token de recuperação recebido por e-mail.",
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
    summary: "Define uma nova senha usando um token válido de recuperação.",
    access: "Público • limite de requisições",
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
    title: "Encerrar sessão do cliente",
    summary: "Encerra a sessão limpando o cookie de autenticação.",
    access: "Público",
    details: [
      {
        label: "Cookie",
        value: "access_token",
        description: "Envie o cookie da sessão atual.",
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
  title: "Enviar nova mensagem de contato",
  summary: "Envia para a loja uma mensagem do cliente pelo formulário de contato do e-commerce.",
  access: "Público • limite de requisições",
  details: [
    {
      label: "Body",
      value: "merchantCode, name, email, description",
      description: "Descrição limitada a 2000 caracteres.",
    },
  ],
  request: `curl -X POST "${API_BASE_URL}email/custom-order" \\
  -H "Content-Type: application/json" \\
  -d '{"merchantCode":"${MERCHANT_CODE_TOKEN}","name":"Cliente Exemplo","email":"cliente@example.com","description":"Gostaria de obter mais informações sobre os produtos da loja."}'`,
  response: `{
  "message": "<mensagem de sucesso>"
}`,
};
