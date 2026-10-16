import { useEffect, useState } from "react";
import axios from "axios";

import { getErrorMessage } from "@/infra/http/httpError";
import { authRepository } from "../repositories/authRepository";

export type ResetTokenState = "checking" | "valid" | "invalid" | "error";

export const useResetPassword = (token: string) => {
  const [tokenState, setTokenState] = useState<ResetTokenState>("checking");
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    if (!token) {
      setTokenState("invalid");
      return () => {
        isActive = false;
      };
    }

    setTokenState("checking");
    setError(undefined);
    authRepository
      .validatePasswordResetToken(token)
      .then(() => {
        if (isActive) setTokenState("valid");
      })
      .catch((requestError: unknown) => {
        if (!isActive) return;

        const status = axios.isAxiosError(requestError)
          ? requestError.response?.status
          : undefined;
        setTokenState(
          status && [400, 401, 404, 410, 422].includes(status)
            ? "invalid"
            : "error",
        );
        setError(getErrorMessage(requestError));
      });

    return () => {
      isActive = false;
    };
  }, [retryCount, token]);

  const retryValidation = () => {
    setError(undefined);
    setRetryCount((count) => count + 1);
  };

  const resetPassword = async (password: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      await authRepository.resetPassword({ token, password });
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { tokenState, error, isSubmitting, resetPassword, retryValidation };
};