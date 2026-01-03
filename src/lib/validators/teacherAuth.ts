import * as z from "zod";

export const teacherLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type TeacherLoginSchema = z.infer<typeof teacherLoginSchema>;

export default teacherLoginSchema;
