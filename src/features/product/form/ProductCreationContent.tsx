import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
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
  if (hasNoCategories) {
    return (
      <div className="flex min-h-[280px] flex-1 items-center justify-center px-2 py-8">
        <Alert
          variant="destructive"
          className="max-w-lg border-destructive/30 bg-destructive/5 px-6 py-5 text-center [&>svg]:left-1/2 [&>svg]:top-5 [&>svg]:-translate-x-1/2 [&>svg~*]:pl-0 [&>svg+div]:translate-y-0"
        >
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="mt-8 text-base">
            Cadastre uma categoria primeiro
          </AlertTitle>
          <AlertDescription className="mt-2">
            Para cadastrar um produto, é necessário ter pelo menos uma
            categoria. Acesse a página de categorias e crie a primeira para
            continuar.
          </AlertDescription>
          <Button asChild className="mt-5">
            <Link to="/categorias">Ir para categorias</Link>
          </Button>
        </Alert>
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
