import { ProductCategory } from "../hooks/useProductCategories";
import { ProductFormState } from "../types/product-form.types";
import type { Variant } from "@/features/variant/types/variant.types";
import type { ProductFormErrors } from "../helpers/product-form.helpers";
import ProductForm from "./ProductForm";

interface Props {
  isCreate: boolean;
  categories: ProductCategory[];
  isLoadingCategories: boolean;
  hasErrorCategories: boolean;
  variants: Variant[];
  isLoadingVariants: boolean;
  variantsError: string | null;
  onRetryVariants: () => void;
  form: ProductFormState;
  onChange: <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) => void;
  onMediaUploadingChange: (isUploading: boolean) => void;
  errors: ProductFormErrors;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProductCreationContent = ({
  isCreate,
  categories,
  isLoadingCategories,
  hasErrorCategories,
  variants,
  isLoadingVariants,
  variantsError,
  onRetryVariants,
  form,
  onChange,
  onMediaUploadingChange,
  errors,
  activeTab,
  onTabChange,
}: Props) => {
  return (
    <ProductForm
      isCreate={isCreate}
      form={form}
      categories={categories}
      isLoadingCategories={isLoadingCategories}
      hasErrorCategories={hasErrorCategories}
      variants={variants}
      isLoadingVariants={isLoadingVariants}
      variantsError={variantsError}
      onRetryVariants={onRetryVariants}
      onChange={onChange}
      onMediaUploadingChange={onMediaUploadingChange}
      errors={errors}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
};

export default ProductCreationContent;
