import { Check } from "lucide-react";

import type { RoadmapTask } from "../types/roadmap.types";

interface RoadmapTaskItemProps {
  task: RoadmapTask;
  done?: boolean;
}

export const RoadmapTaskItem = ({ task, done = false }: RoadmapTaskItemProps) => (
  <li className="flex items-start gap-4 rounded-3xl border border-rose-100 bg-white p-5 shadow-[0_2px_12px_rgba(244,114,182,0.08)]">
    <span
      className={
        done
          ? "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-emerald-700"
          : "mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-dashed border-amber-300"
      }
    >
      {done && <Check className="h-4 w-4" strokeWidth={3} />}
    </span>
    <div>
      <p
        className={
          done ? "font-semibold text-slate-400 line-through" : "font-semibold text-slate-700"
        }
      >
        {task.title}
      </p>
      {task.note && <p className="mt-1 text-sm text-slate-400">{task.note}</p>}
      {task.tag && (
        <span className="mt-2 inline-block rounded-full bg-violet-50 px-3 py-0.5 text-xs font-semibold text-violet-400">
          {task.tag}
        </span>
      )}
    </div>
  </li>
);
