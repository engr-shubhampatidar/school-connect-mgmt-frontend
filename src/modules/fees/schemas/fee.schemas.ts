import { z } from "zod";

export const feeCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  requirement: z.enum(["MANDATORY", "OPTIONAL"]).default("MANDATORY"),
  type: z.enum(["STANDARD", "TRANSPORT"]).default("STANDARD"),
  isActive: z.boolean().default(true),
});

export type FeeCategoryFormValues = z.infer<typeof feeCategorySchema>;

const transportSlabSchema = z.object({
  thresholdKm: z.union([z.literal(10), z.literal(20), z.literal(30)]),
  amount: z.coerce.number().min(0),
});

const feePlanItemSchema = z.object({
  categoryId: z.string().uuid("Select a category"),
  amount: z.coerce.number().min(0, "Amount must be >= 0"),
  transportSlabs: z.array(transportSlabSchema).optional(),
});

export const feePlanSchema = z.object({
  classId: z.string().uuid("Select a class"),
  academicYear: z.string().min(1, "Academic year is required").max(20),
  name: z.string().max(200).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  items: z.array(feePlanItemSchema).min(1, "Add at least one category"),
});

export type FeePlanFormValues = z.infer<typeof feePlanSchema>;

export const feeClassPolicySchema = z
  .object({
    classId: z.string().uuid("Select a class"),
    academicYear: z.string().min(1, "Academic year is required").max(20),
    frequency: z.enum([
      "ONE_TIME",
      "MONTHLY",
      "QUARTERLY",
      "HALF_YEARLY",
      "YEARLY",
    ]),
    fineType: z.enum(["NONE", "DAILY_FIXED", "ONE_TIME_FIXED", "PERCENTAGE"]),
    fineAmount: z.coerce.number().min(0).optional().nullable(),
    fineRate: z.coerce.number().min(0).max(100).optional().nullable(),
    fineCap: z.coerce.number().min(0).optional().nullable(),
    startDate: z.string().min(1, "Start date is required"),
  })
  .superRefine((data, ctx) => {
    if (
      (data.fineType === "DAILY_FIXED" || data.fineType === "ONE_TIME_FIXED") &&
      (data.fineAmount === null || data.fineAmount === undefined)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fine amount is required",
        path: ["fineAmount"],
      });
    }
    if (
      data.fineType === "PERCENTAGE" &&
      (data.fineRate === null || data.fineRate === undefined)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fine rate is required",
        path: ["fineRate"],
      });
    }
  });

export type FeeClassPolicyFormValues = z.infer<typeof feeClassPolicySchema>;

export const packageAssignItemSchema = z.object({
  structureItemId: z.string().uuid(),
  optedIn: z.boolean(),
  transportDistanceKm: z.coerce.number().min(0.01).optional(),
});

export const packageAssignSchema = z.object({
  studentUserId: z.string().uuid("Select a student"),
  academicYear: z.string().min(1).max(20),
  items: z.array(packageAssignItemSchema),
});

export type PackageAssignFormValues = z.infer<typeof packageAssignSchema>;

export const feeStructureSchema = feePlanSchema;

export type FeeStructureFormValues = FeePlanFormValues;

export const assignFeeSchema = z.object({
  studentUserId: z.string().uuid("Select a student"),
  feeStructureId: z.string().uuid("Select a fee structure"),
  discountAmount: z.coerce.number().min(0).default(0),
  discountReason: z.string().max(500).optional().or(z.literal("")),
});

export type AssignFeeFormValues = z.infer<typeof assignFeeSchema>;

export const bulkAssignFeeSchema = z.object({
  feeStructureId: z.string().uuid("Select a fee structure"),
  classId: z.string().uuid("Select a class"),
  discountAmount: z.coerce.number().min(0).default(0),
  discountReason: z.string().max(500).optional().or(z.literal("")),
});

export type BulkAssignFeeFormValues = z.infer<typeof bulkAssignFeeSchema>;

export const collectPaymentSchema = z.object({
  feeInstallmentId: z.string().uuid(),
  amount: z.coerce.number().min(0.01, "Amount is required"),
  method: z.enum(["CASH", "CHEQUE", "UPI", "BANK_TRANSFER", "CARD"]),
  referenceNumber: z.string().max(100).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export type CollectPaymentFormValues = z.infer<typeof collectPaymentSchema>;

export const discountSchema = z.object({
  discountAmount: z.coerce.number().min(0),
  discountReason: z.string().max(500).optional().or(z.literal("")),
});

export type DiscountFormValues = z.infer<typeof discountSchema>;
