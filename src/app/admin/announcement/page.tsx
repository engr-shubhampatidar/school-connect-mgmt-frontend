"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  AnnouncementCard,
  CreateAnnouncementDialog,
  AnnouncementsPageSkeleton,
  fetchAnnouncements,
  type Announcement,
} from "@/modules/announcements";

export default function Page() {
  const [openCreate, setOpenCreate] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAnnouncements({ page: 1, pageSize: 50 });
        if (!mounted) return;
        setAnnouncements(res.announcements ?? []);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Failed to load announcements");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading && !announcements && !error) {
    return <AnnouncementsPageSkeleton />;
  }

  return (
    <div className="mx-auto p-6 gap-6 flex flex-col">
      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] text-[#021034] font-[600]">
              Announcement Board
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage and schedule school-wide communication
            </p>
          </div>

          <div>
            <Button variant="dark" onClick={() => setOpenCreate(true)}>
              + Create Announcement
            </Button>
            <CreateAnnouncementDialog
              open={openCreate}
              onClose={() => setOpenCreate(false)}
            />
          </div>
        </div>
      </section>

      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && announcements && announcements.length === 0 && (
        <div className="text-sm text-gray-600">No announcements found.</div>
      )}

      {announcements &&
        announcements.map((a) => {
          const date = a.createdAt ?? null;
          const dateTime = date ? new Date(date).toLocaleString() : "";

          const parseAttachments = (raw?: any) => {
            if (!raw) return undefined;
            // Try JSON parse first (server may return JSON stringified array)
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                return parsed.map((it: any) =>
                  it && typeof it === "object"
                    ? {
                        filename: it.filename ?? null,
                        url: it.url ?? null,
                      }
                    : { filename: String(it), url: String(it) },
                );
              }
            } catch (e) {
              // ignore
            }

            // If it's already an array, normalize entries
            if (Array.isArray(raw)) {
              return raw.map((it: any) =>
                it && typeof it === "object"
                  ? {
                      filename: it.filename ?? it.name ?? null,
                      url: it.url ?? it.path ?? it.fileUrl ?? null,
                    }
                  : { filename: String(it), url: String(it) },
              );
            }

            // If it's an object (single attachment), wrap into array
            if (raw && typeof raw === "object") {
              return [
                (raw.filename ?? null)
                  ? {
                      filename: raw.filename ?? null,
                      url: raw.url ?? null,
                    }
                  : { filename: String(raw), url: String(raw) },
              ];
            }

            // From here, treat as string. Try JSON parse first (server may return JSON stringified array)
            if (typeof raw === "string") {
              try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                  return parsed.map((it: any) =>
                    it && typeof it === "object"
                      ? {
                          filename: it.filename ?? it.name ?? null,
                          url: it.url ?? it.path ?? it.fileUrl ?? null,
                        }
                      : { filename: String(it), url: String(it) },
                  );
                }
                if (parsed && typeof parsed === "object") {
                  return [
                    parsed.filename || parsed.name || null
                      ? {
                          filename: parsed.filename ?? parsed.name ?? null,
                          url:
                            parsed.url ?? parsed.path ?? parsed.fileUrl ?? null,
                        }
                      : { filename: String(parsed), url: String(parsed) },
                  ];
                }
              } catch (e) {
                // ignore
              }

              // Fallback: comma-separated URLs or single URL string
              const parts = raw
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              return parts.map((p) => ({
                filename: p.split("/").pop() ?? p,
                url: p,
              }));
            }

            // Last resort: coerce to string
            const s = String(raw);
            if (!s) return undefined;
            return [
              {
                filename: s.split("/").pop() ?? s,
                url: s,
              },
            ];
          };

          const attachments = parseAttachments(a.attachments ?? null);

          return (
            <AnnouncementCard
              key={a.id}
              status={a.status ?? "Active"}
              role={a.role ?? "All"}
              dateTime={dateTime}
              title={a.title}
              message={a?.message ?? ""}
              attachments={attachments}
            />
          );
        })}
    </div>
  );
}
