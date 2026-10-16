import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { useCustomers } from "./hooks/useCustomers";
import { Customer } from "./types/customer.types";

import CustomerTableSkeleton from "./list/CustomerTableSkeleton";
import CustomerTable from "./list/CustomerTable";

import EditCustomerDialog from "./form/EditCustomerDialog";
import CreateCustomerDialog from "./form/CreateCustomerDialog";

const AdminCustomers = () => {
  const {
    customerList,
    isLoading,
    createCustomer,
    updateCustomer,
    removeCustomer,
  } = useCustomers();

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">Clientes</h2>

        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus size={16} />
          Novo Cliente
        </Button>
      </div>

      {isLoading ? (
        <CustomerTableSkeleton />
      ) : customerList.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
      ) : (
        <CustomerTable
          customers={customerList}
          onEdit={setEditingCustomer}
          onRemove={removeCustomer}
        />
      )}

      <EditCustomerDialog
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSave={updateCustomer}
      />

      <CreateCustomerDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createCustomer}
      />
    </div>
  );
};

export default AdminCustomers;
