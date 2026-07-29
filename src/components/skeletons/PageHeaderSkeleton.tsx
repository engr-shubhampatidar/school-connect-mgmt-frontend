import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

type PageHeaderSkeletonProps = {
  className?: string;
  showCta?: boolean;
  titleWidth?: string;
  subtitleWidth?: string;
};

export function PageHeaderSkeleton({
  className,
  showCta = true,
  titleWidth = "w-56",
  subtitleWidth = "w-72",
}: PageHeaderSkeletonProps) {
  return (
    <div
      className={cn(
        "mb-6 flex items-center justify-between gap-4",
        className,
      )}
    >
      <div className="space-y-2">
        <Skeleton className={cn("h-7 bg-slate-300", titleWidth)} />
        <Skeleton className={cn("h-4", subtitleWidth)} />
      </div>
      {showCta ? <Skeleton className="h-10 w-32" rounded="lg" /> : null}
    </div>
  );
}

export default PageHeaderSkeleton;
