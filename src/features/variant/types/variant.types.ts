export type VariantType = "preset" | "free_text";

export interface VariantOption {
  id: string;
  value: string;
}

export interface Variant {
  id: string;
  key: string;
  type: VariantType;
  values: VariantOption[];
}
