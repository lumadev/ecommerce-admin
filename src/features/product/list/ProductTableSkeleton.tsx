import { Skeleton } from "@/shared/components/ui/skeleton";

const ProductTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  const GRID_TEMPLATE = "grid-cols-[1.3fr_2fr_1fr_90px_80px_80px]";
  const skeletonClass = "bg-muted/70 dark:bg-zinc-700 animate-pulse";

  const renderHeader = () => (
    <div className={`mb-4 grid ${GRID_TEMPLATE} gap-4`}>
      <Skeleton className={`h-5 w-28 ${skeletonClass}`} />
      <Skeleton className={`h-5 w-32 ${skeletonClass}`} />
      <Skeleton className={`h-5 w-24 ${skeletonClass}`} />
      <Skeleton className={`h-5 w-14 justify-self-end ${skeletonClass}`} />
      <Skeleton className={`h-5 w-16 justify-self-center ${skeletonClass}`} />
      <Skeleton className={`h-5 w-14 justify-self-center ${skeletonClass}`} />
    </div>
  );

  const renderRow = (index: number) => (
    <div key={index} className={`grid ${GRID_TEMPLATE} gap-4 py-2`}>
      <Skeleton className={`h-6 w-10/12 ${skeletonClass}`} />
      <Skeleton className={`h-6 w-full ${skeletonClass}`} />
      <Skeleton className={`h-6 w-10/12 ${skeletonClass}`} />
      <Skeleton className={`h-6 w-14 justify-self-end ${skeletonClass}`} />
      <Skeleton className={`h-6 w-16 justify-self-center ${skeletonClass}`} />
      <Skeleton className={`h-6 w-14 justify-self-center ${skeletonClass}`} />
    </div>
  );

  return (
    <div
      className="rounded-lg border border-border/50 p-4"
      role="status"
      aria-live="polite"
      aria-label="Carregando produtos"
    >
      {renderHeader()}

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => renderRow(index))}
      </div>
    </div>
  );
};

export default ProductTableSkeleton;