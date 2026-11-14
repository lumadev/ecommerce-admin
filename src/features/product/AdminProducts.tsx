import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { Input } from "@/shared/components/ui/input";
import { useProducts } from "./hooks/useProducts";
import { useProductFilter } from "./hooks/useProductFilter";
import { ProductListItem } from "./types/product.types";

import ProductTableSkeleton from "./list/ProductTableSkeleton";
import ProductTable from "./list/ProductTable";

import EditProductDialog from "./form/dialog/EditProductDialog";
import CreateProductDialog from "./form/dialog/CreateProductDialog";
import StockHistoryDialog from "./components/StockHistoryDialog";

const AdminProducts = () => {
  const { productList, isLoading, updateProduct, createProduct, removeProduct } = useProducts();
  const { merchantCode } = useOutletContext<{ merchantCode?: string }>();
  const { search, setSearch, filteredProducts } = useProductFilter(productList);

  const [editingProduct, setEditingProduct] = useState<ProductListItem | null>(
    null
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [historyProduct, setHistoryProduct] = useState<ProductListItem | null>(null);

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

      <div className="relative mb-4 sm:max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome, descrição, categoria ou preço"
          aria-label="Buscar produtos"
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <ProductTableSkeleton />
      ) : filteredProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        <ProductTable 
          products={filteredProducts} 
          onEdit={setEditingProduct}
          onHistory={setHistoryProduct}
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

      {historyProduct && (
        <StockHistoryDialog
          key={`${merchantCode}-${historyProduct.id}`}
          product={historyProduct}
          merchantCode={merchantCode}
          onClose={() => setHistoryProduct(null)}
        />
      )}
    </div>
  );
};

export default AdminProducts;