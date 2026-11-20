import { Trophy } from "@boxicons/react";
import { format } from "date-fns";

function BestSets({ bestSets }) {
  return (
    <div>
      <div className="rounded-xl border border-steel">
        <div className="flex items-center justify-between border-b border-steel px-4.5 py-3.5">
          <h2 className="font-medium">Your best sets</h2>
          <span className="text-xs text-slate">This range</span>
        </div>

        {bestSets.length === 0 ? (
          <p className="p-4 text-sm text-slate">
            No sets logged in this range yet.
          </p>
        ) : (
          <div className="divide-y divide-steel">
            {bestSets.map((set) => (
              <div key={set.name} className="flex items-center gap-3 p-4.5">
                <Trophy fill="#2e4c6d" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-slate">{set.name}</span>
                  <span className="text-lg font-medium">
                    {set.weight} kg × {set.reps}
                  </span>
                  <span className="text-xs text-slate">
                    {format(new Date(`${set.date}T00:00:00`), "MMM d")}
                    {set.delta > 0 ? ` · +${set.delate} kg` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BestSets;
