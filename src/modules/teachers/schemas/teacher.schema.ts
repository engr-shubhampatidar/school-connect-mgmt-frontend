import { z } from "zod";

// Subject item returned by API
export const SubjectSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Subject = z.infer<typeof SubjectSchema>;

// Helper: calculate age in years from a date
function calculateAgeYears(d: Date) {
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

// Phone validation: allow leading + and digits/spaces; when digits only
// length must be between 10 and 15 (excluding + and spaces)
const phoneDigitsOnly = (val: string) => val.replace(/[^0-9]/g, "");

export const createTeacherSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),

    email: z.string().email("Must be a valid email"),

    mobile: z
      .string()
      .min(1, "Phone is required")
      .transform((s) => s.trim())
      .refine((s) => /^[+0-9 ]+$/.test(s), {
        message: "Phone can contain only +, digits and spaces",
      })
      .refine((s) => {
        const digits = phoneDigitsOnly(s);
        return digits.length >= 10 && digits.length <= 15;
      }, "Phone should contain 10 to 15 digits"),

    date_of_birth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((s) => {
        const d = new Date(s);
        return !Number.isNaN(d.getTime());
      }, "Invalid date")
      .refine((s) => {
        const d = new Date(s);
        const now = new Date();
        return d <= now;
      }, "Date of birth cannot be in the future")
      .refine(
        (s) => calculateAgeYears(new Date(s)) >= 18,
        "Teacher must be at least 18 years old",
      ),

    gender: z.enum(["MALE", "FEMALE", "OTHER"]),

    aadhar: z
      .string()
      .min(1, "Aadhar number is required")
      .transform((v) => (v === "" ? undefined : v))
      .refine((v) => v === undefined || /^[0-9]{12}$/.test(v), {
        message: "Aadhar must be exactly 12 digits",
      }),

    subject_speciality: z
      .array(z.string())
      .min(1, "Select at least one subject")
      .max(5, "You can select up to 5 subjects"),

    employee_id: z.string().optional(),

    address: z
      .string()
      .min(1, "Permanent address is required")
      .max(300, "Address must be at most 300 characters"),
  })
  .strict();

export type CreateTeacherValues = z.infer<typeof createTeacherSchema>;

export const SubjectsResponseSchema = z.object({
  items: z.array(SubjectSchema),
});

export type SubjectsResponse = z.infer<typeof SubjectsResponseSchema>;
