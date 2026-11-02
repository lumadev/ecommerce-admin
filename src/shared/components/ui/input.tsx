import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> &
  (
    | {
        clearable: true;
        clearLabel: string;
        clearButtonClassName?: string;
        onClear: () => void;
      }
    | {
        clearable?: false;
        clearLabel?: never;
        clearButtonClassName?: never;
        onClear?: never;
      }
  );

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      value,
      clearable = false,
      clearLabel = "Limpar campo",
      clearButtonClassName,
      onClear,
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && value !== null && value !== "";
    const showClearButton = clearable && hasValue && !!onClear;

    const input = (
      <input
        type={type}
        value={value}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          showClearButton && "pr-9",
          className
        )}
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
    );

    if (!clearable) return input;

    return (
      <div className="relative w-full">
        {input}
        {showClearButton && (
          <button
            type="button"
            onClick={onClear}
            aria-label={clearLabel}
            disabled={disabled || readOnly}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              clearButtonClassName
            )}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
