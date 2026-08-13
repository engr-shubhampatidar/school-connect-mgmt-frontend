import { ADMIN_API, STUDENT_API } from "@/config/api-routes";
import API from "@/services/axios";
import type {
  ClassReport,
  CreateExamPayload,
  CreateSchedulePayload,
  Exam,
  ExamDashboardStats,
  ExamMarksGrid,
  ExamMark,
  ExamResult,
  ExamSchedule,
  ExamStatus,
  Paginated,
  ReportCard,
  StudentExamScheduleGroup,
  UpsertMarkItem,
} from "@/modules/exams/types";

export async function fetchExamDashboard(): Promise<ExamDashboardStats> {
  const res = await API.get<ExamDashboardStats>(ADMIN_API.EXAMS_DASHBOARD);
  return res.data;
}

export async function fetchExams(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    classId?: string;
    academicYear?: string;
    examType?: string;
    status?: string;
  } = {},
): Promise<Paginated<Exam>> {
  const res = await API.get<Paginated<Exam>>(ADMIN_API.EXAMS, { params });
  return res.data;
}

export async function fetchExam(id: string): Promise<Exam> {
  const res = await API.get<Exam>(ADMIN_API.EXAM_BY_ID(id));
  return res.data;
}

export async function createExam(payload: CreateExamPayload): Promise<Exam> {
  const res = await API.post<Exam>(ADMIN_API.EXAMS, payload);
  return res.data;
}

export async function updateExam(
  id: string,
  payload: Partial<CreateExamPayload>,
): Promise<Exam> {
  const res = await API.patch<Exam>(ADMIN_API.EXAM_BY_ID(id), payload);
  return res.data;
}

export async function updateExamStatus(
  id: string,
  status: ExamStatus,
): Promise<Exam> {
  const res = await API.patch<Exam>(ADMIN_API.EXAM_STATUS(id), { status });
  return res.data;
}

export async function deleteExam(id: string): Promise<void> {
  await API.delete(ADMIN_API.EXAM_BY_ID(id));
}

export async function fetchExamSchedules(
  examId: string,
): Promise<ExamSchedule[]> {
  const res = await API.get<ExamSchedule[]>(ADMIN_API.EXAM_SCHEDULES(examId));
  return res.data;
}

export async function createExamSchedule(
  examId: string,
  payload: CreateSchedulePayload,
): Promise<ExamSchedule> {
  const res = await API.post<ExamSchedule>(
    ADMIN_API.EXAM_SCHEDULES(examId),
    payload,
  );
  return res.data;
}

export async function updateExamSchedule(
  examId: string,
  scheduleId: string,
  payload: Partial<CreateSchedulePayload>,
): Promise<ExamSchedule> {
  const res = await API.patch<ExamSchedule>(
    ADMIN_API.EXAM_SCHEDULE_BY_ID(examId, scheduleId),
    payload,
  );
  return res.data;
}

export async function deleteExamSchedule(
  examId: string,
  scheduleId: string,
): Promise<void> {
  await API.delete(ADMIN_API.EXAM_SCHEDULE_BY_ID(examId, scheduleId));
}

export async function fetchExamMarks(examId: string): Promise<ExamMarksGrid> {
  const res = await API.get<ExamMarksGrid>(ADMIN_API.EXAM_MARKS(examId));
  return res.data;
}

export async function upsertExamMarks(
  examId: string,
  marks: UpsertMarkItem[],
): Promise<ExamMark[]> {
  const res = await API.put<ExamMark[]>(ADMIN_API.EXAM_MARKS(examId), {
    marks,
  });
  return res.data;
}

export async function generateExamResults(
  examId: string,
): Promise<ExamResult[]> {
  const res = await API.post<ExamResult[]>(
    ADMIN_API.EXAM_RESULTS_GENERATE(examId),
  );
  return res.data;
}

export async function publishExamResults(
  examId: string,
): Promise<ExamResult[]> {
  const res = await API.post<ExamResult[]>(
    ADMIN_API.EXAM_RESULTS_PUBLISH(examId),
  );
  return res.data;
}

export async function fetchExamResults(
  examId: string,
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<Paginated<ExamResult>> {
  const res = await API.get<Paginated<ExamResult>>(
    ADMIN_API.EXAM_RESULTS(examId),
    { params },
  );
  return res.data;
}

export async function fetchReportCard(
  examId: string,
  studentUserId: string,
): Promise<ReportCard> {
  const res = await API.get<ReportCard>(
    ADMIN_API.EXAM_REPORT_CARD(examId, studentUserId),
  );
  return res.data;
}

export async function fetchClassReport(examId: string): Promise<ClassReport> {
  const res = await API.get<ClassReport>(ADMIN_API.EXAM_CLASS_REPORT(examId));
  return res.data;
}

export async function fetchMyExamResults(): Promise<ExamResult[]> {
  const res = await API.get<ExamResult[]>(STUDENT_API.EXAMS);
  return res.data;
}

export async function fetchMyReportCard(examId: string): Promise<ReportCard> {
  const res = await API.get<ReportCard>(STUDENT_API.EXAM_REPORT_CARD(examId));
  return res.data;
}

export async function fetchMyExamSchedule(): Promise<StudentExamScheduleGroup[]> {
  const res = await API.get<StudentExamScheduleGroup[]>(
    STUDENT_API.EXAMS_SCHEDULE,
  );
  return Array.isArray(res.data) ? res.data : [];
}
