import { Clock } from "lucide-react";
import { StatusHistoryEntry, OrderStatusLabel } from "@/data/orders";
import { formatDateTime } from "../utils/formatDateTime";

export const StatusTimeline = ({ history }: { history: StatusHistoryEntry[] }) => (
  <div className="relative ml-3 border-l border-border pl-6 py-2">
    {history.map((entry, i) => {
      const isLast = i === history.length - 1;

      return (
        <div key={`${entry.status}-${i}`} className="relative mb-4 last:mb-0">
          <div
            className={`absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border-2 ${
              isLast
                ? "border-primary bg-primary"
                : "border-muted-foreground/40 bg-background"
            }`}
          />

          <div className="flex flex-col gap-0.5">
            <span className={`text-sm font-medium ${isLast ? "text-foreground" : "text-muted-foreground"}`}>
              {OrderStatusLabel[entry.status]}
            </span>

            <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
              <Clock size={10} />
              {formatDateTime(entry.date)}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);