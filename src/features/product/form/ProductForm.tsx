import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button/button";
import FieldCompletionIndicator from "@/shared/components/ui/FieldCompletionIndicator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import type { Variant } from "@/features/variant/types/variant.types";
import type { ProductFormErrors } from "../helpers/product-form.helpers";

import { ProductFormState } from "../types/product-form.types";
import { CategoriesSelect } from "./CategoriesSelect";
import ProductMediaGallery from "./ProductMediaGallery";
import ProductVariantsFields from "./ProductVariantsFields";
import { ProductCategory } from "../hooks/useProductCategories";

interface Props {
  isCreate: boolean;
  form: ProductFormState;
  categories: ProductCategory[];
  isLoadingCategories: boolean;
  hasErrorCategories: boolean;
  variants: Variant[];
  isLoadingVariants: boolean;
  variantsError: string | null;
  onRetryVariants: () => void;
  errors: ProductFormErrors;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onChange: <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) => void;
  onMediaUploadingChange: (isUploading: boolean) => void;
}

const ProductForm = ({
  isCreate,
  form,
  categories,
  isLoadingCategories,
  hasErrorCategories,
  variants,
  isLoadingVariants,
  variantsError,
  onRetryVariants,
  errors,
  activeTab,
  onTabChange,
  onChange,
  onMediaUploadingChange,
}: Props) => {
  const dataErrors = [
    errors.name,
    errors.price,
    errors.stock,
    errors.categoryIds,
    errors.merchantCode,
  ].filter(Boolean).length;
  const variantErrors = Object.keys(errors.variants ?? {}).length;
  const mediaErrors = errors.media ? 1 : 0;
  const variantHasIssues = variantErrors > 0 || Boolean(variantsError);
  const outOfTabIssues = [
    ...(activeTab !== "data" && dataErrors > 0
      ? [{ tab: "data", label: "Dados do produto" }]
      : []),
    ...(activeTab !== "variants" && variantHasIssues
      ? [{ tab: "variants", label: "Variantes" }]
      : []),
    ...(activeTab !== "media" && mediaErrors > 0
      ? [{ tab: "media", label: "Fotos e vídeos" }]
      : []),
  ];
  const hasValidName = form.name.trim().length > 0 && !errors.name;
  const priceValue = form.price.trim();
  const hasValidPrice =
    /^\d+(?:\.\d{1,2})?$/.test(priceValue) &&
    Number.isFinite(Number(priceValue)) &&
    Number(priceValue) > 0 &&
    !errors.price;
  const stockValue = form.stock.trim();
  const hasValidStock =
    /^\d+$/.test(stockValue) &&
    Number.isSafeInteger(Number(stockValue)) &&
    !errors.stock;

  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="flex min-h-0 flex-1 flex-col overflow-hidden py-1"
    >
      {outOfTabIssues.length > 0 && (
        <div
          className="mb-2 flex shrink-0 flex-wrap items-center gap-x-2 text-xs text-muted-foreground"
          role="status"
        >
          <span>Revisar:</span>
          {outOfTabIssues.map(({ tab, label }, index) => (
            <span key={tab} className="inline-flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">·</span>}
              <button
                type="button"
                className="underline decoration-muted-foreground/50 underline-offset-2 hover:text-foreground"
                onClick={() => onTabChange(tab)}
              >
                {label}
              </button>
            </span>
          ))}
        </div>
      )}
      <TabsList className="mb-3 grid w-full shrink-0 grid-cols-3">
        <TabsTrigger value="data" className="gap-1.5">
          Dados do produto
          {dataErrors > 0 && (
            <span aria-hidden="true" className="ml-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
          )}
          {dataErrors > 0 && <span className="sr-only">Contém erros</span>}
        </TabsTrigger>
        <TabsTrigger value="variants" className="gap-1.5">
          Variantes
          {variantHasIssues && (
            <span aria-hidden="true" className="ml-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
          )}
          {variantHasIssues && <span className="sr-only">Contém erros</span>}
        </TabsTrigger>
        <TabsTrigger value="media" className="gap-1.5">
          Fotos e vídeos{form.media.length > 0 ? ` (${form.media.length})` : ""}
          {mediaErrors > 0 && (
            <span aria-hidden="true" className="ml-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
          )}
          {mediaErrors > 0 && <span className="sr-only">Contém erros</span>}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="data"
        className="mt-0 min-h-0 flex-1 overflow-y-auto p-1.5"
      >
        <div className="grid content-start gap-3">
          {errors.merchantCode && (
            <p id="product-merchant-code-error" role="alert" className="text-sm text-destructive">
              {errors.merchantCode}
            </p>
          )}
          <div className="grid gap-3">
            <div className="grid content-start gap-2">
              <Label htmlFor="name" className="flex items-center justify-between text-sm font-medium">
                <span>Nome</span>
                <span className="text-xs font-normal text-muted-foreground">Obrigatório</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) => onChange("name", event.target.value)}
                  placeholder="Ex: Vaso Geométrico"
                  aria-required="true"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "product-name-error" : undefined}
                  className="bg-background pr-10"
                />
                {hasValidName && (
                  <FieldCompletionIndicator label="Nome preenchido corretamente" />
                )}
              </div>
              {errors.name && (
                <p id="product-name-error" role="alert" className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid content-start gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Categorias</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {isCreate ? "Obrigatório" : "Opcional"}
                </span>
              </div>
              <CategoriesSelect
                categories={categories}
                isLoading={isLoadingCategories}
                hasError={hasErrorCategories}
                value={form.categoryIds}
                onChange={(categoryIds) => onChange("categoryIds", categoryIds)}
                isRequired={isCreate}
                error={errors.categoryIds}
              />
            </div>
          </div>

          <div className="grid content-start gap-2">
            <Label htmlFor="description" className="flex items-center justify-between text-sm font-medium">
              <span>Descrição</span>
              <span className="text-xs font-normal text-muted-foreground">Opcional</span>
            </Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(event) => onChange("description", event.target.value)}
              placeholder="Descreva o produto..."
              className="min-h-[100px] resize-y bg-background"
            />
          </div>

          <div className="grid grid-cols-2 items-start gap-3">
            <div className="grid content-start gap-2">
              <Label htmlFor="price" className="flex items-center justify-between text-sm font-medium">
                <span>Preço (R$)</span>
                <span className="text-xs font-normal text-muted-foreground">Obrigatório</span>
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={form.price}
                  aria-required="true"
                  onChange={(event) => {
                    const value = event.target.value;
                    if (/^\d*(?:\.\d{0,2})?$/.test(value)) {
                      onChange("price", value);
                    }
                  }}
                  onBlur={() => {
                    if (form.price !== "" && Number(form.price) > 0) {
                      onChange("price", Number(form.price).toFixed(2));
                    }
                  }}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? "product-price-error" : undefined}
                  className="bg-background pr-10"
                />
                {hasValidPrice && (
                  <FieldCompletionIndicator label="Preço preenchido corretamente" />
                )}
              </div>
              {errors.price && (
                <p id="product-price-error" role="alert" className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="grid content-start gap-2">
              <Label htmlFor="stock" className="flex items-center justify-between text-sm font-medium">
                <span>Estoque</span>
                <span className="text-xs font-normal text-muted-foreground">Obrigatório</span>
              </Label>
              <div className="relative">
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={form.stock}
                  onChange={(event) => {
                    if (/^\d*$/.test(event.target.value)) {
                      onChange("stock", event.target.value);
                    }
                  }}
                  aria-required="true"
                  aria-invalid={Boolean(errors.stock)}
                  aria-describedby={errors.stock ? "product-stock-error" : undefined}
                  className="bg-background pr-10"
                />
                {hasValidStock && (
                  <FieldCompletionIndicator label="Estoque preenchido corretamente" />
                )}
              </div>
              {errors.stock && (
                <p id="product-stock-error" role="alert" className="text-sm text-destructive">{errors.stock}</p>
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="variants" className="mt-0 min-h-0 flex-1 overflow-y-auto p-1.5">
        <ProductVariantsFields
          variants={variants}
          value={form.variants}
          errors={errors.variants ?? {}}
          isLoading={isLoadingVariants}
          loadError={variantsError}
          onChange={(productVariants) => onChange("variants", productVariants)}
          onRetry={onRetryVariants}
        />
      </TabsContent>

      <TabsContent value="media" className="mt-0 min-h-0 flex-1 overflow-y-auto">
        <p className="mb-3 text-right text-xs text-muted-foreground">
          {isCreate ? "Foto obrigatória" : "Mídia opcional"}
        </p>
        <ProductMediaGallery
          value={form.media}
          onChange={(media) => onChange("media", media)}
          onUploadingChange={onMediaUploadingChange}
          error={errors.media}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProductForm;
