function ProgressStats({ stats }) {
  const {
    completedCount,
    dueCount,
    consistency,
    loggedSessionCount,
    totalVolume,
    avgSessionMinutes,
    bestSet,
  } = stats;

  const cards = [
    {
      label: "Sessions complete",
      value: dueCount ? `${completedCount} / ${dueCount} ` : "-",
      note:
        consistency !== null
          ? `${consistency}% consistency`
          : "Nothing due yet",
      positive: consistency !== null && consistency >= 80,
    },
    {
      label: bestSet ? `${bestSet.name} best set` : "Best set",
      value: bestSet ? `${bestSet.weight} kg` : "-",
      note: !bestSet
        ? "No sets logged yet"
        : bestSet.delta > 0
          ? `+${bestSet.delta} kg in this range`
          : "Best set in this range",
      positive: bestSet?.delta > 0,
    },
    {
      label: "Total volume",
      value: totalVolume ? `${(totalVolume / 1000).toFixed(1)} t` : "-",
      note: `Across ${loggedSessionCount} ${loggedSessionCount === 1 ? "session" : "sessions"}`,
    },
    {
      label: "Average session",
      value: avgSessionMinutes ? `${avgSessionMinutes} min` : "-",
      note: "Estimated from logged sets",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-steel bg-steel lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="flex flex-col gap-1 bg-paper p-4">
          <span className="truncate text-sm text-slate">{card.label}</span>
          <span className="text-3xl font-medium">{card.value}</span>
          <span
            className={`text-xs ${card.positive ? "text-moss" : "text-slate"}`}
          >
            {card.note}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProgressStats;
