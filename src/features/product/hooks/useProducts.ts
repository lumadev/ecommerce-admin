import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { productRepository } from "../repositories/productRepository";
import {
  CreateProductData,
  ProductListItem,
  UpdateProductData,
} from "../types/product.types";

export const useProducts = () => {
  const { toast } = useToast();
  const [productList, setProductList] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setIsLoading(true);

      try {
        const products = await productRepository.findAll(controller.signal);
        setProductList(products);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        toast({ description: "Nao foi possível carregar os produtos." });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  const updateProduct = async (id: string, data: UpdateProductData) => {
    try {
      const updated = await productRepository.update(id, data);

      setProductList((prev) =>
        prev.map((p) => {
          if (p.id !== id) {
            return p;
          }
          return updated;
        })
      );

      toast({ variant: "success", description: "Produto atualizado com sucesso." });
      return updated;
    } catch (error) {
      toast({ description: "Não foi possível atualizar o produto." });
      throw error;
    }
  };

  const createProduct = async (data: CreateProductData) => {
    try {
      const created = await productRepository.create(data);
      const createdProduct: ProductListItem = {
        ...created,
        categories: [],
      };

      setProductList((prev) => [createdProduct, ...prev]);

      toast({ variant: "success", description: "Produto criado com sucesso." });
      return createdProduct;
    } catch (error) {
      toast({ description: "Não foi possível criar o produto." });
      throw error;
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await productRepository.remove(id);
      setProductList((prev) => prev.filter((p) => p.id !== id));

      toast({ variant: "success", description: "Produto removido com sucesso." });
    } catch (error) {
      toast({ description: "Não foi possível remover o produto." });
      throw error;
    }
  };

  return {
    productList,
    isLoading,
    updateProduct,
    createProduct,
    removeProduct,
  };
};