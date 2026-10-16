import { httpClientAuth } from "@/infra/http/httpClient";
import {
  RegisterData,
  LoginData,
  LoginAdminData,
  ForgotPasswordData,
  ResetPasswordData,
  AuthResponse,
  SessionUser,
  ImpersonationTarget,
} from "../types/auth.types";

const BASE_URL = "/auth";

export const authRepository = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await httpClientAuth.post(`${BASE_URL}/register`, {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await httpClientAuth.post(`${BASE_URL}/login`, {
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  loginAdmin: async (data: LoginAdminData): Promise<AuthResponse> => {
    const response = await httpClientAuth.post(`${BASE_URL}/login-admin`, {
      username: data.username,
      password: data.password,
    });
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<void> => {
    await httpClientAuth.post(`${BASE_URL}/forgot-password`, {
      email: data.email,
    });
  },

  validatePasswordResetToken: async (token: string): Promise<void> => {
    await httpClientAuth.post(`${BASE_URL}/reset-password/validate`, { token });
  },

  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    await httpClientAuth.post(`${BASE_URL}/reset-password`, data);
  },

  checkSession: async (): Promise<SessionUser> => {
    const response = await httpClientAuth.get(`${BASE_URL}/me`);

    return response.data;
  },

  getImpersonationTargets: async (): Promise<ImpersonationTarget[]> => {
    const response = await httpClientAuth.get(`${BASE_URL}/impersonate/targets`);
    const payload = response.data;

    if (Array.isArray(payload)) return payload;

    const list = payload?.data ?? payload?.targets ?? payload?.admins;

    return Array.isArray(list) ? list : [];
  },

  impersonate: async (adminId: string): Promise<void> => {
    await httpClientAuth.post(`${BASE_URL}/impersonate`, { adminId });
  },

  stopImpersonation: async (): Promise<void> => {
    await httpClientAuth.post(`${BASE_URL}/impersonate/stop`);
  },

  logout: async (): Promise<void> => {
    await httpClientAuth.post(`${BASE_URL}/logout`);
  },
};
