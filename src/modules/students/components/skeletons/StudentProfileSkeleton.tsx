import {
  InfoGridSkeleton,
  PageHeaderSkeleton,
  ProfileHeaderSkeleton,
  SideCardSkeleton,
  Skeleton,
} from "@/components/skeletons";

export default function StudentProfileSkeleton() {
  return (
    <div className="animate-pulse p-3 md:p-6" aria-hidden>
      <PageHeaderSkeleton showCta={false} titleWidth="w-64" subtitleWidth="w-72" />
      <ProfileHeaderSkeleton pillCount={3} />

      <div className="mb-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <InfoGridSkeleton fields={6} fullWidthField />
          <InfoGridSkeleton fields={4} title />
        </div>
        <div className="space-y-5">
          <SideCardSkeleton rows={4} maxWidth={false} />
          <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
            <Skeleton className="mb-4 h-5 w-36 bg-slate-300" />
            <Skeleton className="mb-3 h-24 w-full" rounded="lg" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
            <Skeleton className="mb-4 h-5 w-40 bg-slate-300" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" rounded="lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
