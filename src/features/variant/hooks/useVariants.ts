import { useContext } from "react";
import { VariantContext } from "../variant.context";

export const useVariants = () => {
  const context = useContext(VariantContext);

  if (!context) {
    throw new Error("useVariants must be used within VariantProvider");
  }

  return context;
};
