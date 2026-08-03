import { ADMIN_API, TEACHER_API } from "@/config/api-routes";
import API from "@/services/axios";
import { fetchTeachers as adminFetchTeachers } from "@/modules/teachers/api/adminTeachers";
import type { CreateTeacherValues, Subject } from "@/modules/teachers/schemas/teacher.schema";
import type {
  TeacherOption,
  TeacherProfileResponse,
  UpdateTeacherPayload,
} from "@/modules/teachers/types/service";
import { normalizeAadharDigits } from "@/modules/teachers/utils/normalizeAadharDigits";
import axios from "axios";

export type {
  TeacherOption,
  TeacherProfileResponse,
  UpdateTeacherPayload,
  GenerateEmployeeIdPayload,
  GenerateEmployeeIdResponse,
} from "@/modules/teachers/types/service";

/** @deprecated Use `TeacherOption` for dropdown/list helpers. */
export type Teacher = TeacherOption;

function normalizeTeacher(it: {
  id?: string;
  name?: string;
  subjects?: string[] | null;
  subjectsSpeciality?: string[] | null;
  user?: { id?: string } | null;
  userId?: string | null;
  user_id?: string | null;
} | null): TeacherOption {
  if (!it) return { id: "", name: "" };
  const specialty = Array.isArray(it.subjectsSpeciality)
    ? it.subjectsSpeciality
    : Array.isArray(it.subjects)
      ? it.subjects
      : undefined;
  const userId = it.user_id ?? it.userId ?? it.user?.id;
  return {
    id: String(it.id ?? ""),
    name: String(it.name ?? ""),
    subjects: specialty?.filter(Boolean) as string[] | undefined,
    user_id: userId ? String(userId) : undefined,
  };
}

export async function getTeachers(search = "", subjectId?: string | null) {
  const res = await adminFetchTeachers({
    search,
    subjectIds: subjectId ? [subjectId] : undefined,
    page: 1,
    pageSize: 100,
  });
  return (res.teachers ?? []).map(normalizeTeacher);
}

export async function getNotClassTeachers(search = "") {
  const res = await API.get(ADMIN_API.TEACHERS, {
    params: {
      search,
      availableForClassTeacher: true,
      page: 1,
      pageSize: 100,
      limit: 100,
    },
  });
  const data = res?.data ?? res;
  const items = Array.isArray(data)
    ? data
    : (data?.items ?? data?.data ?? data?.teachers ?? data?.results ?? []);
  return (Array.isArray(items) ? items : []).map((it: unknown) => {
    const o = (it && typeof it === "object" ? it : {}) as Record<
      string,
      unknown
    >;
    const nestedUser =
      o.user && typeof o.user === "object"
        ? (o.user as { id?: string })
        : null;
    return normalizeTeacher({
      id: String(o.id ?? o._id ?? ""),
      name: String(o.fullName ?? o.name ?? o.email ?? ""),
      subjects: Array.isArray(o.subjects) ? (o.subjects as string[]) : null,
      subjectsSpeciality: Array.isArray(o.subjectsSpeciality)
        ? (o.subjectsSpeciality as string[])
        : null,
      userId: o.userId ? String(o.userId) : undefined,
      user: nestedUser,
    });
  });
}

export { normalizeAadharDigits } from "@/modules/teachers/utils/normalizeAadharDigits";

export class ApiValidationError extends Error {
  public fieldErrors: Record<string, string>;
  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.fieldErrors = fieldErrors;
    Object.setPrototypeOf(this, ApiValidationError.prototype);
  }
}

export async function fetchSubjects(search = ""): Promise<Subject[]> {
  const { fetchSubjects: adminFetchSubjects } = await import(
    "@/modules/subjects"
  );
  try {
    const res = await adminFetchSubjects({ search });
    return (res.subjects ?? []).map((s) => ({
      id: String(s.id ?? ""),
      name: String(s.name ?? ""),
    })) as Subject[];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        (err.response?.data as { message?: string })?.message ?? err.message,
      );
    }
    throw err;
  }
}

export async function createTeacher(
  payload: CreateTeacherValues,
): Promise<unknown> {
  try {
    const resp = await API.post(ADMIN_API.TEACHERS, {
      ...payload,
      aadhar: normalizeAadharDigits(payload.aadhar ?? ""),
    });
    return resp.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as Record<string, unknown> | undefined;
      if (data?.fieldErrors && typeof data.fieldErrors === "object") {
        throw new ApiValidationError(
          (data.message as string) ?? err.message,
          data.fieldErrors as Record<string, string>,
        );
      }
      throw new Error((data && (data.message as string)) ?? err.message);
    }
    throw err;
  }
}

export async function fetchTeacherById(
  id: string,
): Promise<TeacherProfileResponse> {
  try {
    const resp = await API.get(TEACHER_API.PROFILE(id));
    return resp.data as TeacherProfileResponse;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as Record<string, unknown> | undefined;
      throw new Error((data && (data.message as string)) ?? err.message);
    }
    throw err;
  }
}

export async function updateTeacher(
  id: string,
  payload: UpdateTeacherPayload,
): Promise<unknown> {
  try {
    const resp = await API.put(`/api/admin/teachers/${id}`, payload);
    return resp.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as Record<string, unknown> | undefined;

      if (data?.fieldErrors && typeof data.fieldErrors === "object") {
        throw new ApiValidationError(
          (data.message as string) ?? err.message,
          data.fieldErrors as Record<string, string>,
        );
      }

      throw new Error((data && (data.message as string)) ?? err.message);
    }
    throw err;
  }
}
