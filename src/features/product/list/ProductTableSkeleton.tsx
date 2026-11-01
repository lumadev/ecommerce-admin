import { Skeleton } from "@/shared/components/ui/skeleton";

const ProductTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  const GRID_TEMPLATE = "grid-cols-[1.3fr_2fr_1fr_90px_80px_80px]";
  const renderHeader = () => (
    <div className={`mb-4 grid ${GRID_TEMPLATE} gap-4`}>
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-5 w-14 justify-self-end" />
      <Skeleton className="h-5 w-16 justify-self-center" />
      <Skeleton className="h-5 w-14 justify-self-center" />
    </div>
  );

  const renderMobileRow = (index: number) => (
    <div key={index} className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-14 w-14 shrink-0 rounded-md" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <Skeleton className="mt-4 h-4 w-full" />
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );

  const renderRow = (index: number) => (
    <div key={index} className={`grid ${GRID_TEMPLATE} gap-4 py-2`}>
      <Skeleton className="h-6 w-10/12" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-10/12" />
      <Skeleton className="h-6 w-14 justify-self-end" />
      <Skeleton className="h-6 w-16 justify-self-center" />
      <Skeleton className="h-6 w-14 justify-self-center" />
    </div>
  );

  return (
    <div role="status" aria-live="polite" aria-label="Carregando produtos">
      <div className="space-y-3 lg:hidden">
        {Array.from({ length: rows }).map((_, index) => renderMobileRow(index))}
      </div>

      <div className="hidden rounded-lg border border-border/50 p-4 lg:block">
        {renderHeader()}

        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, index) => renderRow(index))}
        </div>
      </div>
    </div>
  );
};

export default ProductTableSkeleton;