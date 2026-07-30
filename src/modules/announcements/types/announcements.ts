export type Announcement = {
  id: string;
  title: string;
  message?: string | null;
  status?: string | null;
  role?: string | null;
  attachments?: string | null;
  createdAt?: string | null;
  scheduledAt?: string | null;
};

export type AnnouncementsResponse = {
  announcements: Announcement[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type AnnouncementsQuery = {
  search?: string;
  status?: string;
  role?: string;
  page?: number;
  pageSize?: number;
};

export type CreateAnnouncementAttachment = {
  filename: string;
  url: string;
};

export type CreateAnnouncementPayload = {
  title: string;
  message: string;
  audience: string;
  attachments: CreateAnnouncementAttachment[];
};
