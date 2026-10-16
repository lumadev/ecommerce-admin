import { MerchantAttributeType } from "./merchant.types";

export interface MerchantAttributeFormItem {
  uid: string;
  key: string;
  type: MerchantAttributeType;
  productCount: number;
}

export interface MerchantFormState {
  code: string;
  name: string;
  email: string;
  domain: string;
  isActive: boolean;
  attributes: MerchantAttributeFormItem[];
}

export type MerchantFormErrors = Partial<
  Record<Exclude<keyof MerchantFormState, "attributes">, string>
> & { attributes?: string };
