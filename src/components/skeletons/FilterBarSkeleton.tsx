import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

type FilterBarSkeletonProps = {
  className?: string;
  selectCount?: number;
  showAction?: boolean;
};

export function FilterBarSkeleton({
  className,
  selectCount = 2,
  showAction = true,
}: FilterBarSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#D7E3FC] bg-white p-4",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 flex-1" rounded="md" />
        {Array.from({ length: selectCount }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-10 w-full sm:w-40"
            rounded="md"
          />
        ))}
        {showAction ? (
          <Skeleton className="h-10 w-24 bg-slate-300" rounded="md" />
        ) : null}
      </div>
    </div>
  );
}

export default FilterBarSkeleton;
