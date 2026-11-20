import { format } from "date-fns";

function BestSets({ bestSets }) {
  return (
    <div>
      <div className="rounded-xl border border-steel">
        <div className="flex items-center justify-between border-b border-steel px-4 py-3">
          <h2 className="font-medium">Your best sets</h2>
          <span className="font-mono text-xs text-slate">This range</span>
        </div>

        {bestSets.length === 0 ? (
          <p className="p-4 text-sm text-slate">
            No sets logged in this range yet.
          </p>
        ) : (
          <div className="divide-y divide-steel">
            {bestSets.map((set) => (
              <div key={set.name} className="flex flex-col gap-0.5 px-4 py-3">
                <span className="text-sm text-slate">{set.name}</span>
                <span className="text-lg font-medium">
                  {set.weight} kg × {set.reps}
                </span>
                <span className="font-mono text-xs text-slate">
                  {format(new Date(`${set.date}T00:00:00`), "MMM d")}
                  {set.delta > 0 ? ` · +${set.delate} kg` : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BestSets;
