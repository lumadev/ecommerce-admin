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
import { mediaUploadRepository } from "@/features/file/repositories/imageUploadRepository";
import { useToast } from "@/hooks/use-toast";
import { ProductFormState } from "../../types/product-form.types";
import { Product, CreateProductData } from "../../types/product.types";
import { useProductCategories } from "../../hooks/useProductCategories";
import ProductCreationContent from "../ProductCreationContent";
import { validateProductForm } from "../../helpers/product-form.helpers";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateProductData) => Promise<Product>;
  merchantCode?: string;
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  media: [],
  categoryIds: [],
};

const CreateProductDialog = ({
  open,
  onClose,
  onCreate,
  merchantCode,
}: Props) => {
  const {
    categories,
    isLoading: isLoadingCategories,
    hasError: hasErrorCategories,
  } = useProductCategories(open, merchantCode);
  const { toast } = useToast();
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [hasMediaError, setHasMediaError] = useState(false);
  const hasNoCategories =
    !isLoadingCategories && !hasErrorCategories && categories.length === 0;
  const canCreate = !isLoadingCategories && !hasNoCategories;

  const handleFormChange = <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) => {
    setForm((state) => ({ ...state, [field]: value }));
  };

  const handleCancel = async () => {
    if (isLoading || isMediaUploading || isCanceling) return;
    setIsCanceling(true);
    try {
      for (const media of form.media.filter((item) => !item.persisted)) {
        await mediaUploadRepository.delete(
          media.publicId,
          media.type,
          "products",
          merchantCode,
        );
      }
    } catch (error) {
      console.error("Erro ao remover mídias temporárias no cancelamento:", error);
      toast({
        description: "Não foi possível limpar todas as mídias enviadas. Tente cancelar novamente.",
      });
      setIsCanceling(false);
      return;
    }

    onClose();
    setForm(emptyForm);
    setIsCanceling(false);
  };

  const onSaveCreate = async () => {
    setHasMediaError(!form.media.some((item) => item.type === "image"));
    const validatedForm = validateProductForm(form, (description) =>
      toast({ description }),
    );
    if (!validatedForm) {
      return;
    }

    const newProduct: CreateProductData = {
      ...validatedForm,
    };

    try {
      setIsLoading(true);

      await onCreate(newProduct);

      toast({
        variant: "success",
        description: `Produto "${newProduct.name}" cadastrado com sucesso.`,
      });
      onClose();
      setForm(emptyForm);
    } catch (error) {
      toast({ description: "Erro ao cadastrar produto." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSaveCreate();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && void handleCancel()}
    >
      <DialogContent
        className={`flex max-h-[calc(100vh_-_2rem)] flex-col overflow-hidden border-border bg-card text-card-foreground ${
          hasNoCategories
            ? "h-auto sm:max-w-xl"
            : "h-[min(680px,calc(100vh_-_2rem))] sm:max-w-[960px]"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className={`flex min-h-0 flex-col overflow-hidden ${
            hasNoCategories ? "flex-none" : "flex-1"
          }`}
        >
          <DialogHeader className="shrink-0 border-b border-border pb-4">
            <DialogTitle className="text-xl">Novo Produto</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Para cadastrar um produto, selecione uma categoria e preencha os
              dados da vitrine.
            </DialogDescription>
          </DialogHeader>

          <ProductCreationContent
            hasNoCategories={hasNoCategories}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            hasErrorCategories={hasErrorCategories}
            form={form}
            onChange={handleFormChange}
            onMediaUploadingChange={setIsMediaUploading}
            hasMediaError={hasMediaError}
          />

          <DialogFooter className="shrink-0 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading || isMediaUploading || isCanceling}
            >
              {isCanceling ? "Limpando..." : "Cancelar"}
            </Button>
            {canCreate && (
              <Button
                type="submit"
                disabled={isLoading || isMediaUploading || isCanceling}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Salvando..." : "Criar"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDialog;