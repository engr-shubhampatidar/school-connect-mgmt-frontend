import { z } from "zod";
import { GENDER_VALUES, optionalMobile } from "./shared";

export { GENDER_OPTIONS } from "./shared";

const optionalEmail = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(z.string().email("Invalid email address").optional());

export const createStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  classId: z.string().min(1, "Class is required"),
  email: optionalEmail,
  phoneNumber: optionalMobile,
  profileUrl: z
    .string()
    .optional()
    .refine((v) => {
      if (!v || v.trim() === "") return true;
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    }, "Must be a valid URL"),
  admissionDate: z.string().min(1, "Admission date is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z
    .string()
    .min(1, "Gender is required")
    .pipe(z.enum(GENDER_VALUES)),
});

export type CreateStudentValues = z.infer<typeof createStudentSchema>;
