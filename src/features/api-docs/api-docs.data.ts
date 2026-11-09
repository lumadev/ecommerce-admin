import type { ApiEndpoint } from "./api-docs.types";
import { API_BASE_URL, MERCHANT_CODE_TOKEN } from "./api-docs.constants";
import { catalogEndpoints } from "./endpoints/catalog.endpoints";
import {
  customerEndpoints,
  customOrderEndpoint,
} from "./endpoints/customer.endpoints";
import { orderEndpoints } from "./endpoints/orders.endpoints";

export { API_BASE_URL };

const endpointTemplates: ApiEndpoint[] = [
  ...catalogEndpoints,
  ...customerEndpoints,
  ...orderEndpoints,
  customOrderEndpoint,
];

export const getApiEndpoints = (merchantCode: string): ApiEndpoint[] => {
  const encodedMerchantCode = encodeURIComponent(merchantCode);

  return endpointTemplates.map((endpoint) => ({
    ...endpoint,
    path: endpoint.path.split(MERCHANT_CODE_TOKEN).join(encodedMerchantCode),
    request: endpoint.request
      .split(MERCHANT_CODE_TOKEN)
      .join(encodedMerchantCode),
  }));
};
