import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mediaUploadRepository } from "@/features/file/repositories/imageUploadRepository";
import { ProductListItem, UpdateProductData } from "../../types/product.types";
import { ProductFormState } from "../../types/product-form.types";
import ProductForm from "../ProductForm";
import { validateProductForm } from "../../helpers/product-form.helpers";

interface Props {
  product: ProductListItem | null;
  onClose: () => void;
  onSave: (id: string, data: UpdateProductData) => Promise<ProductListItem>;
}

const toFormState = (p: ProductListItem | null): ProductFormState => ({
  name: p?.name ?? "",
  description: p?.description ?? "",
  price: p?.price != null ? p.price.toString() : "",
  stock: p?.stock != null ? p.stock.toString() : "",
  media: p
    ? (p.media?.length
        ? p.media
        : p.mediaUrls.map((src, index) => ({
            src,
            type: p.mediaTypes?.[index] ?? "image",
            publicId: p.mediaPublicIds?.[index] ?? src,
          }))
      ).map((media, index) => ({
        src: media.src,
        poster: media.poster,
        type: media.type,
        publicId: media.publicId ?? p.mediaPublicIds?.[index] ?? media.src,
        format: media.format,
        persisted: true,
      }))
    : [],
  categoryIds: p?.categories ? p.categories.map((c) => c.id) : [],
});

const EditProductDialog = ({ product, onClose, onSave }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState<ProductFormState>(() => toFormState(product));
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
    setIsCanceling(false);
  };

  const onSaveEdit = async () => {
    if (!product) return;

    setHasMediaError(!form.media.some((item) => item.type === "image"));
    const validatedForm = validateProductForm(form, (description) =>
      toast({ description }),
    );
    if (!validatedForm) {
      return;
    }

    const updateData: UpdateProductData = {
      ...validatedForm,
    };

    try {
      setIsLoading(true);
      await onSave(product.id, updateData);
      onClose();
    } catch {
      // toast error is handled inside useProducts hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSaveEdit();
  };

  return (
    <Dialog
      open={!!product}
      onOpenChange={(isOpen) => !isOpen && void handleCancel()}
    >
      <DialogContent className="flex h-fit max-h-[calc(100vh-2rem)] flex-col overflow-hidden border-border bg-card text-card-foreground sm:max-w-[960px]">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DialogHeader className="shrink-0 border-b border-border pb-4">
            <DialogTitle className="text-xl">Editar Produto</DialogTitle>
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
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;