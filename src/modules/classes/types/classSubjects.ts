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
