import { useEffect, useState } from "react";
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
}: EmailTemplatePreviewDialogProps) => {
  const [loadedPreview, setLoadedPreview] =
    useState<AdminEmailTemplatePreview | null>(null);
  const isFrameLoading = Boolean(preview && loadedPreview !== preview);

  useEffect(() => {
    if (!open) {
      setLoadedPreview(null);
    }
  }, [open]);

  return (
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

        <div
          className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-background"
          aria-busy={isLoading || isFrameLoading}
        >
          {preview && !isError && (
            <iframe
              key={preview.id}
              title={`Prévia do e-mail: ${preview.name}`}
              srcDoc={preview.html}
              sandbox=""
              referrerPolicy="no-referrer"
              onLoad={() => setLoadedPreview(preview)}
              className={`absolute inset-0 h-full w-full bg-background transition-opacity duration-150 ${
                isFrameLoading ? "opacity-0" : "opacity-100"
              }`}
            />
          )}

          {isError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background text-center">
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
          ) : isLoading || isFrameLoading ? (
            <div
              role="status"
              className="absolute inset-0 z-10 flex items-center justify-center bg-background text-sm text-muted-foreground"
            >
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Carregando prévia...
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
