import { ADMIN_API, STUDENT_API } from "@/config/api-routes";
import API from "@/services/axios";
import type {
  BulkAssignResult,
  FeeAssignmentPreview,
  FeeCategory,
  FeeCategoryRequirement,
  FeeCategoryType,
  FeeClassPolicy,
  FeeDashboardStats,
  FeePayment,
  FeeReport,
  FeeStructure,
  PackageAssignItem,
  Paginated,
  PaymentMethod,
  StudentFee,
  StudentFeeDetail,
  StudentFeeStatus,
  StudentFeeSummary,
  StudentFeesSummary,
  FineType,
  FeeFrequency,
} from "@/modules/fees/types";
import { downloadBlob } from "@/modules/fees/utils/format";

export async function fetchFeeDashboard(): Promise<FeeDashboardStats> {
  const res = await API.get<FeeDashboardStats>(ADMIN_API.FEES_DASHBOARD);
  return res.data;
}

export async function fetchFeeCategories(params: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
} = {}): Promise<Paginated<FeeCategory>> {
  const res = await API.get<Paginated<FeeCategory>>(ADMIN_API.FEE_CATEGORIES, {
    params,
  });
  return res.data;
}

export async function createFeeCategory(payload: {
  name: string;
  description?: string;
  requirement?: FeeCategoryRequirement;
  type?: FeeCategoryType;
  isActive?: boolean;
}): Promise<FeeCategory> {
  const res = await API.post<FeeCategory>(ADMIN_API.FEE_CATEGORIES, payload);
  return res.data;
}

export async function updateFeeCategory(
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    requirement: FeeCategoryRequirement;
    type: FeeCategoryType;
    isActive: boolean;
  }>,
): Promise<FeeCategory> {
  const res = await API.patch<FeeCategory>(
    ADMIN_API.FEE_CATEGORY_BY_ID(id),
    payload,
  );
  return res.data;
}

export async function deleteFeeCategory(id: string): Promise<void> {
  await API.delete(ADMIN_API.FEE_CATEGORY_BY_ID(id));
}

export async function fetchFeeStructures(params: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  classId?: string;
  academicYear?: string;
  isActive?: boolean;
} = {}): Promise<Paginated<FeeStructure>> {
  const res = await API.get<Paginated<FeeStructure>>(ADMIN_API.FEE_STRUCTURES, {
    params,
  });
  return res.data;
}

export async function createFeeStructure(
  payload: Record<string, unknown>,
): Promise<FeeStructure> {
  const res = await API.post<FeeStructure>(ADMIN_API.FEE_STRUCTURES, payload);
  return res.data;
}

export async function updateFeeStructure(
  id: string,
  payload: Record<string, unknown>,
): Promise<FeeStructure> {
  const res = await API.patch<FeeStructure>(
    ADMIN_API.FEE_STRUCTURE_BY_ID(id),
    payload,
  );
  return res.data;
}

export async function deleteFeeStructure(id: string): Promise<void> {
  await API.delete(ADMIN_API.FEE_STRUCTURE_BY_ID(id));
}

export async function fetchStudentFeeSummaries(params: {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
} = {}): Promise<Paginated<StudentFeeSummary>> {
  const res = await API.get<Paginated<StudentFeeSummary>>(
    ADMIN_API.FEE_ASSIGNMENTS,
    { params },
  );
  return res.data;
}

export async function fetchStudentFeeDetail(
  studentUserId: string,
): Promise<StudentFeeDetail> {
  const res = await API.get<StudentFeeDetail>(
    ADMIN_API.STUDENT_FEE_DETAIL(studentUserId),
  );
  return res.data;
}

export async function fetchFeeClassPolicies(params: {
  page?: number;
  limit?: number;
  classId?: string;
  academicYear?: string;
} = {}): Promise<Paginated<FeeClassPolicy>> {
  const res = await API.get<Paginated<FeeClassPolicy>>(
    ADMIN_API.FEE_CLASS_POLICIES,
    { params },
  );
  return res.data;
}

export async function fetchFeeClassPolicyByClass(
  classId: string,
  academicYear: string,
): Promise<FeeClassPolicy> {
  const res = await API.get<FeeClassPolicy>(
    ADMIN_API.FEE_CLASS_POLICY_BY_CLASS,
    { params: { classId, academicYear } },
  );
  return res.data;
}

export async function createFeeClassPolicy(payload: {
  classId: string;
  academicYear: string;
  frequency: FeeFrequency;
  fineType: FineType;
  fineAmount?: number | null;
  fineRate?: number | null;
  fineCap?: number | null;
  startDate: string;
}): Promise<FeeClassPolicy> {
  const res = await API.post<FeeClassPolicy>(
    ADMIN_API.FEE_CLASS_POLICIES,
    payload,
  );
  return res.data;
}

export async function updateFeeClassPolicy(
  id: string,
  payload: Partial<{
    frequency: FeeFrequency;
    fineType: FineType;
    fineAmount?: number | null;
    fineRate?: number | null;
    fineCap?: number | null;
    startDate: string;
  }>,
): Promise<FeeClassPolicy> {
  const res = await API.patch<FeeClassPolicy>(
    ADMIN_API.FEE_CLASS_POLICY_BY_ID(id),
    payload,
  );
  return res.data;
}

export async function deleteFeeClassPolicy(id: string): Promise<void> {
  await API.delete(ADMIN_API.FEE_CLASS_POLICY_BY_ID(id));
}

