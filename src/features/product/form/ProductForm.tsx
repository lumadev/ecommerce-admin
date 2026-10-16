import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { ProductFormState } from "../types/product-form.types";
import { CategoriesSelect } from "./CategoriesSelect";
import ProductMediaGallery from "./ProductMediaGallery";
import { useProductCategories } from "../hooks/useProductCategories";

interface Props {
  form: ProductFormState;
  onChange: <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) => void;
  onMediaUploadingChange: (isUploading: boolean) => void;
  hasMediaError: boolean;
}

const ProductForm = ({
  form,
  onChange,
  onMediaUploadingChange,
  hasMediaError,
}: Props) => {
  const { categories, isLoading, hasError: hasErrorCategories } = useProductCategories();

  return (
    <Tabs
      defaultValue="data"
      className="flex min-h-0 flex-1 flex-col overflow-hidden py-1"
    >
      <TabsList className="mb-3 grid w-full shrink-0 grid-cols-2">
        <TabsTrigger value="data">Dados do produto</TabsTrigger>
        <TabsTrigger value="media">
          Fotos e vídeos{form.media.length > 0 ? ` (${form.media.length})` : ""}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="data"
        className="mt-0 min-h-0 flex-1 overflow-y-auto p-1.5"
      >
        <div className="grid content-start gap-3">
          <div className="grid grid-cols-2 items-start gap-3">
            <div className="grid content-start gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder="Ex: Vaso Geométrico"
                className="bg-background"
              />
            </div>

            <div className="grid content-start gap-2">
              {categories?.length > 0 && (
                <CategoriesSelect
                  categories={categories}
                  isLoading={isLoading}
                  hasError={hasErrorCategories}
                  value={form.categoryIds}
                  onChange={(categoryIds) => onChange("categoryIds", categoryIds)}
                />
              )}
            </div>
          </div>

          <div className="grid content-start gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição
            </Label>
            <Textarea
              id="description"
              rows={6}
              value={form.description}
              onChange={(event) => onChange("description", event.target.value)}
              placeholder="Descreva o produto..."
              className="min-h-[180px] resize-y bg-background"
            />
          </div>

          <div className="grid grid-cols-2 items-start gap-3">
            <div className="grid content-start gap-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Preço (R$)
              </Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={form.price}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^\d*(?:\.\d{0,2})?$/.test(value)) {
                    onChange("price", value);
                  }
                }}
                onBlur={() => {
                  if (form.price !== "") {
                    onChange("price", Number(form.price).toFixed(2));
                  }
                }}
                className="bg-background"
              />
            </div>

            <div className="grid content-start gap-2">
              <Label htmlFor="stock" className="text-sm font-medium">
                Estoque
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                value={form.stock}
                onChange={(event) => onChange("stock", event.target.value)}
                className="bg-background"
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="media" className="mt-0 min-h-0 flex-1 overflow-y-auto">
        <ProductMediaGallery
          value={form.media}
          onChange={(media) => onChange("media", media)}
          onUploadingChange={onMediaUploadingChange}
          error={
            hasMediaError && !form.media.some((item) => item.type === "image")
              ? "Adicione ao menos uma foto do produto."
              : undefined
          }
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProductForm;
