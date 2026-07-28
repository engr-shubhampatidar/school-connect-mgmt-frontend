import axios, { AxiosError, type AxiosRequestHeaders } from "axios";
import { BASE_URL, TEACHER_API, ATTENDANCE_API } from "./api-routes";
import { getToken, removeToken } from "./auth";

const TAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

TAPI.interceptors.request.use((config) => {
  try {
    const token = getToken("teacher");
    if (token) {
      config.headers = {
        ...((config.headers as AxiosRequestHeaders) ?? {}),
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
  } catch {
    // ignore
  }
  return config;
});

TAPI.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (!error.response) return Promise.reject(new Error("Network error"));
    if (error.response.status === 401) {
      try {
        removeToken("teacher");
      } catch {}
      // if (typeof window !== "undefined") {
      //   window.location.href = "/login";
      // }
    }
    return Promise.reject(error);
  },
);

export type TeacherMe = {
  id: string;
  name: string;
  email: string;
  role?: string;
  classTeacherClassId?: string | null;
};

export async function loginTeacher(payload: {
  email: string;
  password: string;
}): Promise<unknown> {
  const res = await TAPI.post<Record<string, unknown>>(
    TEACHER_API.LOGIN,
    payload,
  );
  const data = res.data ?? {};
  return data;
}

export async function getTeacherMe(): Promise<TeacherMe> {
  const res = await TAPI.get<TeacherMe>(TEACHER_API.ME);
  return res.data;
}

export type AssignedClass = {
  classId: string;
  class: string;
  section: string;
  room?: string | null;
  totalStudents: number;
  attendanceStatus: "COMPLETED" | "PENDING" | string;
};

export type AssignedSubject = {
  subjectId: string;
  class: string;
  section: string;
  subject: string;
  teacherName?: string;
  totalStudents: number;
};

export type TodayScheduleItem = {
  subject: string;
  class: string;
  section: string;
  room?: string | null;
  startTime: string;
  endTime: string;
};

export type TeacherDashboard = {
  assignedClass: AssignedClass | null;
  assignedSubjects: AssignedSubject[];
  todaySchedule: TodayScheduleItem[];
};

export async function getTeacherDashboard(): Promise<TeacherDashboard> {
  const res = await TAPI.get<TeacherDashboard>(TEACHER_API.DASHBOARD);
  const data = res.data ?? {};
  return {
    assignedClass: data.assignedClass ?? null,
    assignedSubjects: Array.isArray(data.assignedSubjects)
      ? data.assignedSubjects
      : [],
    todaySchedule: Array.isArray(data.todaySchedule) ? data.todaySchedule : [],
  };
}

export type TeacherClassStudent = {
  studentId: string;
  id?: string;
  name?: string;
  rollNo?: string | number | null;
  roll_no?: string | number | null;
  email?: string | null;
  gender?: string | null;
  status?: string | null;
  photoUrl?: string | null;
};

export type TeacherClass = {
  id: string;
  name?: string;
  section?: string | null;
  students?: TeacherClassStudent[];
};

export type ClassAttendanceSummary = {
  present: number;
  absent: number;
  late: number;
  total: number;
};

export type GetTeacherClassResponse = {
  class: TeacherClass;
  students: TeacherClassStudent[];
  attendanceSummary?: ClassAttendanceSummary | null;
  attendanceTaken?: boolean;
};

export async function getTeacherClass(): Promise<GetTeacherClassResponse> {
  const res = await TAPI.get<GetTeacherClassResponse | TeacherClass>(
    TEACHER_API.CLASS,
  );
  const data = res.data;

  if (data && typeof data === "object" && "class" in data) {
    const parsed = data as GetTeacherClassResponse;
    return {
      class: parsed.class,
      students: Array.isArray(parsed.students)
        ? parsed.students.map(normalizeClassStudent)
        : [],
      attendanceSummary: normalizeAttendanceSummary(parsed.attendanceSummary),
      attendanceTaken: Boolean(parsed.attendanceTaken),
    };
  }

  const legacy = data as TeacherClass;
  const embedded = Array.isArray(legacy?.students) ? legacy.students : [];
  return {
    class: legacy,
    students: embedded.map(normalizeClassStudent),
    attendanceSummary: null,
    attendanceTaken: false,
  };
}

function normalizeClassStudent(
  s: TeacherClassStudent | Record<string, unknown>,
): TeacherClassStudent {
  const so = (s ?? {}) as Record<string, unknown>;
  const studentId = String(so.studentId ?? so.id ?? "");
  return {
    studentId,
    id: typeof so.id === "string" ? so.id : studentId || undefined,
    name: typeof so.name === "string" ? so.name : undefined,
    rollNo: (so.rollNo ?? so.roll_no ?? null) as string | number | null,
    roll_no: (so.roll_no ?? so.rollNo ?? null) as string | number | null,
    email: typeof so.email === "string" ? so.email : null,
    gender: typeof so.gender === "string" ? so.gender : null,
    status: typeof so.status === "string" ? so.status : null,
    photoUrl: typeof so.photoUrl === "string" ? so.photoUrl : null,
  };
}

function normalizeAttendanceSummary(
  summary: ClassAttendanceSummary | Record<string, unknown> | null | undefined,
): ClassAttendanceSummary | null {
  if (!summary || typeof summary !== "object") return null;
  const s = summary as Record<string, unknown>;
  return {
    present: Number(s.present ?? 0) || 0,
    absent: Number(s.absent ?? 0) || 0,
    late: Number(s.late ?? 0) || 0,
    total: Number(s.total ?? 0) || 0,
  };
}

export async function fetchAttendanceForClassDate(
  classId: string,
  date: string,
): Promise<unknown> {
  const res = await TAPI.get<unknown>(ATTENDANCE_API.BASE, {
    params: { classId, date },
  });
  return res.data;
}

export async function fetchAttendanceByClass(
  classId: string,
  params?: { startDate?: string; endDate?: string },
): Promise<unknown> {
  const res = await TAPI.get<unknown>(ATTENDANCE_API.CLASS(classId), {
    params,
  });
  return res.data;
}

export async function markAttendance(payload: {
  classId: string;
  date: string;
  students: Array<{ studentId: string; status: string }>;
}): Promise<unknown> {
  const res = await TAPI.post<unknown>(ATTENDANCE_API.BASE, payload);
  return res.data;
}

export default TAPI;
