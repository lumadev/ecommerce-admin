import { createContext } from "react";
import { LoginAdminData, LoginData, SessionUser } from "./types/auth.types";

export type AuthType = "CUSTOMER" | "ADMIN";

export type CredentialsByRole<R extends AuthType> = R extends "CUSTOMER"
  ? LoginData
  : LoginAdminData;

export interface AuthContextValue<R extends AuthType = AuthType> {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  login: (credentials: CredentialsByRole<R>) => Promise<SessionUser | null>;
  logout: () => void;
  refreshSession: () => Promise<SessionUser | null>;
}

const createAuthContext = <R extends AuthType>() =>
  createContext<AuthContextValue<R> | undefined>(undefined);

export const ClientAuthContext = createAuthContext<"CUSTOMER">();
export const AdminAuthContext = createAuthContext<"ADMIN">();