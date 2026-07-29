import { Skeleton } from "@/components/skeletons";

export default function StudentDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-4 md:p-6" aria-hidden>
      <div className="space-y-2">
        <Skeleton className="h-7 w-56 bg-slate-300" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
            <Skeleton className="mb-4 h-6 w-40 bg-slate-300" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-4 py-3"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-slate-300" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16" rounded="full" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
            <Skeleton className="mb-4 h-6 w-36 bg-slate-300" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" rounded="lg" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
            <Skeleton className="mb-4 h-6 w-40 bg-slate-300" />
            <Skeleton className="mx-auto h-40 w-40" rounded="full" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
            <Skeleton className="mb-4 h-5 w-36 bg-slate-300" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" rounded="lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
