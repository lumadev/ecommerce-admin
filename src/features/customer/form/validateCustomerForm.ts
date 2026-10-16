import { CustomerFormErrors, CustomerFormState } from "../types/customer-form.types";
import { isValidEmail } from "@/lib/validation";

export const validateCustomerForm = (
  form: CustomerFormState,
  { requirePassword }: { requirePassword: boolean }
): CustomerFormErrors => {
  const errors: CustomerFormErrors = {};

  const name = form.name.trim();

  if (!name) {
    errors.name = "Informe o nome do cliente.";
  } else if (name.length > 120) {
    errors.name = "O nome deve ter no máximo 120 caracteres.";
  }

  const email = form.email.trim();

  if (!email) {
    errors.email = "Informe o e-mail do cliente.";
  } else if (!isValidEmail(email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!form.password) {
    if (requirePassword) {
      errors.password = "Informe a senha do cliente.";
    }
  } else if (form.password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres.";
  }

  return errors;
};
