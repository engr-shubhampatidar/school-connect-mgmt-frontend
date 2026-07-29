import { z } from "zod";

const nameRegex = /^[A-Za-z ]+$/;

export const GENDER_VALUES = ["male", "female", "other"];
export const CATEGORY_VALUES = ["General", "OBC", "SC", "ST", "EWS"];

export const guardianSchema = z.object({
  father_name: z
    .string()
    .trim()
    .min(3, "Father name must be at least 3 characters")
    .max(100, "Too long"),
  mother_name: z
    .string()
    .trim()
    .min(3, "Mother name must be at least 3 characters")
    .max(100, "Too long")
    .optional()
    .or(z.literal("")),
  phone_no: z
    .string()
    .min(10, "Guardian phone must be 10-15 digits")
    .max(15, "Guardian phone must be 10-15 digits")
    .regex(/^[0-9]+$/, "Digits only"),
  email: z.string().trim().email("Invalid guardian email"),
  address: z
    .string()
    .trim()
    .max(300, "Max 300 characters")
    .optional()
    .or(z.literal("")),
});

export const documentSchema = z.object({
  document_type: z.string().min(1, "Document type is required").max(120),
  url: z.string().url("Invalid document URL"),
});

export const updateStudentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(nameRegex, "Only alphabets and spaces are allowed"),
  email: z.string().trim().email("Invalid email"),
  phone_no: z
    .string()
    .min(10, "Phone must be 10-15 digits")
    .max(15, "Phone must be 10-15 digits")
    .regex(/^[0-9]+$/, "Digits only"),
  gender: z.string().refine((val) => GENDER_VALUES.includes(val), {
    message: "Select gender",
  }),
  category: z.string().refine((val) => CATEGORY_VALUES.includes(val), {
    message: "Select Category",
  }),
  admission_date: z.string().refine((v) => {
    if (!v) return false;
    const d = new Date(v);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    return d <= today;
  }, "Admission date cannot be in future"),
  address: z.string().trim().min(1, "Address is required").max(300),
  aadhar: z
    .string()
    .length(12, "Aadhar must be 12 digits")
    .regex(/^[0-9]{12}$/g, "Aadhar must be numeric"),
  guardian: guardianSchema,
  student_documents: z.array(documentSchema),
  class_name: z.string().optional(),
  admission_locked: z.boolean().optional(),
});

export type UpdateStudentForm = z.infer<typeof updateStudentSchema>;

export const updateStudentDefaultValues: UpdateStudentForm = {
  name: "",
  email: "",
  phone_no: "",
  gender: "male",
  category: "General",
  admission_date: "",
  address: "",
  aadhar: "",
  guardian: {
    father_name: "",
    mother_name: "",
    phone_no: "",
    email: "",
    address: "",
  },
  student_documents: [],
  class_name: "",
  admission_locked: false,
};
