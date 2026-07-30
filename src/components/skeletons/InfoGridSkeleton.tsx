import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

type InfoGridSkeletonProps = {
  fields?: number;
  className?: string;
  title?: boolean;
  fullWidthField?: boolean;
};

export function InfoGridSkeleton({
  fields = 6,
  className,
  title = true,
  fullWidthField = false,
}: InfoGridSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-blue-200 bg-white p-4",
        className,
      )}
    >
      {title ? <Skeleton className="mb-5 h-6 w-48 bg-slate-300" /> : null}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: fields }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-blue-200 bg-blue-50/50 p-3"
          >
            <Skeleton className="mb-2 h-3 w-20" />
            <Skeleton className="h-4 w-36 bg-slate-300" />
          </div>
        ))}
      </div>
      {fullWidthField ? (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
          <Skeleton className="mb-2 h-3 w-20" />
          <Skeleton className="h-4 w-3/4 bg-slate-300" />
        </div>
      ) : null}
    </div>
  );
}

export default InfoGridSkeleton;
