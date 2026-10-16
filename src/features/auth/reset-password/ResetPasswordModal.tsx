import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CircleAlert,
  KeyRound,
  Loader2,
  MailCheck,
  X,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { PasswordField } from "../components/PasswordField";
import { useResetPassword } from "../hooks/useResetPassword";

export const ResetPasswordModal = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token")?.trim() ?? "";
  const { tokenState, error: requestError, isSubmitting, resetPassword, retryValidation } = useResetPassword(token);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState<string>();
  const [confirmationError, setConfirmationError] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);

  const closeModal = () => navigate("/");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextPasswordError = password ? undefined : "Informe uma nova senha.";
    const nextConfirmationError = !confirmation
      ? "Confirme sua nova senha."
      : password !== confirmation
        ? "As senhas informadas precisam ser iguais."
        : undefined;

    setPasswordError(nextPasswordError);
    setConfirmationError(nextConfirmationError);
    if (nextPasswordError || nextConfirmationError) return;

    if (await resetPassword(password)) setIsSuccess(true);
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    setPasswordError(undefined);
    if (confirmation && value === confirmation) setConfirmationError(undefined);
  };

  const updateConfirmation = (value: string) => {
    setConfirmation(value);
    setConfirmationError(
      value && value !== password
        ? "As senhas informadas precisam ser iguais."
        : undefined,
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/65 px-4 py-8 backdrop-blur-sm"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}
      >
        <motion.section
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          aria-labelledby={
            tokenState === "invalid"
              ? "reset-password-invalid-title"
              : "reset-password-title"
          }
          aria-modal="true"
          role="dialog"
          className="relative my-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-2xl sm:p-8"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-emerald-400 to-amber-400" />
          <button
            type="button"
            onClick={closeModal}
            aria-label="Fechar"
            className="absolute right-4 top-4 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>

          {tokenState !== "invalid" && (
            <div className="mb-7 text-center">
              <p className="text-lg font-bold text-primary">
                JOANES<span className="text-foreground">3D</span>
              </p>
              <div className="mx-auto mt-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {isSuccess ? <MailCheck size={25} /> : <KeyRound size={25} />}
              </div>
              <h1
                id="reset-password-title"
                className="mt-4 text-xl font-semibold text-foreground"
              >
                {isSuccess ? "Acesso recuperado" : "Crie uma nova senha"}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {isSuccess
                  ? "Sua senha foi atualizada. Você já pode entrar na sua conta."
                  : "Escolha uma nova senha para recuperar o acesso à sua conta."}
              </p>
            </div>
          )}

          {tokenState === "checking" && (
            <div className="flex flex-col items-center gap-3 py-4 text-sm text-muted-foreground" role="status">
              <Loader2 size={24} className="animate-spin text-primary" />
              Validando seu link de recuperação...
            </div>
          )}

          {tokenState === "invalid" && !isSuccess && (
            <div className="text-center">
              <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <CircleAlert size={22} />
              </div>
              <p
                id="reset-password-invalid-title"
                className="text-sm leading-relaxed text-muted-foreground"
              >
                Este link é inválido ou expirou. Solicite um novo link para continuar.
              </p>
              <button
                type="button"
                onClick={closeModal}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <ArrowLeft size={16} />
                Voltar para a loja
              </button>
            </div>
          )}

          {tokenState === "error" && !isSuccess && (
            <div className="text-center">
              <p role="alert" className="text-sm leading-relaxed text-destructive">
                {requestError}
              </p>
              <button
                type="button"
                onClick={() => {
                  retryValidation();
                }}
                className="mt-5 w-full rounded-lg border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {tokenState === "valid" && !isSuccess && (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <PasswordField
                id="reset-password"
                placeholder="Nova senha"
                value={password}
                onChange={updatePassword}
                error={passwordError}
              />
              <PasswordField
                id="reset-password-confirmation"
                placeholder="Confirme a nova senha"
                value={confirmation}
                onChange={updateConfirmation}
                error={confirmationError}
              />
              {requestError && (
                <p role="alert" className="text-sm text-destructive">
                  {requestError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Salvar nova senha"
                )}
              </button>
            </form>
          )}

          {isSuccess && (
            <button
              type="button"
              onClick={closeModal}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Check size={17} />
              Voltar para a loja
            </button>
          )}
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
};