import { DataTableSkeleton, Skeleton } from "@/components/skeletons";

export default function AttendanceSkeleton() {
  return (
    <div className="animate-pulse space-y-2 p-4 pb-20" aria-hidden>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-48 bg-slate-300" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-36 bg-slate-300" rounded="md" />
          </div>
        </div>
      </div>

      <div className="w-full rounded-xl border bg-white shadow-sm">
        <div className="flex items-start justify-between p-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 bg-slate-300" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-56" rounded="lg" />
        </div>
        <DataTableSkeleton
          className="rounded-none border-0 border-t shadow-none"
          showPagination={false}
          rows={8}
          columns={[
            { headerWidth: "w-16", cellWidth: "w-12" },
            { headerWidth: "w-28", avatar: true },
            { headerWidth: "w-32", cellWidth: "w-40", align: "right" },
          ]}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full border-t bg-white md:pl-64 lg:pl-72">
        <div className="mx-auto flex max-h-20 items-center justify-between px-6 py-4">
          <Skeleton className="h-4 w-64" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-9 w-36" rounded="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
