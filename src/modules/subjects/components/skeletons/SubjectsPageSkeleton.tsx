import { DataTableSkeleton, PageHeaderSkeleton } from "@/components/skeletons";

export default function SubjectsPageSkeleton() {
  return (
    <div className="mx-auto animate-pulse px-4 py-6" aria-hidden>
      <PageHeaderSkeleton />
      <DataTableSkeleton
        rows={10}
        columns={[
          { headerWidth: "w-32", cellWidth: "w-40" },
          { headerWidth: "w-28", cellWidth: "w-24" },
          { headerWidth: "w-24", cellWidth: "w-28", hideOnMobile: true },
        ]}
      />
    </div>
  );
}
