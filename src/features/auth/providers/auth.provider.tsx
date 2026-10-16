import { ReactNode, useEffect, useState } from "react";
import { authRepository } from "../repositories/authRepository";
import { AuthResponse, SessionUser } from "../types/auth.types";
import {
  AdminAuthContext,
  AuthType,
  AuthContextValue,
  CredentialsByRole,
  ClientAuthContext,
} from "../auth.context";

const AUTHENTICATED_SESSION_KEY = "auth:authenticated";

function assertRole(user: SessionUser, expectedRole: AuthType) {
  return expectedRole === "ADMIN"
    ? user.role === "ADMIN" || user.role === "SUPER_ADMIN"
    : user.role === expectedRole;
}

export function createAuthProvider<R extends AuthType>(
  role: R,
  loginRequest: (
    credentials: CredentialsByRole<R>
  ) => Promise<AuthResponse>,
  Context: React.Context<AuthContextValue<R> | undefined>
) {
  return function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    const refreshSession = async () => {
      try {
        const sessionUser = await authRepository.checkSession();

        if (!assertRole(sessionUser, role)) {
          window.localStorage.removeItem(AUTHENTICATED_SESSION_KEY);
          setUser(null);
          return null;
        }

        setUser(sessionUser);
        return sessionUser;
      } catch {
        window.localStorage.removeItem(AUTHENTICATED_SESSION_KEY);
        setUser(null);
        return null;
      } finally {
        setIsCheckingSession(false);
      }
    };

    const login = async (credentials: CredentialsByRole<R>) => {
      const loginResponse = await loginRequest(credentials);

      const sessionUser = await authRepository.checkSession();

      if (!assertRole(sessionUser, role)) {
        window.localStorage.removeItem(AUTHENTICATED_SESSION_KEY);
        setUser(null);
        return null;
      }

      const authenticatedUser =
        role === "ADMIN" && loginResponse.role === "SUPER_ADMIN"
          ? { ...sessionUser, role: loginResponse.role }
          : sessionUser;

      window.localStorage.setItem(AUTHENTICATED_SESSION_KEY, "true");
      setUser(authenticatedUser);

      return authenticatedUser;
    };

    const logout = async () => {
      try {
        await authRepository.logout();
      } catch {
        // Ignora erros caso a chamada de logout falhe
      } finally {
        window.localStorage.removeItem(AUTHENTICATED_SESSION_KEY);
        setUser(null);
      }
    };

    useEffect(() => {
      if (
        window.localStorage.getItem(AUTHENTICATED_SESSION_KEY) !== "true"
      ) {
        setIsCheckingSession(false);
        return;
      }

      void refreshSession();
    }, []);

    return (
      <Context.Provider
        value={{
          user,
          isAuthenticated: Boolean(user),
          isCheckingSession,
          login,
          logout,
          refreshSession,
        }}
      >
        {children}
      </Context.Provider>
    );
  };
}

export const ClientAuthProvider = createAuthProvider<"CUSTOMER">(
  "CUSTOMER",
  authRepository.login,
  ClientAuthContext
);
export const AdminAuthProvider = createAuthProvider<"ADMIN">(
  "ADMIN",
  authRepository.loginAdmin,
  AdminAuthContext
);