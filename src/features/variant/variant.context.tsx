import { createContext } from "react";
import { Variant } from "./types/variant.types";

export interface VariantContextValue {
  variants: Variant[];
  isLoading: boolean;
  loadError: string | null;
  addOption: (variantId: string, value: string) => Promise<boolean>;
  removeOption: (variantId: string, optionId: string) => Promise<boolean>;
}

export const VariantContext = createContext<VariantContextValue | undefined>(
  undefined
);
