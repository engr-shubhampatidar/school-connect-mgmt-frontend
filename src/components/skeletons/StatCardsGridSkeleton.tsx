import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#D7E3FC] bg-white p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-7" />
      </div>
      <Skeleton className="mt-4 h-8 w-20 bg-slate-300" />
      <Skeleton className="mt-3 h-4 w-28" />
    </div>
  );
}

type StatCardsGridSkeletonProps = {
  count?: number;
  className?: string;
  columnsClassName?: string;
};

export function StatCardsGridSkeleton({
  count = 4,
  className,
  columnsClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}: StatCardsGridSkeletonProps) {
  return (
    <section className={cn("grid gap-4", columnsClassName, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </section>
  );
}

export default StatCardsGridSkeleton;
