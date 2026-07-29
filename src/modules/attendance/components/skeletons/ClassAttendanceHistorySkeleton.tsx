import { PageHeaderSkeleton, Skeleton } from "@/components/skeletons";

export default function ClassAttendanceHistorySkeleton() {
  return (
    <div className="mx-auto animate-pulse space-y-4 p-6" aria-hidden>
      <PageHeaderSkeleton showCta={false} titleWidth="w-56" subtitleWidth="w-64" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-[#D7E3FC] bg-white p-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-5 w-36 bg-slate-300" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20" rounded="full" />
              <Skeleton className="h-6 w-20" rounded="full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
