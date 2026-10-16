import { MerchantFormState } from "../types/merchant-form.types";
import { Merchant } from "../types/merchant.types";

export interface MerchantChange {
  label: string;
  before: string;
  after: string;
}

const EMPTY = "(vazio)";

const orEmpty = (value: string) => (value.trim() ? value.trim() : EMPTY);

const formatAttributes = (attrs: { key: string; type: string }[]) =>
  attrs.length ? attrs.map((a) => `${a.key.trim()} (${a.type})`).join(", ") : EMPTY;

export const getMerchantChanges = (
  merchant: Merchant,
  form: MerchantFormState
): MerchantChange[] => {
  const changes: MerchantChange[] = [];

  const push = (label: string, before: string, after: string) => {
    if (before !== after) changes.push({ label, before, after });
  };

  push("Nome", orEmpty(merchant.name), orEmpty(form.name));
  push("E-mail", orEmpty(merchant.email ?? ""), orEmpty(form.email));
  push("Domínio", orEmpty(merchant.domain ?? ""), orEmpty(form.domain));
  push(
    "Status",
    merchant.isActive ? "Ativa" : "Inativa",
    form.isActive ? "Ativa" : "Inativa"
  );
  push(
    "Atributos",
    formatAttributes(merchant.attributes ?? []),
    formatAttributes(form.attributes)
  );

  return changes;
};
