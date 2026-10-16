import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { customerRepository } from "../repositories/customerRepository";
import {
  CreateCustomerData,
  Customer,
  UpdateCustomerData,
} from "../types/customer.types";

export const useCustomers = () => {
  const { toast } = useToast();
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadCustomers = async () => {
      setIsLoading(true);

      try {
        const customers = await customerRepository.findAll(controller.signal);
        setCustomerList(customers);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        toast({ description: "Não foi possível carregar os clientes." });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      controller.abort();
    };
  }, []);

  const createCustomer = async (data: CreateCustomerData) => {
    try {
      const created = await customerRepository.create(data);
      setCustomerList((prev) => [created, ...prev]);

      toast({ variant: "success", description: "Cliente criado com sucesso." });
      return created;
    } catch (error) {
      toast({ description: "Não foi possível criar o cliente." });
      throw error;
    }
  };

  const updateCustomer = async (id: string, data: UpdateCustomerData) => {
    try {
      const updated = await customerRepository.update(id, data);
      setCustomerList((prev) => prev.map((c) => (c.id === id ? updated : c)));

      toast({ variant: "success", description: "Cliente atualizado com sucesso." });
      return updated;
    } catch (error) {
      toast({ description: "Não foi possível atualizar o cliente." });
      throw error;
    }
  };

  const removeCustomer = async (id: string) => {
    try {
      await customerRepository.remove(id);
      setCustomerList((prev) => prev.filter((c) => c.id !== id));

      toast({ variant: "success", description: "Cliente removido com sucesso." });
    } catch (error) {
      toast({ description: "Não foi possível remover o cliente." });
      throw error;
    }
  };

  return {
    customerList,
    isLoading,
    createCustomer,
    updateCustomer,
    removeCustomer,
  };
};
