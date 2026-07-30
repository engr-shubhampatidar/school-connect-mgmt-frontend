import type {
  ClassDashboardDetails,
  ClassDashboardStats,
  ClassDetail,
  ClassItem,
  ClassesQuery,
  ClassesResponse,
  ClassWithTeacher,
  CreateClassWithSubjectsPayload,
} from "@/modules/classes/types/classes";
import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";

export type {
  ClassDashboardDetails,
  ClassDashboardStats,
  ClassDetail,
  ClassItem,
  ClassesQuery,
  ClassesResponse,
  ClassWithTeacher,
  CreateClassWithSubjectsPayload,
} from "@/modules/classes/types/classes";

export async function fetchClasses(
  query: ClassesQuery = {},
): Promise<ClassesResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  const res = await API.get<any>(ADMIN_API.CLASSES_WITH_TEACHER, { params });
  const data = res.data as unknown;
  const d =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  let rawItems: unknown[] = [];
  if (Array.isArray(data)) rawItems = data as unknown[];
  else if (Array.isArray(d.items)) rawItems = d.items as unknown[];
  else if (Array.isArray(d.classes)) rawItems = d.classes as unknown[];
  else rawItems = (d.classes ?? d.items ?? []) as unknown[];

  let classes: ClassItem[];
  let groups: unknown[] | undefined = undefined;

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

export async function fetchClassesWithTeacher(): Promise<ClassWithTeacher[]> {
  const res = await API.get<any>(ADMIN_API.CLASSES_WITH_TEACHER);
  const data = res.data as unknown;

  if (Array.isArray(data) && data.length > 0) {
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

    return data as ClassWithTeacher[];
  }

  const d =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  if (Array.isArray(d.items)) return d.items as ClassWithTeacher[];
  if (Array.isArray(d.classes)) return d.classes as ClassWithTeacher[];

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

export async function createClassWithSubjects(
  payload: CreateClassWithSubjectsPayload,
) {
  const res = await API.post(ADMIN_API.CLASSES, payload);
  return res.data;
}

export async function fetchClassById(id: string): Promise<ClassDetail> {
  const res = await API.get<ClassDetail>(`${ADMIN_API.CLASSES}/${id}`);
  return res.data;
}

export async function fetchClassDetails(
  classId: string,
): Promise<ClassDashboardDetails> {
  const res = await API.get<ClassDashboardDetails>(
    `${ADMIN_API.CLASSES}/${classId}/details`,
  );
  return res.data;
}

export async function fetchClassDashboard(): Promise<ClassDashboardStats | null> {
  const res = await API.get<ClassDashboardStats>(ADMIN_API.CLASS_DASHBOARD);
  return res.data ?? null;
}

export async function updateClass(
  id: string,
  payload: { room_no: string; classTeacherId: string },
): Promise<void> {
  await API.put(`${ADMIN_API.CLASSES}/${id}`, payload);
}

export async function assignTeacherToClass(
  classId: string,
  teacherId: string,
): Promise<void> {
  const url = `${ADMIN_API.CLASSES}/${classId}/assign-teacher`;
  await API.post(url, { teacherId });
}
