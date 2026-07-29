import { DataTableSkeleton, Skeleton } from "@/components/skeletons";

export default function StudentAttendanceHistorySkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 md:p-6" aria-hidden>
      <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14" rounded="full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 bg-slate-300" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Skeleton className="h-6 w-44 bg-slate-300" />
          <Skeleton className="h-9 w-40" rounded="md" />
        </div>
        <DataTableSkeleton
          className="rounded-none border-0"
          showPagination={false}
          rows={8}
          columns={[
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-20" },
            { headerWidth: "w-32", cellWidth: "w-40", hideOnMobile: true },
          ]}
        />
      </div>
    </div>
  );
}
