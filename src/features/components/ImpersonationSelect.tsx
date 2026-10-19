import { LoaderCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useImpersonation } from "@/features/auth/hooks/useImpersonation";

const SELF_VALUE = "__self__";

interface ImpersonationSelectProps {
  onBeforeChange: () => void;
}

export const ImpersonationSelect = ({
  onBeforeChange,
}: ImpersonationSelectProps) => {
  const {
    canImpersonate,
    isImpersonating,
    impersonatedAdminId,
    targets,
    isLoading,
    isRefreshing,
    isSwitching,
    impersonate,
    stopImpersonation,
  } = useImpersonation();

  if (!canImpersonate) return null;

  if (isLoading) {
    return (
      <div
        className="ml-auto flex shrink-0 items-center gap-2"
        role="status"
        aria-label="Carregando admins para impersonate"
      >
        <span className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:block">
          Ver como
        </span>
        <Skeleton className="h-9 w-56 opacity-60" />
      </div>
    );
  }

  const handleChange = (value: string) => {
    onBeforeChange();

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
        <SelectTrigger className="h-9 w-56 border-border bg-card text-card-foreground">
          <SelectValue placeholder="Selecionar admin" />
          {(isSwitching || isRefreshing) && (
            <LoaderCircle
              className="mr-2 h-3.5 w-3.5 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </SelectTrigger>
        <SelectContent className="border-border bg-card text-card-foreground">
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
