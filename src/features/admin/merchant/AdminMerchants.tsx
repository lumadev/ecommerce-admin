import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { useMerchants } from "./hooks/useMerchants";

import MerchantTableSkeleton from "./list/MerchantTableSkeleton";
import MerchantTable from "./list/MerchantTable";

import CreateMerchantDialog from "./form/CreateMerchantDialog";

const AdminMerchants = () => {
  const { merchantList, isLoading, createMerchant, removeMerchant } = useMerchants();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">Lojas</h2>

        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus size={16} />
          Nova Loja
        </Button>
      </div>

      {isLoading ? (
        <MerchantTableSkeleton />
      ) : merchantList.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma loja encontrada.</p>
      ) : (
        <MerchantTable
          merchants={merchantList}
          onEdit={(merchant) =>
            navigate(`/lojas/${merchant.id}/editar`)
          }
          onRemove={removeMerchant}
        />
      )}

      <CreateMerchantDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createMerchant}
      />
    </div>
  );
};

export default AdminMerchants;
