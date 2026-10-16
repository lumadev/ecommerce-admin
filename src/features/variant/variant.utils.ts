export const pluralizeVariantName = (name: string) => {
  const trimmed = name.trim();
  if (/s$/i.test(trimmed)) return trimmed;
  if (/[rz]$/i.test(trimmed)) return `${trimmed}es`;
  return `${trimmed}s`;
};
