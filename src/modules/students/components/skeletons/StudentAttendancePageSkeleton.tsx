import { DataTableSkeleton, PageHeaderSkeleton } from "@/components/skeletons";

export default function StudentAttendancePageSkeleton() {
  return (
    <div className="mx-auto animate-pulse px-4 py-6" aria-hidden>
      <PageHeaderSkeleton showCta={false} titleWidth="w-48" subtitleWidth="w-64" />
      <DataTableSkeleton
        rows={8}
        showPagination
        columns={[
          { headerWidth: "w-24", cellWidth: "w-28" },
          { headerWidth: "w-20", cellWidth: "w-20" },
          { headerWidth: "w-40", cellWidth: "w-48", hideOnMobile: true },
        ]}
      />
    </div>
  );
}
