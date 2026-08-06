import { PARENT_API } from "@/config/api-routes";
import API from "@/services/axios";
import type {
  ChildAnnouncementsPage,
  ChildAttendanceRecord,
  ChildClassInfo,
  ChildDashboard,
  ChildExamScheduleGroup,
  ChildFeeSummary,
  ChildMonthlyAttendance,
  ChildProfile,
  ChildProfileRaw,
  ChildTimetableEntry,
  FeePayment,
  Homework,
  HomeworkQuery,
  Paginated,
  ParentChild,
  ParentMe,
  ReportCard,
  StudentFee,
  StudentHomeworkDetail,
} from "@/modules/parent-portal/types";
import type { EntityDocument } from "@/modules/documents/types";
import type { ExamResult } from "@/modules/exams/types";

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: T[] }).data;
  }
  return [];
}

function asPaginated<T>(data: unknown, page = 1, limit = 20): Paginated<T> {
  if (data && typeof data === "object") {
    const d = data as {
      data?: T[];
      items?: T[];
      total?: number;
      page?: number;
      limit?: number;
    };
    const rows = Array.isArray(d.data)
      ? d.data
      : Array.isArray(d.items)
        ? d.items
        : [];
    return {
      data: rows,
      total: typeof d.total === "number" ? d.total : rows.length,
      page: typeof d.page === "number" ? d.page : page,
      limit: typeof d.limit === "number" ? d.limit : limit,
    };
  }
  return { data: [], total: 0, page, limit };
}

function formatDob(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  try {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-IN");
  } catch {
    return String(value);
  }
}

export function normalizeChildProfile(raw: ChildProfileRaw): ChildProfile {
  const user = raw.user;
  const profile = raw.profile;
  const classInfo =
    raw.class ??
    (profile?.currentClass
      ? {
          id: profile.currentClass.id ?? "",
          name: profile.currentClass.name ?? "",
          section: profile.currentClass.section ?? null,
        }
      : null);

  return {
    id: raw.id ?? user?.id ?? "",
    fullName: raw.fullName ?? user?.fullName ?? "Student",
    studentCode: raw.studentCode ?? user?.studentCode ?? null,
    dob: formatDob(raw.dob ?? user?.dateOfBirth),
    gender: raw.gender ?? user?.gender ?? null,
    bloodGroup: raw.bloodGroup ?? profile?.bloodGroup ?? null,
    aadhaarNumber: raw.aadhaarNumber ?? profile?.aadhaarNumber ?? null,
    phone: raw.phoneNumber ?? user?.mobile ?? null,
    email: raw.email ?? user?.email ?? null,
    address: raw.address ?? user?.address ?? null,
    fatherName: raw.fatherName ?? profile?.fatherName ?? null,
    fatherMobile: raw.fatherMobile ?? profile?.fatherMobile ?? null,
    motherName: raw.motherName ?? profile?.motherName ?? null,
    motherMobile: raw.motherMobile ?? profile?.motherMobile ?? null,
    guardianName: raw.guardianName ?? profile?.guardianName ?? null,
    guardianMobile: raw.guardianMobile ?? profile?.guardianMobile ?? null,
    medicalNotes: profile?.medicalNotes ?? null,
    class: classInfo && classInfo.id
      ? {
          id: classInfo.id,
          name: classInfo.name ?? "",
          section: classInfo.section ?? null,
        }
      : null,
    documents: Array.isArray(raw.documents) ? raw.documents : [],
  };
}

export async function fetchParentMe(): Promise<ParentMe> {
  const res = await API.get<ParentMe>(PARENT_API.ME);
  return res.data;
}

export async function fetchParentChildren(): Promise<ParentChild[]> {
  const res = await API.get(PARENT_API.CHILDREN);
  return asArray<ParentChild>(res.data);
}

export async function fetchChildDashboard(
  studentId: string,
): Promise<ChildDashboard> {
  const res = await API.get<ChildDashboard>(
    PARENT_API.CHILD_DASHBOARD(studentId),
  );
  return res.data ?? ({} as ChildDashboard);
}

export async function fetchChildProfile(
  studentId: string,
): Promise<ChildProfile> {
  const res = await API.get<ChildProfileRaw>(
    PARENT_API.CHILD_PROFILE(studentId),
  );
  return normalizeChildProfile(res.data ?? {});
}

export async function fetchChildAttendance(
  studentId: string,
  params?: { from?: string; to?: string },
): Promise<ChildAttendanceRecord[]> {
  const res = await API.get(PARENT_API.CHILD_ATTENDANCE(studentId), {
    params,
  });
  return asArray<ChildAttendanceRecord>(res.data);
}

