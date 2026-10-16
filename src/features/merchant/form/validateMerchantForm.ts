import {
  MerchantFormErrors,
  MerchantFormState,
} from "../types/merchant-form.types";
import { isValidEmail, isValidSlug } from "@/lib/validation";

export const validateMerchantForm = (
  form: MerchantFormState,
  { validateCode }: { validateCode: boolean }
): MerchantFormErrors => {
  const errors: MerchantFormErrors = {};

  if (validateCode) {
    const code = form.code.trim();

    if (!code) {
      errors.code = "Informe o código da loja.";
    } else if (code.length > 60) {
      errors.code = "O código deve ter no máximo 60 caracteres.";
    } else if (!isValidSlug(code)) {
      errors.code = "Use um slug em minúsculas (ex: loja-do-joao).";
    }
  }

  const name = form.name.trim();

  if (!name) {
    errors.name = "Informe o nome da loja.";
  } else if (name.length > 120) {
    errors.name = "O nome deve ter no máximo 120 caracteres.";
  }

  const email = form.email.trim();

  if (email && !isValidEmail(email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (form.domain.trim().length > 255) {
    errors.domain = "O domínio deve ter no máximo 255 caracteres.";
  }

  const keys = form.attributes.map((a) => a.key.trim().toLowerCase());

  if (keys.some((k) => !k)) {
    errors.attributes = "Informe o nome de todas as variantes.";
  } else if (keys.some((k) => k.length > 60)) {
    errors.attributes = "O nome da variante deve ter no máximo 60 caracteres.";
  } else if (new Set(keys).size !== keys.length) {
    errors.attributes = "Não repita o nome de uma variante.";
  }

  return errors;
};
