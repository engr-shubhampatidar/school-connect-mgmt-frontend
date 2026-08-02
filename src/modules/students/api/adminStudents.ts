import type {
  StudentDetails,
  StudentsQuery,
  StudentsResponse,
} from "@/modules/students/types/admin";
import { ADMIN_API, STUDENT_API } from "@/config/api-routes";
import API from "@/services/axios";
import { mapStudentListItem } from "@/modules/students/utils/mappers";

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
  if (query.page) params.page = query.page;
  // Backend PaginationStudentDto expects `limit`
  if (query.pageSize) params.limit = query.pageSize;

  const res = await API.get<{
    data: Array<{
      id: string;
      name: string;
      studentId?: string | number | null;
      className?: string | null;
      section?: string | null;
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
  } = res.data;

  return {
    students: data.map(mapStudentListItem),
    total,
    page,
    pageSize: limit,
  };
}

export async function getStudentById(id: string): Promise<StudentDetails> {
  const res = await API.get<StudentDetails>(`${ADMIN_API.STUDENTS}/${id}`);
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
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  admissionDate?: string;
  classId?: string;
  addressLine?: string;
  aadhaarNumber?: string;
  fatherName?: string;
  fatherMobile?: string;
  motherName?: string;
  motherMobile?: string;
  guardianName?: string;
  guardianMobile?: string;
  bloodGroup?: string;
  medicalNotes?: string;
};

export async function updateStudent(
  studentId: string,
  payload: UpdateStudentPayload,
  options?: { signal?: AbortSignal },
) {
  const res = await API.patch(STUDENT_API.UPDATE(studentId), payload, {
    signal: options?.signal,
  });
  return res.data;
}
