export type HomeworkType = "HOMEWORK" | "ASSIGNMENT";
export type HomeworkStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type SubmissionStatus =
  | "NOT_SUBMITTED"
  | "SUBMITTED"
  | "LATE"
  | "REVIEWED"
  | "RETURNED";

export type HomeworkAttachment = {
  filename: string;
  url: string;
};

export type HomeworkClass = {
  id: string;
  classId: string;
  className: string;
  section: string | null;
};

export type Homework = {
  id: string;
  schoolId: string;
  title: string;
  description: string | null;
  type: HomeworkType;
  subjectId: string | null;
  subjectName: string | null;
  createdByUserId: string;
  createdByName: string | null;
  dueAt: string;
  maxMarks: number | null;
  allowLateSubmission: boolean;
  status: HomeworkStatus;
  attachments: HomeworkAttachment[] | null;
  classes: HomeworkClass[];
  mySubmissionStatus?: SubmissionStatus;
  submissionCount?: number;
  reviewedCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type HomeworkSubmission = {
  id: string;
  schoolId: string;
  homeworkId: string;
  studentUserId: string;
  studentName: string | null;
  classId: string;
  className: string | null;
  content: string | null;
  attachments: HomeworkAttachment[] | null;
  status: SubmissionStatus;
  submittedAt: string | null;
  isLate: boolean;
  marksObtained: number | null;
  remarks: string | null;
  reviewedByUserId: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudentHomeworkDetail = Homework & {
  mySubmission: HomeworkSubmission | null;
};

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type HomeworkQuery = {
  page?: number;
  limit?: number;
  search?: string;
  type?: HomeworkType;
  status?: HomeworkStatus;
  classId?: string;
  subjectId?: string;
};

export type CreateHomeworkPayload = {
  title: string;
  description?: string;
  type: HomeworkType;
  subjectId?: string;
  dueAt: string;
  maxMarks?: number;
  allowLateSubmission?: boolean;
  attachments?: HomeworkAttachment[];
  classIds: string[];
};

export type UpdateHomeworkPayload = Partial<CreateHomeworkPayload>;

export type SubmitHomeworkPayload = {
  content?: string;
  attachments?: HomeworkAttachment[];
};

export type ReviewSubmissionPayload = {
  marksObtained?: number;
  remarks?: string;
  status?: "REVIEWED" | "RETURNED";
};

export type SubmissionQuery = {
  page?: number;
  limit?: number;
  status?: SubmissionStatus;
  classId?: string;
  search?: string;
};
