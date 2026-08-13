import { z } from "zod";

export const createExamSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  academicYear: z.string().min(1, "Academic year is required").max(20),
  examType: z.enum(["UNIT_TEST", "MIDTERM", "FINAL", "PRACTICAL", "OTHER"]),
  classId: z.string().uuid("Select a class"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  description: z.string().max(1000).optional().or(z.literal("")),
});

export type CreateExamValues = z.infer<typeof createExamSchema>;

export const createScheduleSchema = z.object({
  subjectId: z.string().uuid("Select a subject"),
  examDate: z.string().min(1, "Exam date is required"),
  startTime: z.string().optional().or(z.literal("")),
  endTime: z.string().optional().or(z.literal("")),
  maxMarks: z.coerce.number().min(1).max(1000),
  passMarks: z.coerce.number().min(0).max(1000).optional(),
  venue: z.string().max(200).optional().or(z.literal("")),
});

export type CreateScheduleValues = z.infer<typeof createScheduleSchema>;
