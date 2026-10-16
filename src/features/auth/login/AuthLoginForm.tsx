import { useState } from "react";
import { Loader2, Mail } from "lucide-react";

import { getErrorMessage } from "@/infra/http/httpError";
import { useToast } from "@/hooks/use-toast";
import { isValidEmail } from "@/lib/validation";
import { useAuth } from "../hooks/useAuth";
import { InputField } from "../components/InputField";
import { PasswordField } from "../components/PasswordField";

interface AuthLoginFormProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
  onLoginSucess: () => void;
}

export const AuthLoginForm = ({ onToggleMode, onForgotPassword, onLoginSucess }: AuthLoginFormProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: typeof errors = {};
    if (!isValidEmail(formData.email)) {
      nextErrors.email = "Preencha um email válido";
    }
    if (!formData.password) {
      nextErrors.password = "Preencha sua senha";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      toast({ variant: "success", description: "Login realizado com sucesso." });

      onLoginSucess(); // closes modal
    } catch (error) {
      toast({ description: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (field === "email" && isValidEmail(value)) {
        return { ...prev, email: undefined };
      }
      if (field === "password" && value.length > 0) {
        return { ...prev, password: undefined };
      }
      return prev;
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        <InputField
          id="login-email"
          icon={<Mail size={16} />}
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={updateFormData("email")}
          autoComplete="off"
          error={errors.email}
        />

        <PasswordField
          id="login-password"
          value={formData.password}
          onChange={updateFormData("password")}
          error={errors.password}
        />

        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-primary hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <button
          onClick={onToggleMode}
          className="font-medium text-primary hover:underline"
        >
          Criar conta
        </button>
      </div>
    </>
  );
};