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
import { mediaUploadRepository } from "@/features/file/repositories/imageUploadRepository";
import { useToast } from "@/hooks/use-toast";
import { ProductFormState } from "../../types/product-form.types";
import { Product, CreateProductData } from "../../types/product.types";
import { useProductCategories } from "../../hooks/useProductCategories";
import { useVariants } from "@/features/variant/hooks/useVariants";
import ProductCreationContent from "../ProductCreationContent";
import { validateProductForm } from "../../helpers/product-form.helpers";
import type { ProductFormErrors } from "../../helpers/product-form.helpers";

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
  variants: [],
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
  const {
    variants,
    isLoading: isLoadingVariants,
    loadError: variantsError,
    load: loadVariants,
  } = useVariants();
  const { toast } = useToast();
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [activeTab, setActiveTab] = useState("data");
  const [isLoading, setIsLoading] = useState(false);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    void loadVariants(controller.signal);
    return () => controller.abort();
  }, [open, loadVariants]);

  const handleFormChange = <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) => {
    setForm((state) => ({ ...state, [field]: value }));
    setErrors((state) => {
      const nextErrors = { ...state };
      if (field === "variants") {
        nextErrors.variants = undefined;
      } else if (field === "media") {
        if (
          Array.isArray(value) &&
          value.some((media) => media.type === "image")
        ) {
          nextErrors.media = undefined;
        }
      } else if (field === "name") {
        nextErrors.name = undefined;
      } else if (field === "price") {
        nextErrors.price = undefined;
      } else if (field === "stock") {
        nextErrors.stock = undefined;
      } else if (field === "categoryIds") {
        nextErrors.categoryIds = undefined;
      }
      return nextErrors;
    });
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
    setErrors({});
    setActiveTab("data");
    setIsCanceling(false);
  };

  const onSaveCreate = async () => {
    if (!merchantCode) {
      setErrors({ merchantCode: "Não foi possível identificar a loja." });
      setActiveTab("data");
      return;
    }

    const validation = validateProductForm(form, variants, {
      requireCategories: true,
      requirePhoto: true,
    });
    setErrors(validation.errors);
    if (!validation.data) {
      setActiveTab(
        validation.errors.name ||
        validation.errors.price ||
        validation.errors.stock ||
        validation.errors.categoryIds
          ? "data"
          : validation.errors.variants
            ? "variants"
            : "media",
      );
      return;
    }

    const newProduct: CreateProductData = {
      merchantCode,
      ...validation.data,
      stock: validation.data.stock,
      categoryIds: validation.data.categoryIds ?? form.categoryIds,
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
      setErrors({});
      setActiveTab("data");
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
      <DialogContent className="flex h-[min(720px,calc(100vh_-_2rem))] max-h-[calc(100vh_-_2rem)] flex-col overflow-hidden border-border bg-card text-card-foreground sm:max-w-[960px]">
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <DialogHeader className="shrink-0 border-b border-border pb-4">
            <DialogTitle className="text-xl">Novo Produto</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Preencha os dados do produto, configure as variantes aplicáveis e
              adicione mídias se desejar. Os campos obrigatórios estão indicados.
            </DialogDescription>
          </DialogHeader>

          <ProductCreationContent
            isCreate
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            hasErrorCategories={hasErrorCategories}
            variants={variants}
            isLoadingVariants={isLoadingVariants}
            variantsError={variantsError}
            onRetryVariants={() => void loadVariants()}
            form={form}
            onChange={handleFormChange}
            onMediaUploadingChange={setIsMediaUploading}
            errors={errors}
            activeTab={activeTab}
            onTabChange={setActiveTab}
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
              {isLoading ? "Salvando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDialog;