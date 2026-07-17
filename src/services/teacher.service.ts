import { ADMIN_API } from "@/lib/api-routes";
import API from "@/lib/axios";
import { CreateTeacherValues, Subject } from "@/schemas/teacher.schema";
import axios from "axios";

export interface Teacher {
  id: string;
  name: string;
  subjects?: string[];
  subject_count?: number;
  user_id?: string;
}

const BASE = "/api/admin/teachers";

function normalizeTeacher(it: any): Teacher {
  if (!it) return { id: "", name: "" };
  if (typeof it === "string") return { id: it, name: it };
  const o = it as Record<string, any>;
  return {
    id: String(o.id ?? o._id ?? o.uuid ?? o.value ?? ""),
    name: String(o.fullName ?? o.name ?? o.title ?? o.email ?? ""),
    subjects: Array.isArray(o.subjectsSpeciality)
      ? o.subjectsSpeciality
      : (o.subjects ?? undefined),
    subject_count:
      typeof o.subject_count === "number" ? o.subject_count : undefined,
    user_id: o.userId,
  } as Teacher;
}

async function extractListFromResponse(resp: any): Promise<Teacher[]> {
  const data = resp?.data ?? resp;
  if (Array.isArray(data)) return data.map(normalizeTeacher);
  if (data && typeof data === "object") {
    const items = data.items ?? data.data ?? data.results ?? [];
    if (Array.isArray(items)) return items.map(normalizeTeacher);
  }
  return [];
}

export async function getTeachers(search = "", subjectId?: string | null) {
  const res = await API.get(ADMIN_API.TEACHERS, {
    params: {
      search,
      subjectId: subjectId ?? undefined, // only send if exists
    },
  });
  return extractListFromResponse(res);
}

export async function getNotClassTeachers(search = "") {
  const res = await API.get(ADMIN_API.TEACHERS, {
    params: { search, availableForClassTeacher: true },
  });
  return extractListFromResponse(res);
}

/** Strip spaces/dashes so UI-formatted Aadhaar validates as 12 digits. */
export function normalizeAadharDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export class ApiValidationError extends Error {
  public fieldErrors: Record<string, string>;
  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.fieldErrors = fieldErrors;
    Object.setPrototypeOf(this, ApiValidationError.prototype);
  }
}

export interface GenerateEmployeeIdPayload {
  fullName: string;
  date_of_birth: string; // ISO date
  phone: string;
}

export interface GenerateEmployeeIdResponse {
  employee_id: string;
}

export async function fetchSubjects(search = ""): Promise<Subject[]> {
  const url = `${ADMIN_API.SUBJECTS}?search=${encodeURIComponent(search)}&includeDeleted=false`;
  try {
    const resp = await API.get(url);
    const data = resp.data.subjects as Subject[];
    return data as Subject[];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error((err.response?.data as any)?.message ?? err.message);
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

// -----------------------------
// Fetch Teacher Profile
// GET /api/admin/teacher/{id}
// -----------------------------

export interface TeacherProfileResponse {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  address: string;
  gender: string;
  date_of_birth: string | null;
  aadhar: string;
  subject_speciality: string[];
  employee_id: string;
}

export async function fetchTeacherById(
  id: string,
): Promise<TeacherProfileResponse> {
  try {
    const resp = await API.get(`/api/admin/teachers/${id}`);
    return resp.data as TeacherProfileResponse;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as Record<string, unknown> | undefined;
      throw new Error((data && (data.message as string)) ?? err.message);
    }
    throw err;
  }
}

// -----------------------------
// Update Teacher
// PUT /api/admin/teacher/{id}
// -----------------------------

export interface UpdateTeacherPayload {
  mobile: string;
  address: string;
  subject_speciality: string[];
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
