import { Skeleton } from "@/shared/components/ui/skeleton";

const CategoryTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  const GRID_TEMPLATE = "grid-cols-[1.3fr_2fr_80px]";
  const skeletonClass =
    "bg-muted/70 dark:bg-zinc-700 animate-pulse";

  const renderHeader = () => (
    <div className={`mb-4 grid ${GRID_TEMPLATE} gap-4`}>
      <Skeleton className={`h-5 w-36 ${skeletonClass}`} />
      <Skeleton className={`h-5 w-40 ${skeletonClass}`} />
      <Skeleton className={`h-5 w-12 justify-self-end ${skeletonClass}`} />
    </div>
  );

  const renderRow = (index: number) => (
    <div key={index} className={`grid ${GRID_TEMPLATE} gap-4 py-2`}>
      <Skeleton className={`h-6 w-10/12 ${skeletonClass}`} />
      <Skeleton className={`h-6 w-full ${skeletonClass}`} />
      <Skeleton className={`h-6 w-12 justify-self-end ${skeletonClass}`} />
    </div>
  );

  return (
    <div
      className="rounded-lg border border-border/50 p-4"
      role="status"
      aria-live="polite"
      aria-label="Carregando categorias"
    >
      {renderHeader()}

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) =>
          renderRow(index)
        )}
      </div>
    </div>
  );
};

export default CategoryTableSkeleton;