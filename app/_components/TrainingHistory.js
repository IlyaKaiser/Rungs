import { format } from "date-fns";
import Link from "next/link";

const STATUS = {
  complete: { label: "Complete", className: "text-xs bg-moss-100 text-moss" },
  in_progress: {
    label: "In progress",
    className: "text-xs bg-iron-100 text-iron",
  },
  missed: { label: "Missed", className: "text-xs bg-rust-100 text-rust" },
};

function TrainingHistory({ history }) {
  return (
    <div className="rounded-xl border border-steel">
      <div className="flex items-center justify-between border-b border-steel px-4.5 py-3.5">
        <h2 className="font-medium">Training history</h2>
        <span className="text-xs text-slate">Recent sessions</span>
      </div>

      {history.length === 0 ? (
        <p className="p-4 text-sm text-slate">No sessions in this range yet.</p>
      ) : (
        <div className="divide-y divide-steel">
          {history.map((entry) => {
            const status = STATUS[entry.status];
            const details = [
              entry.minutes ? `${entry.minutes} min` : null,
              entry.setCount > 0
                ? `${entry.setCount} ${entry.setCount === 1 ? "set" : "sets"}`
                : null,
              entry.topSet
                ? `${entry.topSet.name} ${entry.topSet.weight} kg × ${entry.topSet.reps}`
                : null,
            ].filter(Boolean);

            return (
              <Link
                key={entry.id}
                href={`/program/${entry.id}`}
                className="flex items-center justify-between gap-3 p-4.5 transition-colors hover:bg-slate/5"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-xs text-slate">
                    {format(new Date(entry.date), "MMM d")}
                  </span>
                  <span className="truncate font-medium text-ink">
                    {entry.name}
                  </span>
                  {details.length > 0 && (
                    <span className="truncate text-xs text-slate">
                      {details.join(" · ")}
                    </span>
                  )}
                </div>

                <span
                  className={`shrink-0 rounded-xl px-2 py-1 text-sum ${status.className}`}
                >
                  {status.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TrainingHistory;
