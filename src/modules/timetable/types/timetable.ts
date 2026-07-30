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

export interface ClassTimetableEntry {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string | null;
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  room: string | null;
  subjectName: string;
  teacherName: string | null;
}
