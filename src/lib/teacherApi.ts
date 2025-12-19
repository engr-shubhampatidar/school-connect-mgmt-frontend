import axios, { AxiosError, type AxiosRequestHeaders } from "axios";
import { BASE_URL, TEACHER_API, ATTENDANCE_API } from "./api-routes";
import { getToken, setToken, removeToken } from "./auth";

const TAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

TAPI.interceptors.request.use((config) => {
  try {
    const url = config.url ?? "";
    if (
      url.startsWith("/api/teacher") ||
      url.includes("/api/teacher") ||
      url.includes("/api/attendance")
    ) {
      const token = getToken("teacher");
      if (token) {
        config.headers = {
          ...((config.headers as AxiosRequestHeaders) ?? {}),
          Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders;
      }
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
      if (typeof window !== "undefined") {
        window.location.href = "/teacher/login";
      }
    }
    return Promise.reject(error);
  }
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
    payload
  );
  const data = res.data ?? {};

  // Expecting token in data.token or data.accessToken
  let token: string | null = null;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.token === "string") token = d.token;
    else if (typeof d.accessToken === "string") token = d.accessToken;
  }

  if (token) setToken("teacher", token);
  return data;
}

export async function getTeacherMe(): Promise<TeacherMe> {
  const res = await TAPI.get<TeacherMe>(TEACHER_API.ME);
  return res.data;
}

export type TeacherClass = {
  id: string;
  name?: string;
  section?: string | null;
  students?: Array<{
    id: string;
    name?: string;
    rollNo?: string | number | null;
    roll_no?: string | number | null;
  }>;
};

export type GetTeacherClassResponse = {
  class: TeacherClass;
  students: Array<{
    id: string;
    name?: string;
    rollNo?: string | number | null;
    photoUrl?: string | null;
  }>;
};

export async function getTeacherClass(): Promise<
  GetTeacherClassResponse | TeacherClass
> {
  const res = await TAPI.get<GetTeacherClassResponse | TeacherClass>(
    TEACHER_API.CLASS
  );
  return res.data;
}

export async function fetchAttendanceForClassDate(
  classId: string,
  date: string
): Promise<unknown> {
  const res = await TAPI.get<unknown>(ATTENDANCE_API.BASE, {
    params: { classId, date },
  });
  return res.data;
}

export async function fetchAttendanceByClass(
  classId: string
): Promise<unknown> {
  const res = await TAPI.get<unknown>(ATTENDANCE_API.CLASS(classId));
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
