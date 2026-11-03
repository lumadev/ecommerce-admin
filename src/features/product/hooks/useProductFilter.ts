import { useMemo, useState } from "react";
import { ProductListItem } from "../types/product.types";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const matchesQuery = (product: ProductListItem, query: string) => {
  const priceFormatted = product.price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });

  const searchable = [
    product.name,
    product.description,
    ...product.categories.map((category) => category.name),
    String(product.price),
    priceFormatted,
  ];

  return searchable.some((text) => normalize(text ?? "").includes(query));
};

export const useProductFilter = (products: ProductListItem[]) => {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const query = normalize(search);
    if (!query) return products;
    return products.filter((product) => matchesQuery(product, query));
  }, [products, search]);

  return { search, setSearch, filteredProducts };
};
