import API from "./axios";
import type { AxiosRequestConfig } from "axios";
import { ADMIN_API, BASE_URL } from "./api-routes";
import { ur } from "zod/locales";

export type Student = {
  id: string;
  name: string;
  studentId?: string | number | null;
  class?:
    | string
    | null
    | {
        id: string;
        name: string;
        section?: string | null;
      };
  email?: string | null;
  photoUrl?: string | null;
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
  classId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

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
    items: Array<{
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

  const { items = [], total, page, limit } = res.data;

  const students: Student[] = items.map((it) => ({
    id: it.id,
    name: it.name,
    studentId: (it.studentId ?? null) as string | number | null,
    class: it.currentClass
      ? {
          id: "",
          name: it.currentClass.name,
          section: it.currentClass.section ?? null,
        }
      : null,
    createdAt: it.createdAt,
  }));

  return {
    students,
    total,
    page,
    pageSize: limit,
  };
}

export type Teacher = {
  id: string;
  user?: {
    id?: string;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  name: string;
  email: string;
  phone?: string | null;
  subjects?: string[] | null;
  employeeId?: string;
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
  subjectId?: string;
  classId?: string;
  page?: number;
  pageSize?: number;
};

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
export interface StudentDetails {
  id: string;
  name: string;
  email: string;
  studentId: string;
  phoneNo: string;
  gender: string | null;
  category: string | null;
  admissionDate: string | null;
  aadhaar: string | null;
  address: string | null;
  rollNo: string | null;
  fatherName: string | null;
  fatherMobile: string | null;
  fatherEmail: string | null;
  motherName: string | null;
  emergencyContact: string | null;
  dob: string | null;
}

export async function getStudentById(id: string) {
  console.log("BASE URL:", API.defaults.baseURL);
 const url =`${BASE_URL}${ADMIN_API.STUDENTS}/${id}`
  const res = await API.get(url);

  console.log(res);

  return res.data;
}

export type ClassItem = {
  id: string;
  name: string;
  section?: string | null;
  createdAt?: string;
  classTeacherId?: string | null;
  classTeacherName?: string | null;
};

export type ClassesResponse = {
  classes: ClassItem[];
  groups?: unknown[];
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
  query: ClassesQuery = {},
): Promise<ClassesResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  // Use the endpoint that includes class teacher info
  const res = await API.get<any>(ADMIN_API.CLASSES_WITH_TEACHER, { params });
  const data = res.data as unknown;
  const d =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  // Normalize possible array shapes: raw array, { items: [] }, { classes: [] }
  let rawItems: unknown[] = [];
  if (Array.isArray(data)) rawItems = data as unknown[];
  else if (Array.isArray(d.items)) rawItems = d.items as unknown[];
  else if (Array.isArray(d.classes)) rawItems = d.classes as unknown[];
  else rawItems = (d.classes ?? d.items ?? []) as unknown[];

  let classes: ClassItem[];
  let groups: unknown[] | undefined = undefined;

  // If API returned grouped grade objects with `sections`, derive a flat list for callers
  const first = rawItems && rawItems.length > 0 ? rawItems[0] : null;
  if (
    first &&
    typeof first === "object" &&
    Array.isArray((first as Record<string, any>).sections)
  ) {
    groups = rawItems as unknown[];
    classes = (groups as any[]).flatMap((g) => {
      const grade = g as Record<string, any>;
      const gradeName = grade.gradeName ?? grade.name ?? "";
      const secs = Array.isArray(grade.sections) ? grade.sections : [];
      return secs.map((s: any, idx: number) => {
        const sid = s.id ?? s.classId ?? `${gradeName}-${s.section ?? idx}`;
        return {
          id: String(sid),
          name: `${gradeName}${s.sectionLabel ? ` - ${s.sectionLabel}` : ""}`,
          section: s.section ?? null,
          createdAt: undefined,
          classTeacherId: s.classTeacherId ?? null,
          classTeacherName: s.classTeacherName ?? null,
        } as ClassItem;
      });
    });
  } else {
    classes = (rawItems || []).map((it) => {
      const obj =
        it && typeof it === "object" ? (it as Record<string, any>) : {};
      const id = (obj.classId ?? obj.id ?? obj._id ?? "") as string;
      const name = (obj.className ?? obj.name ?? "") as string;
      const section = (obj.classSection ?? obj.section ?? null) as
        | string
        | null;
      const ct = obj.classTeacher ?? obj.class_teacher ?? null;
      const classTeacherId =
        ct && typeof ct === "object"
          ? (ct.teacherId ?? ct.id ?? ct._id ?? null)
          : null;
      const classTeacherName =
        ct && typeof ct === "object"
          ? (ct.fullName ?? ct.name ?? null)
          : (obj.classTeacherName ?? null);

      return {
        id: String(id),
        name: String(name),
        section,
        createdAt: (obj.createdAt ?? undefined) as string | undefined,
        classTeacherId: classTeacherId ?? null,
        classTeacherName: classTeacherName ?? null,
      } as ClassItem;
    });
  }

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
    groups,
    total,
    page,
    pageSize,
  };
}

