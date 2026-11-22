function Block({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-steel ${className}`} />;
}

function ProgressSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading progress"
      data-loading
      className="flex flex-col gap-6 sm:gap-8"
    >
      <div className="flex flex-col gap-3">
        <Block className="ml-auto h-4 w-40" />

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-steel bg-steel lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-2 bg-paper p-4">
              <Block className="h-4 w-24" />
              <Block className="h-8 w-20" />
              <Block className="h-3 w-28" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex flex-col gap-4 rounded-xl border border-steel p-4">
            <Block className="h-5 w-32" />
            <Block className="h-48 w-full" />
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-steel p-4">
            <Block className="h-5 w-36" />
            {Array.from({ length: 3 }, (_, i) => (
              <Block key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-steel p-4"
            >
              <Block className="h-5 w-28" />
              <Block className="h-10 w-full" />
              <Block className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressSkeleton;
