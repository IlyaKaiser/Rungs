function WeeklyConsistency({ program }) {
  const weeks = program.weekNumbers.filter(
    (week) => week <= program.currentWeek,
  );
  const current = program.weekProgress[program.currentWeek];
  const currentIsOpen = current && current.completed < current.total;

  return (
    <div className="rounded-xl border border-steel">
      <div className="flex items-center justify-between border-b border-steel px-4.5 py-3.5">
        <h2 className="font-medium">Weekly consistency</h2>
        <span className="text-xs text-slate">Sessions</span>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {weeks.map((week) => {
          const { total, completed } = program.weekProgress[week];

          return (
            <div key={week} className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-sm text-slate">
                Week {week}
              </span>

              <div className="flex flex-1 gap-1">
                {Array.from({ length: total }, (_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 flex-1 rounded-full ${i < completed ? "bg-moss" : "bg-steel"}`}
                  />
                ))}
              </div>

              <span className="font-mono text-xs text-slate">
                {completed} / {total}
              </span>
            </div>
          );
        })}

        {currentIsOpen && (
          <p className="text-xs text-slate">
            Week {program.currentWeek} is still in progress.
          </p>
        )}
      </div>
    </div>
  );
}

export default WeeklyConsistency;
