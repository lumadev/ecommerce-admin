export interface CustomerFormState {
  name: string;
  email: string;
  password: string;
}

export type CustomerFormErrors = Partial<Record<keyof CustomerFormState, string>>;
