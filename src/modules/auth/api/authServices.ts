import API from "@/services/axios";
import { AUTH_API } from "@/config/api-routes";
import { setSession, type Role } from "./session";

function normalizeUser(respUser: Record<string, unknown>, role: Role) {
  return {
    id: (respUser?.id ?? respUser?._id ?? null) as string | null,
    name: (respUser?.fullName ??
      respUser?.name ??
      respUser?.username ??
      null) as string | null,
    email: (respUser?.email ?? null) as string | null,
    role: (respUser?.role ?? role) as string,
    school: (respUser?.school ?? null) as unknown,
    schoolId: (respUser?.schoolId ?? null) as string | null,
  };
}

function extractTokenFromData(data: unknown): {
  access?: string;
  refresh?: string;
} {
  if (!data || typeof data !== "object") return {};
  const d = data as Record<string, unknown>;
  const nested =
    d.data && typeof d.data === "object"
      ? (d.data as Record<string, unknown>)
      : null;
  const access =
    d.accessToken ?? d.token ?? d.access_token ?? nested?.accessToken ?? null;
  const refresh =
    d.refreshToken ?? d.refresh_token ?? nested?.refreshToken ?? null;
  return {
    access: typeof access === "string" ? access : undefined,
    refresh: typeof refresh === "string" ? refresh : undefined,
  };
}

function handleLoginResponse(role: Role, data: unknown) {
  try {
    const payload =
      data && typeof data === "object" ? (data as Record<string, unknown>) : {};
    const { access, refresh } = extractTokenFromData(payload);
    if (!access || !refresh) {
      throw new Error("Login response missing tokens");
    }

    const respUser =
      payload.user ??
      payload.teacher ??
      payload.student ??
      payload.parent ??
      payload;
    const user =
      respUser && typeof respUser === "object"
        ? normalizeUser(respUser as Record<string, unknown>, role)
        : undefined;

    setSession({
      accessToken: access,
      refreshToken: refresh,
      role,
      user,
    });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === "Login response missing tokens"
    ) {
      throw err;
    }
    // ignore storage errors
  }
  return data;
}

export async function login(
  role: Role,
  values: { email: string; password: string },
) {
  const res = await API.post(AUTH_API.LOGIN, {
    email: values.email,
    password: values.password,
  });
  return handleLoginResponse(role, res.data ?? {});
}

export async function adminLogin(values: { email: string; password: string }) {
  return login("admin", values);
}

export async function teacherLogin(values: {
  email: string;
  password: string;
}) {
  return login("teacher", values);
}

export async function studentLogin(values: {
  email: string;
  password: string;
}) {
  return login("student", values);
}

export async function parentLogin(values: {
  email: string;
  password: string;
}) {
  return login("parent", values);
}

export default {
  login,
  adminLogin,
  teacherLogin,
  studentLogin,
  parentLogin,
};
