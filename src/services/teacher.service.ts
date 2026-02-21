import API from "@/lib/axios";
import { SubjectsResponse, Subject, CreateTeacherValues } from "@/schemas/teacher.schema";
import axios from "axios";

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
  const url = `/api/admin/subjects?search=${encodeURIComponent(search)}&includeDeleted=false`;
  try {
    const resp = await API.get(url);
    const data = resp.data as unknown;
    // safe parse
    if (data && typeof data === "object" && Array.isArray((data as any).items)) {
      const items = (data as any).items as unknown[];
      return items.map((it) => {
        if (it && typeof it === "object") {
          const o = it as Record<string, unknown>;
          return {
            id: String(o.id ?? o._id ?? o.uuid ?? o.value ?? o.key ?? ""),
            name: String(o.name ?? o.title ?? o.value ?? ""),
          } as Subject;
        }
        return { id: String(it ?? ""), name: String(it ?? "") } as Subject;
      });
    }
    return [];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error((err.response?.data as any)?.message ?? err.message);
    }
    throw err;
  }
}

export async function generateEmployeeId(payload: GenerateEmployeeIdPayload): Promise<GenerateEmployeeIdResponse> {
  try {
    const resp = await API.post("/api/admin/teachers/generate-employee-id", payload);
    const data = resp.data as { employee_id?: string } | undefined;
    if (data && typeof data.employee_id === "string") {
      return { employee_id: data.employee_id };
    }
    throw new Error("Unexpected response from employee id generator");
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as Record<string, unknown> | undefined;
      if (data?.fieldErrors && typeof data.fieldErrors === "object") {
        throw new ApiValidationError((data.message as string) ?? err.message, data.fieldErrors as Record<string, string>);
      }
      throw new Error((data && (data.message as string)) ?? err.message);
    }
    throw err;
  }
}

export async function createTeacher(payload: CreateTeacherValues): Promise<unknown> {
  try {
    const resp = await API.post("/api/admin/teachers", payload);
    return resp.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as Record<string, unknown> | undefined;
      if (data?.fieldErrors && typeof data.fieldErrors === "object") {
        throw new ApiValidationError((data.message as string) ?? err.message, data.fieldErrors as Record<string, string>);
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
  id: string
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
  payload: UpdateTeacherPayload
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
          data.fieldErrors as Record<string, string>
        );
      }

      throw new Error((data && (data.message as string)) ?? err.message);
    }
    throw err;
  }
}

