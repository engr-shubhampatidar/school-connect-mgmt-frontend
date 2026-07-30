import {
  InfoGridSkeleton,
  PageHeaderSkeleton,
  ProfileHeaderSkeleton,
} from "@/components/skeletons";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentPortalProfileSkeleton() {
  return (
    <div className="animate-pulse p-3 md:p-6" aria-hidden>
      <PageHeaderSkeleton showCta={false} titleWidth="w-48" subtitleWidth="w-56" />
      <ProfileHeaderSkeleton pillCount={3} />
      <InfoGridSkeleton className="mb-5" fields={6} />
      <InfoGridSkeleton className="mb-5" fields={4} />
      <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
        <Skeleton className="mb-4 h-6 w-40 bg-slate-300" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" rounded="lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
