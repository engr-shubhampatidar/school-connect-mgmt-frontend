import type { AxiosRequestConfig } from "axios";
import type {
  Announcement,
  AnnouncementsQuery,
  AnnouncementsResponse,
  CreateAnnouncementPayload,
} from "@/modules/announcements/types/announcements";
import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";

export type {
  Announcement,
  AnnouncementsQuery,
  AnnouncementsResponse,
  CreateAnnouncementAttachment,
  CreateAnnouncementPayload,
} from "@/modules/announcements/types/announcements";

export async function fetchAnnouncements(
  query: AnnouncementsQuery = {},
  config?: AxiosRequestConfig,
): Promise<AnnouncementsResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.status) params.status = query.status;
  if (query.role) params.role = query.role;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;

  const res = await API.get<any>(ADMIN_API.ANNOUNCEMENTS, {
    params,
    ...(config ?? {}),
  });

  const data = res.data as unknown;
  const d =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  const items = (
    Array.isArray(data)
      ? (data as unknown[])
      : Array.isArray(d.announcements)
        ? (d.announcements as unknown[])
        : Array.isArray(d.items)
          ? (d.items as unknown[])
          : []
  ) as unknown[];

  const announcements: Announcement[] = (items || []).map((it) => {
    const obj =
      it && typeof it === "object" ? (it as Record<string, unknown>) : {};
    return {
      id: String(obj.id ?? obj._id ?? obj.announcementId ?? ""),
      title: String(obj.title ?? obj.name ?? ""),
      message: (obj.message ?? obj.body ?? null) as string | null,
      status: (obj.status ?? null) as string | null,
      role: (obj.role ?? null) as string | null,
      attachments: (obj.attachments ?? obj.files ?? null) as string | null,
      createdAt: (obj.createdAt ?? obj.created_at ?? null) as string | null,
      scheduledAt: (obj.scheduledAt ?? obj.scheduled_at ?? null) as
        | string
        | null,
    } as Announcement;
  });

  const total: number | undefined =
    (d.total as number | undefined) ??
    (d.totalCount as number | undefined) ??
    announcements.length;
  const page: number | undefined =
    (d.page as number | undefined) ?? (d.p as number | undefined) ?? query.page;
  const pageSize: number | undefined =
    (d.pageSize as number | undefined) ??
    (d.limit as number | undefined) ??
    query.pageSize;

  return {
    announcements,
    total,
    page,
    pageSize,
  };
}

export async function createAnnouncement(payload: CreateAnnouncementPayload) {
  const res = await API.post(ADMIN_API.ANNOUNCEMENTS, payload);
  return res.data;
}
