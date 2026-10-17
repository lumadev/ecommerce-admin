import { Check } from "lucide-react";

import type { RoadmapTask } from "../types/roadmap.types";

interface RoadmapTaskItemProps {
  task: RoadmapTask;
  done?: boolean;
}

export const RoadmapTaskItem = ({ task, done = false }: RoadmapTaskItemProps) => (
  <li className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground">
    <span
      className={
        done
          ? "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
          : "mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-dashed border-accent"
      }
    >
      {done && <Check className="h-4 w-4" strokeWidth={3} />}
    </span>
    <div>
      <p
        className={
          done
            ? "font-semibold text-muted-foreground line-through"
            : "font-semibold text-card-foreground"
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