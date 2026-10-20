import type { Variant } from "@/features/variant/types/variant.types";
import type { ProductFormState } from "../types/product-form.types";
import type { ProductVariantInput } from "../types/product.types";

export interface ValidatedProductForm {
  name: string;
  description?: string;
  price: number;
  stock: number;
  media?: {
    publicId: string;
    type: ProductFormState["media"][number]["type"];
    format?: string;
  }[];
  categoryIds?: string[];
  variants?: ProductVariantInput[];
}

export interface ProductFormErrors {
  name?: string;
  price?: string;
  stock?: string;
  categoryIds?: string;
  media?: string;
  merchantCode?: string;
  variants?: Record<string, string>;
}

interface ProductValidationOptions {
  requireCategories?: boolean;
  requirePhoto?: boolean;
}

export const validateProductForm = (
  form: ProductFormState,
  availableVariants: Variant[],
  options: ProductValidationOptions = {},
): { data: ValidatedProductForm | null; errors: ProductFormErrors } => {
  const errors: ProductFormErrors = {};
  const name = form.name.trim();
  if (!name) {
    errors.name = "Informe o nome do produto.";
  }

  const priceValue = form.price.trim();
  const price = Number(priceValue);
  if (!/^\d+(?:\.\d{1,2})?$/.test(priceValue) || !Number.isFinite(price) || price <= 0) {
    errors.price = "Informe um preço positivo com no máximo 2 casas decimais.";
  }

  const stockValue = form.stock.trim();
  const stock = Number(stockValue);
  if (
    stockValue === "" ||
    !/^\d+$/.test(stockValue) ||
    !Number.isSafeInteger(stock)
  ) {
    errors.stock = "Informe um estoque inteiro maior ou igual a zero.";
  }

  if (options.requireCategories && form.categoryIds.length === 0) {
    errors.categoryIds = "Selecione ao menos uma categoria.";
  }

  if (
    options.requirePhoto &&
    !form.media.some((media) => media.type === "image")
  ) {
    errors.media = "Adicione ao menos uma foto do produto.";
  }

  const variants: ProductVariantInput[] = [];
  const variantErrors: Record<string, string> = {};

  for (const definition of availableVariants) {
    const selected = form.variants.find(
      (variant) => variant.attributeId === definition.id,
    );
    const value = selected?.value.trim() ?? "";

    if (definition.type === "free_text") {
      if (!value) {
        if (definition.isRequired) {
          variantErrors[definition.id] = `Preencha "${definition.key}".`;
        }
        continue;
      }
      variants.push({ attributeId: definition.id, value });
      continue;
    }

    const option = definition.values.find(
      (item) =>
        item.id === selected?.optionId ||
        (value !== "" &&
          item.value.toLocaleLowerCase() === value.toLocaleLowerCase()),
    );
    if (!option) {
      if (definition.isRequired) {
        variantErrors[definition.id] = `Selecione uma opção para "${definition.key}".`;
      } else if (value) {
        variantErrors[definition.id] = `Selecione uma opção válida para "${definition.key}".`;
      }
      continue;
    }
    variants.push({
      attributeId: definition.id,
      optionId: option.id,
      value: option.value,
    });
  }

  if (Object.keys(variantErrors).length > 0) {
    errors.variants = variantErrors;
  }

  if (Object.keys(errors).length > 0) {
    return { data: null, errors };
  }

  return {
    errors,
    data: {
      name,
      ...(form.description.trim() ? { description: form.description.trim() } : {}),
      price,
      stock,
      ...(form.media.length > 0
        ? {
            media: form.media.map(({ publicId, type, format }) => ({
              publicId,
              type,
              format,
            })),
          }
        : {}),
      ...(form.categoryIds.length
        ? { categoryIds: form.categoryIds }
        : options.requireCategories
          ? { categoryIds: [] }
          : {}),
      ...(variants.length ? { variants } : {}),
    },
  };
};
