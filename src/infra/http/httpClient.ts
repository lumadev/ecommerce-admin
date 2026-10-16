import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * O backend (Render free tier) "dorme" após um período de inatividade e leva
 * alguns segundos para acordar ("cold start"). A primeira requisição após esse
 * período pode expirar por timeout ou retornar 502/503/504 enquanto o serviço
 * sobe. Para evitar que o usuário veja uma lista vazia/erro nesse cenário,
 * requisições GET são automaticamente reenviadas com backoff antes de falhar.
 */
const COLD_START_MAX_RETRIES = 3;
const COLD_START_RETRY_DELAY_MS = 2000;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retryCount?: number;
};

const isRetryableError = (error: AxiosError): boolean => {
  const method = error.config?.method?.toLowerCase();
  if (method !== "get") {
    return false;
  }

  const isTimeout = error.code === "ECONNABORTED";
  const isNetworkError = !error.response && Boolean(error.request);
  const isColdStartStatus = error.response
    ? [502, 503, 504].includes(error.response.status)
    : false;

  return isTimeout || isNetworkError || isColdStartStatus;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const registerColdStartRetry = (client: AxiosInstance) => {
  client.interceptors.response.use(undefined, async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (!config || !isRetryableError(error)) {
      return Promise.reject(error);
    }

    const retryCount = config._retryCount ?? 0;
    if (retryCount >= COLD_START_MAX_RETRIES) {
      return Promise.reject(error);
    }

    config._retryCount = retryCount + 1;
    await wait(COLD_START_RETRY_DELAY_MS * config._retryCount);

    return client.request(config);
  });
};

const apiBaseUrl =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:3000/api" : undefined);

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_URL must be configured when building the application for production.",
  );
}

const isRelativeUrl = apiBaseUrl.startsWith("/");

if (
  import.meta.env.PROD &&
  !isRelativeUrl &&
  !apiBaseUrl.startsWith("https://")
) {
  throw new Error(
    "VITE_API_URL must use HTTPS (or be a relative path) in production.",
  );
}

export const httpClientAuth = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  withCredentials: true,
});

export const httpClientPublic = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  withCredentials: false,
});

registerColdStartRetry(httpClientAuth);
registerColdStartRetry(httpClientPublic);