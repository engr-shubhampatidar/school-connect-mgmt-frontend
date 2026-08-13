"use client";

import React from "react";
import { Megaphone } from "lucide-react";
import {
  getClassAnnouncements,
  type StudentAnnouncementItem,
} from "@/modules/students";
import { ensureSessionReady } from "@/modules/auth";
import { useToast } from "@/components/ui/use-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { AnnouncementsPageSkeleton } from "@/modules/announcements";

const PAGE_SIZE = 10;

export default function StudentAnnouncementsPage() {
  const [items, setItems] = React.useState<StudentAnnouncementItem[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const toastRef = React.useRef(toast);

  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const load = React.useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      await ensureSessionReady();
      const data = await getClassAnnouncements(p, PAGE_SIZE);
      setItems(data.items);
      setTotal(data.total);
      setPage(data.page);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load announcements";
      setError(message);
      toastRef.current?.({
        title: "Error",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load(page);
  }, [load, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isInitial = loading && items.length === 0 && !error;

  if (isInitial) {
    return <AnnouncementsPageSkeleton />;
  }

  return (
    <div className="mx-auto px-4 py-6 bg-[#F5F9FF] min-h-full">
      <div className="mb-6 flex items-start gap-3">
        <Megaphone className="mt-1 h-5 w-5 text-[#021034]" />
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">
            Announcements
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            School-wide and class announcements
          </p>
        </div>
      </div>

      {error && items.length === 0 ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">{error}</p>
            <Button variant="dark" onClick={() => void load(page)}>
              Retry
            </Button>
          </div>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-slate-500">
            No announcements yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : null}
          {items.map((a) => (
            <div
              key={a.id}
              className="w-full rounded-xl border border-[#D7E3FC] bg-white px-6 py-5"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                {a.pinned ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    Pinned
                  </span>
                ) : null}
                <span className="text-[13px]">
                  {a.publishedAt
                    ? new Date(a.publishedAt).toLocaleString()
                    : ""}
                </span>
                {a.authorName ? (
                  <span className="text-[13px]">· {a.authorName}</span>
                ) : null}
              </div>
              <h2 className="mt-3 text-[18px] font-[600] text-[#021034]">
                {a.title}
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-[#737373]">
                {a.body}
              </p>
            </div>
          ))}

          {totalPages > 1 ? (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