export async function fetchChildMonthlyAttendance(
  studentId: string,
  params?: { year?: number; month?: number },
): Promise<ChildMonthlyAttendance> {
  const res = await API.get<ChildMonthlyAttendance>(
    PARENT_API.CHILD_ATTENDANCE_MONTHLY(studentId),
    { params },
  );
  return (
    res.data ?? {
      studentId,
      year: params?.year ?? new Date().getFullYear(),
      month: params?.month ?? new Date().getMonth() + 1,
      totalDays: 0,
      present: 0,
      absent: 0,
      leave: 0,
      percentage: 0,
      details: [],
    }
  );
}

export async function fetchChildClass(
  studentId: string,
): Promise<ChildClassInfo> {
  const res = await API.get<ChildClassInfo>(PARENT_API.CHILD_CLASS(studentId));
  return res.data ?? null;
}

export async function fetchChildTimetable(
  studentId: string,
): Promise<ChildTimetableEntry[]> {
  const res = await API.get(PARENT_API.CHILD_TIMETABLE(studentId));
  return asArray<ChildTimetableEntry>(res.data);
}

export async function fetchChildAnnouncements(
  studentId: string,
  params?: { page?: number; limit?: number },
): Promise<ChildAnnouncementsPage> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const res = await API.get(PARENT_API.CHILD_ANNOUNCEMENTS(studentId), {
    params: { page, limit },
  });
  const data = res.data ?? {};
  if (data && typeof data === "object" && Array.isArray(data.items)) {
    return {
      items: data.items,
      total: typeof data.total === "number" ? data.total : data.items.length,
      page: typeof data.page === "number" ? data.page : page,
      limit: typeof data.limit === "number" ? data.limit : limit,
    };
  }
  const items = asArray<ChildAnnouncementsPage["items"][number]>(data);
  return { items, total: items.length, page, limit };
}

export async function fetchChildDocuments(
  studentId: string,
): Promise<EntityDocument[]> {
  const res = await API.get(PARENT_API.CHILD_DOCUMENTS(studentId));
  return asArray<EntityDocument>(res.data);
}

export async function fetchChildHomework(
  studentId: string,
  query: HomeworkQuery = {},
): Promise<Paginated<Homework>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const res = await API.get(PARENT_API.CHILD_HOMEWORK(studentId), {
    params: query,
  });
  return asPaginated<Homework>(res.data, page, limit);
}

export async function fetchChildHomeworkDetail(
  studentId: string,
  homeworkId: string,
): Promise<StudentHomeworkDetail> {
  const res = await API.get<StudentHomeworkDetail>(
    PARENT_API.CHILD_HOMEWORK_BY_ID(studentId, homeworkId),
  );
  return res.data;
}

export async function fetchChildFees(
  studentId: string,
  params?: { page?: number; limit?: number; status?: string },
): Promise<Paginated<StudentFee>> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 50;
  const res = await API.get(PARENT_API.CHILD_FEES(studentId), {
    params: { page, limit, status: params?.status },
  });
  return asPaginated<StudentFee>(res.data, page, limit);
}

export async function fetchChildFeesSummary(
  studentId: string,
): Promise<ChildFeeSummary> {
  const res = await API.get<ChildFeeSummary>(
    PARENT_API.CHILD_FEES_SUMMARY(studentId),
  );
  return (
    res.data ?? {
      totalOutstanding: 0,
      totalPaid: 0,
      overdueCount: 0,
      pendingCount: 0,
      totalAssignments: 0,
    }
  );
}

export async function fetchChildFeePayments(
  studentId: string,
  params?: { page?: number; limit?: number },
): Promise<Paginated<FeePayment>> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 50;
  const res = await API.get(PARENT_API.CHILD_FEE_PAYMENTS(studentId), {
    params: { page, limit },
  });
  return asPaginated<FeePayment>(res.data, page, limit);
}

export async function fetchChildExamResults(
  studentId: string,
): Promise<ExamResult[]> {
  const res = await API.get(PARENT_API.CHILD_EXAMS(studentId));
  return asArray<ExamResult>(res.data);
}

export async function fetchChildExamSchedule(
  studentId: string,
): Promise<ChildExamScheduleGroup[]> {
  const res = await API.get(PARENT_API.CHILD_EXAMS_SCHEDULE(studentId));
  return asArray<ChildExamScheduleGroup>(res.data);
}

export async function fetchChildReportCard(
  studentId: string,
  examId: string,
): Promise<ReportCard> {
  const res = await API.get<ReportCard>(
    PARENT_API.CHILD_REPORT_CARD(studentId, examId),
  );
  return res.data;
}
