"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import {
  FeeSubnav,
  FeeStructureDialog,
  ClassFeePolicyDialog,
  useFeeStructures,
  useFeeCategories,
  useFeeClassPolicies,
  useFeeMutations,
  formatInr,
  FINE_TYPE_LABELS,
  FEE_FREQUENCY_LABELS,
} from "@/modules/fees";
import type { FeeClassPolicy, FeeStructure } from "@/modules/fees";

export default function AdminFeeStructuresPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<FeeStructure | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<FeeClassPolicy | null>(
    null,
  );

  const { data, isLoading, error, refetch } = useFeeStructures({
    page,
    limit: 10,
    search: search || undefined,
  });
  const policiesQuery = useFeeClassPolicies({ page: 1, limit: 100 });
  const categoriesQuery = useFeeCategories({ page: 1, limit: 100 });
  const mutations = useFeeMutations();
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));

  const policyForPlan = (plan: FeeStructure) =>
    policiesQuery.data?.data?.find(
      (p) => p.classId === plan.classId && p.academicYear === plan.academicYear,
    );

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">Fee plans</h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Annual category amounts and class payment policies
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setEditingPolicy(null);
              setPolicyDialogOpen(true);
            }}
          >
            + Class policy
          </Button>
          <Button
            variant="dark"
            onClick={() => {
              setEditingPlan(null);
              setPlanDialogOpen(true);
            }}
          >
            + Add fee plan
          </Button>
        </div>
      </div>

      <FeeSubnav />

      <div className="mb-4">
        <input
          className="w-full max-w-sm rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Search plans"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {isLoading ? (
        <DataTableSkeleton
          rows={8}
          columns={[
            { headerWidth: "w-40", cellWidth: "w-48" },
            { headerWidth: "w-32", cellWidth: "w-40" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
          ]}
        />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load fee plans.</p>
            <Button variant="dark" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-3">Plan</th>
                  <th className="py-2 pr-3">Categories (annual)</th>
                  <th className="py-2 pr-3">Policy</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-slate-500">
                      No fee plans yet
                    </td>
                  </tr>
                ) : (
                  data?.data.map((row) => {
                    const policy = policyForPlan(row);
                    return (
                      <tr key={row.id} className="border-t">
                        <td className="py-3 pr-3">
                          <div className="font-medium text-[#021034]">
                            {row.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {row.className ?? "—"} · {row.academicYear}
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          <ul className="space-y-1 text-xs text-slate-600">
                            {(row.items ?? []).map((item) => (
                              <li key={item.id}>
                                {item.categoryName
                                  ? item.categoryName
                                  : "School Fee"}
                                : {formatInr(item.amount)}
                                {item.categoryType === "TRANSPORT"
                                  ? " (+ tiers)"
                                  : ""}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 pr-3 text-xs text-slate-600">
                          {policy ? (
                            <>
                              {FEE_FREQUENCY_LABELS[policy.frequency]} ·{" "}
                              {FINE_TYPE_LABELS[policy.fineType]} · Start{" "}
                              {policy.startDate?.slice(0, 10)}
                            </>
                          ) : (
                            <span className="text-amber-600">
                              No policy — add before assigning fees
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="text-blue-700 hover:underline"
                              onClick={() => {
                                setEditingPlan(row);
                                setPlanDialogOpen(true);
                              }}
                            >
                              Edit plan
                            </button>
                            <button
                              className="text-blue-700 hover:underline"
                              onClick={() => {
                                setEditingPolicy(policy ?? null);
                                setPolicyDialogOpen(true);
                              }}
                            >
                              {policy ? "Edit policy" : "Add policy"}
                            </button>

                            {/* this button is commentOut because it might cause some issue with fee stucture */}

                            {/* <button
                              className="text-red-600 hover:underline"
                              onClick={async () => {
                                try {
                                  await mutations.deleteStructure.mutateAsync(
                                    row.id,
                                  );
                                  toast({
                                    title: "Plan deleted",
                                    type: "success",
                                  });
                                } catch (err) {
                                  toast({
                                    title: "Delete failed",
                                    description:
                                      err instanceof Error
                                        ? err.message
                                        : undefined,
                                    type: "error",
                                  });
                                }
                              }}
                            >
                              Delete
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} · {data?.total ?? 0} total
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      <FeeStructureDialog
        open={planDialogOpen}
        initial={editingPlan}
        categories={categoriesQuery.data?.data ?? []}
        onClose={() => setPlanDialogOpen(false)}
        onSubmit={async (values) => {
          if (editingPlan) {
            await mutations.updateStructure.mutateAsync({
              id: editingPlan.id,
              payload: values,
            });
            toast({ title: "Plan updated", type: "success" });
          } else {
            await mutations.createStructure.mutateAsync(values);
            toast({ title: "Plan created", type: "success" });
          }
        }}
      />

      <ClassFeePolicyDialog
        open={policyDialogOpen}
        initial={editingPolicy}
        presetClassId={editingPlan?.classId}
        presetAcademicYear={editingPlan?.academicYear}
        onClose={() => setPolicyDialogOpen(false)}
        onSubmit={async (values) => {
          if (editingPolicy) {
            await mutations.updateClassPolicy.mutateAsync({
              id: editingPolicy.id,
              payload: values,
            });
            toast({ title: "Policy updated", type: "success" });
          } else {
            await mutations.createClassPolicy.mutateAsync(
              values as Parameters<
                typeof mutations.createClassPolicy.mutateAsync
              >[0],
            );
            toast({ title: "Policy created", type: "success" });
          }
        }}
      />
    </div>
  );
}
