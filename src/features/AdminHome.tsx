import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { useAdminAuth } from "@/features/auth/hooks/useAdminAuth";
import { adminNavigationItems } from "@/features/admin-navigation";

const AdminHome = () => {
  const { user } = useAdminAuth();
  const navigationItems = adminNavigationItems
    .filter((item) => item.key !== "lojas" || user?.role === "SUPER_ADMIN")
    .map((item) => ({ ...item, path: `/${item.key}` }));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section aria-labelledby="admin-quick-access-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Navegação
            </p>
            <h2
              id="admin-quick-access-title"
              className="mt-1 text-lg font-semibold text-foreground"
            >
              Acesso rápido
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {navigationItems.length} áreas
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {navigationItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className="group flex min-h-36 flex-col rounded-md border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <ArrowUpRight
                  className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Seu catálogo começa pelos produtos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Atualize itens e organize a vitrine da sua loja.
          </p>
        </div>
        <Link
          to="/produtos"
          className="inline-flex min-h-10 items-center gap-2 self-start text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:self-auto"
        >
          Gerenciar produtos
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
};

export default AdminHome;