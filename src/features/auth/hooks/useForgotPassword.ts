import { useState } from "react";
import { authRepository } from "../repositories/authRepository";
import { ForgotPasswordData } from "../types/auth.types";

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const forgotPassword = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    try {
      await authRepository.forgotPassword(data);
    } finally {
      setIsLoading(false);
    }
  };

  return { forgotPassword, isLoading };
};
