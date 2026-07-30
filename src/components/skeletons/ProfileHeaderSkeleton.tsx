import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

type ProfileHeaderSkeletonProps = {
  className?: string;
  pillCount?: number;
};

export function ProfileHeaderSkeleton({
  className,
  pillCount = 2,
}: ProfileHeaderSkeletonProps) {
  return (
    <div
      className={cn(
        "mb-5 flex items-center gap-6 rounded-xl border border-[#D7E3FC] bg-white p-4",
        className,
      )}
    >
      <Skeleton className="h-[62px] w-[62px] shrink-0" rounded="full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-7 w-48 bg-slate-300" />
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          {Array.from({ length: pillCount }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-5", i === 0 ? "w-28" : "w-16")}
              rounded="full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeaderSkeleton;
