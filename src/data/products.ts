import productVaso from "@/assets/product-vaso.jpg";
import productLuminaria from "@/assets/product-luminaria.jpg";
import productSuporte from "@/assets/product-suporte.jpg";
import productOrganizador from "@/assets/product-organizador.jpg";
import productDragao from "@/assets/product-dragao.jpg";
import productChaveiro from "@/assets/product-chaveiro.jpg";

export type ProductMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  image: string;
  media?: ProductMedia[];
  categories: string[];
  customizable: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Vaso Geométrico",
    description: "Vaso decorativo com design geométrico moderno, perfeito para suculentas e plantas pequenas.",
    price: 49.90,
    image: productVaso,
    media: [
      { type: "image", src: productVaso },
      { type: "video", src: "https://samplelib.com/preview/mp4/sample-5s.mp4", poster: productVaso },
    ],
    categories: ["Decoração"],
    customizable: true,
  },
  {
    id: "2",
    name: "Luminária Lunar",
    description: "Luminária em formato de lua com detalhes realistas de crateras. Iluminação LED inclusa.",
    price: 89.90,
    image: productLuminaria,
    categories: ["Iluminação", "Decoração"],
    customizable: true,
  },
  {
    id: "3",
    name: "Suporte para Fone",
    description: "Suporte elegante para headset com design minimalista e encaixe universal.",
    price: 39.90,
    image: productSuporte,
    categories: ["Acessórios"],
    customizable: false,
  },
  {
    id: "4",
    name: "Organizador de Mesa",
    description: "Organizador modular para escritório com compartimentos para canetas, celular e cartões.",
    price: 59.90,
    image: productOrganizador,
    categories: ["Escritório"],
    customizable: true,
  },
  {
    id: "5",
    name: "Miniatura de Dragão",
    description: "Miniatura articulada de dragão com alto nível de detalhe. Ideal para colecionadores.",
    price: 79.90,
    image: productDragao,
    categories: ["Colecionáveis"],
    customizable: false,
  },
  {
    id: "6",
    name: "Porta-Chaves Personalizado",
    description: "Porta-chaves com formato customizável. Adicione seu nome ou símbolo favorito.",
    price: 24.90,
    image: productChaveiro,
    categories: ["Acessórios"],
    customizable: true,
  },
];
