import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

export type DataTableColumnSkeleton = {
  headerWidth?: string;
  cellWidth?: string;
  avatar?: boolean;
  hideOnMobile?: boolean;
  align?: "left" | "right";
};

type DataTableSkeletonProps = {
  columns: DataTableColumnSkeleton[];
  rows?: number;
  showPagination?: boolean;
  className?: string;
};

export function DataTableSkeleton({
  columns,
  rows = 8,
  showPagination = true,
  className,
}: DataTableSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[#D7E3FC] bg-white",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={cn(
                    "px-4 py-4",
                    col.align === "right" ? "text-right" : "text-left",
                    col.hideOnMobile && "hidden lg:table-cell",
                  )}
                >
                  <Skeleton
                    className={cn(
                      "h-3",
                      col.headerWidth ?? "w-24",
                      col.align === "right" && "ml-auto",
                    )}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx} className="border-t border-[#D7E3FC]">
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={cn(
                      "px-4 py-3",
                      col.hideOnMobile && "hidden lg:table-cell",
                    )}
                  >
                    {col.avatar ? (
                      <div className="flex items-center gap-3">
                        <Skeleton
                          className="h-10 w-10 shrink-0"
                          rounded="full"
                        />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32 bg-slate-300" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                    ) : (
                      <Skeleton
                        className={cn(
                          "h-4",
                          col.cellWidth ?? "w-28",
                          col.align === "right" && "ml-auto",
                        )}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination ? (
        <>
          <div className="mt-4 border-t border-[#D7E3FC]" />
          <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
            <Skeleton className="h-4 w-36" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default DataTableSkeleton;
