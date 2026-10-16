import type { RoadmapTask } from "./types/roadmap.types";

export const todoTasks: RoadmapTask[] = [
  {
    id: "1",
    title: "Criar lógica de Ordens",
    note: "Necessário concluir o checkout do ecommerce.",
  },
  {
    id: "2",
    title: "Criar lógica de relatório mensal",
    note: "Com filtros de produto consignado.",
  },
  {
    id: "4",
    title: "Cadastrar variante \"Código\" para a loja Mili",
    note: "Testar se vincula corretamente no cadastro do produto. O código não será obrigatório.",
  },
  {
    id: "6",
    title: "Criar lógica do produto consignado",
    note: "Backend e frontend.",
  },
  {
    id: "9",
    title: "Definir vínculo do Cloudinary e do Resend à loja",
    note: "Cloudinary para fotos e Resend para e-mails.",
  },
  {
    id: "10",
    title: "Criar documentação dos endpoints do ecommerce backend",
  },
  {
    id: "11",
    title: "Lógica de observabilidade da aplicação",
  },
  {
    id: "13",
    title: "Criar tema ADMIN para a loja Mili Babystore",
  },
  {
    id: "14",
    title: "Fazer o deploy da área Admin em outro projeto",
    note: "O domínio irá mudar.",
  },
  { id: "15", title: "Testar cadastro de variantes em produto" },
  { id: "16", title: "Pensar em forma de dar baixa em Produtos (físicos)" },
];

export const doneTasks: RoadmapTask[] = [
  { id: "3", title: "Criar área para cadastro de Tamanhos", note: "Na área ADMIN." },
  { id: "10", title: "Criar lógica de Tamanho no backend" },
  {
    id: "11",
    title: "Criar área de \"impersonate\"",
    note: "Permite ver o ADMIN com a visão de diferentes lojistas.",
  },
  {
    id: "12",
    title: "Criar área de gerenciamento de lojas",
    note: "Permite cadastrar variantes na loja Milii BabyStore.",
  },
];
