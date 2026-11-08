import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

interface AdminPageContentProps {
  contentKey: string;
  merchantCode?: string;
  isLoadingMerchants: boolean;
  requiresStoreSelection: boolean;
}

export const AdminPageContent = ({
  contentKey,
  merchantCode,
  isLoadingMerchants,
  requiresStoreSelection,
}: AdminPageContentProps) => (
  <main className="min-h-0 flex-1 overflow-y-auto p-6">
    <motion.div
      key={contentKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {requiresStoreSelection ? (
        <p className="text-sm text-muted-foreground">
          {isLoadingMerchants
            ? "Carregando a loja padrão..."
            : "Selecione uma loja para visualizar os dados."}
        </p>
      ) : (
        <Outlet context={{ merchantCode }} />
      )}
    </motion.div>
  </main>
);
