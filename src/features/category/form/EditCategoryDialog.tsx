import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/data/categories";
import { CategoryFormState } from "@/features//category/types/category-form.types";
import { UpdateCategoryData } from "@/features//category/types/category.types";

import CategoryForm from "./CategoryForm";

interface Props {
  category: Category | null;
  onClose: () => void;
  onSave: (id: string, category: UpdateCategoryData) => Promise<UpdateCategoryData>;
}

const emptyForm: CategoryFormState = {
  name: "",
  description: "",
  url: "",
  picturePublicId: "",
  hashtags: [],
};

const toFormState = (c: Category | null): CategoryFormState => ({
  name: c?.name ?? "",
  description: c?.description ?? "",
  picturePublicId: c?.picturePublicId ?? "",
  url: c?.url ?? "",
  hashtags: c?.hashtags ?? [],
});

const EditCategoryDialog = ({ category, onClose, onSave }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState<CategoryFormState>(() => toFormState(category));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setForm(toFormState(category));
  }, [category]);

  const isBusy = isLoading;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSaveEdit();
  };

  const handleCancel = () => {
    onClose();
    setForm(emptyForm);
  };

  const onSaveEdit = async () => {
    if (!category) return;

    if (!form.name.trim()) {
      toast({ description: "Informe o nome da categoria." });
      return;
    }

    const updatedCategory: UpdateCategoryData = {
      name: form.name.trim(),
      description: form.description.trim(),
      picturePublicId: form.picturePublicId,
      hashtags: form.hashtags,
    };

    setIsLoading(true);

    try {
      await onSave(category.id, updatedCategory);
      onClose();
      setForm(emptyForm);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!category} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden border-border bg-card text-card-foreground sm:max-w-[980px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-xl">Editar Categoria</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Altere os dados e a foto da categoria.
            </DialogDescription>
          </DialogHeader>

          <CategoryForm
            form={form}
            onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
          />

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isBusy}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isBusy}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
