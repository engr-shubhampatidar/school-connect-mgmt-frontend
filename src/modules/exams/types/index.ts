export type ExamType =
  | "UNIT_TEST"
  | "MIDTERM"
  | "FINAL"
  | "PRACTICAL"
  | "OTHER";

export type ExamStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "RESULTS_PUBLISHED"
  | "CANCELLED";

export type ResultStatus = "DRAFT" | "PUBLISHED";

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type Exam = {
  id: string;
  schoolId: string;
  name: string;
  academicYear: string;
  examType: ExamType;
  classId: string;
  className?: string | null;
  classSection?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: ExamStatus;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExamSchedule = {
  id: string;
  schoolId: string;
  examId: string;
  subjectId: string;
  subjectName?: string | null;
  subjectCode?: string | null;
  examDate: string;
  startTime?: string | null;
  endTime?: string | null;
  maxMarks: number;
  passMarks: number;
  venue?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExamMark = {
  id: string;
  examId: string;
  scheduleId: string;
  studentUserId: string;
  studentName?: string | null;
  studentCode?: string | null;
  subjectId?: string | null;
  subjectName?: string | null;
  marksObtained?: number | null;
  maxMarks?: number | null;
  passMarks?: number | null;
  grade?: string | null;
  isAbsent: boolean;
  isPassed: boolean;
  remarks?: string | null;
};

export type ExamMarksGrid = {
  schedules: ExamSchedule[];
  students: Array<{
    studentUserId: string;
    studentName: string;
    studentCode?: string | null;
  }>;
  marks: ExamMark[];
};

export type ExamResult = {
  id: string;
  examId: string;
  studentUserId: string;
  studentName?: string | null;
  studentCode?: string | null;
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  grade?: string | null;
  rank?: number | null;
  isPassed: boolean;
  status: ResultStatus;
  examName?: string | null;
  className?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReportCard = {
  exam: Exam;
  studentUserId: string;
  studentName: string;
  studentCode?: string | null;
  subjects: Array<{
    subjectId: string;
    subjectName: string;
    maxMarks: number;
    passMarks: number;
    marksObtained?: number | null;
    grade?: string | null;
    isAbsent: boolean;
    isPassed: boolean;
    examDate?: string | null;
  }>;
  result?: ExamResult | null;
};

export type ClassReport = {
  exam: Exam;
  totalStudents: number;
  resultsGenerated: number;
  passCount: number;
  failCount: number;
  passPercentage: number;
  classAveragePercentage: number;
  subjects: Array<{
    subjectId: string;
    subjectName: string;
    averageMarks: number;
    averagePercentage: number;
    passCount: number;
    failCount: number;
    absentCount: number;
    highestMarks: number;
    lowestMarks: number;
  }>;
};

export type ExamDashboardStats = {
  totalExams: number;
  draftCount: number;
  scheduledCount: number;
  inProgressCount: number;
  completedCount: number;
  publishedCount: number;
  pendingMarksCount: number;
  upcomingSchedules: Array<{
    scheduleId: string;
    examId: string;
    examName: string;
    subjectName: string;
    examDate: string;
    startTime?: string | null;
    className?: string | null;
  }>;
  recentExams: Exam[];
};

export type CreateExamPayload = {
  name: string;
  academicYear: string;
  examType: ExamType;
  classId: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type CreateSchedulePayload = {
  subjectId: string;
  examDate: string;
  startTime?: string;
  endTime?: string;
  maxMarks: number;
  passMarks?: number;
  venue?: string;
};

export type UpsertMarkItem = {
  scheduleId: string;
  studentUserId: string;
  marksObtained?: number | null;
  isAbsent?: boolean;
  remarks?: string | null;
};
