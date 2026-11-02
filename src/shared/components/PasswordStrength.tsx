import { Check, Circle } from "lucide-react";
import {
  PASSWORD_MIN_LENGTH,
  hasMinPasswordLength,
  hasUpperAndLowerCase,
} from "@/lib/passwordValidation";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const requirements = [
    { label: `Mínimo de ${PASSWORD_MIN_LENGTH} caracteres`, met: hasMinPasswordLength(password) },
    { label: "Letras maiúsculas e minúsculas", met: hasUpperAndLowerCase(password) },
  ];

  return (
    <ul className="grid gap-1" aria-live="polite">
      {requirements.map(({ label, met }) => (
        <li
          key={label}
          className={`flex items-center gap-2 text-sm ${
            met ? "text-green-600" : "text-muted-foreground"
          }`}
        >
          {met ? <Check size={14} aria-hidden /> : <Circle size={14} aria-hidden />}
          <span>{label}</span>
          <span className="sr-only">{met ? "(atendido)" : "(não atendido)"}</span>
        </li>
      ))}
    </ul>
  );
};

export default PasswordStrength;
