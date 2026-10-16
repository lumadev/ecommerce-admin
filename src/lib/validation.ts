const EMAIL_PATTERN = /^[a-z\d!#$%&'*+\/?^_`{|}~-]+(?:\.[a-z\d!#$%&'*+\/?^_`{|}~-]+)*@(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i;
const POSTAL_CODE_PATTERN = /^\d{5}-?\d{3}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isBlank = (value: string) => value.trim().length === 0;

export const isValidEmail = (value: string) => EMAIL_PATTERN.test(value.trim());

export const isValidPostalCode = (value: string) =>
  POSTAL_CODE_PATTERN.test(value.trim());

export const isValidSlug = (value: string) => SLUG_PATTERN.test(value.trim());

export const exceedsMaxLength = (value: string, max: number) => value.trim().length > max;

export const passwordsMatch = (password: string, confirmation: string) =>
  password === confirmation;
