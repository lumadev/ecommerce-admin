import { useState } from "react";
import { Eye, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmailTemplatePreviewDialog } from "./components/EmailTemplatePreviewDialog";
import { useEmailTemplates } from "./hooks/useEmailTemplates";

const AdminEmailTemplates = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const {
    merchantCode,
    templates,
    merchant,
    isLoading,
    isError,
    refetch,
    preview,
    isPreviewLoading,
    isPreviewError,
    refetchPreview,
  } = useEmailTemplates(selectedTemplateId);

  const closePreview = (open: boolean) => {
    if (!open) {
      setSelectedTemplateId(null);
    }
  };

  if (!merchantCode) {
    return (
      <section className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Templates de e-mail
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Selecione uma loja para visualizar os templates de e-mail.
        </p>
      </section>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6">
      <header className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-primary">
              Comunicação da loja
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Templates de e-mail
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Visualize os e-mails enviados automaticamente para clientes e
              administradores.
            </p>
            {merchant && (
              <p className="mt-3 text-xs font-medium text-muted-foreground">
                Loja: <span className="text-foreground">{merchant.name}</span>
              </p>
            )}
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2].map((item) => (
            <Card key={item}>
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <section className="rounded-xl border border-destructive/30 bg-card p-6">
          <p className="font-medium text-foreground">
            Não foi possível carregar os templates desta loja.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente novamente. Se o problema continuar, entre em contato com o
            suporte.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void refetch()}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tentar novamente
          </Button>
        </section>
      ) : templates.length === 0 ? (
        <section className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <Mail className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-3 font-semibold text-foreground">
            Nenhum template disponível
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Esta loja ainda não possui templates de e-mail configurados.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="flex h-full flex-col border-border transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex-1">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Para: {template.recipient}
                </div>
                <CardTitle className="font-display text-xl">
                  {template.name}
                </CardTitle>
                <CardDescription className="leading-6">
                  {template.trigger}
                </CardDescription>
                <p className="pt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Assunto:</span>{" "}
                  {template.subject}
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Visualizar template
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <EmailTemplatePreviewDialog
        open={Boolean(selectedTemplateId)}
        preview={preview}
        isLoading={isPreviewLoading}
        isError={isPreviewError}
        onRetry={() => void refetchPreview()}
        onOpenChange={closePreview}
      />
    </main>
  );
};

export default AdminEmailTemplates;
