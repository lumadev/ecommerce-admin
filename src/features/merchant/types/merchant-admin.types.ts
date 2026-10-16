export interface MerchantAdmin {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "ADMIN";
  merchantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMerchantAdminData {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface UpdateMerchantAdminData {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
}

export interface MerchantAdminFormState {
  name: string;
  email: string;
  username: string;
  password: string;
}

export type MerchantAdminFormErrors = Partial<
  Record<keyof MerchantAdminFormState, string>
>;