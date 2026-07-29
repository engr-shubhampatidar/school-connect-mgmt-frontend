import {
  DataTableSkeleton,
  FilterBarSkeleton,
  PageHeaderSkeleton,
  StatCardsGridSkeleton,
} from "@/components/skeletons";

const teacherTableColumns = [
  { headerWidth: "w-14", cellWidth: "w-16", hideOnMobile: true },
  { headerWidth: "w-28", avatar: true },
  { headerWidth: "w-24", cellWidth: "w-28" },
  { headerWidth: "w-28", cellWidth: "w-24", hideOnMobile: true },
  { headerWidth: "w-40", cellWidth: "w-36", hideOnMobile: true },
  { headerWidth: "w-16", cellWidth: "w-24", align: "right" as const },
];

export function TeachersTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <DataTableSkeleton
      columns={teacherTableColumns}
      rows={rows}
      showPagination
    />
  );
}

export default function TeachersPageSkeleton() {
  return (
    <div className="mx-auto animate-pulse px-4 py-6" aria-hidden>
      <PageHeaderSkeleton />
      <StatCardsGridSkeleton count={4} className="mb-5" />
      <div className="mb-5">
        <FilterBarSkeleton />
      </div>
      <TeachersTableSkeleton />
    </div>
  );
}
