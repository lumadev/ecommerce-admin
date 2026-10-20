import { Check } from "lucide-react";

interface FieldCompletionIndicatorProps {
  label: string;
  className?: string;
}

const FieldCompletionIndicator = ({
  label,
  className = "right-3",
}: FieldCompletionIndicatorProps) => (
  <span
    role="img"
    aria-label={label}
    className={`pointer-events-none absolute ${className} top-1/2 -translate-y-1/2 text-emerald-600`}
  >
    <Check aria-hidden="true" className="h-4 w-4" />
  </span>
);

export default FieldCompletionIndicator;
