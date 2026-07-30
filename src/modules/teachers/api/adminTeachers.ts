import type { AxiosRequestConfig } from "axios";
import type {
  Teacher,
  TeacherClassRaw,
  TeachersQuery,
  TeachersResponse,
} from "@/modules/teachers/types/admin";
import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";

export type {
  Teacher,
  TeacherClassRaw,
  TeachersQuery,
  TeachersResponse,
} from "@/modules/teachers/types/admin";

export async function fetchTeachers(
  query: TeachersQuery = {},
  config?: AxiosRequestConfig,
): Promise<TeachersResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.email) params.email = query.email;
  if (query.subjectId) params.subjectId = query.subjectId;
  if (query.classId) params.classId = query.classId;
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
    const name = (itObj.fullName ?? "") as string;
    const email = (user.email ?? itObj.email ?? "") as string;
    const phone = (itObj.phone ?? user.phone ?? null) as string | null;

    let subjects: string[] | null = null;
    if (Array.isArray(itObj.subjects)) {
      subjects = (itObj.subjects as unknown[])
        .map((s) =>
          s && typeof s === "object"
            ? ((s as Record<string, unknown>).name ?? null)
            : typeof s === "string"
              ? s
              : null,
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
          new Set([...(subjects ?? []), ...subjFromAssignments]),
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
          new Set([...(assignedClasses ?? []), ...classesFromAssignments]),
        );
      }
    }

    return {
      id: (itObj.id ?? user.id ?? "") as string,
      name,
      email,
      phone,
      subjects,
      employeeId: itObj.employeeId,
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

// Fetch available teachers for assignment
export async function fetchAvailableTeachers(): Promise<Teacher[]> {
  try {
    const res = await API.get(`${ADMIN_API.TEACHERS}/not-class-teachers`);
    const data = res.data as unknown;
    if (Array.isArray(data)) return data as Teacher[];
    const d =
      data && typeof data === "object" ? (data as Record<string, unknown>) : {};
    if (Array.isArray(d.teachers)) return d.teachers as Teacher[];
    if (Array.isArray(d.items)) return d.items as Teacher[];
    return [];
  } catch (err) {
    throw err;
  }
}
