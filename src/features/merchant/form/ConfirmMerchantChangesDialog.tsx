import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button/button";
import { MerchantChange } from "./getMerchantChanges";

interface Props {
  open: boolean;
  changes: MerchantChange[];
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmMerchantChangesDialog = ({
  open,
  changes,
  isLoading,
  onCancel,
  onConfirm,
}: Props) => {
  const statusChange = changes.find((c) => c.label === "Status");

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !isLoading && onCancel()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto border-border bg-card text-card-foreground sm:max-w-[760px]">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl">Dados Alterados</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Revise as alterações antes de salvar.
          </DialogDescription>
        </DialogHeader>

        {statusChange && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-400"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              O status da loja será alterado de <strong>{statusChange.before}</strong>{" "}
              para <strong>{statusChange.after}</strong>.
            </span>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="w-[22%] px-4 py-3 font-medium">Campo</th>
                <th className="w-[39%] px-4 py-3 font-medium">Antes</th>
                <th className="w-[39%] px-4 py-3 font-medium">Depois</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {changes.map((change) => (
                <tr key={change.label} className="align-top">
                  <td className="px-4 py-3 font-medium text-foreground">{change.label}</td>
                  <td className="break-words px-4 py-3 text-muted-foreground line-through decoration-muted-foreground/50">
                    {change.before}
                  </td>
                  <td className="break-words bg-green-500/5 px-4 py-3 font-medium text-green-700 dark:text-green-400">
                    {change.after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DialogFooter className="border-t border-border pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Voltar
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Salvando..." : "Confirmar e Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmMerchantChangesDialog;
