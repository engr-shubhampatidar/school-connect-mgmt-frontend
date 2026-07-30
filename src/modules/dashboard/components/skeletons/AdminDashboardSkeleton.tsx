import {
  PageHeaderSkeleton,
  SideCardSkeleton,
  Skeleton,
  StatCardsGridSkeleton,
} from "@/components/skeletons";

function ChartCardSkeleton() {
  return (
    <div className="w-full rounded-xl border border-[#D7E3FC] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 bg-slate-300" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" rounded="md" />
          <Skeleton className="h-9 w-24" rounded="md" />
        </div>
      </div>
      <div className="mt-12 flex h-56 items-end gap-3 px-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            rounded="md"
            style={{ height: `${40 + ((i * 17) % 50)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function RecentActivitySkeleton() {
  return (
    <div className="w-full rounded-xl border border-[#D7E3FC] bg-white p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44 bg-slate-300" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-32" rounded="lg" />
      </div>
      <div className="divide-y">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3 px-2">
              <Skeleton className="h-9 w-9" rounded="full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 bg-slate-300" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardSkeleton() {
  return (
    <div className="animate-pulse px-6 py-6" aria-hidden>
      <PageHeaderSkeleton
        className="mb-4 pl-4"
        showCta={false}
        titleWidth="w-56"
        subtitleWidth="w-32"
      />

      <StatCardsGridSkeleton count={4} />

      <div className="flex flex-col">
        <section className="mt-6 flex flex-row gap-6">
          <ChartCardSkeleton />
          <SideCardSkeleton rows={4} />
        </section>

        <section className="mt-6 flex flex-row gap-6">
          <div className="w-full">
            <RecentActivitySkeleton />
          </div>
          <SideCardSkeleton rows={4} />
        </section>
      </div>
    </div>
  );
}