export async function fetchStudentFees(params: {
  page?: number;
  limit?: number;
  search?: string;
  studentUserId?: string;
  classId?: string;
  categoryId?: string;
  feeStructureId?: string;
  status?: StudentFeeStatus;
} = {}): Promise<Paginated<StudentFee>> {
  const res = await API.get<Paginated<StudentFee>>(ADMIN_API.FEE_ASSIGNMENTS, {
    params,
  });
  return res.data;
}

export async function assignStudentFee(payload: {
  studentUserId: string;
  feeStructureId: string;
  baseAmount?: number;
  discountAmount?: number;
  discountReason?: string;
  dueDate?: string;
  notes?: string;
}): Promise<StudentFee> {
  const res = await API.post<StudentFee>(ADMIN_API.FEE_ASSIGNMENTS, payload);
  return res.data;
}

export async function bulkAssignStudentFees(payload: {
  feeStructureId: string;
  classId: string;
  discountAmount?: number;
  discountReason?: string;
  dueDate?: string;
}): Promise<BulkAssignResult> {
  const res = await API.post<BulkAssignResult>(
    ADMIN_API.FEE_ASSIGNMENTS_BULK,
    payload,
  );
  return res.data;
}

export async function previewFeeAssignment(params: {
  studentUserId?: string;
  classId?: string;
  academicYear: string;
}): Promise<FeeAssignmentPreview> {
  const res = await API.get<FeeAssignmentPreview>(
    ADMIN_API.FEE_ASSIGNMENTS_PREVIEW,
    { params },
  );
  return res.data;
}

export async function assignFeePackage(payload: {
  studentUserId: string;
  academicYear: string;
  items: PackageAssignItem[];
}): Promise<StudentFee[]> {
  const res = await API.post<StudentFee[]>(
    ADMIN_API.FEE_ASSIGNMENTS_PACKAGE,
    payload,
  );
  return res.data;
}

export async function bulkAssignFeePackage(payload: {
  classId: string;
  academicYear: string;
  items: PackageAssignItem[];
}): Promise<BulkAssignResult> {
  const res = await API.post<BulkAssignResult>(
    ADMIN_API.FEE_ASSIGNMENTS_BULK_PACKAGE,
    payload,
  );
  return res.data;
}

export async function updateAssignmentTransport(
  id: string,
  payload: { transportDistanceKm: number },
): Promise<StudentFee> {
  const res = await API.patch<StudentFee>(
    ADMIN_API.FEE_ASSIGNMENT_TRANSPORT(id),
    payload,
  );
  return res.data;
}

export async function optOutAssignment(id: string): Promise<void> {
  await API.post(ADMIN_API.FEE_ASSIGNMENT_OPT_OUT(id));
}

export async function deleteAssignment(id: string): Promise<void> {
  await API.delete(ADMIN_API.FEE_ASSIGNMENT_BY_ID(id));
}

export async function updateStudentFeeDiscount(
  id: string,
  payload: { discountAmount: number; discountReason?: string },
): Promise<StudentFee> {
  const res = await API.patch<StudentFee>(
    ADMIN_API.FEE_ASSIGNMENT_DISCOUNT(id),
    payload,
  );
  return res.data;
}

export async function waiveStudentFee(
  id: string,
  payload?: { reason?: string },
): Promise<StudentFee> {
  const res = await API.post<StudentFee>(
    ADMIN_API.FEE_ASSIGNMENT_WAIVE(id),
    payload ?? {},
  );
  return res.data;
}

export async function collectFeePayment(payload: {
  feeInstallmentId: string;
  amount: number;
  method: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
}): Promise<FeePayment> {
  const res = await API.post<FeePayment>(
    ADMIN_API.FEE_PAYMENT_COLLECT,
    payload,
  );
  return res.data;
}

export async function fetchFeePayments(params: {
  page?: number;
  limit?: number;
  search?: string;
  studentUserId?: string;
  studentFeeId?: string;
  method?: PaymentMethod;
  paidFrom?: string;
  paidTo?: string;
} = {}): Promise<Paginated<FeePayment>> {
  const res = await API.get<Paginated<FeePayment>>(ADMIN_API.FEE_PAYMENTS, {
    params,
  });
  return res.data;
}

export async function downloadAdminReceipt(paymentId: string): Promise<void> {
  const res = await API.get(ADMIN_API.FEE_PAYMENT_RECEIPT(paymentId), {
    responseType: "blob",
  });
  downloadBlob(res.data as Blob, `receipt-${paymentId}.pdf`);
}

export async function fetchFeeReport(params: {
  from?: string;
  to?: string;
  classId?: string;
  categoryId?: string;
} = {}): Promise<FeeReport> {
  const res = await API.get<FeeReport>(ADMIN_API.FEES_REPORTS, { params });
  return res.data;
}

export async function fetchMyFees(params: {
  page?: number;
  limit?: number;
  status?: StudentFeeStatus;
} = {}): Promise<Paginated<StudentFee>> {
  const res = await API.get<Paginated<StudentFee>>(STUDENT_API.FEES, {
    params,
  });
  return res.data;
}

export async function fetchMyFeePayments(params: {
  page?: number;
  limit?: number;
} = {}): Promise<Paginated<FeePayment>> {
  const res = await API.get<Paginated<FeePayment>>(STUDENT_API.FEE_PAYMENTS, {
    params,
  });
  return res.data;
}

export async function downloadMyReceipt(paymentId: string): Promise<void> {
  const res = await API.get(STUDENT_API.FEE_PAYMENT_RECEIPT(paymentId), {
    responseType: "blob",
  });
  downloadBlob(res.data as Blob, `receipt-${paymentId}.pdf`);
}

export async function fetchMyFeesSummary(): Promise<StudentFeesSummary> {
  const res = await API.get<StudentFeesSummary>(STUDENT_API.FEES_SUMMARY);
  return res.data;
}
