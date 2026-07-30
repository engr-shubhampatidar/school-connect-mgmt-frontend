import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type CreateSubjectValues = z.infer<typeof createSubjectSchema>;
