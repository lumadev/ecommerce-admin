import { useState } from "react";
import {
  BookOpen,
  Check,
  Clipboard,
  Tag,
} from "lucide-react";

const API_BASE_URL = "https://ecommerce-3d-back.onrender.com/api/";

const endpoints = [
  {
    id: "list",
    method: "GET",
    path: "/categories?merchantCode={merchantCode}",
    title: "Listar categorias",
    summary: "Retorna as categorias públicas que o e-commerce pode exibir.",
    access: "Endpoint público",
    details: [
      { label: "Query param", value: "merchantCode", description: "Código da loja. Obrigatório." },
    ],
    request: `curl -X GET "${API_BASE_URL}categories?merchantCode=minha-loja" \\
  -H "Accept: application/json"`,
    response: `[
  {
    "id": "f64f13f7-c7d8-4f2b-bcd2-45cca3408966",
    "merchantId": "0c2c334a-100f-4356-9ba9-0ffaf5527b05",
    "name": "Brinquedo",
    "description": null,
    "hashtags": [
      "brinquedos"
    ],
    "picturePublicId": null,
    "createdAt": "2026-10-05T18:03:10.659Z",
    "updatedAt": "2026-10-05T18:03:10.659Z",
    "url": null
  },
  {
    "id": "d5cc447d-a606-4b38-95bf-330e6be604d7",
    "merchantId": "0c2c334a-100f-4356-9ba9-0ffaf5527b05",
    "name": "Decoração",
    "description": "Itens para decoração ou armazenamento.",
    "hashtags": [
      "decoracao",
      "armazenamento"
    ],
    "picturePublicId": null,
    "createdAt": "2026-10-05T00:59:14.939Z",
    "updatedAt": "2026-10-05T00:59:14.939Z",
    "url": null
  },
  {
    "id": "c857123e-4769-47e5-8e92-817b779fc555",
    "merchantId": "0c2c334a-100f-4356-9ba9-0ffaf5527b05",
    "name": "Música",
    "description": "Produtos musicais",
    "hashtags": [
      "Música",
      "palheta",
      "portapalheta"
    ],
    "picturePublicId": null,
    "createdAt": "2026-09-20T01:50:28.580Z",
    "updatedAt": "2026-09-20T01:50:28.580Z",
    "url": null
  }
]`,
  },
  {
    id: "find-one",
    method: "GET",
    path: "/categories/{id}",
    title: "Buscar categoria",
    summary: "Retorna os dados públicos de uma categoria específica pelo ID.",
    access: "Endpoint público",
    details: [
      { label: "Path param", value: "id", description: "Identificador da categoria. Obrigatório." },
    ],
    request: `curl -X GET "${API_BASE_URL}categories/categoria_123" \\
  -H "Accept: application/json"`,
    response: `{
  "id": "categoria_123",
  "name": "Acessórios",
  "description": "Acessórios para o dia a dia",
  "picturePublicId": "categories/acessorios",
  "url": "https://exemplo.com/imagem.jpg",
  "hashtags": ["novidades", "acessorios"]
}`,
  },
];

const CopyButton = ({ value, id }: { value: string; id: string }) => {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={copyValue}
      aria-label={copied ? "Copiado" : `Copiar ${id}`}
      title={copied ? "Copiado" : `Copiar ${id}`}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
    >
      {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
    </button>
  );
};

const ApiDocumentationPage = () => (
  <main className="-mx-6 -my-6 min-h-full bg-[#f3f5f1] text-slate-900">
    <header className="border-b border-slate-800 bg-[#182b2a] px-6 py-9 text-white sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-emerald-300">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Central de integração
        </div>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              API para seu e-commerce
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Documentação para o lojista integrar o e-commerce da sua loja. Aqui estão
              somente os métodos públicos de consulta que podem ser usados pela loja virtual.
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-md border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            API de categorias
          </div>
        </div>
      </div>
    </header>

    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-10">
      <aside className="h-fit border-b border-slate-200 pb-5 lg:sticky lg:top-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
        <p className="mb-3 text-xs font-bold uppercase text-slate-500">Recursos</p>
        <a
          href="#categories"
          className="flex items-center gap-2 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
        >
          <Tag className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          Categorias
          <span className="ml-auto text-xs text-slate-500">2</span>
        </a>
        <div className="mt-6 space-y-1">
          <p className="mb-2 text-xs font-bold uppercase text-slate-500">Nesta página</p>
          {endpoints.map((endpoint) => (
            <a
              key={endpoint.id}
              href={`#${endpoint.id}`}
              className="block rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <span className="mr-2 font-mono text-[10px] font-bold text-emerald-800">
                {endpoint.method}
              </span>
              {endpoint.title}
            </a>
          ))}
        </div>
      </aside>

      <div className="min-w-0">
        <section id="categories" className="mb-8 scroll-mt-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
              <Tag className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">Categorias</h2>
              <p className="text-sm text-slate-600">Gerencie e consulte as categorias do catálogo.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-l-2 border-emerald-700 pl-4 sm:flex-row sm:items-center sm:gap-4">
            <span className="text-xs font-bold uppercase text-slate-500">Base URL</span>
            <code className="w-fit max-w-full overflow-x-auto rounded bg-white px-2.5 py-1.5 font-mono text-xs text-slate-800 ring-1 ring-slate-200">
              {API_BASE_URL}
            </code>
            <span className="text-xs text-slate-500">URL base dos endpoints documentados para integração da loja virtual.</span>
          </div>
        </section>

        <div className="space-y-5">
          {endpoints.map((endpoint) => (
            <article
              key={endpoint.id}
              id={endpoint.id}
              className="scroll-mt-6 border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-emerald-100 px-2 py-1 font-mono text-xs font-bold text-emerald-900">
                    {endpoint.method}
                  </span>
                  <code className="min-w-0 break-all font-mono text-sm font-semibold text-slate-800">
                    {endpoint.path}
                  </code>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{endpoint.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{endpoint.summary}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    {endpoint.access}
                  </span>
                </div>
              </div>

              <div className="space-y-5 px-5 py-5 sm:px-6">
                {endpoint.details.length > 0 && (
                  <dl className="divide-y divide-slate-100">
                    {endpoint.details.map((detail) => (
                      <div key={detail.label} className="grid gap-1 py-3 first:pt-0 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
                        <dt className="text-xs font-bold uppercase text-slate-500">{detail.label}</dt>
                        <dd className="min-w-0 text-sm">
                          <code className="font-mono font-semibold text-slate-900">{detail.value}</code>
                          <span className="ml-2 text-slate-600">{detail.description}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="grid gap-4 xl:grid-cols-2">
                  <section className="min-w-0">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h4 className="text-xs font-bold uppercase text-slate-500">Exemplo de requisição</h4>
                      <CopyButton value={endpoint.request} id="exemplo de requisição" />
                    </div>
                    <pre className="overflow-x-auto rounded-md bg-[#182b2a] p-4 text-xs leading-5 text-emerald-50"><code>{endpoint.request}</code></pre>
                  </section>
                  <section className="min-w-0">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h4 className="text-xs font-bold uppercase text-slate-500">Exemplo de resposta</h4>
                      <CopyButton value={endpoint.response} id="exemplo de resposta" />
                    </div>
                    <pre className="overflow-x-auto rounded-md bg-slate-100 p-4 text-xs leading-5 text-slate-800"><code>{endpoint.response}</code></pre>
                  </section>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Os exemplos de resposta ilustram o formato dos dados. Valores e códigos de resposta podem variar conforme a categoria e a configuração da API.
        </p>
      </div>
    </div>
  </main>
);

export default ApiDocumentationPage;