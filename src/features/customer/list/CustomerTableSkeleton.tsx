import { Skeleton } from "@/shared/components/ui/skeleton";

const CustomerTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  const GRID_TEMPLATE = "grid-cols-[1.3fr_1.5fr_1fr_80px]";
  return (
    <div
      className="rounded-lg border border-border/50 p-4"
      role="status"
      aria-live="polite"
      aria-label="Carregando clientes"
    >
      <div className={`mb-4 grid ${GRID_TEMPLATE} gap-4`}>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-12 justify-self-end" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className={`grid ${GRID_TEMPLATE} gap-4 py-2`}>
            <Skeleton className="h-6 w-10/12" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-12 justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTableSkeleton;
