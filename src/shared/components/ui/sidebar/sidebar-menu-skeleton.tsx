import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/shared/components/ui/skeleton"

type SidebarMenuSkeletonProps = React.ComponentProps<"div"> & {
  showIcon?: boolean
}

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  SidebarMenuSkeletonProps
>(({ className, showIcon = false, ...props }, ref) => {
  // Generate width once and keep it stable
  const [width] = React.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  })

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}

      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})

SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

export { SidebarMenuSkeleton }