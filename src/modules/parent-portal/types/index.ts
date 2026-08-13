import type { EntityDocument } from "@/modules/documents/types";
import type { Exam, ExamResult, ExamSchedule, ReportCard } from "@/modules/exams/types";
import type { FeePayment, Paginated, StudentFee } from "@/modules/fees/types";
import type {
  Homework,
  HomeworkQuery,
  StudentHomeworkDetail,
} from "@/modules/homework/types";

export type ParentRelationship =
  | "FATHER"
  | "MOTHER"
  | "GUARDIAN"
  | "OTHER";

export type ParentMe = {
  id: string;
  fullName: string;
  email: string;
  mobile?: string | null;
};

export type ParentChild = {
  id: string;
  fullName: string;
  studentCode?: string | null;
  classId?: string | null;
  className?: string | null;
  section?: string | null;
  relationship: ParentRelationship;
};

export type ChildClassInfo = {
  id: string;
  name: string;
  section?: string | null;
} | null;

export type ChildDashboard = {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  attendancePercentage: number;
  profile?: {
    id: string;
    fullName: string;
    studentCode: string | null;
    class: ChildClassInfo;
  };
  currentClass?: ChildClassInfo;
  timetable?: ChildTimetableEntry[];
  recentAnnouncements?: ChildAnnouncementItem[];
  documents?: {
    count: number;
    items: EntityDocument[];
  };
};

export type ChildTimetableEntry = {
  subject: string | null;
  startTime: string;
  endTime: string;
  subjectTeacher: string | null;
  room: string | null;
  dayOfWeek?: number | string | null;
};

export type ChildAnnouncementItem = {
  id: string;
  title: string;
  body: string;
  publishedAt: string | Date;
  authorName: string | null;
  pinned?: boolean;
};

export type ChildAnnouncementsPage = {
  total: number;
  page: number;
  limit: number;
  items: ChildAnnouncementItem[];
};

export type ChildAttendanceRecord = {
  date: string;
  status: string;
  note?: string | null;
};

export type ChildMonthlyAttendance = {
  studentId: string;
  year: number;
  month: number;
  totalDays: number;
  present: number;
  absent: number;
  leave: number;
  percentage: number;
  details: ChildAttendanceRecord[];
};

/** Raw shape from parent profile endpoint (service returns user + profile). */
export type ChildProfileRaw = {
  user?: {
    id?: string;
    fullName?: string | null;
    email?: string | null;
    mobile?: string | null;
    address?: string | null;
    gender?: string | null;
    dateOfBirth?: string | Date | null;
    studentCode?: string | null;
    status?: string | null;
  };
  profile?: {
    bloodGroup?: string | null;
    aadhaarNumber?: string | null;
    fatherName?: string | null;
    fatherMobile?: string | null;
    motherName?: string | null;
    motherMobile?: string | null;
    guardianName?: string | null;
    guardianMobile?: string | null;
    medicalNotes?: string | null;
    currentClass?: {
      id?: string;
      name?: string;
      section?: string | null;
    } | null;
  };
  documents?: EntityDocument[];
  /** Flattened fields if API ever maps like student portal */
  id?: string;
  fullName?: string | null;
  dob?: string | Date | null;
  gender?: string | null;
  bloodGroup?: string | null;
  aadhaarNumber?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  fatherName?: string | null;
  fatherMobile?: string | null;
  motherName?: string | null;
  motherMobile?: string | null;
  guardianName?: string | null;
  guardianMobile?: string | null;
  studentCode?: string | null;
  class?: {
    id?: string;
    name?: string;
    section?: string | null;
  } | null;
};

export type ChildProfile = {
  id: string;
  fullName: string;
  studentCode: string | null;
  dob: string | null;
  gender: string | null;
  bloodGroup: string | null;
  aadhaarNumber: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  fatherName: string | null;
  fatherMobile: string | null;
  motherName: string | null;
  motherMobile: string | null;
  guardianName: string | null;
  guardianMobile: string | null;
  medicalNotes: string | null;
  class: ChildClassInfo;
  documents: EntityDocument[];
};

export type ChildFeeSummary = {
  totalOutstanding: number;
  totalPaid: number;
  overdueCount: number;
  pendingCount: number;
  totalAssignments: number;
};

export type ChildExamScheduleGroup = {
  exam: Exam;
  schedules: ExamSchedule[];
};

export type { Homework, HomeworkQuery, StudentHomeworkDetail };
export type { StudentFee, FeePayment, Paginated };
export type { ExamResult, ReportCard, EntityDocument };