export type ClassWithTeacher = {
  classId: string;
  className: string;
  classSection: string;
  classTeacher: {
    teacherId: string;
    fullName: string;
    email: string;
    phone: string;
  } | null;
};

export async function fetchClassesWithTeacher(): Promise<ClassWithTeacher[]> {
  const res = await API.get<any>(ADMIN_API.CLASSES_WITH_TEACHER);
  const data = res.data as unknown;

  // If API returned a flat array of ClassWithTeacher objects
  if (Array.isArray(data) && data.length > 0) {
    // detect grouped shape (grade objects with `sections`) and flatten below
    const first = data[0];
    if (
      first &&
      typeof first === "object" &&
      Array.isArray((first as Record<string, any>).sections)
    ) {
      const groups = data as any[];
      const flat: ClassWithTeacher[] = groups.flatMap((g) => {
        const gradeName = g.gradeName ?? g.name ?? "";
        const secs = Array.isArray(g.sections) ? g.sections : [];
        return secs.map((s: any) => {
          const classId = s.classId ?? s.id ?? "";
          const classSection = s.section ?? s.sectionLabel ?? "";
          const className = gradeName || s.className || s.name || "";
          const teacher =
            s.classTeacher || s.classTeacherName || s.class_teacher
              ? // normalize teacher object
                s.classTeacher && typeof s.classTeacher === "object"
                ? {
                    teacherId:
                      s.classTeacher.teacherId ?? s.classTeacher.id ?? "",
                    fullName:
                      s.classTeacher.fullName ??
                      s.classTeacher.name ??
                      String(s.classTeacherName ?? ""),
                    email: s.classTeacher.email ?? null,
                    phone: s.classTeacher.phone ?? null,
                  }
                : {
                    teacherId: s.teacherId ?? "",
                    fullName: String(
                      s.classTeacherName ?? s.classTeacher ?? "",
                    ),
                    email: null,
                    phone: null,
                  }
              : null;

          return {
            classId: String(classId),
            className: String(className),
            classSection: String(classSection ?? ""),
            classTeacher: teacher,
          } as ClassWithTeacher;
        });
      });
      return flat;
    }

    // If it's already the expected flat list of ClassWithTeacher, return as-is
    return data as ClassWithTeacher[];
  }

  const d =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  if (Array.isArray(d.items)) return d.items as ClassWithTeacher[];
  if (Array.isArray(d.classes)) return d.classes as ClassWithTeacher[];

  // Handle grouped response under a top-level object containing grades
  // e.g. { grades: [ { gradeName, sections: [...] }, ... ] }
  const groups = Array.isArray(d.grades)
    ? d.grades
    : Array.isArray(d.groups)
      ? d.groups
      : null;
  if (Array.isArray(groups) && groups.length > 0) {
    const flat: ClassWithTeacher[] = (groups as any[]).flatMap((g) => {
      const gradeName = g.gradeName ?? g.name ?? "";
      const secs = Array.isArray(g.sections) ? g.sections : [];
      return secs.map((s: any) => {
        const classId = s.classId ?? s.id ?? "";
        const classSection = s.section ?? s.sectionLabel ?? "";
        const className = gradeName || s.className || s.name || "";
        const teacher =
          s.classTeacher || s.classTeacherName || s.class_teacher
            ? s.classTeacher && typeof s.classTeacher === "object"
              ? {
                  teacherId:
                    s.classTeacher.teacherId ?? s.classTeacher.id ?? "",
                  fullName:
                    s.classTeacher.fullName ??
                    s.classTeacher.name ??
                    String(s.classTeacherName ?? ""),
                  email: s.classTeacher.email ?? null,
                  phone: s.classTeacher.phone ?? null,
                }
              : {
                  teacherId: s.teacherId ?? "",
                  fullName: String(s.classTeacherName ?? s.classTeacher ?? ""),
                  email: null,
                  phone: null,
                }
            : null;

        return {
          classId: String(classId),
          className: String(className),
          classSection: String(classSection ?? ""),
          classTeacher: teacher,
        } as ClassWithTeacher;
      });
    });
    return flat;
  }

  return [];
}

