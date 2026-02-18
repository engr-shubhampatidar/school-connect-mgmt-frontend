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
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name must be at most 100 characters")
      .refine((s) => /^[A-Za-z ]+$/.test(s.trim()), {
        message: "Full name can contain only letters and spaces",
      }),

    email: z.string().email("Must be a valid email"),

    phone: z
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
      .refine((s) => calculateAgeYears(new Date(s)) >= 18, "Teacher must be at least 18 years old"),

    gender: z.enum(["male", "female", "other"]),

    aadhaar: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v))
      .refine((v) => v === undefined || /^[0-9]{12}$/.test(v), {
        message: "Aadhaar must be exactly 12 digits",
      }),

    subjects: z
      .array(z.string())
      .min(1, "Select at least one subject")
      .max(5, "You can select up to 5 subjects"),

    employeeId: z.string().optional(),

    permanentAddress: z.string().min(1, "Permanent address is required").max(300, "Address must be at most 300 characters"),
  })
  .strict();

export type CreateTeacherValues = z.input<typeof createTeacherSchema>;

export const SubjectsResponseSchema = z.object({
  items: z.array(SubjectSchema),
});

export type SubjectsResponse = z.infer<typeof SubjectsResponseSchema>;
