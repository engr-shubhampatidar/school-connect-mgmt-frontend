import { z } from "zod";

export const GENDER_OPTIONS = [
  { id: "MALE", name: "Male" },
  { id: "FEMALE", name: "Female" },
  { id: "OTHER", name: "Other" },
] as const;

const optionalEmail = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(z.string().email("Invalid email address").optional());

/** Indian mobile: exactly 10 digits, starting with 6–9 */
const mobileRegex = /^[6-9]\d{9}$/;

const optionalMobile = z
  .string()
  .trim()
  .refine((v) => v === "" || mobileRegex.test(v), {
    message: "Enter a valid 10-digit mobile number",
  });

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
    .pipe(z.enum(["MALE", "FEMALE", "OTHER"])),
});

export type CreateStudentValues = z.infer<typeof createStudentSchema>;
