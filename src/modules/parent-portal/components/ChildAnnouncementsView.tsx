"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useChildAnnouncementsQuery } from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatErrorMessage,
  PortalEmpty,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
} from "@/modules/parent-portal/components/PortalState";

const PAGE_SIZE = 10;

export default function ChildAnnouncementsView({
  studentId,
}: {
  studentId: string;
}) {
  const [page, setPage] = useState(1);
  const query = useChildAnnouncementsQuery(studentId, {
    page,
    limit: PAGE_SIZE,
  });

  if (query.isLoading && !query.data) return <PortalLoading rows={3} />;
  if (query.error && !query.data) {
    return (
      <PortalError
        message={formatErrorMessage(
          query.error,
          "Failed to load announcements",
        )}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <PortalPageShell>
      <PortalPageHeader
        title="Announcements"
        description="School and class announcements for this student"
      />

      {items.length === 0 ? (
        <PortalEmpty title="No announcements yet" />
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <Card key={a.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                {a.pinned ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                    Pinned
                  </span>
                ) : null}
                <span>
                  {a.publishedAt
                    ? new Date(a.publishedAt).toLocaleString("en-IN")
                    : ""}
                </span>
                {a.authorName ? <span>· {a.authorName}</span> : null}
              </div>
              <h2 className="mt-3 text-xl font-semibold text-[#021034]">
                {a.title}
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#737373]">
                {a.body}
              </p>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </PortalPageShell>
  );
}
