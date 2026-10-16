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
import ProductForm from "../ProductForm";
import { validateProductForm } from "../../helpers/product-form.helpers";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateProductData) => Promise<Product>;
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  media: [],
  categoryIds: [],
};

const CreateProductDialog = ({ open, onClose, onCreate }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [hasMediaError, setHasMediaError] = useState(false);

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
        await mediaUploadRepository.delete(media.publicId, media.type);
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
      <DialogContent className="flex h-fit max-h-[calc(100vh-2rem)] flex-col overflow-hidden border-border bg-card text-card-foreground sm:max-w-[960px]">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DialogHeader className="shrink-0 border-b border-border pb-4">
            <DialogTitle className="text-xl">Novo Produto</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Preencha os dados do produto e adicione as fotos ou vídeos da vitrine.
            </DialogDescription>
          </DialogHeader>

          <ProductForm
            form={form}
            onChange={handleFormChange}
            onMediaUploadingChange={setIsMediaUploading}
            hasMediaError={hasMediaError}
          />

          <DialogFooter className="shrink-0 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading || isMediaUploading || isCanceling}
            >
              {isCanceling ? "Limpando..." : "Cancelar"}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isMediaUploading || isCanceling}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Salvando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDialog;