import API from "./axios";
import type { AxiosRequestConfig } from "axios";
import { ADMIN_API } from "./api-routes";

export type Student = {
  id: string;
  name: string;
  rollNo?: string | number | null;
  class?:
    | string
    | null
    | {
        id: string;
        name: string;
        section?: string | null;
      };
  createdAt: string;
};

export type StudentsResponse = {
  students: Student[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type StudentsQuery = {
  search?: string;
  class?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchStudents(
  query: StudentsQuery = {}
): Promise<StudentsResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.class) params.class = query.class;
  if (query.status) params.status = query.status;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;

  const res = await API.get<StudentsResponse>(ADMIN_API.STUDENTS, { params });
  const data = res.data as any;

  const students: Student[] = data.students ?? data.items ?? [];
  const total: number | undefined = data.total ?? data.totalCount ?? students.length;
  const page: number | undefined = data.page ?? data.p ?? undefined;
  const pageSize: number | undefined = data.pageSize ?? data.limit ?? query.pageSize;

  return {
    students,
    total,
    page,
    pageSize,
  };
}

export type Teacher = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subjects?: string[] | null;
  assignedClasses?: string[] | null;
  invitedAt?: string | null;
};

export type TeachersResponse = {
  teachers: Teacher[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type TeachersQuery = {
  search?: string;
  email?: string;
  subject?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchTeachers(
  query: TeachersQuery = {},
  config?: AxiosRequestConfig
): Promise<TeachersResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.email) params.email = query.email;
  if (query.subject) params.subject = query.subject;
  if (query.page) params.page = query.page;
  if (query.pageSize) {
    params.pageSize = query.pageSize;
    // some APIs expect `limit` instead of `pageSize`
    params.limit = query.pageSize;
  }
  const res = await API.get<TeachersResponse>(ADMIN_API.TEACHERS, {
    params,
    ...(config ?? {}),
  });
  const data = res.data as any;

  const items: any[] = data.teachers ?? data.items ?? [];

  const teachers: Teacher[] = (items || []).map((it: any) => {
    const user = it.user ?? {};
    const name = user.fullName ?? it.name ?? "";
    const email = user.email ?? it.email ?? "";
    const phone = it.phone ?? user.phone ?? null;

    let subjects: string[] | null = null;
    if (Array.isArray(it.subjects)) {
      subjects = it.subjects.map((s: any) => s?.name ?? s).filter(Boolean);
    }

    // handle assignment-based responses: some APIs return assignments array
    // with className/classSection and subjectName fields
    const assignments = Array.isArray(it.assignments) ? it.assignments : [];
    if (assignments.length > 0) {
      const subjFromAssignments = assignments
        .map((a: any) => a?.subjectName ?? (a.subject ?? a.subject_id ?? null))
        .filter(Boolean);
      if (subjFromAssignments.length > 0) {
        subjects = Array.from(new Set([...(subjects ?? []), ...subjFromAssignments]));
      }
    }

    let assignedClasses: string[] | null = null;
    // some APIs return classes, some return assignedClasses
    const classesArr = it.classes ?? it.assignedClasses ?? [];
    if (Array.isArray(classesArr) && classesArr.length > 0) {
      assignedClasses = classesArr.map((c: any) => c?.name ?? c).filter(Boolean);
    }

    // also support classes provided inside `assignments` objects
    if (assignments.length > 0) {
      const classesFromAssignments = assignments
        .map((a: any) => {
          const name = a?.className ?? a?.name ?? a?.class ?? null;
          const section = a?.classSection ?? a?.section ?? null;
          if (!name) return null;
          return section ? `${name} - ${section}` : name;
        })
        .filter(Boolean);
      if (classesFromAssignments.length > 0) {
        assignedClasses = Array.from(
          new Set([...(assignedClasses ?? []), ...classesFromAssignments])
        );
      }
    }

    return {
      id: it.id ?? user.id ?? "",
      name,
      email,
      phone,
      subjects,
      assignedClasses,
      invitedAt: it.invitedAt ?? null,
    } as Teacher;
  });

  // derive pagination values
  let total: number | undefined = data.total ?? data.totalCount ?? teachers.length;
  const page: number | undefined = data.page ?? data.p ?? query.page ?? 1;
  const pageSize: number | undefined = data.pageSize ?? data.limit ?? query.pageSize;

  // If the API returned all items without pagination (no total provided)
  // and the caller requested a page/pageSize, perform client-side slicing
  // so the UI gets only the items for the requested page.
  let finalTeachers = teachers;
  if (
    typeof pageSize === "number" &&
    typeof query.page === "number" &&
    (data.total === undefined && data.totalCount === undefined) &&
    teachers.length > pageSize
  ) {
    total = teachers.length;
    const start = (query.page - 1) * pageSize;
    finalTeachers = teachers.slice(start, start + pageSize);
  }

  return {
    teachers: finalTeachers,
    total,
    page,
    pageSize,
  };
}

export type ClassItem = {
  id: string;
  name: string;
  section?: string | null;
  createdAt?: string;
};

export type ClassesResponse = {
  classes: ClassItem[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type ClassesQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchClasses(
  query: ClassesQuery = {}
): Promise<ClassesResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  const res = await API.get<ClassesResponse>(ADMIN_API.CLASSES, { params });
  const data = res.data as any;

  const classes: ClassItem[] = data.classes ?? data.items ?? [];
  const total: number | undefined = data.total ?? data.totalCount ?? classes.length;
  const page: number | undefined = data.page ?? data.p ?? query.page;
  const pageSize: number | undefined = data.pageSize ?? data.limit ?? query.pageSize;

  return {
    classes,
    total,
    page,
    pageSize,
  };
}

export async function createClass(payload: {
  name: string;
  section?: string | null;
}) {
  const res = await API.post<{ id: string } | ClassItem>(
    ADMIN_API.CLASSES,
    payload
  );
  return res.data;
}

export type Subject = {
  id: string;
  name: string;
  code: string;
  createdAt?: string;
};

export type SubjectsResponse = {
  subjects: Subject[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type SubjectsQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchSubjects(
  query: SubjectsQuery = {}
): Promise<SubjectsResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  const res = await API.get<SubjectsResponse>(ADMIN_API.SUBJECTS, { params });
  const data = res.data as any;

  const subjects: Subject[] = data.subjects ?? data.items ?? [];
  const total: number | undefined = data.total ?? data.totalCount ?? subjects.length;
  const page: number | undefined = data.page ?? data.p ?? query.page;
  const pageSize: number | undefined = data.pageSize ?? data.limit ?? query.pageSize;

  return {
    subjects,
    total,
    page,
    pageSize,
  };
}

export async function createSubject(payload: { name: string; code: string }) {
  const res = await API.post<{ id: string }>(ADMIN_API.SUBJECTS, payload);
  return res.data;
}
