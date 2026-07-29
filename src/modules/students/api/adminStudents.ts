import type { StudentsQuery, StudentsResponse } from "@/modules/students/types/admin";
import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";

export type {
  Student,
  StudentDetails,
  StudentsQuery,
  StudentsResponse,
} from "@/modules/students/types/admin";

export async function fetchStudents(
  query: StudentsQuery = {},
): Promise<StudentsResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.classId) params.classId = query.classId;
  if (query.status) params.status = query.status;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  const res = await API.get<{
    data: Array<{
      id: string;
      name: string;
      studentId?: string | number | null;
      currentClass?: { name: string; section?: string | null } | null;
      createdAt: string;
    }>;
    total?: number;
    page?: number;
    limit?: number;
  }>(ADMIN_API.STUDENTS, { params });

  const {
    data = [],
    total = 0,
    page = 1,
    limit = 10,
  } = res.data as {
    data: Array<{
      id: string;
      name: string;
      studentId?: string | number | null;
      currentClass?: { name: string; section?: string | null } | null;
      createdAt: string;
    }>;
    total?: number;
    page?: number;
    limit?: number;
  };

  return {
    students: data,
    total,
    page,
    pageSize: limit,
  };
}

export async function getStudentById(id: string) {
  console.log("BASE URL:", API.defaults.baseURL);
  const url = `${ADMIN_API.STUDENTS}/${id}`;
  const res = await API.get(url);

  console.log(res);

  return res.data;
}

export type CreateStudentPayload = {
  firstName: string;
  lastName: string;
  classId: string;
  email?: string;
  phoneNumber?: string;
  profileUrl?: string | null;
  admissionDate?: string;
  date_of_birth?: string;
  gender?: string;
};

export async function createStudent(payload: CreateStudentPayload) {
  const res = await API.post(ADMIN_API.STUDENTS, payload);
  return res.data;
}

export type UpdateStudentPayload = {
  email: string;
  fullName: string;
  phoneNumber: string;
  gender: string;
  category: string;
  admissionDate: string | null;
  addressLine: string;
  aadhaarNumber: string;
  fatherName: string;
  fatherMobile: string;
  motherName: string;
  parentEmail: string;
  documentUrls: string[];
};

export async function updateStudent(
  studentId: string,
  payload: UpdateStudentPayload,
  options?: { signal?: AbortSignal },
) {
  const res = await API.put(`/api/admin/students/${studentId}`, payload, {
    signal: options?.signal,
  });
  return res.data;
}
