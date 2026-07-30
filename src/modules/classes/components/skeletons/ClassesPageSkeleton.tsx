import {
  DataTableSkeleton,
  FilterBarSkeleton,
  PageHeaderSkeleton,
  StatCardsGridSkeleton,
} from "@/components/skeletons";

export default function ClassesPageSkeleton() {
  return (
    <div className="mx-auto animate-pulse px-4 py-6" aria-hidden>
      <PageHeaderSkeleton />
      <StatCardsGridSkeleton
        count={3}
        className="mb-5"
        columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      />
      <div className="mb-5">
        <FilterBarSkeleton selectCount={1} />
      </div>
      <DataTableSkeleton
        rows={8}
        columns={[
          { headerWidth: "w-24", cellWidth: "w-28" },
          { headerWidth: "w-20", cellWidth: "w-20" },
          { headerWidth: "w-24", cellWidth: "w-16", hideOnMobile: true },
          { headerWidth: "w-28", cellWidth: "w-24", hideOnMobile: true },
          { headerWidth: "w-16", cellWidth: "w-24", align: "right" },
        ]}
      />
    </div>
  );
}
