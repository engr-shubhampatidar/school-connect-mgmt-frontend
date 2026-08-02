import { z } from "zod";
import { GENDER_VALUES, optionalMobile, type GenderValue } from "./shared";

export { GENDER_VALUES, type GenderValue } from "./shared";
export const CATEGORY_VALUES = ["General", "OBC", "SC", "ST", "EWS"];

const nameRegex = /^[A-Za-z ]+$/;

export const updateStudentSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "Too long")
    .regex(nameRegex, "Only alphabets and spaces are allowed"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Too long")
    .regex(nameRegex, "Only alphabets and spaces are allowed"),
  email: z.string().trim().email("Invalid email").or(z.literal("")),
  phone_no: optionalMobile,
  gender: z.enum(GENDER_VALUES, { message: "Select gender" }),
  category: z.string().optional().or(z.literal("")),
  admission_date: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => {
      if (!v) return true;
      const d = new Date(v);
      if (isNaN(d.getTime())) return false;
      return d <= new Date();
    }, "Admission date cannot be in future"),
  classId: z.string().optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  aadhar: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v === "" || /^[0-9]{12}$/.test(v), {
      message: "Aadhar must be exactly 12 digits",
    }),
  father_name: z.string().trim().max(100).optional().or(z.literal("")),
  father_mobile: optionalMobile,
  mother_name: z.string().trim().max(100).optional().or(z.literal("")),
  mother_mobile: optionalMobile,
  guardian_name: z.string().trim().max(100).optional().or(z.literal("")),
  guardian_mobile: optionalMobile,
  bloodGroup: z.string().trim().max(10).optional().or(z.literal("")),
  medicalNotes: z.string().trim().max(500).optional().or(z.literal("")),
  class_name: z.string().optional(),
  admission_locked: z.boolean().optional(),
});

export type UpdateStudentForm = z.infer<typeof updateStudentSchema>;

export const updateStudentDefaultValues: UpdateStudentForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone_no: "",
  gender: "MALE" satisfies GenderValue,
  category: "",
  admission_date: "",
  classId: "",
  address: "",
  aadhar: "",
  father_name: "",
  father_mobile: "",
  mother_name: "",
  mother_mobile: "",
  guardian_name: "",
  guardian_mobile: "",
  bloodGroup: "",
  medicalNotes: "",
  class_name: "",
  admission_locked: false,
};
