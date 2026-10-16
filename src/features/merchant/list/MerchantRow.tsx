import { motion } from "framer-motion";
import { Check, Copy, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { TableCell } from "@/shared/components/ui/table";
import ConfirmActionDialog from "@/shared/components/ConfirmActionDialog";
import { Merchant } from "../types/merchant.types";

interface Props {
  merchant: Merchant;
  index: number;
  onEdit: (merchant: Merchant) => void;
  onRemove: (id: string) => Promise<void> | void;
}

const CopyButton = ({ value, label }: { value: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copiar ${label}`}
      title={copied ? "Copiado!" : `Copiar ${label}`}
      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  );
};

const toUrl = (domain: string) =>
  /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;

const MerchantRow = ({ merchant, index, onEdit, onRemove }: Props) => {
  const handleRemove = () => {
    void onRemove(merchant.id);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b transition-colors hover:bg-muted/50"
    >
    <TableCell className="font-medium text-foreground">{merchant.name}</TableCell>

    <TableCell className="text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        {merchant.code}
        <CopyButton value={merchant.code} label="código" />
      </div>
    </TableCell>

    <TableCell className="text-sm text-muted-foreground">
      {merchant.email ? (
        <div className="flex items-center gap-1">
          {merchant.email}
          <CopyButton value={merchant.email} label="e-mail" />
        </div>
      ) : (
        "-"
      )}
    </TableCell>

    <TableCell className="text-sm text-muted-foreground">
      {merchant.domain ? (
        <a
          href={toUrl(merchant.domain)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {merchant.domain}
        </a>
      ) : (
        "-"
      )}
    </TableCell>

    <TableCell>
      <Badge
        variant="outline"
        className={
          merchant.isActive
            ? "border-green-500/30 bg-green-500/15 text-green-700 dark:text-green-400"
            : "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-400"
        }
      >
        {merchant.isActive ? "Ativa" : "Inativa"}
      </Badge>
    </TableCell>

    <TableCell className="text-center">
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(merchant)}
          aria-label={`Editar ${merchant.name}`}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
        >
          <Pencil size={16} />
        </button>

        <ConfirmActionDialog
          trigger={
            <button
              type="button"
              aria-label={`Excluir ${merchant.name}`}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
            >
              <Trash2 size={16} />
            </button>
          }
          title="Excluir loja?"
          description={
            <span className="block space-y-3">
              <span className="block">
                Você está prestes a excluir a loja <strong>{merchant.name}</strong>.
              </span>
              <span className="block rounded-md border border-destructive/40 bg-destructive/10 p-4 text-left text-destructive">
                <span className="block text-base font-bold">
                  ATENÇÃO: esta ação é permanente.
                </span>
                <span className="mt-1 block">
                  A loja será excluída definitivamente e não poderá ser recuperada.
                </span>
              </span>
              <span className="block">Confirme somente se deseja continuar.</span>
            </span>
          }
          confirmText="Excluir loja"
          cancelText="Cancelar"
          onConfirm={handleRemove}
        />
      </div>
    </TableCell>
    </motion.tr>
  );
};

export default MerchantRow;
