import { AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button/button";
import { ProductCategory } from "../hooks/useProductCategories";
import { ProductFormState } from "../types/product-form.types";
import ProductForm from "./ProductForm";

interface Props {
  hasNoCategories: boolean;
  categories: ProductCategory[];
  isLoadingCategories: boolean;
  hasErrorCategories: boolean;
  form: ProductFormState;
  onChange: <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) => void;
  onMediaUploadingChange: (isUploading: boolean) => void;
  hasMediaError: boolean;
}

const ProductCreationContent = ({
  hasNoCategories,
  categories,
  isLoadingCategories,
  hasErrorCategories,
  form,
  onChange,
  onMediaUploadingChange,
  hasMediaError,
}: Props) => {
  if (isLoadingCategories) {
    return (
      <div
        className="flex min-h-[280px] flex-1 flex-col items-center justify-center gap-3 text-muted-foreground"
        role="status"
      >
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Carregando categorias...</p>
      </div>
    );
  }

  if (hasNoCategories) {
    return (
      <div className="flex items-center justify-center px-2 py-2">
        <div
          role="alert"
          className="flex max-w-lg flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-5 text-center"
        >
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h3 className="font-medium leading-none tracking-tight text-destructive">
            Cadastre uma categoria primeiro
          </h3>
          <p className="text-sm text-muted-foreground">
            Para cadastrar um produto, é necessário ter pelo menos uma
            categoria. Acesse a página de categorias e crie a primeira para
            continuar.
          </p>
          <Button asChild className="mt-2">
            <Link to="/categorias">Ir para categorias</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      form={form}
      categories={categories}
      isLoadingCategories={isLoadingCategories}
      hasErrorCategories={hasErrorCategories}
      onChange={onChange}
      onMediaUploadingChange={onMediaUploadingChange}
      hasMediaError={hasMediaError}
    />
  );
};

export default ProductCreationContent;
