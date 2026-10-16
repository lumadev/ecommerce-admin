import { ReactNode } from "react";

interface InputFieldProps {
  icon: ReactNode;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  id?: string;
  error?: string;
}

export const InputField = ({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  id,
  error,
}: InputFieldProps) => {
  return (
    <div className="space-y-1">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error && id ? `${id}-error` : undefined}
          className="w-full rounded-lg border border-border bg-secondary py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      {error && <p id={id ? `${id}-error` : undefined} role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
};