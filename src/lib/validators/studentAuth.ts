import * as z from "zod";

export const studentLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(6),
});

export type StudentLoginSchema = z.infer<typeof studentLoginSchema>;

export default studentLoginSchema;
