import { format } from "date-fns";
import {
  getActiveProgramOverview,
  getOwnClientRecord,
  getProgressData,
} from "../_lib/data-service";
import BestSets from "./BestSets";
import ProgressStats from "./ProgressStats";
import StrengthTrend from "./StrengthTrend";
import TrainingHistory from "./TrainingHistory";
import WeeklyConsistency from "./WeeklyConsistency";

async function ProgressContent({ range }) {
  const client = await getOwnClientRecord();
  const [progress, program] = await Promise.all([
    getProgressData(client.id, range),
    getActiveProgramOverview(client.id),
  ]);

  const rangeLabel = progress.since
    ? `${format(new Date(progress.since), "MMM d")} - ${format(new Date(), "MMM d, yyyy")}`
    : "All time";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="hidden md:inline-block text-right text-xs text-slate">
          {rangeLabel}
        </span>
        <ProgressStats stats={progress.stats} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <StrengthTrend trend={progress.trend} />
          <TrainingHistory history={progress.history} />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <BestSets bestSets={progress.bestSets} />
          {program && <WeeklyConsistency program={program} />}

          <div className="flex flex-col gap-2.5 rounded-xl bg-steel/50 p-4.5">
            <p className="font-medium">
              Progress isn&apos;t always a heavier bar.
            </p>
            <p className="text-sm text-slate">
              Better technique, steadier consistency, and simply showing up all
              count. Keep logging how each session feels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressContent;
