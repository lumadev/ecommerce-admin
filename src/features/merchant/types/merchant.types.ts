export type MerchantAttributeType = "preset" | "free_text";

export interface MerchantAttribute {
  id: string;
  key: string;
  type: MerchantAttributeType;
  _count?: { products: number };
}

export interface MerchantAttributeInput {
  key: string;
  type: MerchantAttributeType;
}

export interface Merchant {
  id: string;
  code: string;
  name: string;
  email: string | null;
  domain: string | null;
  isActive: boolean;
  attributes?: MerchantAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMerchantData {
  code: string;
  name: string;
  email?: string;
  domain?: string;
  isActive?: boolean;
  attributes?: MerchantAttributeInput[];
}

export interface UpdateMerchantData {
  name?: string;
  email?: string;
  domain?: string;
  isActive?: boolean;
  attributes?: MerchantAttributeInput[];
}
