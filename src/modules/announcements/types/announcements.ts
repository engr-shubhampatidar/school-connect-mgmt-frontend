export type AnnouncementScope = "SCHOOL" | "CLASS";

export type AnnouncementAttachment = {
  filename: string;
  url: string;
};

export type Announcement = {
  id: string;
  title: string;
  message: string;
  scope: AnnouncementScope;
  targetClassId: string | null;
  targetClassName: string | null;
  schoolId: string;
  attachments: AnnouncementAttachment[] | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type AnnouncementsResponse = {
  data: Announcement[];
  total: number;
  page: number;
  limit: number;
};

export type AnnouncementsQuery = {
  search?: string;
  scope?: AnnouncementScope;
  classId?: string;
  date?: string;
  page?: number;
  limit?: number;
};

export type CreateAnnouncementAttachment = AnnouncementAttachment;

export type CreateAnnouncementPayload = {
  title: string;
  message: string;
  scope: AnnouncementScope;
  targetClassId?: string;
  attachments?: CreateAnnouncementAttachment[];
};

export type UpdateAnnouncementPayload = Partial<CreateAnnouncementPayload>;
