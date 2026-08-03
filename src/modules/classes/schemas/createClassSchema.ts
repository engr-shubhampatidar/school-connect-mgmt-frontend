import { z } from "zod";

export const createClassSchema = z
  .object({
    number: z
      .string()
      .min(1, "Class number is required")
      .regex(/^\d{1,2}$/, "Class number must be digits only")
      .refine((v) => {
        const n = Number(v);
        return n >= 1 && n <= 12;
      }, "Class number must be between 1 and 12"),
    section: z
      .string()
      .optional()
      .transform((v) => (v ? v.trim().toUpperCase() : undefined))
      .refine((v) => v === undefined || /^[A-E]$/.test(v), {
        message: "Section must be a letter from A–E",
      }),
  })
  .required();

export type CreateClassValues = z.infer<typeof createClassSchema>;
