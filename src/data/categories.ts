import catDecoracao from "@/assets/cat-decoracao.jpg";
import catAcessorios from "@/assets/cat-acessorios.jpg";
import catMiniaturas from "@/assets/cat-miniaturas.jpg";
import catIluminacao from "@/assets/cat-iluminacao.jpg";
import catEscritorio from "@/assets/cat-escritorio.jpg";
import catPersonalizados from "@/assets/cat-personalizados.jpg";

export interface Category {
  id: string;
  name: string;
  description: string;
  picturePublicId: string;
  url?: string;
  hashtags: string[];
}

export const categories: Category[] = [
  {
    id: "decoracao",
    name: "Decoração",
    description: "Peças decorativas únicas para transformar ambientes com design " +
    "moderno e geométrico.",
    picturePublicId: catDecoracao,
    url: catDecoracao,
    hashtags: ["Vasos geométricos", "Esculturas", "Quadros 3D", "Porta-retratos"],
  },
  {
    id: "iluminacao",
    name: "Iluminação",
    description: "Luminárias artísticas com designs exclusivos e iluminação LED integrada.",
    picturePublicId: catIluminacao,
    url: catIluminacao,
    hashtags: ["Luminária Lunar", "Abajures", "Luminárias de mesa", "Luz noturna"],
  },
  {
    id: "acessorios",
    name: "Acessórios Gamer & Tech",
    description: "Suportes, organizadores e acessórios para seu setup gamer e tecnológico.",
    picturePublicId: catAcessorios,
    url: catAcessorios,
    hashtags: ["Suporte para headset", "Dock para controle", "Organizador de cabos"],
  },
  {
    id: "miniaturas",
    name: "Miniaturas & Colecionáveis",
    description: "Figuras detalhadas e articuladas para colecionadores e jogadores de RPG.",
    picturePublicId: catMiniaturas,
    url: catMiniaturas,
    hashtags: ["Dragões", "Personagens RPG", "Figuras de ação", "Cenários"],
  },
  {
    id: "escritorio",
    name: "Escritório",
    description: "Organizadores modulares e acessórios práticos para um escritório produtivo.",
    picturePublicId: catEscritorio,
    url: catEscritorio,
    hashtags: ["Porta-canetas", "Suporte celular", "Organizador modular"],
  },
  {
    id: "personalizados",
    name: "Personalizados",
    description: "Produtos sob medida com seu nome, logo ou design exclusivo.",
    picturePublicId: catPersonalizados,
    url: catPersonalizados,
    hashtags: ["Chaveiros com nome", "Placas personalizadas", "Presentes únicos"],
  },
];
