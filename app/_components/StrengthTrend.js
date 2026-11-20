"use client";

import { useState } from "react";
import { format } from "date-fns";
import { IBM_Plex_Sans } from "next/font/google";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const shortDate = (date) => format(new Date(`${date}T00:00:00`), "MMM dd");

function TrendChart({ points }) {
  const weights = points.map((p) => p.weight);
  const lo = Math.min(...weights);
  const hi = Math.max(...weights);
  const span = hi - lo || 10;
  const min = lo - span * 0.2;
  const max = hi + span * 0.2;

  const x = (i) =>
    points.length === 1 ? 50 : 4 + (i / (points.length - 1)) * 92;
  const y = (weight) => 100 - ((weight - min) / (max - min)) * 100;

  const gridLevels = [0, 1, 2, 3].map((i) => min + ((max - min) * i) / 3);

  const first = points[0];
  const last = points.at(-1);
  const labelPoints =
    points.length > 2
      ? [first, points[Math.floor((points.length - 1) / 2)], last]
      : points;
  const e1rmChanged = points.length > 1 && last.e1rm !== first.e1rm;

  return (
    <div className="flex flex-col gap-4">
      <p className="mt-4 text-sm text-slate">
        {points.length > 1
          ? `${first.weight} → ${last.weight} kg`
          : `${first.weight} kg × ${first.reps}`}
      </p>

      <div className="relative mt-4 h-48 pl-10">
        <div className="relative h-full">
          {gridLevels.map((level) => (
            <div
              key={level}
              className="absolute left-0 right-0 border-t border-steel"
              style={{ top: `${y(level)}%` }}
            >
              <span className="absolute -left-10 -translate-y-1/2 font-mono text-xs text-slate">
                {Math.round(level)}
              </span>
            </div>
          ))}

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline
              points={points.map((p, i) => `${x(i)},${y(p.weight)}`).join(" ")}
              fill="none"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              style={{ stroke: "var(--color-iron)" }}
            />
          </svg>

          {points.map((p, i) => (
            <div
              key={p.date}
              className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-iron bg-paper"
              style={{ left: `${x(i)}%`, top: `${y(p.weight)}%` }}
            />
          ))}
        </div>
      </div>

      <div
        className={`mt-2 flex pl-10 font-mono text-xs text-slate ${
          points.length === 1 ? "justify-center" : "justify-between"
        }`}
      >
        {labelPoints.map((p) => (
          <span key={p.date}>{shortDate(p.date)}</span>
        ))}
      </div>

      <p className="pt-4 text-sm text-slate">
        Estimated 1-rep max: {last.e1rm} kg
        {e1rmChanged
          ? `, ${last.e1rm > first.e1rm ? "up" : "down"} from ${first.e1rm} kg`
          : ""}
        .
      </p>
    </div>
  );
}

function StrengthTrend({ trend }) {
  const lifts = Object.keys(trend).sort(
    (a, b) => trend[b].length - trend[a].length,
  );

  const [selected, setSelected] = useState(lifts[0] ?? null);

  const lift = trend[selected] ? selected : (lifts[0] ?? null);
  const points = lift ? trend[lift] : [];

  const change =
    points.length > 1
      ? Math.round(
          ((points.at(-1).weight - points[0].weight) / points[0].weight) * 100,
        )
      : null;

  return (
    <div className="rounded-xl border border-steel">
      <div className="flex items-center justify-between border-b border-steel px-4.5 py-3.5">
        <h2 className="font-medium">Strength trend</h2>
        <span className="text-xs text-slate">Best working set</span>
      </div>

      {!lift ? (
        <p className="p-4.5 text-sm text-slate">
          Log a few sessions and your lifts will show up here.
        </p>
      ) : (
        <div className="flex flex-col p-4.5">
          <div className="flex items-center justify-between gap-4">
            <Select value={lift} onValueChange={setSelected}>
              <SelectTrigger
                aria-label="Choose a lift"
                className="w-fit rounded-lg border border-steel bg-paper px-3 py-2 text-sm font-medium focus:border-iron"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {lifts.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {change !== null && (
              <span
                className={`rounded-xl px-2 py-1 text-sm ${
                  change > 0 ? "bg-moss-100 text-moss" : "bg-steel text-slate"
                }`}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            )}
          </div>

          <TrendChart points={points} />
        </div>
      )}
    </div>
  );
}

export default StrengthTrend;
