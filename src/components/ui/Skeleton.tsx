import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: "md" | "lg" | "full" | "none";
};

export function Skeleton({
  className,
  rounded = "md",
  ...props
}: SkeletonProps) {
  const roundedClass =
    rounded === "full"
      ? "rounded-full"
      : rounded === "lg"
        ? "rounded-lg"
        : rounded === "none"
          ? ""
          : "rounded";

  return (
    <div
      className={cn("bg-slate-200", roundedClass, className)}
      {...props}
    />
  );
}

export default Skeleton;
