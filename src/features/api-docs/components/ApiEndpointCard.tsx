import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ApiEndpoint } from "../api-docs.types";
import CodeExample from "./CodeExample";

interface ApiEndpointCardProps {
  endpoint: ApiEndpoint;
}

const ApiEndpointCard = ({ endpoint }: ApiEndpointCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const contentId = `endpoint-content-${endpoint.id}`;

  return (
    <article
      id={endpoint.id}
      className="scroll-mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="flex w-full items-center justify-between gap-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent px-5 py-4 text-left transition hover:from-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-6"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
              {endpoint.method}
            </span>
            <code className="min-w-0 break-all font-mono text-sm font-semibold text-foreground">
              {endpoint.path}
            </code>
          </span>
          <span className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span>
              <span role="heading" aria-level={3} className="block font-display font-bold text-foreground">
                {endpoint.title}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {endpoint.summary}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              {endpoint.access}
            </span>
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={contentId}
        hidden={!isExpanded}
        className="space-y-5 px-5 py-5 sm:px-6"
      >
        {endpoint.details.length > 0 && (
          <dl className="divide-y divide-border">
            {endpoint.details.map((detail) => (
              <div
                key={detail.label}
                className="grid gap-1 py-3 first:pt-0 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4"
              >
                <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {detail.label}
                </dt>
                <dd className="min-w-0 text-sm">
                  <code className="font-mono font-semibold text-foreground">
                    {detail.value}
                  </code>
                  <span className="ml-2 text-muted-foreground">
                    {detail.description}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="grid gap-4 xl:grid-cols-2">
          <CodeExample
            title="Exemplo de requisição"
            value={endpoint.request}
            label="exemplo de requisição"
            variant="request"
          />
          <CodeExample
            title="Exemplo de resposta"
            value={endpoint.response}
            label="exemplo de resposta"
            variant="response"
          />
        </div>
      </div>
    </article>
  );
};

export default ApiEndpointCard;
