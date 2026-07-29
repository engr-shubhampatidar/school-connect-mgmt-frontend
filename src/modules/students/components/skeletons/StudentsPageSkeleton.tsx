import {
  DataTableSkeleton,
  FilterBarSkeleton,
  PageHeaderSkeleton,
} from "@/components/skeletons";

export function StudentsTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <DataTableSkeleton
      rows={rows}
      showPagination
      columns={[
        { headerWidth: "w-14", cellWidth: "w-16", hideOnMobile: true },
        { headerWidth: "w-28", avatar: true },
        { headerWidth: "w-20", cellWidth: "w-24", hideOnMobile: true },
        { headerWidth: "w-24", cellWidth: "w-28" },
        { headerWidth: "w-16", cellWidth: "w-28", align: "right" },
      ]}
    />
  );
}

export default function StudentsPageSkeleton() {
  return (
    <div className="mx-auto animate-pulse px-4 py-6" aria-hidden>
      <PageHeaderSkeleton />
      <div className="mb-4">
        <FilterBarSkeleton selectCount={1} />
      </div>
      <StudentsTableSkeleton />
    </div>
  );
}
