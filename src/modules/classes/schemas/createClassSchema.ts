import { z } from "zod";

export const createClassSchema = z
  .object({
    number: z
      .string()
      .min(1, "Class number is required")
      .regex(/^\d{1,2}$/, "Class number must be 1 or 2 digits"),
    section: z
      .string()
      .optional()
      .transform((v) => (v ? v.trim().toUpperCase() : undefined))
      .refine((v) => v === undefined || /^[A-Z]$/.test(v), {
        message: "Section must be a single letter A–Z",
      }),
  })
  .required();

export type CreateClassValues = z.infer<typeof createClassSchema>;
