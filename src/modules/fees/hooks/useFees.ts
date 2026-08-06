"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignStudentFee,
  bulkAssignStudentFees,
  collectFeePayment,
  createFeeCategory,
  createFeeStructure,
  deleteFeeCategory,
  deleteFeeStructure,
  fetchFeeCategories,
  fetchFeeDashboard,
  fetchFeePayments,
  fetchFeeReport,
  fetchFeeStructures,
  fetchMyFeePayments,
  fetchMyFees,
  fetchStudentFees,
  updateFeeCategory,
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
      mutationFn: createFeeStructure,
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
    assign: useMutation({
      mutationFn: assignStudentFee,
      onSuccess: invalidate,
    }),
    bulkAssign: useMutation({
      mutationFn: bulkAssignStudentFees,
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
