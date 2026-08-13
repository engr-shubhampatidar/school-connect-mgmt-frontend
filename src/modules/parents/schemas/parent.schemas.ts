import { z } from "zod";

const phoneDigitsOnly = (val: string) => val.replace(/[^0-9]/g, "");

export const PARENT_RELATIONSHIP_OPTIONS = [
  { id: "FATHER", name: "Father" },
  { id: "MOTHER", name: "Mother" },
  { id: "GUARDIAN", name: "Guardian" },
  { id: "OTHER", name: "Other" },
] as const;

export const createParentSchema = z.object({
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
  address: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (s) => !s || !Number.isNaN(new Date(s).getTime()),
      "Invalid date",
    ),
});

export type CreateParentValues = z.infer<typeof createParentSchema>;

export const updateParentSchema = createParentSchema.partial().extend({
  status: z.string().optional(),
});

export type UpdateParentValues = z.infer<typeof updateParentSchema>;

export const linkChildItemSchema = z.object({
  studentUserId: z.string().uuid("Select a valid student"),
  relationship: z
    .enum(["FATHER", "MOTHER", "GUARDIAN", "OTHER"])
    .default("GUARDIAN"),
});

export const linkChildrenSchema = z.object({
  children: z
    .array(linkChildItemSchema)
    .min(1, "Select at least one child"),
});

export type LinkChildrenValues = z.infer<typeof linkChildrenSchema>;
