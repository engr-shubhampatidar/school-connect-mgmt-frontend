"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import {
  FeeSubnav,
  FeeCategoryDialog,
  useFeeCategories,
  useFeeMutations,
} from "@/modules/fees";
import type { FeeCategory } from "@/modules/fees";

export default function AdminFeeCategoriesPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FeeCategory | null>(null);

  const { data, isLoading, error, refetch } = useFeeCategories({
    page,
    limit: 10,
    search: search || undefined,
  });
  const mutations = useFeeMutations();

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">
            Fee categories
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Group fee structures by category
          </p>
        </div>
        <Button
          variant="dark"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          + Add category
        </Button>
      </div>

      <FeeSubnav />

      <div className="mb-4">
        <input
          className="w-full max-w-sm rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Search categories"
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
            { headerWidth: "w-32", cellWidth: "w-40" },
            { headerWidth: "w-40", cellWidth: "w-56", hideOnMobile: true },
            { headerWidth: "w-20", cellWidth: "w-16" },
            { headerWidth: "w-24", cellWidth: "w-28" },
          ]}
        />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load categories.</p>
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
                  <th className="py-2 pr-3">Name</th>
                  <th className="hidden py-2 pr-3 md:table-cell">Description</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-slate-500">
                      No categories yet
                    </td>
                  </tr>
                ) : (
                  data?.data.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="py-3 pr-3 font-medium text-[#021034]">
                        {row.name}
                      </td>
                      <td className="hidden py-3 pr-3 text-slate-600 md:table-cell">
                        {row.description || "—"}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${
                            row.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {row.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            className="text-blue-700 hover:underline"
                            onClick={() => {
                              setEditing(row);
                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={async () => {
                              try {
                                await mutations.deleteCategory.mutateAsync(
                                  row.id,
                                );
                                toast({
                                  title: "Category deleted",
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
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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

      <FeeCategoryDialog
        open={dialogOpen}
        initial={editing}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (values) => {
          if (editing) {
            await mutations.updateCategory.mutateAsync({
              id: editing.id,
              payload: values,
            });
            toast({ title: "Category updated", type: "success" });
          } else {
            await mutations.createCategory.mutateAsync(values);
            toast({ title: "Category created", type: "success" });
          }
        }}
      />
    </div>
  );
}
