import axios from "axios";
import API from "./axios";
import { ADMIN_API } from "./api-routes";
import { loginTeacher } from "./teacherApi";
import studentApi from "./studentApi";
import { setToken, setUser } from "./auth";
import { email } from "zod";

type Role = "admin" | "teacher" | "student";

function normalizeUser(respUser: any, role: Role) {
  return {
    id: respUser?.id ?? respUser?._id ?? null,
    name: respUser?.fullName ?? respUser?.name ?? respUser?.username ?? null,
    email: respUser?.email ?? null,
    role: respUser?.role ?? role,
    school: respUser?.school ?? null,
  };
}

function extractTokenFromData(data: any): {
  access?: string;
  refresh?: string;
} {
  if (!data || typeof data !== "object") return {};
  const d = data as Record<string, any>;
  const access =
    d.accessToken ?? d.token ?? d.access_token ?? d.data?.accessToken ?? null;
  const refresh =
    d.refreshToken ?? d.refresh_token ?? d.data?.refreshToken ?? null;
  return {
    access: typeof access === "string" ? access : undefined,
    refresh: typeof refresh === "string" ? refresh : undefined,
  };
}

function handleLoginResponse(role: Role, data: any) {
  try {
    const { access, refresh } = extractTokenFromData(data ?? {});
    if (access) setToken(role, access);
    if (refresh) setToken(role, refresh, "refresh");

    const respUser =
      data && typeof data === "object"
        ? (data.user ?? data.teacher ?? data.student ?? data)
        : null;
    if (respUser && typeof respUser === "object") {
      const userToStore = normalizeUser(respUser, role);
      setUser(role, userToStore);
    }
  } catch {
    // ignore storage errors
  }
  return data;
}

export async function adminLogin(values: { email: string; password: string }) {
  const res = await API.post(ADMIN_API.LOGIN, values);
  return handleLoginResponse("admin", res.data ?? {});
}

export async function teacherLogin(values: {
  email: string;
  password: string;
}) {
  const data = await loginTeacher(values);
  return handleLoginResponse("teacher", data ?? {});
}

export async function studentLogin(values: {
  email: string;
  password: string;
}) {
  const res = await studentApi.post("/auth/login", {
    email: values.email,
    password: values.password,
  });
  return handleLoginResponse("student", res.data ?? {});
}

export default {
  adminLogin,
  teacherLogin,
  studentLogin,
};
