import { AuthLoginForm } from "../login/AuthLoginForm";
import { AuthSignupForm } from "../signup/AuthSignupForm";
import { AuthForgotPasswordForm } from "../forgot-password/AuthForgotPasswordForm";

interface AuthFormProps {
  isSignUp: boolean;
  isForgotPassword: boolean;
  onToggleMode: () => void;
  onForgotPassword: () => void;
  onBackToLogin: () => void;
  onLoginSucess: () => void;
}

export const AuthForm = ({
  isSignUp,
  isForgotPassword,
  onToggleMode,
  onForgotPassword,
  onBackToLogin,
  onLoginSucess,
}: AuthFormProps) => {
  if (isForgotPassword) {
    return <AuthForgotPasswordForm onBack={onBackToLogin} />;
  }

  if (isSignUp) {
    return (
      <AuthSignupForm
        onToggleMode={onToggleMode}
        onLoginSucess={onLoginSucess}
      />
    );
  }

  return (
    <AuthLoginForm
      onToggleMode={onToggleMode}
      onForgotPassword={onForgotPassword}
      onLoginSucess={onLoginSucess}
    />
  );
};