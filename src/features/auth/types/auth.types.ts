export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface LoginAdminData {
  username: string;
  password: string;
}

export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  token?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  merchantId?: string | null;
  impersonatedBy?: string | null;
}

export interface ImpersonationTarget {
  id: string;
  name: string;
  store?: { name: string } | null;
}
