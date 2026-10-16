import { useState } from "react";
import { ArrowLeft, Check, Loader2, Mail, MailCheck, Sparkles } from "lucide-react";

import { getErrorMessage } from "@/infra/http/httpError";
import { useToast } from "@/hooks/use-toast";
import { isValidEmail } from "@/lib/validation";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { InputField } from "../components/InputField";

interface AuthForgotPasswordFormProps {
  onBack: () => void;
}

export const AuthForgotPasswordForm = ({ onBack }: AuthForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);
  const { forgotPassword, isLoading } = useForgotPassword();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Preencha um email válido");
      return;
    }

    try {
      await forgotPassword({ email: email.trim() });
      setIsSuccess(true);
    } catch (err) {
      toast({ description: getErrorMessage(err) });
    }
  };

  const handleChange = (value: string) => {
    setEmail(value);
    if (isValidEmail(value)) setError(undefined);
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck size={34} strokeWidth={1.6} />
          <span className="absolute -right-1 -top-1 flex size-8 items-center justify-center rounded-full border-4 border-card bg-emerald-500 text-white">
            <Check size={14} strokeWidth={3} />
          </span>
          <Sparkles size={16} className="absolute -left-4 top-1 text-amber-500" />
          <Sparkles size={12} className="absolute -bottom-1 -right-4 text-primary/70" />
        </div>

        <h3 className="text-xl font-semibold text-foreground">
          Confira seu email
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Enviamos as instruções de recuperação para
        </p>
        <div className="mt-4 break-all rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground">
          {email.trim()}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Se este endereço estiver cadastrado, a mensagem chegará em instantes.
          Dê uma olhada também na pasta de spam.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft size={16} />
          Voltar para entrar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 text-center">
        <h3 className="text-xl font-semibold text-foreground">Recupere seu acesso</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Vamos enviar um link para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <InputField
          id="forgot-password-email"
          icon={<Mail size={16} />}
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          autoComplete="off"
          error={error}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "Enviar"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <ArrowLeft size={14} />
          Voltar
        </button>
      </div>
    </>
  );
};
