import { useState } from "react";
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
import { imageUploadRepository } from "@/features/file/repositories/imageUploadRepository";
import { useToast } from "@/hooks/use-toast";

import { CategoryFormState } from "@/features//category/types/category-form.types";
import { Category, CreateCategoryData } from "../types/category.types";

import CategoryForm from "./CategoryForm";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (category: CreateCategoryData) => Promise<Category>;
  merchantCode?: string;
}

const emptyForm: CategoryFormState = {
  name: "",
  description: "",
  url: "",
  picturePublicId: "",
  hashtags: [],
};

const CreateCategoryDialog = ({ open, onClose, onCreate, merchantCode }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCancel = async () => {
    if (isLoading || isClosing) return;
    setIsClosing(true);

    try {
      if (form.picturePublicId) {
        await imageUploadRepository.delete(
          form.picturePublicId,
          "image",
          "categories",
          merchantCode,
        );
      }
      onClose();
      setForm(emptyForm);
    } catch (error) {
      console.error("Erro ao remover imagem no cancelamento:", error);
      toast({
        description: "Não foi possível limpar a imagem enviada. Tente cancelar novamente.",
      });
    } finally {
      setIsClosing(false);
    }
  };

  const isBusy = isLoading || isClosing;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSaveCreate();
  };

  const onSaveCreate = async () => {
    if (!form.name.trim()) {
      toast({
        description: "Informe o nome da categoria.",
      });
      return;
    }
    if (!merchantCode) {
      toast({ description: "Não foi possível identificar a loja." });
      return;
    }

    const newCategory: CreateCategoryData = {
      merchantCode,
      name: form.name.trim(),
      description: form.description.trim(),
      picturePublicId: form.picturePublicId,
      hashtags: form.hashtags,
    };

    setIsLoading(true);

    try {
      await onCreate(newCategory);

      toast({
        variant: "success",
        description: `Categoria "${newCategory.name}" cadastrada com sucesso.`,
      });
      onClose();
      setForm(emptyForm);
    } catch (error) {
      toast({
        description: "Erro ao cadastrar categoria.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && void handleCancel()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden border-border bg-card text-card-foreground sm:max-w-[980px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-xl">Nova Categoria</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Preencha os dados e visualize a foto antes de confirmar.
            </DialogDescription>
          </DialogHeader>

          <CategoryForm
            form={form}
            onChange={(field, value) =>
              setForm((f) => ({ ...f, [field]: value }))
            }
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isBusy}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isBusy}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? "Salvando..." : "Confirmar Cadastro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;