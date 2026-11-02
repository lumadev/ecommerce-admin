export const PASSWORD_MIN_LENGTH = 6;

export const hasMinPasswordLength = (value: string) => value.length >= PASSWORD_MIN_LENGTH;
export const hasUpperAndLowerCase = (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value);
export const isStrongPassword = (value: string) =>
  hasMinPasswordLength(value) && hasUpperAndLowerCase(value);
