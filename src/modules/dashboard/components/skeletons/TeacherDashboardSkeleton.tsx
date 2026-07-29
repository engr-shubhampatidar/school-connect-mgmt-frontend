import { DataTableSkeleton, Skeleton } from "@/components/skeletons";

export default function TeacherDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 pb-28" aria-hidden>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-48 bg-slate-300" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-9 w-36 bg-slate-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-64 bg-slate-300" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="mx-auto h-6 w-20" />
                <Skeleton className="mx-auto h-4 w-32 bg-slate-300" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-b-md border-t-2 border-slate-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-9 w-36 bg-slate-300" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-start justify-between p-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-36 bg-slate-300" />
                <Skeleton className="h-4 w-56" />
              </div>
              <Skeleton className="h-9 w-56" rounded="lg" />
            </div>
            <DataTableSkeleton
              className="rounded-none border-0 border-t border-[#D7E3FC] shadow-none"
              showPagination={false}
              rows={6}
              columns={[
                { headerWidth: "w-20", cellWidth: "w-12" },
                { headerWidth: "w-28", avatar: true },
                { headerWidth: "w-36", cellWidth: "w-32", align: "right" },
              ]}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20 bg-slate-300" />
                </div>
                <Skeleton className="h-10 w-10" rounded="full" />
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16 bg-slate-300" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="space-y-3">
              <Skeleton className="h-4 w-36 bg-slate-300" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3"
                  >
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-32 bg-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
