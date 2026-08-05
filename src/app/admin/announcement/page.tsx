"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  AnnouncementCard,
  AnnouncementFormDialog,
  AnnouncementsPageSkeleton,
  deleteAnnouncement,
  fetchAnnouncements,
  type Announcement,
} from "@/modules/announcements";

export default function Page() {
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAnnouncements({ page: 1, limit: 50 });
      setAnnouncements(res.data ?? []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load announcements";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSaved = (saved: Announcement) => {
    setAnnouncements((prev) => {
      if (!prev) return [saved];
      const idx = prev.findIndex((a) => a.id === saved.id);
      if (idx === -1) return [saved, ...prev];
      const next = [...prev];
      next[idx] = saved;
      return next;
    });
  };

  const handleDelete = async (announcement: Announcement) => {
    const confirmed = window.confirm(
      `Delete announcement "${announcement.title}"?`,
    );
    if (!confirmed) return;

    setDeletingId(announcement.id);
    setError(null);
    try {
      await deleteAnnouncement(announcement.id);
      setAnnouncements((prev) =>
        (prev ?? []).filter((a) => a.id !== announcement.id),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete announcement";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && !announcements && !error) {
    return <AnnouncementsPageSkeleton />;
  }

  return (
    <div className="mx-auto flex flex-col gap-6 p-6">
      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-[600] text-[#021034]">
              Announcement Board
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage school-wide and class-specific announcements
            </p>
          </div>

          <div>
            <Button
              variant="dark"
              onClick={() => {
                setEditing(null);
                setOpenForm(true);
              }}
            >
              + Create Announcement
            </Button>
            <AnnouncementFormDialog
              open={openForm}
              announcement={editing}
              onClose={() => {
                setOpenForm(false);
                setEditing(null);
              }}
              onSaved={handleSaved}
            />
          </div>
        </div>
      </section>

      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && announcements && announcements.length === 0 && (
        <div className="text-sm text-gray-600">No announcements found.</div>
      )}

      {announcements?.map((a) => {
        const dateTime = a.createdAt
          ? new Date(a.createdAt).toLocaleString()
          : "";
        const scopeLabel =
          a.scope === "CLASS"
            ? a.targetClassName || "Class"
            : "School-wide";

        return (
          <AnnouncementCard
            key={a.id}
            scopeLabel={scopeLabel}
            dateTime={dateTime}
            title={a.title}
            message={a.message ?? ""}
            attachments={a.attachments ?? undefined}
            deleting={deletingId === a.id}
            onEdit={() => {
              setEditing(a);
              setOpenForm(true);
            }}
            onDelete={() => void handleDelete(a)}
          />
        );
      })}
    </div>
  );
}
