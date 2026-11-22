import Link from "next/link";
import { Suspense } from "react";
import ProgressSkeleton from "@/app/_components/ProgressSkeleton";
import ProgressContent from "@/app/_components/ProgressContent";
import SetPageTitle from "@/app/_components/SetPageTitle";

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

  return (
    <div className="group flex flex-col gap-6 sm:gap-8">
      <SetPageTitle title="Progress" />

      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase text-slate font-semibold">
          Your work is adding up
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Progress</h1>
        <p className="text-slate text-sm">
          See what&apos;s improving — not just what&apos;s on the bar.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl border border-steel p-1 transition-opacity group-has-[[data-loading]]:pointer-events-none group-has-[[data-loading]]:opacity-50">
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
      </div>

      <Suspense key={selectedRange} fallback={<ProgressSkeleton />}>
        <ProgressContent range={selectedRange} />
      </Suspense>
    </div>
  );
}

export default Page;
