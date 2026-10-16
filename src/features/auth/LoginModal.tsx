import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthForm } from "./components/AuthForm";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-8 shadow-2xl"
          >
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4"
            >
              <X size={20} />
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-primary">
                JOANES<span className="text-foreground">3D</span>
              </h2>

              {!isForgotPassword && (
                <p className="text-sm text-muted-foreground mt-2">
                  {isSignUp
                    ? "Crie sua conta para começar"
                    : "Entre na sua conta"}
                </p>
              )}
            </div>

            <AuthForm
              isSignUp={isSignUp}
              isForgotPassword={isForgotPassword}
              onToggleMode={() => setIsSignUp(!isSignUp)}
              onForgotPassword={() => setIsForgotPassword(true)}
              onBackToLogin={() => setIsForgotPassword(false)}
              onLoginSucess={() => onOpenChange(false)}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;