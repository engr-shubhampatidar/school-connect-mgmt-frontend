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
  /** Filter by subject specialty (single id; sent as subjectIds to API). */
  subjectId?: string;
  /** Filter by subject specialty IDs (match any). */
  subjectIds?: string[];
  /** Filter by class (single id; sent as classIds to API). */
  classId?: string;
  /** Filter by class IDs (subject teacher or class teacher; match any). */
  classIds?: string[];
  page?: number;
  pageSize?: number;
};
