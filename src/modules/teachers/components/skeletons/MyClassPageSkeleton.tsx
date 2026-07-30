import { DataTableSkeleton, Skeleton } from "@/components/skeletons";

export default function MyClassPageSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6 p-6" aria-hidden>
      <div className="flex flex-row gap-6">
        <div className="w-full rounded-xl border border-[#D7E3FC] bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-48 bg-slate-300" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="ml-auto h-6 w-16 bg-slate-300" />
              <Skeleton className="ml-auto h-4 w-28" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#D7E3FC] bg-white">
        <div className="flex items-start justify-between p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-36 bg-slate-300" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-56" rounded="lg" />
        </div>
        <DataTableSkeleton
          className="rounded-none border-0 border-t"
          showPagination={false}
          rows={8}
          columns={[
            { headerWidth: "w-16", cellWidth: "w-12" },
            { headerWidth: "w-28", avatar: true },
            { headerWidth: "w-20", cellWidth: "w-20", hideOnMobile: true },
            { headerWidth: "w-24", cellWidth: "w-28", align: "right" },
          ]}
        />
      </div>
    </div>
  );
}
