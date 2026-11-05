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
  if (axios.isCancel(error)) {
    return false;
  }

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

let activeMerchantCode: string | undefined;

type MerchantCodeQueryRoute = {
  path: string | RegExp;
  methods: readonly string[];
};

const MERCHANT_CODE_QUERY_ROUTES: readonly MerchantCodeQueryRoute[] = [
  // Usuários
  { path: "/users", methods: ["get", "post"] },
  { path: "/users/admin", methods: ["post"] },
  { path: /^\/users\/[^/]+$/, methods: ["get", "patch", "delete"] },

  // Categorias
  { path: "/categories", methods: ["get", "post"] },
  { path: /^\/categories\/[^/]+$/, methods: ["get", "patch", "delete"] },

  // Produtos
  { path: "/admin/products", methods: ["get", "post"] },
  { path: /^\/admin\/products\/[^/]+$/, methods: ["get", "patch", "delete"] },

  // Destaques
  { path: "/highlights", methods: ["get", "post"] },
  { path: /^\/highlights\/[^/]+$/, methods: ["delete"] },
  {
    path: /^\/highlights\/[^/]+\/(?:increase|decrease)$/,
    methods: ["patch"],
  },

  // Variantes
  { path: "/variants", methods: ["get"] },
  {
    path: /^\/variants\/[^/]+\/options(?:\/[^/]+)?$/,
    methods: ["post", "delete"],
  },

  // Templates de e-mail
  { path: "/admin/email-templates", methods: ["get"] },
  { path: /^\/admin\/email-templates\/[^/]+\/preview$/, methods: ["get"] },

  // Uploads
  { path: "/upload", methods: ["post", "delete"] },
];

export const setActiveMerchantCode = (merchantCode?: string | null) => {
  activeMerchantCode = merchantCode ?? undefined;
};

const registerMerchantCodeParam = (client: AxiosInstance) => {
  client.interceptors.request.use((config) => {
    const requestPath = config.url?.split("?")[0].replace(/\/$/, "");
    const method = config.method?.toLowerCase() ?? "get";
    const usesMerchantCodeQuery =
      requestPath !== undefined &&
      MERCHANT_CODE_QUERY_ROUTES.some(
        ({ path, methods }) =>
          methods.includes(method) &&
          (path instanceof RegExp
            ? path.test(requestPath)
            : path === requestPath),
      );

    if (!activeMerchantCode) {
      return config;
    }

    if (usesMerchantCodeQuery) {
      if (config.params instanceof URLSearchParams) {
        if (!config.params.has("merchantCode")) {
          config.params.set("merchantCode", activeMerchantCode);
        }
        return config;
      }

      const params = config.params as Record<string, unknown> | undefined;
      config.params = {
        ...params,
        merchantCode: params?.merchantCode ?? activeMerchantCode,
      };
    }

    return config;
  });
};

registerColdStartRetry(httpClientAuth);
registerColdStartRetry(httpClientPublic);
registerMerchantCodeParam(httpClientAuth);
registerMerchantCodeParam(httpClientPublic);