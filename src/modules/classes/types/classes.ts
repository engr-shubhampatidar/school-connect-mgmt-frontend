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

export type ClassDetail = {
  className: string;
  section: string;
  homeRoom: string;
  classTeacherName: string;
};

export type ClassDashboardDetails = {
  id: string;
  className: string;
  section: string;
  classTeacherName: string | null;
  totalStudents: number;
  roomNo?: string | null;
};

export type ClassDashboardStats = {
  totalClasses?: number | string;
  totalSections?: number | string;
  totalStudents?: number | string;
};

export type CreateClassWithSubjectsPayload = {
  className: string;
  section: string;
  homeRoom: string;
  classTeacherId: string | null;
  subjects: Array<{
    subjectId: string;
    teacherId?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    room?: string | null;
  }>;
};
