import { useEffect, useState } from "react";
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
import { useProductCategories } from "../../hooks/useProductCategories";
import { useVariants } from "@/features/variant/hooks/useVariants";
import ProductForm from "../ProductForm";
import { validateProductForm } from "../../helpers/product-form.helpers";
import type { ProductFormErrors } from "../../helpers/product-form.helpers";

interface Props {
  product: ProductListItem | null;
  onClose: () => void;
  onSave: (id: string, data: UpdateProductData) => Promise<ProductListItem>;
  merchantCode?: string;
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
  variants:
    p?.variants?.map((variant) => ({
      attributeId: variant.attributeId,
      optionId: variant.optionId,
      value: variant.value ?? "",
    })) ?? [],
});

const EditProductDialog = ({
  product,
  onClose,
  onSave,
  merchantCode,
}: Props) => {
  const {
    categories,
    isLoading: isLoadingCategories,
    hasError: hasErrorCategories,
  } = useProductCategories(!!product, merchantCode);
  const {
    variants,
    isLoading: isLoadingVariants,
    loadError: variantsError,
    load: loadVariants,
  } = useVariants();
  const { toast } = useToast();
  const [form, setForm] = useState<ProductFormState>(() => toFormState(product));
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [activeTab, setActiveTab] = useState("data");
  const [isLoading, setIsLoading] = useState(false);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [hasChangedVariants, setHasChangedVariants] = useState(false);

  useEffect(() => {
    if (!product) return;
    const controller = new AbortController();
    void loadVariants(controller.signal);
    return () => controller.abort();
  }, [product?.id, loadVariants]);

  const handleFormChange = <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) => {
    setForm((state) => ({ ...state, [field]: value }));
    if (field === "variants") setHasChangedVariants(true);
    setErrors((state) => ({
      ...state,
      ...(field === "variants"
        ? { variants: undefined }
        : { [field]: undefined }),
    }));
  };

  const handleCancel = async () => {
    if (isLoading || isMediaUploading || isCanceling) return;
    setIsCanceling(true);

    const temporaryMedia = Array.from(
      new Map(
        form.media
          .filter((item) => !item.persisted)
          .map((item) => [`${item.type}:${item.publicId}`, item]),
      ).values(),
    );
    const failedPublicIds: string[] = [];
    for (const media of temporaryMedia) {
      try {
        await mediaUploadRepository.delete(
          media.publicId,
          media.type,
          "products",
          merchantCode,
        );
      } catch (error) {
        console.error("Erro ao remover mídia temporária no cancelamento:", error);
        failedPublicIds.push(media.publicId);
      }
    }

    if (failedPublicIds.length > 0) {
      console.error("Falha ao limpar mídias temporárias no cancelamento:", failedPublicIds);
      toast({
        description:
          "Não foi possível limpar todas as mídias enviadas. Tente cancelar novamente.",
      });
      setIsCanceling(false);
      return;
    }

    onClose();
    setIsCanceling(false);
  };

  const onSaveEdit = async () => {
    if (!product) return;

    const validation = validateProductForm(form, variants);
    setErrors(validation.errors);
    if (!validation.data) {
      setActiveTab(
        validation.errors.name ||
        validation.errors.price ||
        validation.errors.stock ||
        validation.errors.categoryIds
          ? "data"
          : "variants",
      );
      return;
    }

    const updateData: UpdateProductData = {
      ...validation.data,
      media: validation.data.media ?? [],
      ...(hasChangedVariants || product.variants !== undefined
        ? { variants: validation.data.variants ?? [] }
        : {}),
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
      <DialogContent className="flex h-[min(720px,calc(100vh_-_2rem))] max-h-[calc(100vh-2rem)] flex-col overflow-hidden border-border bg-card text-card-foreground sm:max-w-[960px]">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DialogHeader className="shrink-0 border-b border-border pb-4">
            <DialogTitle className="text-xl">Editar Produto</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Atualize os dados e variantes. Os campos obrigatórios estão indicados.
            </p>
          </DialogHeader>

          <ProductForm
            isCreate={false}
            form={form}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            hasErrorCategories={hasErrorCategories}
            variants={variants}
            isLoadingVariants={isLoadingVariants}
            variantsError={variantsError}
            onRetryVariants={() => void loadVariants()}
            errors={errors}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onChange={handleFormChange}
            onMediaUploadingChange={setIsMediaUploading}
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
            <Button
              type="submit"
              disabled={
                isLoading ||
                isMediaUploading ||
                isCanceling ||
                isLoadingVariants ||
                Boolean(variantsError)
              }
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