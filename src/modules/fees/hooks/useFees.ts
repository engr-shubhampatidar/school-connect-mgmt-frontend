"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignStudentFee,
  assignFeePackage,
  bulkAssignStudentFees,
  bulkAssignFeePackage,
  collectFeePayment,
  createFeeCategory,
  createFeeClassPolicy,
  createFeeStructure,
  deleteAssignment,
  deleteFeeCategory,
  deleteFeeClassPolicy,
  deleteFeeStructure,
  fetchFeeCategories,
  fetchFeeClassPolicies,
  fetchFeeClassPolicyByClass,
  fetchFeeDashboard,
  fetchFeePayments,
  fetchFeeReport,
  fetchFeeStructures,
  fetchMyFeePayments,
  fetchMyFees,
  fetchStudentFeeDetail,
  fetchStudentFeeSummaries,
  fetchStudentFees,
  optOutAssignment,
  previewFeeAssignment,
  updateAssignmentTransport,
  updateFeeCategory,
  updateFeeClassPolicy,
  updateFeeStructure,
  updateStudentFeeDiscount,
  waiveStudentFee,
} from "@/modules/fees/api/fees";
import { feeQueryKeys, FEES_PAGE_SIZE } from "@/modules/fees/constants/query-keys";

export function useFeeDashboard() {
  return useQuery({
    queryKey: feeQueryKeys.dashboard(),
    queryFn: fetchFeeDashboard,
  });
}

export function useFeeCategories(query: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: feeQueryKeys.categories(query),
    queryFn: () =>
      fetchFeeCategories({
        page: query.page ?? 1,
        limit: query.limit ?? FEES_PAGE_SIZE,
        search: query.search,
      }),
  });
}

export function useFeeStructures(query: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  classId?: string;
} = {}) {
  return useQuery({
    queryKey: feeQueryKeys.structures(query),
    queryFn: () =>
      fetchFeeStructures({
        page: query.page ?? 1,
        limit: query.limit ?? FEES_PAGE_SIZE,
        search: query.search,
        categoryId: query.categoryId,
        classId: query.classId,
      }),
  });
}

export function useFeeClassPolicies(query: {
  page?: number;
  limit?: number;
  classId?: string;
  academicYear?: string;
} = {}) {
  return useQuery({
    queryKey: feeQueryKeys.classPolicies(query),
    queryFn: () =>
      fetchFeeClassPolicies({
        page: query.page ?? 1,
        limit: query.limit ?? 100,
        classId: query.classId,
        academicYear: query.academicYear,
      }),
  });
}

export function useStudentFeeSummaries(query: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: feeQueryKeys.assignments(query),
    queryFn: () =>
      fetchStudentFeeSummaries({
        page: (query.page as number) ?? 1,
        limit: (query.limit as number) ?? FEES_PAGE_SIZE,
        search: query.search as string | undefined,
        classId: query.classId as string | undefined,
      }),
  });
}

export function useStudentFeeDetail(studentUserId: string) {
  return useQuery({
    queryKey: feeQueryKeys.studentFeeDetail(studentUserId),
    queryFn: () => fetchStudentFeeDetail(studentUserId),
    enabled: !!studentUserId,
  });
}

export function useStudentFees(query: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: feeQueryKeys.assignments(query),
    queryFn: () =>
      fetchStudentFees({
        page: (query.page as number) ?? 1,
        limit: (query.limit as number) ?? FEES_PAGE_SIZE,
        search: query.search as string | undefined,
        studentUserId: query.studentUserId as string | undefined,
        classId: query.classId as string | undefined,
        status: query.status as never,
      }),
  });
}

export function useFeePayments(query: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: feeQueryKeys.payments(query),
    queryFn: () =>
      fetchFeePayments({
        page: (query.page as number) ?? 1,
        limit: (query.limit as number) ?? FEES_PAGE_SIZE,
        search: query.search as string | undefined,
        studentUserId: query.studentUserId as string | undefined,
      }),
  });
}

