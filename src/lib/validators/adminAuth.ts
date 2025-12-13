import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;

export default adminLoginSchema;
