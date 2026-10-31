import { isValidEmail } from "@/lib/validation";
import {
  MerchantAdminFormErrors,
  MerchantAdminFormState,
} from "../types/merchant-admin.types";

export const validateMerchantAdminForm = (
  form: MerchantAdminFormState,
  { requirePassword }: { requirePassword: boolean }
): MerchantAdminFormErrors => {
  const errors: MerchantAdminFormErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const username = form.username.trim();

  if (!name) errors.name = "Informe o nome do admin.";
  else if (name.length > 120) errors.name = "O nome deve ter no máximo 120 caracteres.";

  if (!username) errors.username = "Informe o usuário do admin.";
  else if (username.length > 60) errors.username = "O usuário deve ter no máximo 60 caracteres.";

  if (!email) errors.email = "Informe o e-mail do admin.";
  else if (!isValidEmail(email)) errors.email = "Informe um e-mail válido.";

  if (!form.password) {
    if (requirePassword) errors.password = "Informe a senha do admin.";
  } else if (form.password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres.";
  }

  return errors;
};