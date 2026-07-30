import { PageHeaderSkeleton, Skeleton } from "@/components/skeletons";

function AnnouncementCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#D7E3FC] bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-5 w-16" rounded="full" />
        <Skeleton className="h-5 w-20" rounded="full" />
        <Skeleton className="ml-auto h-4 w-28" />
      </div>
      <Skeleton className="mb-2 h-6 w-64 bg-slate-300" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" rounded="md" />
        <Skeleton className="h-8 w-24" rounded="md" />
      </div>
    </div>
  );
}

export default function AnnouncementsPageSkeleton() {
  return (
    <div className="mx-auto flex animate-pulse flex-col gap-6 p-6" aria-hidden>
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AnnouncementCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
