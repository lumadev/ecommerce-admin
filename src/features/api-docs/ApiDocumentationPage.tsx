import { BookOpen, Tag } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { API_BASE_URL, getApiEndpoints } from "./api-docs.data";
import ApiEndpointCard from "./components/ApiEndpointCard";

interface AdminOutletContext {
  merchantCode?: string;
}

const ApiDocumentationPage = () => {
  const { merchantCode } = useOutletContext<AdminOutletContext>();
  const endpoints = merchantCode ? getApiEndpoints(merchantCode) : [];

  return (
    <main className="-mx-6 -my-6 min-h-full bg-background text-foreground">
      <header className="border-b border-primary/20 bg-gradient-to-br from-slate-950 via-[#123f3b] to-primary px-6 py-8 text-white sm:px-8 lg:py-10">
        <div className="mx-auto max-w-none">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-200">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Central de integração
          </div>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                API para seu e-commerce
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200 sm:text-base">
                Documentação dos endpoints públicos usados para integrar o e-commerce da sua loja.
                Os exemplos de requisição usam automaticamente o código da loja selecionada no painel.
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200/30 bg-emerald-200/10 px-3.5 py-2 text-sm font-medium text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
              Endpoints públicos
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-none gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-8">
        <aside className="h-fit border-b border-border pb-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain lg:border-b-0 lg:pb-0 lg:pr-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Recursos
          </p>
          <a
            href="#public-endpoints"
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary ring-1 ring-primary/15 transition hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Tag className="h-4 w-4" aria-hidden="true" />
            Endpoints
            <span className="ml-auto rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
              {endpoints.length}
            </span>
          </a>
          <div className="mt-6 space-y-1">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Nesta página
            </p>
            {endpoints.map((endpoint) => (
              <a
                key={endpoint.id}
                href={`#${endpoint.id}`}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="mr-2 font-mono text-[10px] font-bold text-primary">
                  {endpoint.method}
                </span>
                {endpoint.title}
              </a>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <section id="public-endpoints" className="mb-8 scroll-mt-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Tag className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold">Endpoints públicos</h2>
                <p className="text-sm text-muted-foreground">
                  Consulte o catálogo, autentique clientes e acompanhe pedidos da loja.
                </p>
              </div>
            </div>
            {merchantCode ? (
              <div className="flex flex-col gap-2 rounded-xl border border-primary/15 bg-primary/5 p-4 sm:flex-row sm:items-center sm:gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Base URL
                </span>
                <code className="w-fit max-w-full overflow-x-auto rounded-md bg-card px-2.5 py-1.5 font-mono text-xs text-foreground ring-1 ring-border">
                  {API_BASE_URL}
                </code>
                <span className="text-xs text-muted-foreground">
                  Os exemplos usam{" "}
                  <code className="font-mono">merchantCode={merchantCode}</code> quando a rota
                  exige o código. As rotas de checkout que identificam a loja pelos produtos ou
                  pela chave não recebem esse parâmetro.
                </span>
              </div>
            ) : (
              <p
                role="status"
                className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground"
              >
                Não foi possível identificar a loja selecionada. Selecione uma loja para carregar
                exemplos de requisição com o código correto.
              </p>
            )}
          </section>

          <div className="space-y-5">
            {endpoints.map((endpoint) => (
              <ApiEndpointCard key={endpoint.id} endpoint={endpoint} />
            ))}
          </div>

          {endpoints.length > 0 && (
            <p className="mt-5 text-xs leading-5 text-muted-foreground">
              Os exemplos de resposta ilustram o formato dos dados. Os endpoints de cadastro de
              cliente e solicitação de encomenda estão marcados como em manutenção na API.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ApiDocumentationPage;
