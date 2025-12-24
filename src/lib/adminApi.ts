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
  const data = res.data as unknown;

  const d =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const items = (
    Array.isArray(d.students)
      ? d.students
      : Array.isArray(d.items)
      ? d.items
      : []
  ) as unknown[];

  const students: Student[] = (items || []).map((it) => {
    const itObj =
      it && typeof it === "object" ? (it as Record<string, unknown>) : {};
    const rawClass =
      itObj.currentClass ??
      itObj.class ??
      itObj.classId ??
      itObj.class_id ??
      null;

    let classVal: Student["class"] = null;
    if (rawClass) {
      if (typeof rawClass === "object") {
        const rc = rawClass as Record<string, unknown>;
        classVal = {
          id: (rc.id ?? rc._id ?? rc.classId ?? "") as string,
          name: (rc.name ?? rc.className ?? "") as string,
          section: (rc.section ?? rc.classSection ?? null) as string | null,
        };
      } else if (typeof rawClass === "string") {
        classVal = rawClass;
      }
    }

    return {
      id: (itObj.id ?? itObj._id ?? "") as string,
      name: (itObj.name ??
        itObj.fullName ??
        (itObj.user && (itObj.user as Record<string, unknown>).fullName) ??
        "") as string,
      rollNo: (itObj.rollNo ?? itObj.roll_no ?? itObj.rollNumber ?? null) as
        | string
        | number
        | null,
      class: classVal,
      createdAt: (itObj.createdAt ??
        itObj.created_at ??
        new Date().toISOString()) as string,
    } as Student;
  });

  const total: number | undefined =
    (d.total as number | undefined) ??
    (d.totalCount as number | undefined) ??
    students.length;
  const page: number | undefined =
    (d.page as number | undefined) ?? (d.p as number | undefined) ?? undefined;
  const pageSize: number | undefined =
    (d.pageSize as number | undefined) ??
    (d.limit as number | undefined) ??
    query.pageSize;

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
  classTeacher?: { id: string; name: string; section?: string | null } | null;
  classes?: TeacherClassRaw[] | null;
  invitedAt?: string | null;
};

