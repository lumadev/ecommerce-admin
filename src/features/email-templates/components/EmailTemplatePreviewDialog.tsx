import { LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { AdminEmailTemplatePreview } from "../types/email-template.types";

interface EmailTemplatePreviewDialogProps {
  open: boolean;
  preview?: AdminEmailTemplatePreview;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onOpenChange: (open: boolean) => void;
}

export const EmailTemplatePreviewDialog = ({
  open,
  preview,
  isLoading,
  isError,
  onRetry,
  onOpenChange,
}: EmailTemplatePreviewDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="flex h-[94vh] w-[96vw] !max-w-[1280px] flex-col gap-4 p-4 sm:p-6">
      <DialogHeader className="shrink-0 pr-8">
        <DialogTitle>{preview?.name ?? "Prévia do template"}</DialogTitle>
        <DialogDescription>
          {preview
            ? `Assunto: ${preview.subject}`
            : "Visualização do e-mail enviado pela loja."}
        </DialogDescription>
      </DialogHeader>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          Carregando prévia...
        </div>
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-destructive">
            Não foi possível carregar a prévia deste template.
          </p>
          <button
            type="button"
            className="text-sm font-medium text-primary underline underline-offset-4"
            onClick={onRetry}
          >
            Tentar novamente
          </button>
        </div>
      ) : preview ? (
        <iframe
          title={`Prévia do e-mail: ${preview.name}`}
          srcDoc={preview.html}
          sandbox=""
          referrerPolicy="no-referrer"
          className="min-h-0 flex-1 rounded-md border border-border bg-white"
        />
      ) : null}
    </DialogContent>
  </Dialog>
);
