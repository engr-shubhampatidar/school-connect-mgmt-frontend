export type FineType =
  | "NONE"
  | "DAILY_FIXED"
  | "ONE_TIME_FIXED"
  | "PERCENTAGE";

export type FeeFrequency = "ONE_TIME" | "MONTHLY" | "QUARTERLY" | "YEARLY";

export type StudentFeeStatus =
  | "PENDING"
  | "PARTIAL"
  | "PAID"
  | "OVERDUE"
  | "WAIVED";

export type PaymentMethod =
  | "CASH"
  | "CHEQUE"
  | "UPI"
  | "BANK_TRANSFER"
  | "CARD"
  | "ONLINE";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type FeeCategory = {
  id: string;
  schoolId: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FeeStructure = {
  id: string;
  schoolId: string;
  name: string;
  academicYear: string;
  categoryId: string;
  categoryName?: string;
  classId?: string | null;
  className?: string | null;
  amount: number;
  dueDate: string;
  frequency: FeeFrequency;
  fineType: FineType;
  fineAmount?: number | null;
  fineRate?: number | null;
  fineCap?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StudentFee = {
  id: string;
  schoolId: string;
  studentUserId: string;
  studentName?: string;
  studentCode?: string | null;
  classId?: string | null;
  className?: string | null;
  feeStructureId: string;
  feeStructureName?: string;
  categoryId?: string;
  categoryName?: string;
  baseAmount: number;
  discountAmount: number;
  discountReason?: string | null;
  dueDate: string;
  status: StudentFeeStatus;
  fineAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  notes?: string | null;
  assignedByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type FeePayment = {
  id: string;
  schoolId: string;
  studentFeeId: string;
  studentUserId: string;
  studentName?: string;
  studentCode?: string | null;
  feeStructureName?: string;
  categoryName?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  provider: string;
  receiptNumber: string;
  paidAt: string;
  recordedByUserId: string;
  notes?: string | null;
  referenceNumber?: string | null;
  createdAt: string;
};

export type FeeDashboardStats = {
  totalCollected: number;
  totalOutstanding: number;
  overdueCount: number;
  collectedThisMonth: number;
  paymentsToday: number;
  pendingFeesCount: number;
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    collected: number;
    outstanding: number;
  }>;
};

export type FeeReport = {
  totalCollected: number;
  totalOutstanding: number;
  overdueCount: number;
  rows: Array<{
    categoryId?: string;
    categoryName?: string;
    classId?: string;
    className?: string;
    collected: number;
    outstanding: number;
    overdueCount: number;
    studentCount: number;
  }>;
};

export type BulkAssignResult = {
  assigned: number;
  skipped: number;
  data: StudentFee[];
};
