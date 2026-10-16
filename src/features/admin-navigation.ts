import {
  Package,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Store,
  Tags,
  Users,
} from "lucide-react";

export const adminNavigationItems = [
  {
    title: "Pedidos",
    description: "Acompanhe e atualize os pedidos da loja.",
    icon: ShoppingCart,
    key: "pedidos",
  },
  {
    title: "Produtos",
    description: "Cadastre produtos e mantenha o catálogo organizado.",
    icon: Package,
    key: "produtos",
  },
  {
    title: "Categorias",
    description: "Organize os produtos em categorias.",
    icon: Tags,
    key: "categorias",
  },
  {
    title: "Variantes",
    description: "Gerencie as opções das variantes da loja, como tamanhos.",
    icon: SlidersHorizontal,
    key: "variantes",
  },
  {
    title: "Destaques",
    description: "Escolha os produtos que ganham mais visibilidade.",
    icon: Star,
    key: "destaques",
  },
  {
    title: "Clientes",
    description: "Consulte os clientes cadastrados na loja.",
    icon: Users,
    key: "clientes",
  },
  {
    title: "Lojas",
    description: "Gerencie as lojas da plataforma.",
    icon: Store,
    key: "lojas",
  },
] as const;

export type AdminSection = (typeof adminNavigationItems)[number]["key"];