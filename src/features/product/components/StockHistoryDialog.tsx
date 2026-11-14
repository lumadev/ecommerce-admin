import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useStockMovements } from "../hooks/useStockMovements";
import type { ProductListItem, StockMovement } from "../types/product.types";

interface StockHistoryDialogProps {
  product: ProductListItem;
  merchantCode?: string;
  onClose: () => void;
}

const movementLabels: Record<StockMovement["type"], string> = {
  INITIAL_STOCK: "Estoque inicial",
  ADMIN_ADJUSTMENT: "Ajuste pelo administrador",
  ORDER_DEDUCTION: "Compra aprovada",
  ORDER_RETURN: "Devolução por cancelamento",
};

const StockHistoryDialog = ({ product, merchantCode, onClose }: StockHistoryDialogProps) => {
  const { page, setPage, result, isLoading, hasError, retry } = useStockMovements(
    product.id,
    merchantCode,
  );
  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;
  const showResults = !isLoading && !hasError && result?.page === page;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden border-border bg-card text-card-foreground sm:max-w-2xl">
        <DialogHeader className="pr-6">
          <DialogTitle>Histórico de estoque</DialogTitle>
          <DialogDescription>
            Movimentações de {product.name}. Registros anteriores à ativação do histórico não estão disponíveis.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-24 overflow-y-auto" aria-live="polite">
          {isLoading && (
            <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Carregando histórico...
            </p>
          )}
          {hasError && (
            <div role="alert" className="space-y-3 py-4">
              <p className="text-sm text-destructive">Não foi possível carregar o histórico de estoque.</p>
              <Button type="button" variant="outline" onClick={retry}>Tentar novamente</Button>
            </div>
          )}
          {showResults && result.items.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">Nenhuma movimentação registrada.</p>
          )}
          {showResults && result.items.length > 0 && (
            <ul className="space-y-3">
              {result.items.map((movement) => {
                const isIncrease = movement.quantity > 0;
                const Icon = isIncrease ? ArrowUpRight : ArrowDownLeft;
                return (
                  <li key={movement.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{movementLabels[movement.type]}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(movement.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <span className={`flex shrink-0 items-center gap-1 text-sm font-semibold ${isIncrease ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {isIncrease ? "+" : ""}{movement.quantity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Estoque: {movement.stockBefore} → {movement.stockAfter}
                    </p>
                    {movement.orderId && (
                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        Pedido: {movement.orderId}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {showResults && (
          <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Anterior
            </Button>
            <span className="text-center text-sm text-muted-foreground">
              Página {page} de {totalPages} · {result.total} {result.total === 1 ? "movimentação" : "movimentações"}
            </span>
            <Button type="button" variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Próxima
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StockHistoryDialog;
