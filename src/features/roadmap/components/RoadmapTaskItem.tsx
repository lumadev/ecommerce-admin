import { Check } from "lucide-react";

import type { RoadmapTask } from "../types/roadmap.types";

interface RoadmapTaskItemProps {
  task: RoadmapTask;
  variant?: "todo" | "done" | "nextStep";
}

export const RoadmapTaskItem = ({
  task,
  variant = "todo",
}: RoadmapTaskItemProps) => {
  const isDone = variant === "done";
  const markerStyles =
    variant === "done"
      ? "bg-muted text-muted-foreground"
      : variant === "nextStep"
        ? "bg-primary/10 text-primary"
        : "border border-primary/30 bg-background";

  return (
    <li
      className={`flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground transition-colors hover:border-primary/30 ${
        isDone ? "opacity-75" : ""
      }`}
    >
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${markerStyles}`}
      >
        {isDone ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : (
          <span className="h-2 w-2 rounded-full bg-primary" />
        )}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p
          className={
            isDone
              ? "font-semibold text-muted-foreground"
              : "font-semibold leading-6 text-card-foreground"
          }
        >
          {task.title}
        </p>
        {task.note && (
          <p className="mt-1 text-sm text-muted-foreground">{task.note}</p>
        )}
        {task.tag && (
          <span className="mt-2 inline-block rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-secondary-foreground">
            {task.tag}
          </span>
        )}
      </div>
    </li>
  );
};