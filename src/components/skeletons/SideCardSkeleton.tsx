import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

type SideCardSkeletonProps = {
  rows?: number;
  className?: string;
  maxWidth?: boolean;
};

export function SideCardSkeleton({
  rows = 4,
  className,
  maxWidth = true,
}: SideCardSkeletonProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-[#D7E3FC] bg-white p-4",
        maxWidth && "max-w-sm",
        className,
      )}
    >
      <div className="mb-4 space-y-2">
        <Skeleton className="h-6 w-36 bg-slate-300" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-slate-100 px-4 py-3"
          >
            <Skeleton className="h-8 w-8 shrink-0" rounded="md" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideCardSkeleton;
