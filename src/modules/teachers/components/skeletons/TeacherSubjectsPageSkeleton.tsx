import { DataTableSkeleton, Skeleton } from "@/components/skeletons";

export default function TeacherSubjectsPageSkeleton() {
  return (
    <div className="animate-pulse p-6" aria-hidden>
      <div className="rounded-xl border border-[#D7E3FC] bg-white">
        <div className="flex items-start justify-between p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-44 bg-slate-300" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-56" rounded="lg" />
        </div>
        <DataTableSkeleton
          className="rounded-none border-0 border-t"
          showPagination={false}
          rows={6}
          columns={[
            { headerWidth: "w-28", cellWidth: "w-36" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24", hideOnMobile: true },
            { headerWidth: "w-16", cellWidth: "w-20", align: "right" },
          ]}
        />
      </div>
    </div>
  );
}
