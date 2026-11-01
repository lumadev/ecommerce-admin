import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { useProducts } from "./hooks/useProducts";
import { ProductListItem } from "./types/product.types";

import ProductTableSkeleton from "./list/ProductTableSkeleton";
import ProductTable from "./list/ProductTable";

import EditProductDialog from "./form/dialog/EditProductDialog";
import CreateProductDialog from "./form/dialog/CreateProductDialog";

const AdminProducts = () => {
  const { productList, isLoading, updateProduct, createProduct, removeProduct } = useProducts();
  const { merchantCode } = useOutletContext<{ merchantCode?: string }>();

  const [editingProduct, setEditingProduct] = useState<ProductListItem | null>(
    null
  );
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Produtos</h2>

        <Button
          onClick={() => setCreateOpen(true)}
          className="w-full justify-center gap-2 sm:w-auto"
        >
          <Plus size={16} />
          Novo Produto
        </Button>
      </div>

      {isLoading ? (
        <ProductTableSkeleton />
      ) : productList.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        <ProductTable 
          products={productList} 
          onEdit={setEditingProduct}
          onRemove={removeProduct}
        />
      )}

      <EditProductDialog
        key={editingProduct?.id ?? "closed"}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={updateProduct}
        merchantCode={merchantCode}
      />

      <CreateProductDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createProduct}
        merchantCode={merchantCode}
      />
    </div>
  );
};

export default AdminProducts;