export async function createClass(payload: {
  name: string;
  section?: string | null;
}) {
  const res = await API.post<{ id: string } | ClassItem>(
    ADMIN_API.CLASSES,
    payload,
  );
  return res.data;
}

export type ClassDetail = {
  className: string;
  section: string;
  homeRoom: string;
  classTeacherName: string;
};

export async function fetchClassById(id: string): Promise<ClassDetail> {
  const res = await API.get<ClassDetail>(`${ADMIN_API.CLASSES}/${id}`);
  return res.data;
}

export async function updateClass(
  id: string,
  payload: { room_no: string; classTeacherId: string },
): Promise<void> {
  await API.put(`${ADMIN_API.CLASSES}/${id}`, payload);
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

// Assign a teacher to a class
export async function assignTeacherToClass(
  classId: string,
  teacherId: string,
): Promise<void> {
  const url = `${ADMIN_API.CLASSES}/${classId}/assign-teacher`;
  await API.post(url, { teacherId });
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
  query: SubjectsQuery = {},
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

/* Timetable API helpers */
export type TimetableEntryDto = {
  id: string;
  classId: string;
  subjectId: string;
  teacherId?: string | null;
  dayOfWeek: number; // 1..7
  startTime: string; // 'HH:MM'
  endTime: string; // 'HH:MM'
  room?: string | null;
  subjectName?: string;
  teacherName?: string;
};

export type CreateTimetableEntryDto = {
  subjectId: string;
  teacherId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
};

export type UpdateTimetableEntryDto = {
  teacherId?: string | null;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  room?: string | null;
};

export async function fetchTimetable(
  classId: string,
): Promise<TimetableEntryDto[]> {
  const url = `${ADMIN_API.CLASSES}/${classId}/timetable`;
  const res = await API.get<TimetableEntryDto[]>(url);
  return res.data || [];
}

export async function createTimetableEntry(
  classId: string,
  payload: CreateTimetableEntryDto,
): Promise<TimetableEntryDto> {
  const url = `${ADMIN_API.CLASSES}/${classId}/timetable`;
  const res = await API.post<TimetableEntryDto>(url, payload);
  return res.data;
}

export async function updateTimetableEntry(
  classId: string,
  teId: string,
  payload: UpdateTimetableEntryDto,
): Promise<TimetableEntryDto> {
  const url = `${ADMIN_API.CLASSES}/${classId}/timetable/${teId}`;
  const res = await API.put<TimetableEntryDto>(url, payload);
  return res.data;
}

export async function deleteTimetableEntry(
  classId: string,
  teId: string,
): Promise<{ message: string }> {
  const url = `${ADMIN_API.CLASSES}/${classId}/timetable/${teId}/delete`;
  const res = await API.post(url);
  return res.data;
}

/* Class - Subject assignment helpers */
export type ClassSubjectDto = {
  id: string;
  classId: string;
  subjectId: string;
  teacherId?: string | null;
  subjectName?: string | null;
  teacherName?: string | null;
};

export type CreateClassSubjectDto = {
  subjectId: string;
  teacherId?: string;
};

export type UpdateClassSubjectDto = {
  teacherId?: string | null;
};

export async function fetchClassSubjects(
  classId: string,
): Promise<ClassSubjectDto[]> {
  const url = `${ADMIN_API.CLASSES}/${classId}/subjects`;
  const res = await API.get<ClassSubjectDto[]>(url);
  return res.data || [];
}

export async function assignSubjectToClass(
  classId: string,
  payload: CreateClassSubjectDto,
): Promise<ClassSubjectDto> {
  const url = `${ADMIN_API.CLASSES}/${classId}/subjects`;
  const res = await API.post<ClassSubjectDto>(url, payload);
  return res.data;
}

export async function updateClassSubject(
  classId: string,
  csId: string,
  payload: UpdateClassSubjectDto,
): Promise<ClassSubjectDto> {
  const url = `${ADMIN_API.CLASSES}/${classId}/subjects/${csId}`;
  const res = await API.put<ClassSubjectDto>(url, payload);
  return res.data;
}

export async function removeClassSubject(
  classId: string,
  csId: string,
): Promise<{ message: string }> {
  const url = `${ADMIN_API.CLASSES}/${classId}/subjects/${csId}/delete`;
  const res = await API.post(url);
  return res.data;
}

export type Announcement = {
  id: string;
  title: string;
  message?: string | null;
  status?: string | null;
  role?: string | null;
  attachments?: string | null;
  createdAt?: string | null;
  scheduledAt?: string | null;
};

export type AnnouncementsResponse = {
  announcements: Announcement[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type AnnouncementsQuery = {
  search?: string;
  status?: string;
  role?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchAnnouncements(
  query: AnnouncementsQuery = {},
  config?: AxiosRequestConfig,
): Promise<AnnouncementsResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.status) params.status = query.status;
  if (query.role) params.role = query.role;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;

  const res = await API.get<any>(ADMIN_API.ANNOUNCEMENTS, {
    params,
    ...(config ?? {}),
  });

  const data = res.data as unknown;
  const d =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  const items = (
    Array.isArray(data)
      ? (data as unknown[])
      : Array.isArray(d.announcements)
        ? (d.announcements as unknown[])
        : Array.isArray(d.items)
          ? (d.items as unknown[])
          : []
  ) as unknown[];

  const announcements: Announcement[] = (items || []).map((it) => {
    const obj =
      it && typeof it === "object" ? (it as Record<string, unknown>) : {};
    return {
      id: String(obj.id ?? obj._id ?? obj.announcementId ?? ""),
      title: String(obj.title ?? obj.name ?? ""),
      message: (obj.message ?? obj.body ?? null) as string | null,
      status: (obj.status ?? null) as string | null,
      role: (obj.role ?? null) as string | null,
      attachments: (obj.attachments ?? obj.files ?? null) as string | null,
      createdAt: (obj.createdAt ?? obj.created_at ?? null) as string | null,
      scheduledAt: (obj.scheduledAt ?? obj.scheduled_at ?? null) as
        | string
        | null,
    } as Announcement;
  });

  const total: number | undefined =
    (d.total as number | undefined) ??
    (d.totalCount as number | undefined) ??
    announcements.length;
  const page: number | undefined =
    (d.page as number | undefined) ?? (d.p as number | undefined) ?? query.page;
  const pageSize: number | undefined =
    (d.pageSize as number | undefined) ??
    (d.limit as number | undefined) ??
    query.pageSize;

  return {
    announcements,
    total,
    page,
    pageSize,
  };
}
