export type FineType =
  | "NONE"
  | "DAILY_FIXED"
  | "ONE_TIME_FIXED"
  | "PERCENTAGE";

export type FeeFrequency =
  | "ONE_TIME"
  | "MONTHLY"
  | "QUARTERLY"
  | "HALF_YEARLY"
  | "YEARLY";

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

export type FeeCategoryRequirement = "MANDATORY" | "OPTIONAL";

export type FeeCategoryType = "STANDARD" | "TRANSPORT";

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
  requirement: FeeCategoryRequirement;
  type: FeeCategoryType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FeeStructureTransportSlab = {
  id?: string;
  thresholdKm: number;
  amount: number;
};

export type FeeStructureItem = {
  id: string;
  categoryId: string;
  categoryName?: string;
  categoryRequirement?: FeeCategoryRequirement;
  categoryType?: FeeCategoryType;
  amount: number;
  transportSlabs?: FeeStructureTransportSlab[];
};

export type FeeStructure = {
  id: string;
  schoolId: string;
  name: string;
  academicYear: string;
  classId: string;
  className?: string | null;
  isActive: boolean;
  items: FeeStructureItem[];
  createdAt: string;
  updatedAt: string;
};

export type FeeClassPolicy = {
  id: string;
  schoolId: string;
  classId: string;
  className?: string | null;
  academicYear: string;
  frequency: FeeFrequency;
  fineType: FineType;
  fineAmount?: number | null;
  fineRate?: number | null;
  fineCap?: number | null;
  startDate: string;
  createdAt: string;
  updatedAt: string;
};

export type FeeInstallment = {
  id: string;
  installmentNumber: number;
  label?: string | null;
  dueDate: string;
  baseAmount: number;
  discountAmount: number;
  fineAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: StudentFeeStatus;
};

export type StudentFeeCategoryDetail = {
  studentFeeId: string;
  categoryId: string;
  categoryName: string;
  categoryType: FeeCategoryType;
  annualAmount: number;
  frequency: FeeFrequency;
  totalPaid: number;
  totalOutstanding: number;
  aggregateStatus: StudentFeeStatus;
  transportDistanceKm?: number | null;
  discountAmount?: number;
  discountReason?: string | null;
  categoryRequirement?: FeeCategoryRequirement;
  installments: FeeInstallment[];
};

export type StudentFeeDetail = {
  studentUserId: string;
  studentName?: string;
  studentCode?: string | null;
  className?: string | null;
  categories: StudentFeeCategoryDetail[];
};

export type StudentFeeSummary = {
  studentUserId: string;
  studentName?: string | null;
  studentCode?: string | null;
  className?: string | null;
  totalOutstanding: number;
  nextDueDate?: string | null;
  pendingInstallmentCount: number;
  statusSummary: StudentFeeStatus;
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
  feeStructureItemId: string;
  categoryId?: string;
  categoryName?: string;
  categoryRequirement?: FeeCategoryRequirement;
  categoryType?: FeeCategoryType;
  isTransport?: boolean;
  transportDistanceKm?: number | null;
  baseAmount: number;
  discountAmount: number;
  discountReason?: string | null;
  frequency: FeeFrequency;
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

export type AssignmentPreviewItem = {
  structureItemId: string;
  feeStructureId: string;
  categoryId: string;
  categoryName: string;
  requirement: FeeCategoryRequirement;
  categoryType: FeeCategoryType;
  amount: number;
  transportSlabs?: FeeStructureTransportSlab[];
  selected: boolean;
  alreadyAssigned: boolean;
  existingAssignmentId?: string | null;
};

export type FeeAssignmentPreview = {
  studentUserId?: string | null;
  classId: string;
  className?: string | null;
  academicYear: string;
  feeStructureId: string;
  policyFrequency?: FeeFrequency;
  policyFineType?: FineType;
  policyStartDate?: string;
  items: AssignmentPreviewItem[];
};

export type PackageAssignItem = {
  structureItemId: string;
  optedIn: boolean;
  transportDistanceKm?: number;
};
