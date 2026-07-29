import {
  DataTableSkeleton,
  InfoGridSkeleton,
  PageHeaderSkeleton,
  ProfileHeaderSkeleton,
  Skeleton,
} from "@/components/skeletons";

export default function TeacherProfileSkeleton() {
  return (
    <div className="animate-pulse p-3 md:p-6" aria-hidden>
      <PageHeaderSkeleton titleWidth="w-64" subtitleWidth="w-48" />
      <ProfileHeaderSkeleton />
      <InfoGridSkeleton className="mb-5" fields={6} fullWidthField />
      <div className="mb-5">
        <div className="mb-0 flex items-center justify-between rounded-t-xl border border-b-0 border-[#D7E3FC] bg-white px-4 py-6">
          <Skeleton className="h-7 w-64 bg-slate-300" />
          <Skeleton className="h-10 w-56" rounded="md" />
        </div>
        <DataTableSkeleton
          className="rounded-t-none"
          showPagination={false}
          rows={2}
          columns={[
            { headerWidth: "w-16", cellWidth: "w-20" },
            { headerWidth: "w-16", cellWidth: "w-16" },
            { headerWidth: "w-20", cellWidth: "w-32" },
            { headerWidth: "w-16", cellWidth: "w-24" },
            { headerWidth: "w-16", cellWidth: "w-20", align: "right" },
          ]}
        />
      </div>
      <div className="flex w-full p-3 md:p-6">
        <Skeleton className="mx-auto h-4 w-96 max-w-full" />
      </div>
    </div>
  );
}