export type TeacherClassRaw = {
  classId?: string;
  className?: string;
  classSection?: string | null;
  subjectName?: string | null;
  id?: string;
  name?: string;
  section?: string | null;
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
  const data = res.data as unknown;
  const d =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const items = (
    Array.isArray(d.teachers)
      ? d.teachers
      : Array.isArray(d.items)
      ? d.items
      : []
  ) as unknown[];

  const teachers: Teacher[] = (items || []).map((it) => {
    const itObj =
      it && typeof it === "object" ? (it as Record<string, unknown>) : {};
    const user =
      itObj.user && typeof itObj.user === "object"
        ? (itObj.user as Record<string, unknown>)
        : {};
    const name = (user.fullName ?? itObj.name ?? "") as string;
    const email = (user.email ?? itObj.email ?? "") as string;
    const phone = (itObj.phone ?? user.phone ?? null) as string | null;

    let subjects: string[] | null = null;
    if (Array.isArray(itObj.subjects)) {
      subjects = (itObj.subjects as unknown[])
        .map((s) =>
          s && typeof s === "object"
            ? (s as Record<string, unknown>).name ?? null
            : typeof s === "string"
            ? s
            : null
        )
        .filter(Boolean) as string[];
    }

    const assignments = Array.isArray(itObj.assignments)
      ? (itObj.assignments as unknown[])
      : [];
    if (assignments.length > 0) {
      const subjFromAssignments = assignments
        .map((a) => {
          if (!a || typeof a !== "object") return null;
          const ao = a as Record<string, unknown>;
          return (ao.subjectName ?? ao.subject ?? ao.subject_id) as
            | string
            | null;
        })
        .filter(Boolean) as string[];
      if (subjFromAssignments.length > 0) {
        subjects = Array.from(
          new Set([...(subjects ?? []), ...subjFromAssignments])
        );
      }
    }

    let assignedClasses: string[] | null = null;
    const classesArr = (itObj.classes ?? itObj.assignedClasses) as
      | unknown[]
      | undefined;
    if (Array.isArray(classesArr) && classesArr.length > 0) {
      assignedClasses = classesArr
        .map((c) => {
          if (!c) return null;
          if (typeof c === "object") {
            const co = c as Record<string, unknown>;
            const name = (co.className ?? co.name ?? co.class ?? null) as
              | string
              | null;
            const section = (co.classSection ?? co.section ?? null) as
              | string
              | null;
            const subject = (co.subjectName ?? co.subject ?? null) as
              | string
              | null;
            if (!name) return null;
            return section
              ? `${name} - ${section}${subject ? ` (${subject})` : ""}`
              : `${name}${subject ? ` (${subject})` : ""}`;
          }
          if (typeof c === "string") return c;
          return null;
        })
        .filter(Boolean) as string[];
    }

    // map single class teacher object if present
    let classTeacher: {
      id: string;
      name: string;
      section?: string | null;
    } | null = null;
    const ct =
      itObj.classTeacher ?? itObj.class_teacher ?? itObj.classTeacherId ?? null;
    if (ct && typeof ct === "object") {
      const cto = ct as Record<string, unknown>;
      const id = (cto.classId ?? cto.id ?? cto._id ?? "") as string;
      const name = (cto.className ?? cto.name ?? "") as string;
      const section = (cto.classSection ?? cto.section ?? null) as
        | string
        | null;
      if (name) classTeacher = { id, name, section };
    }

    if (assignments.length > 0) {
      const classesFromAssignments = assignments
        .map((a) => {
          if (!a || typeof a !== "object") return null;
          const ao = a as Record<string, unknown>;
          const name = (ao.className ?? ao.name ?? ao.class) as string | null;
          const section = (ao.classSection ?? ao.section) as string | null;
          if (!name) return null;
          return section ? `${name} - ${section}` : name;
        })
        .filter(Boolean) as string[];
      if (classesFromAssignments.length > 0) {
        assignedClasses = Array.from(
          new Set([...(assignedClasses ?? []), ...classesFromAssignments])
        );
      }
    }

    return {
      id: (itObj.id ?? user.id ?? "") as string,
      name,
      email,
      phone,
      subjects,
      assignedClasses,
      classes: Array.isArray(classesArr)
        ? (classesArr as TeacherClassRaw[])
        : null,
      classTeacher,
      invitedAt: (itObj.invitedAt ?? null) as string | null,
    } as Teacher;
  });

  // derive pagination values
  let total: number | undefined =
    (d.total as number | undefined) ??
    (d.totalCount as number | undefined) ??
    teachers.length;
  const page: number | undefined =
    (d.page as number | undefined) ??
    (d.p as number | undefined) ??
    query.page ??
    1;
  const pageSize: number | undefined =
    (d.pageSize as number | undefined) ??
    (d.limit as number | undefined) ??
    query.pageSize;

  // If the API returned all items without pagination (no total provided)
  // and the caller requested a page/pageSize, perform client-side slicing
  // so the UI gets only the items for the requested page.
  let finalTeachers = teachers;
  if (
    typeof pageSize === "number" &&
    typeof query.page === "number" &&
    (d.total as number | undefined) === undefined &&
    (d.totalCount as number | undefined) === undefined &&
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
  const data = res.data as unknown;
  const d =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  const classes: ClassItem[] = (d.classes ?? d.items ?? []) as ClassItem[];
  const total: number | undefined =
    (d.total as number | undefined) ??
    (d.totalCount as number | undefined) ??
    classes.length;
  const page: number | undefined =
    (d.page as number | undefined) ?? (d.p as number | undefined) ?? query.page;
  const pageSize: number | undefined =
    (d.pageSize as number | undefined) ??
    (d.limit as number | undefined) ??
    query.pageSize;

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
  const data = res.data as unknown;
  const d =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  const subjects: Subject[] = (d.subjects ?? d.items ?? []) as Subject[];
  const total: number | undefined =
    (d.total as number | undefined) ??
    (d.totalCount as number | undefined) ??
    subjects.length;
  const page: number | undefined =
    (d.page as number | undefined) ?? (d.p as number | undefined) ?? query.page;
  const pageSize: number | undefined =
    (d.pageSize as number | undefined) ??
    (d.limit as number | undefined) ??
    query.pageSize;

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