export function useFeeReport(query: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: feeQueryKeys.reports(query),
    queryFn: () =>
      fetchFeeReport({
        from: query.from as string | undefined,
        to: query.to as string | undefined,
        classId: query.classId as string | undefined,
        categoryId: query.categoryId as string | undefined,
      }),
  });
}

export function useMyFees(query: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: feeQueryKeys.studentFees(query),
    queryFn: () =>
      fetchMyFees({
        page: (query.page as number) ?? 1,
        limit: (query.limit as number) ?? FEES_PAGE_SIZE,
      }),
  });
}

export function useMyFeePayments(query: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: feeQueryKeys.studentPayments(query),
    queryFn: () =>
      fetchMyFeePayments({
        page: (query.page as number) ?? 1,
        limit: (query.limit as number) ?? FEES_PAGE_SIZE,
      }),
  });
}

export function useInvalidateFees() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: feeQueryKeys.all });
}

export function useFeeMutations() {
  const invalidate = useInvalidateFees();

  return {
    createCategory: useMutation({
      mutationFn: createFeeCategory,
      onSuccess: invalidate,
    }),
    updateCategory: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Parameters<typeof updateFeeCategory>[1];
      }) => updateFeeCategory(id, payload),
      onSuccess: invalidate,
    }),
    deleteCategory: useMutation({
      mutationFn: deleteFeeCategory,
      onSuccess: invalidate,
    }),
    createStructure: useMutation({
      mutationFn: (payload: Record<string, unknown>) =>
        createFeeStructure(payload),
      onSuccess: invalidate,
    }),
    updateStructure: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Record<string, unknown>;
      }) => updateFeeStructure(id, payload),
      onSuccess: invalidate,
    }),
    deleteStructure: useMutation({
      mutationFn: deleteFeeStructure,
      onSuccess: invalidate,
    }),
    createClassPolicy: useMutation({
      mutationFn: createFeeClassPolicy,
      onSuccess: invalidate,
    }),
    updateClassPolicy: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Parameters<typeof updateFeeClassPolicy>[1];
      }) => updateFeeClassPolicy(id, payload),
      onSuccess: invalidate,
    }),
    deleteClassPolicy: useMutation({
      mutationFn: deleteFeeClassPolicy,
      onSuccess: invalidate,
    }),
    assign: useMutation({
      mutationFn: assignStudentFee,
      onSuccess: invalidate,
    }),
    bulkAssign: useMutation({
      mutationFn: bulkAssignStudentFees,
      onSuccess: invalidate,
    }),
    previewAssignment: useMutation({
      mutationFn: previewFeeAssignment,
    }),
    assignPackage: useMutation({
      mutationFn: assignFeePackage,
      onSuccess: invalidate,
    }),
    bulkAssignPackage: useMutation({
      mutationFn: bulkAssignFeePackage,
      onSuccess: invalidate,
    }),
    updateTransport: useMutation({
      mutationFn: ({
        id,
        transportDistanceKm,
      }: {
        id: string;
        transportDistanceKm: number;
      }) => updateAssignmentTransport(id, { transportDistanceKm }),
      onSuccess: invalidate,
    }),
    optOut: useMutation({
      mutationFn: optOutAssignment,
      onSuccess: invalidate,
    }),
    deleteAssignment: useMutation({
      mutationFn: deleteAssignment,
      onSuccess: invalidate,
    }),
    updateDiscount: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: { discountAmount: number; discountReason?: string };
      }) => updateStudentFeeDiscount(id, payload),
      onSuccess: invalidate,
    }),
    waive: useMutation({
      mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
        waiveStudentFee(id, { reason }),
      onSuccess: invalidate,
    }),
    collect: useMutation({
      mutationFn: collectFeePayment,
      onSuccess: invalidate,
    }),
  };
}
