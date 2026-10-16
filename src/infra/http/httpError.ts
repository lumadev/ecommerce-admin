import axios from "axios";

function getHttpStatusMessage(status?: number): string {
  switch (status) {
    case 400:
      return "Não foi possível concluir a solicitação. Revise os dados e tente novamente.";
    case 401:
      return "Usuário ou senha inválidos.";
    case 403:
      return "Você não tem permissão para realizar esta ação.";
    case 404:
      return "O recurso solicitado não foi encontrado.";
    case 409:
      return "Não foi possível concluir a solicitação porque os dados informados já existem.";
    case 422:
      return "Os dados informados são inválidos.";
    case 429:
      return "Muitas tentativas em pouco tempo. Aguarde e tente novamente.";
    default:
      if (status && status >= 500) {
        return "Ocorreu um erro interno. Tente novamente mais tarde.";
      }

      return "Não foi possível concluir a solicitação.";
  }
}

function getServerMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object" || !("message" in data)) {
    return undefined;
  }

  const { message } = data as { message: unknown };

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (Array.isArray(message) && typeof message[0] === "string") {
    return message[0];
  }

  return undefined;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;
      return (status < 500 ? getServerMessage(data) : undefined) ?? getHttpStatusMessage(status);
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return "A solicitação demorou mais do que o esperado. Tente novamente.";
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return "Você está sem conexão com a internet. Verifique sua rede e tente novamente.";
    }

    return "Não foi possível conectar ao servidor. Tente novamente em instantes.";
  }

  if (error instanceof Error) {
    return "Ocorreu um erro ao processar sua solicitação. Tente novamente.";
  }

  return "Erro inesperado. Tente novamente.";
}