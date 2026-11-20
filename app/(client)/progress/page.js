import ProgressStats from "@/app/_components/ProgressStats";
import {
  getActiveProgramOverview,
  getOwnClientRecord,
  getProgressData,
} from "@/app/_lib/data-service";
import { format } from "date-fns";
import Link from "next/link";

export const metadata = {
  title: "Progress",
};

const RANGES = [
  { value: "block", label: "This block" },
  { value: "4weeks", label: "4 weeks" },
  { value: "all", label: "All time" },
];

async function Page({ searchParams }) {
  const { range } = await searchParams;
  const selectedRange = RANGES.some((r) => r.value === range) ? range : "block";

  const client = await getOwnClientRecord();
  const [progress, program] = await Promise.all([
    getProgressData(client.id, selectedRange),
    getActiveProgramOverview(client.id),
  ]);

  const rangeLabel = progress.since
    ? `${format(new Date(progress.since), "MMM d")} - ${format(new Date(), "MMM d, yyyy")}`
    : "All time";

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-slate">
          Your work is adding up
        </p>
        <h1 className="text-3xl font-medium tracking-tight">Progress</h1>
        <p className="text-slate">
          See what&apos;s improving — not just what&apos;s on the bar.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl border border-steel p-1">
          {RANGES.map((r) => (
            <Link
              key={r.value}
              href={`/progress?range=${r.value}`}
              scroll={false}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${r.value === selectedRange ? "bg-iron text-paper" : "text-slate hover:bg-iron-100"}`}
            >
              {r.label}
            </Link>
          ))}
        </div>

        <span className="font-mono text-xs text-slate">{rangeLabel}</span>

        <ProgressStats stats={progress.stats} />
      </div>
    </div>
  );
}

export default Page;
