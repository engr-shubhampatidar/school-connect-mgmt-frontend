import type { AxiosRequestConfig } from "axios";
import type {
  Announcement,
  AnnouncementAttachment,
  AnnouncementsQuery,
  AnnouncementsResponse,
  AnnouncementScope,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "@/modules/announcements/types/announcements";
import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";

export type {
  Announcement,
  AnnouncementAttachment,
  AnnouncementsQuery,
  AnnouncementsResponse,
  AnnouncementScope,
  CreateAnnouncementAttachment,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "@/modules/announcements/types/announcements";

function mapAnnouncement(raw: unknown): Announcement {
  const obj =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const attachmentsRaw = obj.attachments;
  let attachments: AnnouncementAttachment[] | null = null;
  if (Array.isArray(attachmentsRaw)) {
    attachments = attachmentsRaw.map((item) => {
      const att =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};
      return {
        filename: String(att.filename ?? ""),
        url: String(att.url ?? ""),
      };
    });
  }

  const scope =
    obj.scope === "CLASS" || obj.targetClassId
      ? ("CLASS" as AnnouncementScope)
      : ("SCHOOL" as AnnouncementScope);

  return {
    id: String(obj.id ?? ""),
    title: String(obj.title ?? ""),
    message: String(obj.message ?? ""),
    scope,
    targetClassId: (obj.targetClassId as string | null) ?? null,
    targetClassName: (obj.targetClassName as string | null) ?? null,
    schoolId: String(obj.schoolId ?? ""),
    attachments,
    createdByUserId: String(obj.createdByUserId ?? ""),
    createdAt: String(obj.createdAt ?? ""),
    updatedAt: String(obj.updatedAt ?? obj.createdAt ?? ""),
  };
}

export async function fetchAnnouncements(
  query: AnnouncementsQuery = {},
  config?: AxiosRequestConfig,
): Promise<AnnouncementsResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.scope) params.scope = query.scope;
  if (query.classId) params.classId = query.classId;
  if (query.date) params.date = query.date;
  if (query.page) params.page = query.page;
  if (query.limit) params.limit = query.limit;

  const res = await API.get(ADMIN_API.ANNOUNCEMENTS, {
    params,
    ...(config ?? {}),
  });

  const payload =
    res.data && typeof res.data === "object"
      ? (res.data as Record<string, unknown>)
      : {};

  const items = Array.isArray(payload.data) ? payload.data : [];

  return {
    data: items.map(mapAnnouncement),
    total: Number(payload.total ?? items.length),
    page: Number(payload.page ?? query.page ?? 1),
    limit: Number(payload.limit ?? query.limit ?? 20),
  };
}

export async function createAnnouncement(payload: CreateAnnouncementPayload) {
  const res = await API.post(ADMIN_API.ANNOUNCEMENTS, payload);
  return mapAnnouncement(res.data);
}

export async function updateAnnouncement(
  id: string,
  payload: UpdateAnnouncementPayload,
) {
  const res = await API.patch(`${ADMIN_API.ANNOUNCEMENTS}/${id}`, payload);
  return mapAnnouncement(res.data);
}

export async function deleteAnnouncement(id: string) {
  const res = await API.delete(`${ADMIN_API.ANNOUNCEMENTS}/${id}`);
  return res.data as { success: boolean };
}
