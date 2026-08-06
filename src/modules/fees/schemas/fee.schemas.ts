import { z } from "zod";

export const feeCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type FeeCategoryFormValues = z.infer<typeof feeCategorySchema>;

export const feeStructureSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200),
    academicYear: z.string().min(1, "Academic year is required").max(20),
    categoryId: z.string().uuid("Select a category"),
    classId: z.string().uuid().optional().or(z.literal("")),
    amount: z.coerce.number().min(0, "Amount must be >= 0"),
    dueDate: z.string().min(1, "Due date is required"),
    frequency: z.enum(["ONE_TIME", "MONTHLY", "QUARTERLY", "YEARLY"]),
    fineType: z.enum(["NONE", "DAILY_FIXED", "ONE_TIME_FIXED", "PERCENTAGE"]),
    fineAmount: z.coerce.number().min(0).optional().nullable(),
    fineRate: z.coerce.number().min(0).max(100).optional().nullable(),
    fineCap: z.coerce.number().min(0).optional().nullable(),
    isActive: z.boolean().default(true),
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

export type FeeStructureFormValues = z.infer<typeof feeStructureSchema>;

export const assignFeeSchema = z.object({
  studentUserId: z.string().uuid("Select a student"),
  feeStructureId: z.string().uuid("Select a fee structure"),
  discountAmount: z.coerce.number().min(0).default(0),
  discountReason: z.string().max(500).optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
});

export type AssignFeeFormValues = z.infer<typeof assignFeeSchema>;

export const bulkAssignFeeSchema = z.object({
  feeStructureId: z.string().uuid("Select a fee structure"),
  classId: z.string().uuid("Select a class"),
  discountAmount: z.coerce.number().min(0).default(0),
  discountReason: z.string().max(500).optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
});

export type BulkAssignFeeFormValues = z.infer<typeof bulkAssignFeeSchema>;

export const collectPaymentSchema = z.object({
  studentFeeId: z.string().uuid(),
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
