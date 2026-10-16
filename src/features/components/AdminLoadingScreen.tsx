import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PackageSearch, ShoppingBag, Sparkles } from "lucide-react";

const SLOW_HINT_DELAY_MS = 6000;

/**
 * Tela exibida enquanto a sessão de administrador está sendo verificada.
 * Evita uma tela em branco durante o cold start do backend (Render free tier),
 * que pode levar dezenas de segundos na primeira requisição.
 */
export const AdminLoadingScreen = () => {
  const [showSlowHint, setShowSlowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSlowHint(true), SLOW_HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background bg-gradient-hero p-4">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/20 shadow-glow-strong"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShoppingBag size={30} />
          </motion.div>

          <motion.span
            className="absolute -right-1 -top-1 text-primary"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={18} />
          </motion.span>
        </div>

        <h1 className="font-display text-xl font-bold text-primary">
          JOANES<span className="text-foreground">3D</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Preparando o painel administrativo
        </p>

        <div className="mt-4 flex items-center gap-1.5">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: dot * 0.2,
              }}
            />
          ))}
        </div>

        {showSlowHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 flex max-w-xs items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-xs text-muted-foreground"
          >
            <PackageSearch size={16} className="shrink-0 text-primary" />
            <span>
              Nosso servidor está "acordando" após um período inativo. Isso
              pode levar até um minuto na primeira vez.
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminLoadingScreen;
