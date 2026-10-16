import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { Category } from "@/data/categories";
import { useCategories } from "./hooks/useCategories";

import CategoryTableSkeleton from "./list/CategoryTableSkeleton";
import CategoryTable from "./list/CategoryTable";

import EditCategoryDialog from "./form/EditCategoryDialog";
import CreateCategoryDialog from "./form/CreateCategoryDialog";

const AdminCategories = () => {
  const { categoryList, isLoading, updateCategory, createCategory, removeCategory } = useCategories();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">Categorias</h2>

        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus size={16} />
          Nova Categoria
        </Button>
      </div>

      {isLoading ? (
        <CategoryTableSkeleton />
      ) : categoryList.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada.</p>
      ) : (
        <CategoryTable 
          categories={categoryList} 
          onEdit={setEditingCategory}
          onRemove={removeCategory}
        />
      )}

      <EditCategoryDialog
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={updateCategory}
      />

      <CreateCategoryDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createCategory}
      />
    </div>
  );
};

export default AdminCategories;
