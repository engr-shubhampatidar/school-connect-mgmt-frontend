import { DataTableSkeleton, Skeleton } from "@/components/skeletons";

export default function ClassOverviewSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-4 md:p-6" aria-hidden>
      <div className="rounded-xl border border-[#D7E3FC] bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-slate-300" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28" rounded="md" />
            <Skeleton className="h-10 w-28" rounded="md" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-16 bg-slate-300" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#D7E3FC] bg-white">
        <div className="flex items-center justify-between border-b border-[#D7E3FC] px-4 py-5">
          <Skeleton className="h-6 w-48 bg-slate-300" />
          <Skeleton className="h-9 w-40" rounded="md" />
        </div>
        <DataTableSkeleton
          className="rounded-none border-0"
          showPagination={false}
          rows={5}
          columns={[
            { headerWidth: "w-28", cellWidth: "w-32" },
            { headerWidth: "w-24", cellWidth: "w-28", avatar: true },
            { headerWidth: "w-16", cellWidth: "w-20", align: "right" },
          ]}
        />
      </div>

      <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
        <Skeleton className="mb-4 h-6 w-36 bg-slate-300" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" rounded="lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
