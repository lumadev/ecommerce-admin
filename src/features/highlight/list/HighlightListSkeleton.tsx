import { Skeleton } from "@/shared/components/ui/skeleton";

const HighlightListSkeleton = ({ items = 4 }: { items?: number }) => {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-live="polite"
      aria-label="Carregando destaques"
    >
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4"
        >
          <Skeleton className="h-16 w-16 shrink-0 rounded-md bg-muted/70 dark:bg-zinc-700" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 bg-muted/70 dark:bg-zinc-700" />
            <Skeleton className="h-3 w-1/2 bg-muted/70 dark:bg-zinc-700" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HighlightListSkeleton;
