import { Skeleton } from "@/shared/components/ui/skeleton";

const skeletonClass = "bg-muted/70 dark:bg-zinc-700";

const MerchantDetailsSkeleton = () => (
  <div
    className="space-y-8"
    role="status"
    aria-live="polite"
    aria-label="Carregando detalhes da loja"
  >
    <div className="space-y-3">
      <Skeleton className={`h-9 w-20 ${skeletonClass}`} />
      <div className="space-y-2">
        <Skeleton className={`h-7 w-40 ${skeletonClass}`} />
        <Skeleton className={`h-4 w-56 ${skeletonClass}`} />
      </div>
    </div>

    <div className="max-w-3xl space-y-5 rounded-lg border border-border bg-card p-5">
      <div className="grid gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className={`h-4 w-20 ${skeletonClass}`} />
            <Skeleton className={`h-10 w-full ${skeletonClass}`} />
          </div>
        ))}
        <Skeleton className={`h-20 w-full ${skeletonClass}`} />
        <div className="flex items-center gap-3">
          <Skeleton className={`h-5 w-9 rounded-full ${skeletonClass}`} />
          <Skeleton className={`h-4 w-24 ${skeletonClass}`} />
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Skeleton className={`h-10 w-24 ${skeletonClass}`} />
        <Skeleton className={`h-10 w-36 ${skeletonClass}`} />
      </div>
    </div>

    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className={`h-6 w-36 ${skeletonClass}`} />
          <Skeleton className={`h-4 w-64 ${skeletonClass}`} />
        </div>
        <Skeleton className={`h-10 w-32 ${skeletonClass}`} />
      </div>
      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 py-2">
            <Skeleton className={`h-5 w-3/4 ${skeletonClass}`} />
            <Skeleton className={`h-5 w-4/5 ${skeletonClass}`} />
            <Skeleton className={`h-5 w-full ${skeletonClass}`} />
            <Skeleton className={`h-5 w-8 justify-self-end ${skeletonClass}`} />
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default MerchantDetailsSkeleton;