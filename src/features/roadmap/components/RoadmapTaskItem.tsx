import { Check } from "lucide-react";

import type { RoadmapTask } from "../types/roadmap.types";

interface RoadmapTaskItemProps {
  task: RoadmapTask;
  done?: boolean;
}

export const RoadmapTaskItem = ({ task, done = false }: RoadmapTaskItemProps) => (
  <li
    className={`flex items-start gap-4 rounded-xl border border-border border-l-4 bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:shadow-md ${
      done ? "border-l-emerald-400" : "border-l-amber-400"
    }`}
  >
    <span
      className={
        done
          ? "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
          : "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-amber-300 bg-amber-50"
      }
    >
      {done ? (
        <Check className="h-4 w-4" strokeWidth={3} />
      ) : (
        <span className="h-2 w-2 rounded-full bg-amber-400" />
      )}
    </span>
    <div className="min-w-0 flex-1 pt-0.5">
      <p
        className={
          done
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