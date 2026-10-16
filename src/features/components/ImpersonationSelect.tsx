import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useImpersonation } from "@/features/auth/hooks/useImpersonation";

const SELF_VALUE = "__self__";

export const ImpersonationSelect = () => {
  const {
    canImpersonate,
    isImpersonating,
    impersonatedAdminId,
    targets,
    isSwitching,
    impersonate,
    stopImpersonation,
  } = useImpersonation();

  if (!canImpersonate) return null;

  const handleChange = (value: string) => {
    if (value === SELF_VALUE) {
      void stopImpersonation();
      return;
    }

    void impersonate(value);
  };

  return (
    <div className="ml-auto flex shrink-0 items-center gap-2">
      <span className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:block">
        {isImpersonating ? "Visualizando como" : "Ver como"}
      </span>
      <Select
        value={impersonatedAdminId ?? SELF_VALUE}
        onValueChange={handleChange}
        disabled={isSwitching}
      >
        <SelectTrigger className="h-9 w-56">
          <SelectValue placeholder="Selecionar admin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SELF_VALUE}>Minha conta (Super Admin)</SelectItem>
          {targets.map((target) => (
            <SelectItem key={target.id} value={target.id}>
              {target.store?.name
                ? `${target.name} - ${target.store.name}`
                : target.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
