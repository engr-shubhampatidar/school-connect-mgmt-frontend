import { z } from "zod";

const attachmentSchema = z.object({
  filename: z.string().min(1, "Filename required"),
  url: z.string().url("Valid URL required"),
});

export const createHomeworkSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().optional().or(z.literal("")),
  type: z.enum(["HOMEWORK", "ASSIGNMENT"]),
  subjectId: z.string().uuid("Select a subject").optional().or(z.literal("")),
  dueAt: z.string().min(1, "Due date is required"),
  maxMarks: z.coerce.number().min(0).optional().or(z.nan()).optional(),
  allowLateSubmission: z.boolean().default(true),
  classIds: z.array(z.string().uuid()).min(1, "Select at least one class"),
  attachments: z.array(attachmentSchema).optional(),
});

export type CreateHomeworkValues = z.infer<typeof createHomeworkSchema>;

export const submitHomeworkSchema = z
  .object({
    content: z.string().optional().or(z.literal("")),
    attachments: z.array(attachmentSchema).optional(),
  })
  .refine(
    (v) =>
      Boolean(v.content?.trim()) ||
      Boolean(v.attachments && v.attachments.length > 0),
    { message: "Provide content or at least one attachment", path: ["content"] },
  );

export type SubmitHomeworkValues = z.infer<typeof submitHomeworkSchema>;

export const reviewSubmissionSchema = z.object({
  marksObtained: z.coerce.number().min(0).optional().or(z.nan()).optional(),
  remarks: z.string().optional().or(z.literal("")),
  status: z.enum(["REVIEWED", "RETURNED"]).default("REVIEWED"),
});

export type ReviewSubmissionValues = z.infer<typeof reviewSubmissionSchema>;
