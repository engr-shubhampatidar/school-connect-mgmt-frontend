import API from "@/services/axios";
import { STUDENT_API } from "@/config/api-routes";

export type StudentMe = Record<string, unknown>;

export type StudentAttendanceSummary = Record<string, unknown>;

export type StudentAttendancePage = {
  items: Array<Record<string, unknown>>;
  total: number;
};

export type StudentClassRef = {
  id: string;
  name: string;
  section?: string | null;
};

export type StudentTimetableItem = {
  dayOfWeek?: number | null;
  subject: string | null;
  startTime: string | null;
  endTime: string | null;
  subjectTeacher?: string | null;
  teacher?: string | null;
  teacherName?: string | null;
  room: string | null;
};

export type StudentAnnouncementItem = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  authorName?: string | null;
  pinned?: boolean;
};

export type StudentAnnouncementsPage = {
  items: StudentAnnouncementItem[];
  total: number;
  page: number;
  limit: number;
};

export type StudentPortalDocument = {
  id: string;
  documentType: string;
  url: string;
  fileName?: string | null;
  originalName?: string | null;
  mimeType?: string | null;
  size?: number | null;
  createdAt?: string | null;
};

export type StudentFeesSummary = {
  totalOutstanding: number;
  totalPaid: number;
  overdueCount: number;
  pendingCount: number;
  totalAssignments: number;
};

export type StudentExamScheduleGroup = {
  exam: {
    id: string;
    name: string;
    academicYear?: string;
    examType?: string;
    status?: string;
    className?: string | null;
    classSection?: string | null;
    startDate?: string | null;
    endDate?: string | null;
  };
  schedules: Array<{
    id: string;
    subjectName?: string | null;
    subjectCode?: string | null;
    examDate: string;
    startTime?: string | null;
    endTime?: string | null;
    maxMarks?: number;
    passMarks?: number;
    venue?: string | null;
  }>;
};

export type StudentDashboard = {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  attendancePercentage: number;
  profile?: {
    id: string;
    fullName: string;
    studentCode?: string | null;
    class?: StudentClassRef | null;
  };
  currentClass?: StudentClassRef | null;
  timetable?: StudentTimetableItem[];
  recentAnnouncements?: StudentAnnouncementItem[];
  documents?: {
    count: number;
    items: StudentPortalDocument[];
  };
};

function normalizeTimetable(data: unknown): StudentTimetableItem[] {
  if (Array.isArray(data)) {
    return data as StudentTimetableItem[];
  }
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { schedules?: unknown }).schedules)
  ) {
    return (data as { schedules: StudentTimetableItem[] }).schedules;
  }
  return [];
}

export async function getStudentMe(): Promise<StudentMe> {
  const res = await API.get(STUDENT_API.ME);
  return (res.data ?? {}) as StudentMe;
}

export async function getStudentProfile(): Promise<StudentMe> {
  const res = await API.get(STUDENT_API.PROFILE);
  return (res.data ?? {}) as StudentMe;
}

export async function getAttendanceSummary(): Promise<StudentAttendanceSummary> {
  const res = await API.get(STUDENT_API.ATTENDANCE);
  return (res.data ?? {}) as StudentAttendanceSummary;
}

export async function getAttendanceHistory(
  page = 1,
  limit = 10,
): Promise<StudentAttendancePage> {
  const res = await API.get(STUDENT_API.ATTENDANCE, {
    params: { page, limit },
  });
  const data = res.data ?? {};
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data.items)
      ? data.items
      : [];
  const total =
    typeof data.total === "number"
      ? data.total
      : Array.isArray(data)
        ? data.length
        : items.length;
  return { items, total };
}

export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<unknown> {
  const res = await API.patch(STUDENT_API.CHANGE_PASSWORD, {
    currentPassword: payload.oldPassword,
    newPassword: payload.newPassword,
  });
  return res.data;
}

export async function getStudentDashboard(): Promise<StudentDashboard> {
  const res = await API.get(STUDENT_API.DASHBOARD);
  const data = (res.data ?? {}) as StudentDashboard;
  return {
    ...data,
    timetable: normalizeTimetable(data.timetable),
  };
}

export async function getTimetable(): Promise<StudentTimetableItem[]> {
  const res = await API.get(STUDENT_API.TIMETABLE);
  return normalizeTimetable(res.data);
}

export async function getStudentDocuments(): Promise<StudentPortalDocument[]> {
  const res = await API.get(STUDENT_API.DOCUMENTS);
  const data = res.data;
  if (Array.isArray(data)) return data as StudentPortalDocument[];
  if (data && Array.isArray(data.items)) {
    return data.items as StudentPortalDocument[];
  }
  if (data && Array.isArray(data.data)) {
    return data.data as StudentPortalDocument[];
  }
  return [];
}

export async function getClassAnnouncements(
  page = 1,
  limit = 20,
): Promise<StudentAnnouncementsPage> {
  const res = await API.get(STUDENT_API.ANNOUNCEMENTS, {
    params: { page, limit },
  });
  const data = res.data ?? {};
  const items = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
  return {
    items: items as StudentAnnouncementItem[],
    total: typeof data.total === "number" ? data.total : items.length,
    page: typeof data.page === "number" ? data.page : page,
    limit: typeof data.limit === "number" ? data.limit : limit,
  };
}

export async function getFeesSummary(): Promise<StudentFeesSummary> {
  const res = await API.get(STUDENT_API.FEES_SUMMARY);
  return (res.data ?? {
    totalOutstanding: 0,
    totalPaid: 0,
    overdueCount: 0,
    pendingCount: 0,
    totalAssignments: 0,
  }) as StudentFeesSummary;
}

export async function getExamsSchedule(): Promise<StudentExamScheduleGroup[]> {
  const res = await API.get(STUDENT_API.EXAMS_SCHEDULE);
  const data = res.data;
  if (Array.isArray(data)) return data as StudentExamScheduleGroup[];
  return [];
}

const studentApi = {
  getStudentMe,
  getStudentProfile,
  getAttendanceSummary,
  getAttendanceHistory,
  changePassword,
  getStudentDashboard,
  getTimetable,
  getStudentDocuments,
  getClassAnnouncements,
  getFeesSummary,
  getExamsSchedule,
};

export default studentApi;
